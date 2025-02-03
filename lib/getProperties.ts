import { prisma } from "./prisma";

export async function getProperties(
  searchParams: { [key: string]: string | string[] | undefined },
  status: string,
  page = 1,
  pageSize = 12
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
    isActive: true,
  };

  if (propertyType) where.propertyType = propertyType;
  if (propertyDetails) where.propertyDetails = propertyDetails;
  if (county) where.county = county;
  if (locality) where.locality = locality;
  if (minPrice || maxPrice) {
    where.price = {};
    if (minPrice) where.price.gte = Number.parseInt(minPrice as string);
    if (maxPrice) where.price.lte = Number.parseInt(maxPrice as string);
  }

  const [properties, totalCount] = await Promise.all([
    prisma.property.findMany({
      where,
      orderBy: { [sort as string]: order },
      take: pageSize,
      skip: (page - 1) * pageSize,
    }),
    prisma.property.count({ where }),
  ]);

  return {
    properties,
    totalCount,
    totalPages: Math.ceil(totalCount / pageSize),
  };
}
