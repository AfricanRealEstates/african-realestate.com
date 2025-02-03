import { prisma } from "@/lib/prisma";

export async function getProperties(
  searchParams: { [key: string]: string | string[] | undefined },
  status: string,
  page = 1,
  pageSize = 12
) {
  const {
    propertyType,
    propertyDetails,
    county,
    locality,
    minPrice,
    maxPrice,
    sort = "createdAt",
    order = "desc",
  } = searchParams;

  const skip = (page - 1) * pageSize;

  const where = {
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
            ...(minPrice ? { gte: Number.parseInt(minPrice as string) } : {}),
            ...(maxPrice ? { lte: Number.parseInt(maxPrice as string) } : {}),
          },
        }
      : {}),
  };

  const [properties, totalCount] = await Promise.all([
    prisma.property.findMany({
      where,
      orderBy: {
        [sort as string]: order as "asc" | "desc",
      },
      include: {
        user: true,
      },
      skip,
      take: pageSize,
    }),
    prisma.property.count({ where }),
  ]);

  return {
    properties,
    totalCount,
    totalPages: Math.ceil(totalCount / pageSize),
  };
}
