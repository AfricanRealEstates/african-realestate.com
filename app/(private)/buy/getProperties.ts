import { prisma } from "@/lib/prisma";


export async function getProperties(
    searchParams: { [key: string]: string | string[] | undefined },
    status: string,
    page: number = 1,
    pageSize: number = 12
) {
    const {
        propertyType,
        propertyDetails,
        county,
        locality,
        minPrice,
        maxPrice,
        sort,
        order,
    } = searchParams;

    const skip = (page - 1) * pageSize;

    const properties = await prisma.property.findMany({
        where: {
            isActive: true,
            isAvailableForPurchase: true,
            status: status,
            ...(propertyType ? { propertyType: propertyType as string } : {}),
            ...(propertyDetails ? { propertyDetails: propertyDetails as string } : {}),
            ...(county ? { county: county as string } : {}),
            ...(locality ? { locality: locality as string } : {}),
            ...(minPrice || maxPrice
                ? {
                    price: {
                        ...(minPrice ? { gte: parseInt(minPrice as string) } : {}),
                        ...(maxPrice ? { lte: parseInt(maxPrice as string) } : {}),
                    },
                }
                : {}),
        },
        orderBy: {
            [(sort as string) || "createdAt"]: (order as "asc" | "desc") || "desc",
        },
        include: {
            user: true,
        },
        skip,
        take: pageSize,
    });

    return properties;
}

