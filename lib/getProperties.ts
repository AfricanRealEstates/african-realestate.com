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

  // Handle special case for sorting by views (hot properties)
  let orderBy: any;
  if (sort === "views" || sort === "hot") {
    orderBy = {
      views: {
        _count: order,
      },
    };
  } else {
    orderBy = { [sort as string]: order };
  }

  const [properties, totalCount] = await Promise.all([
    prisma.property.findMany({
      where,
      orderBy,
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
