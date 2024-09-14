"use server";

import { revalidatePath } from "next/cache";

import prisma from "@/lib/prisma";
import { auth } from "@/auth";

export const addProperty = async (property: any) => {
  try {
    const session = await auth();
    const userId = session?.user.id;

    if (!userId) {
      throw new Error("Unauthorized");
    }

    // Check if the user is not an ADMIN
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { role: true },
    });

    // If the user is not an AGENT and not an ADMIN, update their role to AGENT
    if (user?.role !== "AGENT" && user?.role !== "ADMIN") {
      await prisma.user.update({
        where: { id: userId },
        data: { role: "AGENT" },
      });
    }

    // Add the property with the user's ID
    property.userId = userId;

    await prisma.property.create({
      data: property,
    });

    // Count the total properties of the user
    const propertyCount = await prisma.property.count({
      where: { userId },
    });

    // If the user has more than 3 properties, promote them to AGENCY role
    if (propertyCount > 3 && user?.role !== "AGENCY" && user?.role !== "ADMIN") {
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
      data: property,
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

    // Check if the user is not an ADMIN
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { role: true },
    });

    // If the user is not an AGENT and not an ADMIN, update their role to AGENT
    if (user?.role !== "AGENT" && user?.role !== "ADMIN") {
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


export const deleteProperty = async (id: string) => {
  try {
    await prisma.property.delete({
      where: {
        id: id,
      },
    });
    revalidatePath("/")
    revalidatePath("/buy")
    revalidatePath("/sell")
    revalidatePath("/agent/properties");
    return {
      message: "Property deleted successfully",
    };
  } catch (error: any) {
    return {
      error: error.message,
    };
  }
};

export const getPropertiesByLocality = async (locality: string, skip = 0, take = 10) => {
  try {
    const properties = await prisma.property.findMany({
      where: {
        locality: {
          contains: locality,
          mode: "insensitive",
        },
      },
      skip,  // Skips the number of records
      take,  // Limits the number of records returned
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
