"use server";

import { revalidatePath } from "next/cache";

import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

// Get popular locations with property counts and cover photos
export async function getPopularLocations() {
  try {
    // Get counties with property counts
    const counties = await prisma.property.groupBy({
      by: ["county"],
      _count: {
        id: true,
      },
      where: {
        isActive: true,
      },
      orderBy: {
        _count: {
          id: "desc",
        },
      },
      take: 6,
    });

    // For each county, find a property with a cover photo to use
    const locationsWithImages = await Promise.all(
      counties.map(async (county) => {
        // Find a property in this county that has cover photos
        const propertyWithImage = await prisma.property.findFirst({
          where: {
            county: county.county,
            isActive: true,
            coverPhotos: {
              isEmpty: false,
            },
          },
          select: {
            coverPhotos: true,
          },
        });

        return {
          name: county.county,
          propertyCount: county._count.id,
          // Use the actual property cover photo if available
          imageUrl: propertyWithImage?.coverPhotos?.[0] || null,
        };
      })
    );

    return locationsWithImages;
  } catch (error) {
    console.error("Error fetching popular locations:", error);
    return [];
  }
}

// Track property view
export async function trackPropertyView(propertyId: string, userId?: string) {
  try {
    // Get user agent info from client-side
    const userAgent = {
      deviceType: "unknown", // You'd get this from the client
      browser: "unknown",
      os: "unknown",
      country: "unknown",
      city: "unknown",
    };

    // Create property view record
    await prisma.propertyView.create({
      data: {
        propertyId,
        userId,
        deviceType: userAgent.deviceType,
        browser: userAgent.browser,
        os: userAgent.os,
        country: userAgent.country,
        city: userAgent.city,
      },
    });

    // Update property view count in cache
    revalidatePath(`/properties/${propertyId}`);

    return { success: true };
  } catch (error) {
    console.error("Error tracking property view:", error);
    return { success: false, error: "Failed to track view" };
  }
}

// Get recommended properties based on user's viewing history
export async function getRecommendedProperties(userId?: string, limit = 8) {
  try {
    if (!userId) {
      // If no user ID, return featured properties instead
      return getFeaturedProperties(limit);
    }

    // Get user's recently viewed property types and locations
    const recentViews = await prisma.propertyView.findMany({
      where: { userId },
      orderBy: { viewedAt: "desc" },
      take: 10,
      include: {
        property: {
          select: {
            propertyType: true,
            county: true,
            locality: true,
          },
        },
      },
    });

    if (recentViews.length === 0) {
      return getFeaturedProperties(limit);
    }

    // Extract property types and locations from views
    const propertyTypes = [
      ...new Set(recentViews.map((view) => view.property.propertyType)),
    ];
    const counties = [
      ...new Set(recentViews.map((view) => view.property.county)),
    ];
    const localities = [
      ...new Set(recentViews.map((view) => view.property.locality)),
    ];

    // Find similar properties
    const recommendedProperties = await prisma.property.findMany({
      where: {
        OR: [
          { propertyType: { in: propertyTypes } },
          { county: { in: counties } },
          { locality: { in: localities } },
        ],
        isActive: true,
        isAvailableForPurchase: true,
        // Exclude properties the user has already viewed
        id: {
          notIn: recentViews.map((view) => view.propertyId),
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      take: limit,
    });

    return recommendedProperties;
  } catch (error) {
    console.error("Error fetching recommended properties:", error);
    return [];
  }
}

// Get featured properties
export async function getFeaturedProperties(limit = 8) {
  try {
    // In a real app, you might have a "featured" flag or use properties with most views
    const featuredProperties = await prisma.property.findMany({
      where: {
        isActive: true,
        isAvailableForPurchase: true,
      },
      orderBy: [
        {
          views: {
            _count: "desc",
          },
        },
        { createdAt: "desc" },
      ],
      take: limit,
    });

    return featuredProperties;
  } catch (error) {
    console.error("Error fetching featured properties:", error);
    return [];
  }
}

// Save property to user's favorites
export async function saveProperty(propertyId: string, userId: string) {
  try {
    // Check if already saved
    const existingSave = await prisma.savedProperty.findUnique({
      where: {
        propertyId_userId: {
          propertyId,
          userId,
        },
      },
    });

    if (existingSave) {
      // If already saved, remove it (toggle functionality)
      await prisma.savedProperty.delete({
        where: {
          propertyId_userId: {
            propertyId,
            userId,
          },
        },
      });
      return { success: true, saved: false };
    }

    // Save the property
    await prisma.savedProperty.create({
      data: {
        propertyId,
        userId,
      },
    });

    return { success: true, saved: true };
  } catch (error) {
    console.error("Error saving property:", error);
    return { success: false, error: "Failed to save property" };
  }
}

async function getNextPropertyNumber(): Promise<number> {
  const sequence = await prisma.propertyNumberSequence.findUnique({
    where: { id: 1 },
  });

  if (!sequence) {
    // Initialize the sequence if it doesn't exist
    await prisma.propertyNumberSequence.create({
      data: { id: 1, seq: 7000 },
    });
    return 7000;
  }

  const nextNumber = sequence.seq + 1;

  await prisma.propertyNumberSequence.update({
    where: { id: 1 },
    data: { seq: nextNumber },
  });

  return nextNumber;
}

export const addProperty = async (property: any) => {
  try {
    const session = await auth();
    const userId = session?.user.id;

    if (!userId) {
      throw new Error("Unauthorized");
    }

    // Check the user's current role
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { role: true },
    });

    // Only update the role to AGENT if the user is currently a USER, not an AGENCY or ADMIN
    if (user?.role === "USER") {
      await prisma.user.update({
        where: { id: userId },
        data: { role: "AGENT" },
      });
    }

    // Get the next property number
    const propertyNumber = await getNextPropertyNumber();

    // Add the property with the user's ID and the new property number
    property.userId = userId;
    property.propertyNumber = propertyNumber;

    const newProperty = await prisma.property.create({
      data: property,
    });

    // Count the total properties of the user
    const propertyCount = await prisma.property.count({
      where: { userId },
    });

    // If the user has more than 3 properties, promote them to AGENCY role
    if (
      propertyCount > 3 &&
      user?.role !== "AGENCY" &&
      user?.role !== "ADMIN"
    ) {
      await prisma.user.update({
        where: { id: userId },
        data: { role: "AGENCY" },
      });
    }

    // Revalidate paths after adding property
    revalidatePath("/");
    revalidatePath("/buy");
    revalidatePath("/sell");
    revalidatePath("/agent/properties");

    return {
      data: newProperty,
      message: "Property added successfully",
    };
  } catch (error: any) {
    return {
      error: error.message,
    };
  }
};

export const editProperty = async (id: string, property: any) => {
  try {
    const session = await auth();
    const userId = session?.user.id;

    if (!userId) {
      throw new Error("Unauthorized");
    }

    // Check the user's current role
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { role: true },
    });

    // Only update the role to AGENT if the user is currently a USER, not an AGENCY or ADMIN
    if (user?.role === "USER") {
      await prisma.user.update({
        where: { id: userId },
        data: { role: "AGENT" },
      });
    }

    // Update the property
    await prisma.property.update({
      where: {
        id: id,
      },
      data: property,
    });

    // Revalidate paths after editing property
    revalidatePath("/");
    revalidatePath("/buy");
    revalidatePath("/sell");
    revalidatePath("/agent/properties");

    return {
      data: property,
      message: `Property edited successfully`,
    };
  } catch (error: any) {
    return {
      error: error.message,
    };
  }
};

export async function deleteProperty(id: string) {
  try {
    const session = await auth();
    const userId = session?.user.id;

    if (!userId) {
      return { error: "Unauthorized" };
    }

    // Check if the property belongs to the user
    const property = await prisma.property.findUnique({
      where: { id },
      select: { userId: true },
    });

    if (!property || property.userId !== userId) {
      return { error: "Unauthorized to delete this property" };
    }

    // Delete related records first
    await prisma.propertyView.deleteMany({ where: { propertyId: id } });
    await prisma.notification.deleteMany({ where: { propertyId: id } });
    await prisma.upvote.deleteMany({ where: { propertyId: id } });
    await prisma.comment.deleteMany({ where: { propertyId: id } });
    await prisma.savedProperty.deleteMany({ where: { propertyId: id } });
    await prisma.rating.deleteMany({ where: { propertyId: id } });
    await prisma.like.deleteMany({ where: { propertyId: id } });
    await prisma.order.deleteMany({ where: { propertyId: id } });
    await prisma.query.deleteMany({ where: { propertyId: id } });

    // Finally, delete the property
    await prisma.property.delete({ where: { id } });

    revalidatePath("/");
    revalidatePath("/buy");
    revalidatePath("/sell");
    revalidatePath("/agent/properties");

    return { message: "Property deleted successfully" };
  } catch (error: any) {
    console.error("Error deleting property:", error);
    return { error: error.message };
  }
}

export const getPropertiesByLocality = async (
  locality: string,
  skip = 0,
  take = 10
) => {
  try {
    const properties = await prisma.property.findMany({
      where: {
        locality: {
          contains: locality,
          mode: "insensitive",
        },
      },
      skip, // Skips the number of records
      take, // Limits the number of records returned
    });

    return {
      data: properties,
      message: "Properties fetched successfully",
    };
  } catch (error: any) {
    return {
      error: error.message,
    };
  }
};
