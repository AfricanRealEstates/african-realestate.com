"use server";

import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session";
import type { PropertyData } from "@/lib/types";

export async function getPersonalizedProperties(
  limit = 8
): Promise<PropertyData[]> {
  try {
    console.log("Fetching personalized properties...");
    const user = await getCurrentUser();

    // If no user is logged in, return properties based on anonymous browsing data
    if (!user) {
      console.log("No user logged in, fetching default properties");
      return getDefaultFeaturedProperties(limit);
    }

    // Get user's interaction data with proper error handling
    try {
      // Get all user interactions with properties
      const [
        viewedProperties,
        likedProperties,
        savedProperties,
        searchHistory,
      ] = await Promise.all([
        // Recently viewed properties
        prisma.propertyView.findMany({
          where: { userId: user.id },
          orderBy: { viewedAt: "desc" },
          take: 20,
          select: { propertyId: true, viewedAt: true },
        }),

        // Liked properties
        prisma.like.findMany({
          where: { userId: user.id },
          select: { propertyId: true, createdAt: true },
        }),

        // Saved properties
        prisma.savedProperty.findMany({
          where: { userId: user.id },
          select: { propertyId: true, createdAt: true },
        }),

        // Search history
        prisma.searchHistory.findMany({
          where: { userId: user.id },
          orderBy: { updatedAt: "desc" },
          take: 10,
        }),
      ]);

      // If user has no interactions, return default featured properties
      if (
        viewedProperties.length === 0 &&
        likedProperties.length === 0 &&
        savedProperties.length === 0 &&
        searchHistory.length === 0
      ) {
        console.log("User has no interactions, fetching default properties");
        return getDefaultFeaturedProperties(limit);
      }

      // Extract property IDs from user interactions
      const viewedIds = viewedProperties.map((view) => view.propertyId);
      const likedIds = likedProperties.map((like) => like.propertyId);
      const savedIds = savedProperties.map((saved) => saved.propertyId);

      // Combine all IDs and remove duplicates
      const interactedIds = [
        ...new Set([...viewedIds, ...likedIds, ...savedIds]),
      ];

      // Get properties the user has interacted with to analyze preferences
      const interactedProperties = await prisma.property.findMany({
        where: { id: { in: interactedIds } },
      });

      // Extract user preferences
      const propertyDetails = interactedProperties.map(
        (p) => p.propertyDetails
      );
      const counties = interactedProperties.map((p) => p.county);
      const propertyTypes = interactedProperties.map((p) => p.propertyType);
      const priceRanges = interactedProperties.map((p) => p.price);

      // Calculate price range preferences
      const avgPrice =
        priceRanges.reduce((sum, price) => sum + price, 0) / priceRanges.length;
      const minPricePreference = avgPrice * 0.7; // 30% below average
      const maxPricePreference = avgPrice * 1.3; // 30% above average

      // Extract search preferences from search history
      const searchPreferences = {
        counties: new Set<string>(),
        propertyTypes: new Set<string>(),
        propertyDetails: new Set<string>(),
        status: new Set<string>(),
      };

      searchHistory.forEach((search) => {
        const filters = search.filters as any;
        if (filters.county) searchPreferences.counties.add(filters.county);
        if (filters.propertyType)
          searchPreferences.propertyTypes.add(filters.propertyType);
        if (filters.propertyDetails)
          searchPreferences.propertyDetails.add(filters.propertyDetails);
        if (filters.status) searchPreferences.status.add(filters.status);
      });

      // Build recommendation query
      const recommendationQuery: any = {
        AND: [
          { isActive: true },
          { id: { notIn: interactedIds } }, // Don't recommend properties the user already interacted with
        ],
        OR: [],
      };

      // Add preference-based conditions
      const preferenceConditions = [];

      // Property type preferences (from interactions and searches)
      if (
        propertyTypes.length > 0 ||
        searchPreferences.propertyTypes.size > 0
      ) {
        const allPropertyTypes = [
          ...propertyTypes,
          ...Array.from(searchPreferences.propertyTypes),
        ];
        preferenceConditions.push({ propertyType: { in: allPropertyTypes } });
      }

      // Location preferences (from interactions and searches)
      if (counties.length > 0 || searchPreferences.counties.size > 0) {
        const allCounties = [
          ...counties,
          ...Array.from(searchPreferences.counties),
        ];
        preferenceConditions.push({ county: { in: allCounties } });
      }

      // Price range preferences (from interactions)
      if (priceRanges.length > 0) {
        preferenceConditions.push({
          AND: [
            { price: { gte: minPricePreference } },
            { price: { lte: maxPricePreference } },
          ],
        });
      }

      // Status preferences (from searches)
      if (searchPreferences.status.size > 0) {
        preferenceConditions.push({
          status: { in: Array.from(searchPreferences.status) },
        });
      }

      // Add preference conditions to query
      if (preferenceConditions.length > 0) {
        recommendationQuery.OR = preferenceConditions;
      }

      // Get recommendations based on preferences with view count
      const recommendations = await prisma.property.findMany({
        where: recommendationQuery,
        orderBy: [{ updatedAt: "desc" }],
        take: limit,
        include: {
          views: true,
          likes: true,
        },
      });

      // If we don't have enough recommendations, fill with featured properties
      if (recommendations.length < limit) {
        console.log(
          `Only found ${recommendations.length} recommendations, filling with featured properties`
        );
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

      console.log(
        `Found ${recommendations.length} personalized recommendations`
      );
      return recommendations as any[];
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
    console.log("Fetching default featured properties...");

    // Get a mix of recently updated and popular properties
    const properties = await prisma.property.findMany({
      where: { isActive: true },
      orderBy: [{ updatedAt: "desc" }],
      take: limit,
      include: {
        views: true,
        likes: true,
      },
    });

    console.log(`Found ${properties.length} default featured properties`);
    return properties as any[];
  } catch (error) {
    console.error("Error fetching default featured properties:", error);

    // Return empty array as last resort
    console.log("Returning empty array due to error");
    return [];
  }
}
