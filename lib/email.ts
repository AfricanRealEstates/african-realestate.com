import { Resend } from "resend";
import {
  VerificationEmail,
  PasswordResetEmail,
  InviteEmail,
} from "./email-templates";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendVerificationEmail(
  email: string,
  name: string,
  token: string
) {
  const verificationUrl = `${process.env.NEXT_PUBLIC_APP_URL}/verify-email?token=${token}`;

  try {
    const { data, error } = await resend.emails.send({
      from: "noreply@african-realestate.com",
      to: email,
      subject: "Verify your email address",
      react: VerificationEmail({ name, verificationUrl }),
    });

    if (error) {
      console.error("Error sending verification email:", error);
      return { success: false, error };
    }

    return { success: true, data };
  } catch (error) {
    console.error("Failed to send verification email:", error);
    return { success: false, error };
  }
}

export async function sendPasswordResetEmail(
  email: string,
  name: string,
  token: string
) {
  const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL}/reset-password?token=${token}`;

  try {
    const { data, error } = await resend.emails.send({
      from: "noreply@african-realestate.com",
      to: email,
      subject: "Reset your password",
      react: PasswordResetEmail({ name, resetUrl }),
    });

    if (error) {
      console.error("Error sending password reset email:", error);
      return { success: false, error };
    }

    return { success: true, data };
  } catch (error) {
    console.error("Failed to send password reset email:", error);
    return { success: false, error };
  }
}

export async function sendInviteEmail(
  email: string,
  inviterName: string,
  token: string
) {
  const inviteUrl = `${process.env.NEXT_PUBLIC_APP_URL}/accept-invite?token=${token}`;

  try {
    const { data, error } = await resend.emails.send({
      from: "noreply@african-realestate.com",
      to: email,
      subject: "You've been invited to join as Support",
      react: InviteEmail({ inviterName, inviteUrl }),
    });

    if (error) {
      console.error("Error sending invite email:", error);
      return { success: false, error };
    }

    return { success: true, data };
  } catch (error) {
    console.error("Failed to send invite email:", error);
    return { success: false, error };
  }
}
