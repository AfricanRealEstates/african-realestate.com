import { NextRequest, NextResponse } from 'next/server';
import prisma from "@/lib/prisma";

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const q = searchParams.get('q');

        if (typeof q !== "string") {
            return NextResponse.json({ message: "Invalid query" }, { status: 400 });
        }

        const properties = await prisma.property.findMany({
            where: {
                OR: [
                    { title: { contains: q, mode: "insensitive" } },
                    { description: { contains: q, mode: "insensitive" } },
                    { county: { contains: q, mode: "insensitive" } },
                    { nearbyTown: { contains: q, mode: "insensitive" } },
                    { user: { name: { contains: q, mode: "insensitive" } } },
                ],
            },
            include: {
                user: true,
            },
            take: 5, // Limit to 5 results for the autocomplete
        });

        return NextResponse.json(properties);
    } catch (error) {
        console.error("Search error:", error);
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}