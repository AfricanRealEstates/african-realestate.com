import { prisma } from "@/lib/prisma";

import { hash } from "bcryptjs";
import { NextResponse } from "next/server";
import { z, ZodError } from "zod";

const createUserSchema = z
  .object({
    name: z.string().min(1, "Full name is required").max(100),
    email: z
      .string()
      .min(1, "Email is required")
      .email("Invalid email address"),
    password: z
      .string()
      .min(1, "Password is required")
      .min(8, "Password must be at least 8 characters"),
    passwordConfirm: z.string().min(1, "Please confirm your password"),
    token: z.string().optional(), // Added for invitation flow
  })
  .refine((data) => data.password === data.passwordConfirm, {
    message: "Passwords do not match",
    path: ["passwordConfirm"],
  });

type CreateUserInput = z.infer<typeof createUserSchema>;

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, password, token } = createUserSchema.parse(body);

    // If token is provided, verify the invitation
    if (token) {
      const invitation = await prisma.invitation.findUnique({
        where: { token },
      });

      if (!invitation) {
        return NextResponse.json(
          {
            status: "fail",
            message: "Invalid invitation token",
          },
          { status: 400 }
        );
      }

      if (
        invitation.acceptedAt ||
        invitation.revokedAt ||
        invitation.expiresAt < new Date()
      ) {
        return NextResponse.json(
          {
            status: "fail",
            message: "Invitation has expired or has already been used",
          },
          { status: 400 }
        );
      }

      if (invitation.email.toLowerCase() !== email.toLowerCase()) {
        return NextResponse.json(
          {
            status: "fail",
            message: "Email does not match invitation",
          },
          { status: 400 }
        );
      }
    }

    const hashed_password = await hash(password, 12);

    const user = await prisma.user.create({
      data: {
        name,
        email: email.toLowerCase(),
        password: hashed_password,
        isVerified: !!token, // Auto-verify if using invitation
        isActive: true,
      },
    });

    // If using invitation, mark it as accepted
    if (token) {
      await prisma.invitation.update({
        where: { token },
        data: {
          acceptedAt: new Date(),
          userId: user.id,
        },
      });
    }

    return NextResponse.json({
      user: {
        name: user.name,
        email: user.email,
      },
    });
  } catch (error: any) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        {
          status: "error",
          message: "Validation failed",
          errors: error.errors,
        },
        { status: 400 }
      );
    }

    if (error.code === "P2002") {
      return NextResponse.json(
        {
          status: "fail",
          message: "User with that email already exists",
        },
        { status: 409 }
      );
    }

    return NextResponse.json(
      {
        status: "error",
        message: error.message || "Internal Server Error",
      },
      { status: 500 }
    );
  }
}
