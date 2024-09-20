// import prisma from './prisma'
// import { Prisma } from '@prisma/client'

// export async function getProperties(searchParams: { [key: string]: string | string[] | undefined }) {
//     const {
//         propertyType,
//         propertyDetails,
//         county,
//         locality,
//         minPrice,
//         maxPrice,
//         status,
//     } = searchParams

//     const where: Prisma.PropertyWhereInput = {
//         AND: [
//             propertyType ? { propertyType: { equals: propertyType as string } } : {},
//             propertyDetails ? { propertyDetails: { equals: propertyDetails as string } } : {},
//             county ? { county: { equals: county as string } } : {},
//             locality ? { locality: { equals: locality as string } } : {},
//             minPrice ? { price: { gte: Number(minPrice) } } : {},
//             maxPrice ? { price: { lte: Number(maxPrice) } } : {},
//             { status: status as string }, // Use the status from searchParams
//         ]
//     }

//     const properties = await prisma.property.findMany({
//         where,
//         orderBy: {
//             updatedAt: 'desc',
//         },
//     })

//     return properties
// }

import prisma from "./prisma";

export async function getProperties(searchParams: { [key: string]: string | string[] | undefined }, status: 'sale' | 'let') {
    const where: any = {
        status: status // Add this line to filter by status
    };

    // Add other filters based on searchParams
    if (searchParams.propertyType) {
        where.propertyType = searchParams.propertyType;
    }
    if (searchParams.propertyDetails) {
        where.propertyDetails = searchParams.propertyDetails;
    }
    if (searchParams.county) {
        where.county = searchParams.county;
    }
    if (searchParams.locality) {
        where.locality = searchParams.locality;
    }
    if (searchParams.minPrice) {
        where.price = {
            ...where.price,
            gte: parseInt(searchParams.minPrice as string),
        };
    }
    if (searchParams.maxPrice) {
        where.price = {
            ...where.price,
            lte: parseInt(searchParams.maxPrice as string),
        };
    }

    const properties = await prisma.property.findMany({
        where,
        // Add any other options like orderBy, select, etc.
    });

    return properties;
}