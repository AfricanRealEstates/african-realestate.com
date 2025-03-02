"use server";

import { prisma } from "@/lib/prisma";
import type { UserRole } from "@prisma/client";
import { revalidatePath } from "next/cache";

export async function updateUserRole(userId: string, newRole: UserRole) {
  try {
    await prisma.user.update({
      where: { id: userId },
      data: { role: newRole },
    });
    revalidatePath("/dashboard/users");
    return { success: true };
  } catch (error) {
    console.error("Failed to update user role:", error);
    return { success: false, error: "Failed to update user role" };
  }
}
