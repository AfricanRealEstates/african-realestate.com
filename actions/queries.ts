"use server";

import { getCurrentUser } from "./users";
import prisma from "@/lib/prisma";
export const addQuery = async (query: any) => {
  try {
    const user = await getCurrentUser();
    query.userId = user.data?.id;
    await prisma.query.create({
      data: query,
    });

    return {
      success: true,
      message: "Query added successfully",
    };
  } catch (error: any) {
    return {
      error: error.message,
    };
  }
};

export const getQueriesByPropertyId = async (propertyId: string) => {
  try {
    const queries = await prisma.query.findMany({
      where: {
        propertyId: propertyId,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return {
      success: true,
      data: queries,
    };
  } catch (error: any) {
    return {
      error: error.message,
    };
  }
};
