import { type NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    // Build the query using the same logic as the search API
    const where: any = {};

    const q = searchParams.get("q");
    const status = searchParams.get("status");
    const minPrice = searchParams.get("minPrice");
    const maxPrice = searchParams.get("maxPrice");
    const propertyType = searchParams.get("propertyType");
    const propertyDetails = searchParams.get("propertyDetails");
    const location = searchParams.get("location");
    const county = searchParams.get("county");
    const locality = searchParams.get("locality");

    if (q) {
      where.OR = [
        { title: { contains: q, mode: "insensitive" } },
        { description: { contains: q, mode: "insensitive" } },
        { county: { contains: q, mode: "insensitive" } },
        { nearbyTown: { contains: q, mode: "insensitive" } },
      ];
    }

    if (status) where.status = status;
    if (propertyType) where.propertyType = propertyType;
    if (propertyDetails) where.propertyDetails = propertyDetails;

    if (minPrice || maxPrice) {
      where.price = {};
      if (minPrice) where.price.gte = Number.parseFloat(minPrice);
      if (maxPrice) where.price.lte = Number.parseFloat(maxPrice);
    }

    if (location) {
      where.OR = [
        ...(where.OR || []),
        { locality: { contains: location, mode: "insensitive" } },
        { nearbyTown: { contains: location, mode: "insensitive" } },
        { county: { contains: location, mode: "insensitive" } },
      ];
    }

    if (county) where.county = { contains: county, mode: "insensitive" };
    if (locality) where.locality = { contains: locality, mode: "insensitive" };

    // Only fetch a few properties to get their images
    const properties = await prisma.property.findMany({
      where,
      select: {
        coverPhotos: true,
        images: true,
      },
      take: 3,
    });

    // Extract preview images
    const previewImages = properties
      .map((property) => {
        if (property.coverPhotos && property.coverPhotos.length > 0) {
          return property.coverPhotos[0];
        } else if (property.images && property.images.length > 0) {
          return property.images[0];
        }
        return null;
      })
      .filter(Boolean);

    return NextResponse.json({
      previewImages,
      count: previewImages.length,
    });
  } catch (error) {
    console.error("Error fetching property previews:", error);
    return NextResponse.json({ previewImages: [] }, { status: 500 });
  }
}
