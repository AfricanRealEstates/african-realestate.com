import { type NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const { propertyIds } = await request.json();

    if (
      !propertyIds ||
      !Array.isArray(propertyIds) ||
      propertyIds.length === 0
    ) {
      return NextResponse.json(
        { error: "Invalid property IDs" },
        { status: 400 }
      );
    }

    // Fetch properties by IDs
    const properties = await prisma.property.findMany({
      where: {
        id: {
          in: propertyIds,
        },
        isActive: true,
      },
      take: 8, // Limit to 8 properties
    });

    // Return properties in the same order as the IDs
    const orderedProperties = propertyIds
      .map((id) => properties.find((property) => property.id === id))
      .filter(Boolean);

    return NextResponse.json(orderedProperties);
  } catch (error) {
    console.error("Error fetching recently viewed properties:", error);
    return NextResponse.json(
      { error: "Failed to fetch properties" },
      { status: 500 }
    );
  }
}
