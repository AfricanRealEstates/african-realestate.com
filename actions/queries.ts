"use server";

import { getServerSession } from "next-auth";

import prisma from "@/lib/prisma";
import { authOptions } from "@/lib/auth-options";
export const addQuery = async (query: any) => {
  try {
    const user = await getServerSession(authOptions);
    query.userId = user?.user.id;
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
