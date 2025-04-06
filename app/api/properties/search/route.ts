import { prisma } from "@/lib/prisma";
import { type NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const term = searchParams.get("term") || "";
    const status = searchParams.get("status") || "active";
    const isActive = status === "active";

    // Build the search query
    const properties = await prisma.property.findMany({
      where: {
        isActive,
        OR: [
          { title: { contains: term, mode: "insensitive" } },
          { propertyNumber: term ? Number.parseInt(term) : undefined },
          { user: { name: { contains: term, mode: "insensitive" } } },
          { user: { email: { contains: term, mode: "insensitive" } } },
        ],
      },
      select: {
        id: true,
        title: true,
        propertyNumber: true,
        status: true,
        isActive: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      take: 20, // Limit results
      orderBy: {
        updatedAt: "desc",
      },
    });

    return NextResponse.json(properties);
  } catch (error) {
    console.error("Error searching properties:", error);
    return NextResponse.json(
      { error: "Failed to search properties" },
      { status: 500 }
    );
  }
}
