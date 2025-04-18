import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session";
import type { PropertyData } from "@/lib/types";

export async function getPersonalizedProperties(
  limit = 6
): Promise<PropertyData[]> {
  try {
    const user = await getCurrentUser();

    // If no user is logged in, return featured properties
    if (!user) {
      return getDefaultFeaturedProperties(limit);
    }

    // Get user's interaction data with proper error handling
    try {
      const [viewedProperties, likedProperties, savedProperties] =
        await Promise.all([
          prisma.propertyView.findMany({
            where: { userId: user.id },
            orderBy: { viewedAt: "desc" },
            take: 10,
            select: { propertyId: true },
          }),
          prisma.like.findMany({
            where: { userId: user.id },
            select: { propertyId: true },
          }),
          prisma.savedProperty.findMany({
            where: { userId: user.id },
            select: { propertyId: true },
          }),
        ]);

      // Extract property IDs from user interactions
      const viewedIds = viewedProperties.map((view) => view.propertyId);
      const likedIds = likedProperties.map((like) => like.propertyId);
      const savedIds = savedProperties.map((saved) => saved.propertyId);

      // Combine all IDs and remove duplicates
      const interactedIds = [
        ...new Set([...viewedIds, ...likedIds, ...savedIds]),
      ];

      // If user has no interactions, return default featured properties
      if (interactedIds.length === 0) {
        return getDefaultFeaturedProperties(limit);
      }

      // Get properties the user has interacted with to analyze preferences
      const interactedProperties = await prisma.property.findMany({
        where: { id: { in: interactedIds } },
      });

      // Extract basic preferences
      const propertyDetails = interactedProperties.map(
        (p) => p.propertyDetails
      );
      const counties = interactedProperties.map((p) => p.county);
      const propertyTypes = interactedProperties.map((p) => p.propertyType);

      // Get recommendations based on simple preferences
      const recommendations = await prisma.property.findMany({
        where: {
          AND: [
            { isActive: true },
            { id: { notIn: interactedIds } }, // Don't recommend properties the user already interacted with
            {
              OR: [
                { propertyDetails: { in: propertyDetails } },
                { county: { in: counties } },
                { propertyType: { in: propertyTypes } },
              ],
            },
          ],
        },
        orderBy: { updatedAt: "desc" },
        take: limit,
      });

      // If we don't have enough recommendations, fill with featured properties
      if (recommendations.length < limit) {
        const featuredProperties = await getDefaultFeaturedProperties(
          limit - recommendations.length
        );

        // Combine recommendations with featured properties, avoiding duplicates
        const recommendationIds = recommendations.map((prop) => prop.id);
        const filteredFeatured = featuredProperties.filter(
          (prop) => !recommendationIds.includes(prop.id)
        );

        return [...recommendations, ...filteredFeatured].slice(
          0,
          limit
        ) as PropertyData[];
      }

      return recommendations as PropertyData[];
    } catch (error) {
      console.error("Error fetching user interactions:", error);
      return getDefaultFeaturedProperties(limit);
    }
  } catch (error) {
    console.error("Error in getPersonalizedProperties:", error);
    return getDefaultFeaturedProperties(limit);
  }
}

// Simplified fallback to get default featured properties
async function getDefaultFeaturedProperties(
  limit: number
): Promise<PropertyData[]> {
  try {
    // Simple query for active properties
    const properties = await prisma.property.findMany({
      where: { isActive: true },
      orderBy: { updatedAt: "desc" },
      take: limit,
    });

    return properties as PropertyData[];
  } catch (error) {
    console.error("Error fetching default featured properties:", error);
    return [];
  }
}
