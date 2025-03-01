"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";
import { sendEmail } from "./email";
import { render } from "@react-email/render";
import InvitationEmail from "./email/InvitationEmail";
import RevocationEmail from "./email/RevocationEmail";
import crypto from "crypto";

// Function to send invitation email
export async function sendInvitation(email: string) {
  const session = await auth();

  // Check if user is authenticated and is an admin
  if (!session?.user || session.user.role !== "ADMIN") {
    throw new Error("Not authorized");
  }

  // Check if user already exists
  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  // Check if there's already a pending invitation
  const existingInvitation = await prisma.invitation.findUnique({
    where: { email },
  });

  if (existingInvitation) {
    throw new Error("Invitation already sent to this email");
  }

  // Create invitation token (expires in 7 days)
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 7);

  // Generate a unique token
  const token = crypto.randomBytes(32).toString("hex");

  const invitation = await prisma.invitation.create({
    data: {
      email,
      token,
      expiresAt,
      invitedBy: session.user.id!,
    },
  });

  // Generate invitation URL
  const invitationUrl = existingUser
    ? `${process.env.NEXT_PUBLIC_APP_URL}/accept-invitation?token=${invitation.token}`
    : `${process.env.NEXT_PUBLIC_APP_URL}/register?token=${invitation.token}`;

  // Determine if the user is new or existing
  const isNewUser = !existingUser;

  // Send email using Resend
  const emailHtml = render(
    InvitationEmail({
      invitationUrl,
      inviterName: session.user.name || "African Real Estate Admin",
      recipientEmail: email,
      isNewUser,
    })
  );

  await sendEmail({
    to: email,
    subject: isNewUser
      ? "Invitation to join African Real Estate's blog platform"
      : "Invitation to contribute to African Real Estate's blog",
    html: emailHtml,
  });

  revalidatePath("/blog");
  return invitation;
}

// Function to resend invitation
export async function resendInvitation(email: string) {
  const session = await auth();

  // Check if user is authenticated and is an admin
  if (!session?.user || session.user.role !== "ADMIN") {
    throw new Error("Not authorized");
  }

  // Find the invitation
  const invitation = await prisma.invitation.findUnique({
    where: { email },
  });

  if (!invitation) {
    throw new Error("Invitation not found");
  }

  // Update expiration date (reset to 7 days from now)
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 7);

  const updatedInvitation = await prisma.invitation.update({
    where: { id: invitation.id },
    data: { expiresAt },
  });

  // Check if user exists
  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  // Generate invitation URL
  const invitationUrl = existingUser
    ? `${process.env.NEXT_PUBLIC_APP_URL}/accept-invitation?token=${updatedInvitation.token}`
    : `${process.env.NEXT_PUBLIC_APP_URL}/register?token=${updatedInvitation.token}`;

  const isNewUser = !existingUser;

  // Send email using Resend
  const emailHtml = render(
    InvitationEmail({
      invitationUrl,
      inviterName: session.user.name || "African Real Estate Admin",
      recipientEmail: email,
      isNewUser,
    })
  );

  await sendEmail({
    to: email,
    subject: isNewUser
      ? "Invitation to join African Real Estate's blog platform"
      : "Invitation to contribute to African Real Estate's blog",
    html: emailHtml,
  });

  revalidatePath("/blog");
  return updatedInvitation;
}

// Function to get pending invitations
export async function getPendingInvitations() {
  const session = await auth();

  // Check if user is authenticated and is an admin
  if (!session?.user || session.user.role !== "ADMIN") {
    throw new Error("Not authorized");
  }

  const invitations = await prisma.invitation.findMany({
    where: {
      expiresAt: {
        gt: new Date(),
      },
      acceptedAt: null,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return invitations;
}

// Function to accept invitation
export async function acceptInvitation(token: string) {
  const invitation = await prisma.invitation.findUnique({
    where: { token },
  });

  if (!invitation) {
    throw new Error("Invalid or expired invitation");
  }

  if (invitation.expiresAt < new Date()) {
    throw new Error("Invitation has expired");
  }

  const user = await prisma.user.findUnique({
    where: { email: invitation.email },
  });

  if (!user) {
    throw new Error("User not found");
  }

  // Update user role to SUPPORT if they don't have a role
  if (!user.role || user.role === "USER") {
    await prisma.user.update({
      where: { id: user.id },
      data: { role: "SUPPORT" },
    });
  }

  // Mark invitation as accepted
  await prisma.invitation.update({
    where: { id: invitation.id },
    data: { acceptedAt: new Date() },
  });

  revalidatePath("/blog");
  return { success: true };
}

// Function to get accepted invitations
export async function getAcceptedInvitations() {
  const session = await auth();

  if (!session?.user || session.user.role !== "ADMIN") {
    throw new Error("Not authorized");
  }

  const invitations = await prisma.invitation.findMany({
    where: {
      acceptedAt: { not: null },
      revokedAt: null,
    },
    include: {
      user: true,
    },
    orderBy: {
      acceptedAt: "desc",
    },
  });

  return invitations;
}

// Function to revoke invitation
export async function revokeInvitation(invitationId: string) {
  const session = await auth();

  if (!session?.user || session.user.role !== "ADMIN") {
    throw new Error("Not authorized");
  }

  const invitation = await prisma.invitation.findUnique({
    where: { id: invitationId },
    include: { user: true },
  });

  if (!invitation) {
    throw new Error("Invitation not found");
  }

  // Revoke the invitation
  const revokedInvitation = await prisma.invitation.update({
    where: { id: invitationId },
    data: { revokedAt: new Date() },
  });

  // If the user had the SUPPORT role, revert it to USER
  if (invitation.user && invitation.user.role === "SUPPORT") {
    await prisma.user.update({
      where: { id: invitation.user.id },
      data: { role: "USER" },
    });
  }

  // Send revocation email
  const emailHtml = render(
    RevocationEmail({
      recipientEmail: invitation.email,
      inviterName: session.user.name || "African Real Estate Admin",
    })
  );

  await sendEmail({
    to: invitation.email,
    subject: "Your invitation to African Real Estate's blog has been revoked",
    html: emailHtml,
  });

  revalidatePath("/blog");
  return revokedInvitation;
}
