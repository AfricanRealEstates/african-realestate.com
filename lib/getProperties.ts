// import {prisma} from './prisma'
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

import { prisma } from "./prisma";

export async function getProperties(
    searchParams: { [key: string]: string | string[] | undefined },
    status: string
) {
    const {
        sort = "createdAt",
        order = "desc",
        propertyType,
        propertyDetails,
        county,
        locality,
        minPrice,
        maxPrice,
    } = searchParams;

    const where: any = {
        status,
        isActive: true // Ensure only active properties are fetched
    };

    if (propertyType) where.propertyType = propertyType;
    if (propertyDetails) where.propertyDetails = propertyDetails;
    if (county) where.county = county;
    if (locality) where.locality = locality;
    if (minPrice) where.price = { ...where.price, gte: parseInt(minPrice as string) };
    if (maxPrice) where.price = { ...where.price, lte: parseInt(maxPrice as string) };

    const properties = await prisma.property.findMany({
        where,
        orderBy: { [sort as string]: order },
    });

    return properties;
}
