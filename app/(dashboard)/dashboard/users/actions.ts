"use server";

import { z } from "zod";
import { v4 as uuidv4 } from "uuid";
import { addDays } from "date-fns";
import { Resend } from "resend";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

if (!process.env.RESEND_API_KEY) {
  throw new Error("RESEND_API_KEY is not set in environment variables");
}

const resend = new Resend(process.env.RESEND_API_KEY);

const inviteFormSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
});

export async function sendInvitation(formData: FormData) {
  try {
    // Check if user is authenticated and is an admin
    const session = await auth();

    if (!session?.user || session.user.role !== "ADMIN") {
      return {
        success: false,
        message: "Unauthorized. Only admins can send invitations.",
      };
    }

    // Parse and validate form data
    const email = formData.get("email") as string;
    const validationResult = inviteFormSchema.safeParse({ email });

    if (!validationResult.success) {
      return {
        success: false,
        message: "Invalid email address",
      };
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      if (!existingUser.isActive) {
        return {
          success: false,
          message: "This user is blocked by an administrator",
        };
      }

      return {
        success: false,
        message: "User with this email already exists",
      };
    }

    // Check if there's an existing invitation
    const existingInvitation = await prisma.invitation.findUnique({
      where: { email },
    });

    // If there's an existing invitation that's still valid
    if (
      existingInvitation &&
      !existingInvitation.acceptedAt &&
      !existingInvitation.revokedAt &&
      existingInvitation.expiresAt > new Date()
    ) {
      return {
        success: false,
        message: "An invitation has already been sent to this email",
      };
    }

    // If there's an expired or revoked invitation, delete it first
    if (existingInvitation) {
      await prisma.invitation.delete({
        where: { email },
      });
    }

    // Create a new invitation
    const token = uuidv4();
    const expiresAt = addDays(new Date(), 7); // Invitation expires in 7 days

    const invitation = await prisma.invitation.create({
      data: {
        email,
        token,
        invitedBy: session.user.id!,
        expiresAt,
      },
    });

    if (!process.env.NEXT_PUBLIC_APP_URL) {
      throw new Error(
        "NEXT_PUBLIC_APP_URL is not set in environment variables"
      );
    }

    // Generate invitation URL
    const invitationUrl = `${process.env.NEXT_PUBLIC_APP_URL}/register?token=${token}`;

    try {
      // Send invitation email with Resend
      const emailResult = await resend.emails.send({
        from: "African Real Estate <noreply@african-realestate.com>",
        to: email,
        subject: "Invitation to join African Real Estate",
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
            <h1 style="color: #333;">You're invited to join African Real Estate</h1>
            <p>Hello,</p>
            <p>You've been invited to join the African Real Estate platform. Click the button below to create your account:</p>
            <a href="${invitationUrl}" style="display: inline-block; background-color: #4F46E5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; margin: 20px 0;">Accept Invitation</a>
            <p>This invitation will expire in 7 days.</p>
            <p>If you have any questions, please contact our support team.</p>
            <p>Best regards,<br>The African Real Estate Team</p>
          </div>
        `,
      });

      console.log("Email sent successfully:", emailResult);

      return {
        success: true,
        message: "Invitation sent successfully",
      };
    } catch (emailError: any) {
      console.error("Resend API Error:", emailError);

      // Delete the invitation if email sending fails
      await prisma.invitation.delete({
        where: { id: invitation.id },
      });

      return {
        success: false,
        message: `Failed to send invitation email: ${emailError.message}`,
      };
    }
  } catch (error: any) {
    console.error("Error in sendInvitation:", error);
    return {
      success: false,
      message: `Failed to send invitation: ${error.message}`,
    };
  }
}
