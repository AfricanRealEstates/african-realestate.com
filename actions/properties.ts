"use server";

import { revalidatePath } from "next/cache";
import { getCurrentUser } from "./users";
import prisma from "@/lib/prisma";

export const addProperty = async (property: any) => {
  try {
    const user: any = await getCurrentUser();
    property.userId = user.data.id;

    await prisma.property.create({
      data: property,
    });
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
    await prisma.property.update({
      where: {
        id: id,
      },
      data: property,
    });
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
