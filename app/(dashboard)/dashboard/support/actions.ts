"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { hash } from "bcrypt";
import { hasPermission } from "./permissions-config";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

// Verify that the current user has appropriate access
async function verifyAccess(requiredPermission?: string) {
  const session = await auth();

  if (!session || !session.user) {
    throw new Error("Unauthorized: You must be logged in");
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { role: true, permissions: true },
  });

  if (!user) {
    throw new Error("User not found");
  }

  // Admin always has access
  if (user.role === "ADMIN") {
    return true;
  }

  // Support users need the specific permission
  if (user.role === "SUPPORT") {
    if (!requiredPermission) {
      return true; // No specific permission required
    }

    if (hasPermission(user.permissions, requiredPermission)) {
      return true;
    }

    throw new Error(`Forbidden: You need the ${requiredPermission} permission`);
  }

  throw new Error("Forbidden: Insufficient permissions");
}

// Get all support users
export async function getSupportUsers() {
  // For ADMIN or SUPPORT with user:manage permission
  await verifyAccess("user:view");

  const supportUsers = await prisma.user.findMany({
    where: { role: "SUPPORT" },
    select: {
      id: true,
      name: true,
      email: true,
      permissions: true,
      isActive: true,
    },
    orderBy: { createdAt: "desc" },
  });

  return supportUsers;
}

// Create a new support user
export async function createSupportUser(data: {
  name: string;
  email: string;
  password: string;
  permissions: string[];
}) {
  // Only ADMIN can create support users
  await verifyAccess("user:manage");

  const userSchema = z.object({
    name: z.string().min(2),
    email: z.string().email(),
    password: z.string().min(8),
    permissions: z.array(z.string()).min(1),
  });

  const validatedData = userSchema.parse(data);

  // Check if user already exists
  const existingUser = await prisma.user.findUnique({
    where: { email: validatedData.email },
  });

  if (existingUser) {
    throw new Error("User with this email already exists");
  }

  // Hash the password
  const hashedPassword = await hash(validatedData.password, 10);

  // Create the user
  const newUser = await prisma.user.create({
    data: {
      name: validatedData.name,
      email: validatedData.email,
      password: hashedPassword,
      role: "SUPPORT",
      permissions: validatedData.permissions,
      isActive: true,
      isVerified: true, // Support users are pre-verified
    },
  });

  revalidatePath("/dashboard/support");
  return newUser;
}

// Update user permissions
export async function updateUserPermissions(
  userId: string,
  permissions: string[]
) {
  // Only ADMIN can update permissions
  await verifyAccess("user:manage");

  const permissionsSchema = z.array(z.string());
  const validatedPermissions = permissionsSchema.parse(permissions);

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { role: true },
  });

  if (!user) {
    throw new Error("User not found");
  }

  if (user.role !== "SUPPORT") {
    throw new Error("Can only update permissions for SUPPORT users");
  }

  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data: { permissions: validatedPermissions },
  });

  revalidatePath("/dashboard/support");
  return updatedUser;
}

// Deactivate a support user
export async function deactivateSupportUser(userId: string) {
  // Only ADMIN can deactivate users
  await verifyAccess("user:manage");

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { role: true },
  });

  if (!user) {
    throw new Error("User not found");
  }

  if (user.role !== "SUPPORT") {
    throw new Error("Can only deactivate SUPPORT users");
  }

  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data: { isActive: false },
  });

  revalidatePath("/dashboard/support");
  return updatedUser;
}

// Reactivate a support user
export async function reactivateSupportUser(userId: string) {
  // Only ADMIN can reactivate users
  await verifyAccess("user:manage");

  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data: { isActive: true },
  });

  revalidatePath("/dashboard/support");
  return updatedUser;
}

// Get a specific support user
export async function getSupportUser(userId: string) {
  // ADMIN or SUPPORT with user:view permission
  await verifyAccess("user:view");

  const user = await prisma.user.findUnique({
    where: { id: userId, role: "SUPPORT" },
    select: {
      id: true,
      name: true,
      email: true,
      permissions: true,
      isActive: true,
    },
  });

  if (!user) {
    throw new Error("Support user not found");
  }

  return user;
}

// Get blog posts (for SUPPORT users with blog:write permission)
export async function getBlogPosts() {
  await verifyAccess("blog:write");

  const session = await auth();

  // Get current user
  const currentUser = await prisma.user.findUnique({
    where: { id: session?.user?.id },
    select: { role: true },
  });

  // For ADMIN, get all posts
  // For SUPPORT, only get their own posts
  const where =
    currentUser?.role === "ADMIN" ? {} : { authorId: session?.user?.id };

  const posts = await prisma.post.findMany({
    where,
    select: {
      id: true,
      title: true,
      slug: true,
      published: true,
      createdAt: true,
      updatedAt: true,
      viewCount: true,
    },
    orderBy: { createdAt: "desc" },
  });

  return posts;
}

// Get support tickets (for SUPPORT users with support:respond permission)
export async function getSupportTickets() {
  await verifyAccess("support:respond");

  // This is a placeholder since there's no Query model for support tickets in the schema
  // In a real implementation, you would query the database for support tickets

  // For now, we'll return an empty array
  // The component will use mock data for demonstration
  return [];
}

// Respond to a support ticket
export async function respondToSupportTicket(
  ticketId: string,
  response: string
) {
  await verifyAccess("support:respond");

  // This is a placeholder since there's no actual implementation in the schema
  // In a real implementation, you would update the ticket with the response

  return { success: true };
}

// Escalate a support ticket
export async function escalateSupportTicket(ticketId: string, reason: string) {
  await verifyAccess("support:escalate");

  // This is a placeholder since there's no actual implementation in the schema
  // In a real implementation, you would mark the ticket as escalated

  return { success: true };
}
