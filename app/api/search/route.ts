import { NextRequest, NextResponse } from 'next/server';
import prisma from "@/lib/prisma";

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const q = searchParams.get('q');
        const status = searchParams.get('status');
        const minBedrooms = searchParams.get('minBedrooms');
        const maxBedrooms = searchParams.get('maxBedrooms');
        const minBathrooms = searchParams.get('minBathrooms');
        const maxBathrooms = searchParams.get('maxBathrooms');
        const minPrice = searchParams.get('minPrice');
        const maxPrice = searchParams.get('maxPrice');
        const propertyType = searchParams.get('propertyType');

        const where: any = {};

        if (q) {
            where.OR = [
                { title: { contains: q, mode: "insensitive" } },
                { description: { contains: q, mode: "insensitive" } },
                { county: { contains: q, mode: "insensitive" } },
                { nearbyTown: { contains: q, mode: "insensitive" } },
                { user: { name: { contains: q, mode: "insensitive" } } },
                { user: { agentName: { contains: q, mode: "insensitive" } } },
            ];
        }

        if (status) {
            where.status = { in: status.split(',') };
        }

        if (minBedrooms) where.bedrooms = { gte: parseInt(minBedrooms) };
        if (maxBedrooms) where.bedrooms = { ...where.bedrooms, lte: parseInt(maxBedrooms) };
        if (minBathrooms) where.bathrooms = { gte: parseInt(minBathrooms) };
        if (maxBathrooms) where.bathrooms = { ...where.bathrooms, lte: parseInt(maxBathrooms) };
        if (minPrice) where.price = { gte: parseFloat(minPrice) };
        if (maxPrice) where.price = { ...where.price, lte: parseFloat(maxPrice) };
        if (propertyType) where.propertyType = { in: propertyType.split(',') };

        const properties = await prisma.property.findMany({
            where,
            include: {
                user: true,
            },
            take: q ? 5 : undefined, // Limit to 5 results only for autocomplete queries
        });

        const totalCount = await prisma.property.count({ where });

        return NextResponse.json({
            properties,
            count: totalCount,
        });
    } catch (error) {
        console.error("Search error:", error);
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}