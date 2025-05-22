"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

export async function getUserPreferences() {
  const session = await auth();

  if (!session?.user?.id) {
    return {
      preferredPropertyTypes: [],
      preferredLocations: [],
      priceRange: { min: 0, max: 0 },
      hasPreferences: false,
    };
  }

  try {
    // Get user's search history
    const searchHistory = await prisma.searchHistory.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" },
      take: 10,
    });

    // Get user's viewed properties
    const viewedProperties = await prisma.propertyView.findMany({
      where: { userId: session.user.id },
      include: { property: true },
      orderBy: { viewedAt: "desc" },
      take: 20,
    });

    // Get user's saved properties
    const savedProperties = await prisma.savedProperty.findMany({
      where: { userId: session.user.id },
      include: { property: true },
      orderBy: { createdAt: "desc" },
    });

    // Extract property types from viewed and saved properties
    const propertyTypes = new Set<string>();
    const locations = new Set<string>();
    const prices: number[] = [];

    // Process viewed properties
    viewedProperties.forEach((view) => {
      if (view.property.propertyType) {
        propertyTypes.add(view.property.propertyType);
      }
      if (view.property.county) {
        locations.add(view.property.county);
      }
      if (view.property.locality) {
        locations.add(view.property.locality);
      }
      if (view.property.price) {
        prices.push(view.property.price);
      }
    });

    // Process saved properties
    savedProperties.forEach((saved) => {
      if (saved.property.propertyType) {
        propertyTypes.add(saved.property.propertyType);
      }
      if (saved.property.county) {
        locations.add(saved.property.county);
      }
      if (saved.property.locality) {
        locations.add(saved.property.locality);
      }
      if (saved.property.price) {
        prices.push(saved.property.price);
      }
    });

    // Calculate price range if we have prices
    const priceRange =
      prices.length > 0
        ? {
            min: Math.floor(Math.min(...prices) * 0.8),
            max: Math.ceil(Math.max(...prices) * 1.2),
          }
        : { min: 0, max: 0 };

    return {
      preferredPropertyTypes: Array.from(propertyTypes),
      preferredLocations: Array.from(locations),
      priceRange,
      hasPreferences: propertyTypes.size > 0 || locations.size > 0,
    };
  } catch (error) {
    console.error("Error fetching user preferences:", error);
    return {
      preferredPropertyTypes: [],
      preferredLocations: [],
      priceRange: { min: 0, max: 0 },
      hasPreferences: false,
    };
  }
}
