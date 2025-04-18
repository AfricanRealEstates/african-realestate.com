import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { propertyIds } = body;

    if (
      !propertyIds ||
      !Array.isArray(propertyIds) ||
      propertyIds.length === 0
    ) {
      return NextResponse.json({ properties: [] });
    }

    // Fetch properties by IDs with error handling
    const properties = await prisma.property.findMany({
      where: {
        id: { in: propertyIds },
        isActive: true,
      },
    });

    return NextResponse.json({ properties });
  } catch (error) {
    console.error("Error fetching recently viewed properties:", error);
    return NextResponse.json({ properties: [] });
  }
}
