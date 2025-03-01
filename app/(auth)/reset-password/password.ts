"use server";

import { z } from "zod";
import { v4 as uuidv4 } from "uuid";
import { addHours } from "date-fns";
import { Resend } from "resend";
import { hash } from "bcryptjs";
import { prisma } from "@/lib/prisma";

if (!process.env.RESEND_API_KEY) {
  throw new Error("RESEND_API_KEY is not set");
}

const resend = new Resend(process.env.RESEND_API_KEY);

// Schema for initiating password reset
const forgotPasswordSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
});

// Schema for completing password reset
const resetPasswordSchema = z.object({
  token: z.string(),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export async function initiatePasswordReset(formData: FormData) {
  try {
    const email = formData.get("email") as string;
    const validationResult = forgotPasswordSchema.safeParse({ email });

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
    console.error("Error in initiatePasswordReset:", error);
    return {
      success: false,
      message: "Failed to process password reset request",
    };
  }
}

export async function completePasswordReset(formData: FormData) {
  try {
    const token = formData.get("token") as string;
    const password = formData.get("password") as string;

    const validationResult = resetPasswordSchema.safeParse({ token, password });

    if (!validationResult.success) {
      return {
        success: false,
        message: "Invalid input",
      };
    }

    // Verify token and get reset request
    const resetRequest = await prisma.passwordReset.findUnique({
      where: { token },
    });

    if (!resetRequest) {
      return {
        success: false,
        message: "Invalid reset token",
      };
    }

    if (resetRequest.expires < new Date()) {
      return {
        success: false,
        message: "Reset token has expired",
      };
    }

    // Hash new password
    const hashedPassword = await hash(password, 12);

    // Update user's password
    await prisma.user.update({
      where: { email: resetRequest.email },
      data: { password: hashedPassword },
    });

    // Delete used reset token
    await prisma.passwordReset.delete({
      where: { token },
    });

    return {
      success: true,
      message: "Password reset successfully",
    };
  } catch (error) {
    console.error("Error in completePasswordReset:", error);
    return {
      success: false,
      message: "Failed to reset password",
    };
  }
}
