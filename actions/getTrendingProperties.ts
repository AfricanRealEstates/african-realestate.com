import { prisma } from "@/lib/prisma";
import type { PropertyData } from "@/lib/types";

export async function getTrendingProperties(
  limit = 6
): Promise<PropertyData[]> {
  try {
    // Get properties with the most views in the last 7 days
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const trendingProperties = await prisma.property.findMany({
      where: {
        isActive: true,
        views: {
          some: {
            viewedAt: {
              gte: sevenDaysAgo,
            },
          },
        },
      },
      orderBy: [
        {
          views: {
            _count: "desc",
          },
        },
        { updatedAt: "desc" },
      ],
      take: limit,
    });

    // If we don't have enough trending properties, supplement with recently updated properties
    if (trendingProperties.length < limit) {
      const recentProperties = await prisma.property.findMany({
        where: {
          isActive: true,
          id: {
            notIn: trendingProperties.map((p) => p.id),
          },
        },
        orderBy: { updatedAt: "desc" },
        take: limit - trendingProperties.length,
      });

      return [...trendingProperties, ...recentProperties] as PropertyData[];
    }

    return trendingProperties as PropertyData[];
  } catch (error) {
    console.error("Error fetching trending properties:", error);

    // Fallback to recently updated properties
    const fallbackProperties = await prisma.property.findMany({
      where: { isActive: true },
      orderBy: { updatedAt: "desc" },
      take: limit,
    });

    return fallbackProperties as PropertyData[];
  }
}
