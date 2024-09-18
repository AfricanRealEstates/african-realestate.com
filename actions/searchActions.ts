// app/actions/searchActions.ts
"use server";

import prisma from "@/lib/prisma";

export async function searchProperties(query: string) {
    if (!query.trim()) return [];

    const properties = await prisma.property.findMany({
        where: {
            OR: [
                { title: { contains: query, mode: "insensitive" } },
                { description: { contains: query, mode: "insensitive" } },
                { county: { contains: query, mode: "insensitive" } },
                { nearbyTown: { contains: query, mode: "insensitive" } },
                { user: { name: { contains: query, mode: "insensitive" } } },
            ],
        },
        include: {
            user: true,
        },
        // take: 5, // Limit to 5 results for the autocomplete
    });

    return properties;
}