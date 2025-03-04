"use server";

import { prisma } from "@/lib/prisma";

export interface UserStatusResult {
  exists: boolean;
  isActive?: boolean;
  suspensionEndDate?: Date | null;
  error?: string;
}

/**
 * Check if a user exists and is active before attempting to log in
 */
export async function checkUserStatus(
  email: string
): Promise<UserStatusResult> {
  try {
    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        isActive: true,
        suspensionEndDate: true,
      },
    });

    if (!user) {
      return { exists: false };
    }

    return {
      exists: true,
      isActive: user.isActive,
      suspensionEndDate: user.suspensionEndDate,
    };
  } catch (error) {
    console.error("Error checking user status:", error);
    return {
      exists: false,
      error: "Failed to check user status",
    };
  }
}
