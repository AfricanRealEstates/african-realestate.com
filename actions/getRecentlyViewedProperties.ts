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
        take: 8, // Increased to show more properties
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

export async function getPersonalizedRecommendations(
  userId: string
): Promise<PropertyData[]> {
  try {
    // Get user's recently viewed properties to understand preferences
    const recentlyViewed = await prisma.recentlyViewedProperty.findMany({
      where: { userId },
      include: { property: true },
      orderBy: { viewedAt: "desc" },
      take: 10,
    });

    if (!recentlyViewed.length) {
      // If no viewing history, return popular properties
      return getPopularProperties();
    }

    // Analyze user preferences
    const viewedProperties = recentlyViewed.map((rv) => rv.property);
    const preferences = analyzeUserPreferences(viewedProperties);

    // Get recommendations based on preferences
    const recommendations = await prisma.property.findMany({
      where: {
        AND: [
          { isActive: true },
          { id: { notIn: viewedProperties.map((p) => p.id) } }, // Exclude already viewed
          {
            OR: [
              // Match property type preference
              { propertyType: { in: preferences.preferredTypes } },
              // Match price range
              {
                AND: [
                  { price: { gte: preferences.priceRange.min } },
                  { price: { lte: preferences.priceRange.max } },
                ],
              },
              // Match location preference
              { county: { in: preferences.preferredLocations } },
            ],
          },
        ],
      },
      orderBy: [
        { views: { _count: "desc" } }, // Popular properties first
        { createdAt: "desc" }, // Then newest
      ],
      take: 8,
    });

    return recommendations as PropertyData[];
  } catch (error) {
    console.error("Error fetching personalized recommendations:", error);
    return [];
  }
}

async function getPopularProperties(): Promise<PropertyData[]> {
  try {
    const properties = await prisma.property.findMany({
      where: { isActive: true },
      orderBy: { views: { _count: "desc" } },
      take: 8,
    });

    return properties as PropertyData[];
  } catch (error) {
    console.error("Error fetching popular properties:", error);
    return [];
  }
}

function analyzeUserPreferences(properties: any[]) {
  // Analyze property types
  const typeCount: Record<string, number> = {};
  const locationCount: Record<string, number> = {};
  const prices: number[] = [];

  properties.forEach((property) => {
    // Count property types
    typeCount[property.propertyType] =
      (typeCount[property.propertyType] || 0) + 1;

    // Count locations
    locationCount[property.county] = (locationCount[property.county] || 0) + 1;

    // Collect prices
    prices.push(property.price);
  });

  // Get preferred types (top 2)
  const preferredTypes = Object.entries(typeCount)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 2)
    .map(([type]) => type);

  // Get preferred locations (top 3)
  const preferredLocations = Object.entries(locationCount)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 3)
    .map(([location]) => location);

  // Calculate price range (with some flexibility)
  const avgPrice =
    prices.reduce((sum, price) => sum + price, 0) / prices.length;
  const priceRange = {
    min: Math.max(0, avgPrice * 0.7), // 30% below average
    max: avgPrice * 1.5, // 50% above average
  };

  return {
    preferredTypes,
    preferredLocations,
    priceRange,
  };
}
