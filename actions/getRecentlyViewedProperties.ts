"use server";

import { prisma } from "@/lib/prisma";
import type { PropertyData } from "@/lib/types";

export async function getRecentlyViewedProperties(
  propertyIds: string[]
): Promise<PropertyData[]> {
  if (!propertyIds || propertyIds.length === 0) {
    return [];
  }

  try {
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
