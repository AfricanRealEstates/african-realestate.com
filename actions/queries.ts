"use server";


import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
export const addQuery = async (query: any) => {
  try {
    const session = await auth()
    query.userId = session?.user.id;
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
