"use server";

import { prisma } from "@/lib/prisma";

export async function getPropertyCount() {
  try {
    const count = await prisma.property.count({
      where: {
        isActive: true, // Only count active properties
      },
    });

    return count;
  } catch (error) {
    console.error("Error fetching property count:", error);
    return 0;
  }
}
