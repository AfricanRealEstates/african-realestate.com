"use server";

import { z } from "zod";
import { v4 as uuidv4 } from "uuid";
import { addHours } from "date-fns";
import { Resend } from "resend";
import { prisma } from "@/lib/prisma";

if (!process.env.RESEND_API_KEY) {
  throw new Error("RESEND_API_KEY is not set in environment variables");
}

const resend = new Resend(process.env.RESEND_API_KEY);

const resetPasswordSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
});

export async function sendPasswordResetEmail(formData: FormData) {
  try {
    const email = formData.get("email") as string;
    const validationResult = resetPasswordSchema.safeParse({ email });

    if (!validationResult.success) {
      return {
        success: false,
        message: "Invalid email address",
      };
    }

    // Check if user exists and how they authenticate
    const user = await prisma.user.findUnique({
      where: { email },
      include: {
        accounts: true,
      },
    });

    if (!user) {
      // Don't reveal that the user doesn't exist
      return {
        success: true,
        message:
          "If an account exists with this email, you will receive a password reset link",
      };
    }

    // Check if user uses OAuth only
    const hasOAuthOnly = user.accounts.length > 0 && !user.password;
    if (hasOAuthOnly) {
      return {
        success: false,
        message:
          "This account uses Google Sign In. Please sign in with Google instead.",
      };
    }

    // Generate reset token
    const token = uuidv4();
    const expires = addHours(new Date(), 2); // Token expires in 2 hours

    // Save reset token
    await prisma.passwordReset.create({
      data: {
        email,
        token,
        expires,
      },
    });

    if (!process.env.NEXT_PUBLIC_APP_URL) {
      throw new Error("NEXT_PUBLIC_APP_URL is not set");
    }

    // Generate reset URL
    const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL}/reset-password?token=${token}`;

    // Send email with Resend
    await resend.emails.send({
      from: "African Real Estate <noreply@african-realestate.com>",
      to: email,
      subject: "Reset your password",
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #333;">Reset Your Password</h1>
          <p>Hello,</p>
          <p>We received a request to reset your password. Click the button below to create a new password:</p>
          <a href="${resetUrl}" style="display: inline-block; background-color: #4F46E5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; margin: 20px 0;">Reset Password</a>
          <p>This link will expire in 2 hours.</p>
          <p>If you didn't request this password reset, you can safely ignore this email.</p>
          <p>Best regards,<br>The African Real Estate Team</p>
        </div>
      `,
    });

    return {
      success: true,
      message:
        "If an account exists with this email, you will receive a password reset link",
    };
  } catch (error) {
    console.error("Error in sendPasswordResetEmail:", error);
    return {
      success: false,
      message: "Failed to process password reset request",
    };
  }
}
