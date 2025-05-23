"use server";

import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session";
import { revalidatePath } from "next/cache";

// Like a property
export async function likeProperty(
  propertyId: string
): Promise<{ success: boolean; message: string }> {
  try {
    const user = await getCurrentUser();

    if (!user || !user.id) {
      return {
        success: false,
        message: "You must be logged in to like a property",
      };
    }

    // Check if already liked
    const existingLike = await prisma.like.findUnique({
      where: {
        propertyId_userId: {
          propertyId,
          userId: user.id,
        },
      },
    });

    if (existingLike) {
      return { success: true, message: "Property already liked" };
    }

    // Create like record
    await prisma.like.create({
      data: {
        propertyId,
        userId: user.id,
      },
    });

    // Update user's favoriteIds array
    await prisma.user.update({
      where: { id: user.id },
      data: {
        favoriteIds: {
          push: propertyId,
        },
      },
    });

    revalidatePath(`/properties/${propertyId}`);

    return { success: true, message: "Property liked successfully" };
  } catch (error) {
    console.error("Error liking property:", error);
    return { success: false, message: "Failed to like property" };
  }
}

// Unlike a property
export async function unlikeProperty(
  propertyId: string
): Promise<{ success: boolean; message: string }> {
  try {
    const user = await getCurrentUser();

    if (!user || !user.id) {
      return {
        success: false,
        message: "You must be logged in to unlike a property",
      };
    }

    // Delete like record
    await prisma.like.delete({
      where: {
        propertyId_userId: {
          propertyId,
          userId: user.id,
        },
      },
    });

    // Remove from user's favoriteIds array
    await prisma.user.update({
      where: { id: user.id },
      data: {
        favoriteIds: {
          set: user.favoriteIds.filter((id) => id !== propertyId),
        },
      },
    });

    revalidatePath(`/properties/${propertyId}`);

    return { success: true, message: "Property unliked successfully" };
  } catch (error) {
    console.error("Error unliking property:", error);
    return { success: false, message: "Failed to unlike property" };
  }
}

// Save a property
export async function saveProperty(
  propertyId: string
): Promise<{ success: boolean; message: string }> {
  try {
    const user = await getCurrentUser();

    if (!user || !user.id) {
      return {
        success: false,
        message: "You must be logged in to save a property",
      };
    }

    // Check if already saved
    const existingSave = await prisma.savedProperty.findUnique({
      where: {
        propertyId_userId: {
          propertyId,
          userId: user.id,
        },
      },
    });

    if (existingSave) {
      return { success: true, message: "Property already saved" };
    }

    // Create saved property record
    await prisma.savedProperty.create({
      data: {
        propertyId,
        userId: user.id,
      },
    });

    revalidatePath(`/properties/${propertyId}`);

    return { success: true, message: "Property saved successfully" };
  } catch (error) {
    console.error("Error saving property:", error);
    return { success: false, message: "Failed to save property" };
  }
}

// Unsave a property
export async function unsaveProperty(
  propertyId: string
): Promise<{ success: boolean; message: string }> {
  try {
    const user = await getCurrentUser();

    if (!user || !user.id) {
      return {
        success: false,
        message: "You must be logged in to unsave a property",
      };
    }

    // Delete saved property record
    await prisma.savedProperty.delete({
      where: {
        propertyId_userId: {
          propertyId,
          userId: user.id,
        },
      },
    });

    revalidatePath(`/properties/${propertyId}`);

    return { success: true, message: "Property unsaved successfully" };
  } catch (error) {
    console.error("Error unsaving property:", error);
    return { success: false, message: "Failed to unsave property" };
  }
}
