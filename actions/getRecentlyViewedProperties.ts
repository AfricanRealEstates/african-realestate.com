"use server";

import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session";
import type { PropertyData } from "@/lib/types";

export async function getRecentlyViewedProperties(
  propertyIds?: string[]
): Promise<PropertyData[]> {
  try {
    const user = await getCurrentUser();

    // If user is logged in, get from database
    if (user) {
      const recentlyViewed = await prisma.recentlyViewedProperty.findMany({
        where: {
          userId: user.id,
        },
        orderBy: {
          viewedAt: "desc",
        },
        take: 6,
        include: {
          property: true,
        },
      });

      return recentlyViewed.map((item) => item.property) as PropertyData[];
    }

    // Otherwise use the provided property IDs from cookies/localStorage
    if (!propertyIds || propertyIds.length === 0) {
      return [];
    }

    // Fetch properties by IDs
    const properties = await prisma.property.findMany({
      where: {
        id: { in: propertyIds },
        isActive: true,
      },
    });

    // Sort properties to match the order of propertyIds (most recently viewed first)
    const sortedProperties = propertyIds
      .map((id) => properties.find((property) => property.id === id))
      .filter(Boolean) as PropertyData[];

    return sortedProperties;
  } catch (error) {
    console.error("Error fetching recently viewed properties:", error);
    return [];
  }
}
