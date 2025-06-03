import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const guides = await prisma.guide.findMany({
      where: {
        published: true,
      },
      select: {
        id: true,
        title: true,
        slug: true,
        propertyType: true,
        guideType: true,
        coverImage: true,
        published: true,
        publishedAt: true,
        createdAt: true,
      },
      orderBy: {
        publishedAt: "desc",
      },
      take: 12,
    });

    return NextResponse.json(guides);
  } catch (error) {
    console.error("Failed to fetch guides:", error);
    return NextResponse.json(
      { error: "Failed to fetch guides" },
      { status: 500 }
    );
  }
}
