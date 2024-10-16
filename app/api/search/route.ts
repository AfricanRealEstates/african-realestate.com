import { NextRequest, NextResponse } from 'next/server';
import prisma from "@/lib/prisma";

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const q = searchParams.get('q');
        const status = searchParams.get('status');
        const minPrice = searchParams.get('minPrice');
        const maxPrice = searchParams.get('maxPrice');
        const propertyType = searchParams.get('propertyType');
        const propertyDetails = searchParams.get('propertyDetails');
        const location = searchParams.get('location');

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
            where.status = status;
        }

        if (minPrice || maxPrice) {
            where.price = {};
            if (minPrice) where.price.gte = parseFloat(minPrice);
            if (maxPrice) where.price.lte = parseFloat(maxPrice);
        }

        if (propertyType) where.propertyType = propertyType;
        if (propertyDetails) where.propertyDetails = propertyDetails;

        if (location) {
            where.OR = [
                ...(where.OR || []),
                { locality: { contains: location, mode: "insensitive" } },
                { nearbyTown: { contains: location, mode: "insensitive" } },
                { county: { contains: location, mode: "insensitive" } },
            ];
        }

        const properties = await prisma.property.findMany({
            where,
            include: {
                user: true,
            },
            take: 20, // Limit results to 20 for pagination
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

// import { NextRequest, NextResponse } from 'next/server';
// import prisma from "@/lib/prisma";

// export async function GET(request: NextRequest) {
//     try {
//         const { searchParams } = new URL(request.url);
//         const q = searchParams.get('q');
//         const status = searchParams.get('status');
//         const minPrice = searchParams.get('minPrice');
//         const maxPrice = searchParams.get('maxPrice');
//         const propertyType = searchParams.get('propertyType');
//         const propertyDetails = searchParams.get('propertyDetails');
//         const location = searchParams.get('location');

//         const where: any = {};

//         if (q) {
//             where.OR = [
//                 { title: { contains: q, mode: "insensitive" } },
//                 { description: { contains: q, mode: "insensitive" } },
//                 { county: { contains: q, mode: "insensitive" } },
//                 { nearbyTown: { contains: q, mode: "insensitive" } },
//                 { propertyDetails: { contains: q, mode: "insensitive" } },
//                 { user: { name: { contains: q, mode: "insensitive" } } },
//                 { user: { agentName: { contains: q, mode: "insensitive" } } },
//             ];
//         }

//         if (status) {
//             where.status = status;
//         }

//         // Updated price filtering
//         if (minPrice || maxPrice) {
//             where.price = {};
//             if (minPrice) where.price.gte = parseFloat(minPrice);
//             if (maxPrice) where.price.lte = parseFloat(maxPrice);
//         }

//         if (propertyType) where.propertyType = propertyType;
//         if (propertyDetails) where.propertyDetails = propertyDetails;

//         if (location) {
//             where.OR = [
//                 { locality: { contains: location, mode: "insensitive" } },
//                 { nearbyTown: { contains: location, mode: "insensitive" } },
//                 { county: { contains: location, mode: "insensitive" } },
//             ];
//         }

//         const properties = await prisma.property.findMany({
//             where,
//             include: {
//                 user: true,
//             },
//             take: q ? 5 : undefined, // Limit to 5 results only for autocomplete queries
//         });

//         const totalCount = await prisma.property.count({ where });

//         return NextResponse.json({
//             properties,
//             count: totalCount,
//         });
//     } catch (error) {
//         console.error("Search error:", error);
//         return NextResponse.json({ message: "Internal server error" }, { status: 500 });
//     }
// }