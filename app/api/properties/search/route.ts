import { prisma } from "@/lib/prisma";
import { type NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const term = searchParams.get("term") || "";
    const status = searchParams.get("status") || "active";
    const isActive = status === "active";

    const terms = term
      .split(",")
      .map((t) => t.trim())
      .filter((t) => t.length > 0);

    const numberTerms = terms.filter((t) => !isNaN(Number(t))).map(Number);
    const textTerms = terms.filter((t) => isNaN(Number(t)));

    const properties = await prisma.property.findMany({
      where: {
        isActive,
        OR: [
          ...(numberTerms.length > 0
            ? [{ propertyNumber: { in: numberTerms } }]
            : []),
          ...(textTerms.length > 0
            ? [
                { title: { in: textTerms } },
                { user: { name: { in: textTerms } } },
                { user: { email: { in: textTerms } } },
              ]
            : []),
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
      take: 50, // Allow bigger selection if needed
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
