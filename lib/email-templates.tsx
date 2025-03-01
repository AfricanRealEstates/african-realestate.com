import type { ReactElement } from "react";

export function VerificationEmail({
  name,
  verificationUrl,
}: {
  name: string;
  verificationUrl: string;
}): ReactElement {
  return (
    <div>
      <h1>Verify your email address</h1>
      <p>Hello {name},</p>
      <p>
        Thank you for signing up! Please verify your email address by clicking
        the link below:
      </p>
      <a
        href={verificationUrl}
        style={{
          display: "inline-block",
          padding: "12px 20px",
          backgroundColor: "#4F46E5",
          color: "white",
          textDecoration: "none",
          borderRadius: "4px",
          fontWeight: "bold",
        }}
      >
        Verify Email Address
      </a>
      <p>This link will expire in 24 hours.</p>
      <p>If you did not create an account, please ignore this email.</p>
    </div>
  );
}

export function PasswordResetEmail({
  name,
  resetUrl,
}: {
  name: string;
  resetUrl: string;
}): ReactElement {
  return (
    <div>
      <h1>Reset your password</h1>
      <p>Hello {name},</p>
      <p>
        We received a request to reset your password. Click the link below to
        set a new password:
      </p>
      <a
        href={resetUrl}
        style={{
          display: "inline-block",
          padding: "12px 20px",
          backgroundColor: "#4F46E5",
          color: "white",
          textDecoration: "none",
          borderRadius: "4px",
          fontWeight: "bold",
        }}
      >
        Reset Password
      </a>
      <p>This link will expire in 1 hour.</p>
      <p>If you did not request a password reset, please ignore this email.</p>
    </div>
  );
}

export function InviteEmail({
  inviterName,
  inviteUrl,
}: {
  inviterName: string;
  inviteUrl: string;
}): ReactElement {
  return (
    <div>
      <h1>You&apos;ve been invited to join as Support</h1>
      <p>Hello,</p>
      <p>
        {inviterName} has invited you to join as a support team member. Click
        the link below to accept the invitation:
      </p>
      <a
        href={inviteUrl}
        style={{
          display: "inline-block",
          padding: "12px 20px",
          backgroundColor: "#4F46E5",
          color: "white",
          textDecoration: "none",
          borderRadius: "4px",
          fontWeight: "bold",
        }}
      >
        Accept Invitation
      </a>
      <p>This invitation will expire in 7 days.</p>
    </div>
  );
}
