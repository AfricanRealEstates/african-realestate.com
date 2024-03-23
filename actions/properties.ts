"use server";

import { revalidatePath } from "next/cache";

import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";

export const addProperty = async (property: any) => {
  try {
    const user = await getServerSession(authOptions);
    property.userId = user?.user.id;

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
