import { type NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const propertyType = searchParams.get("propertyType");
  const guideType = searchParams.get("guideType");

  try {
    const guides = await prisma.guide.findMany({
      where: {
        published: true,
        ...(propertyType && { propertyType }),
        ...(guideType && { guideType }),
      },
      orderBy: {
        publishedAt: "desc",
      },
      take: 5,
    });

    return NextResponse.json(guides);
  } catch (error) {
    console.error("Failed to fetch filtered guides:", error);
    return NextResponse.json(
      { error: "Failed to fetch guides" },
      { status: 500 }
    );
  }
}
