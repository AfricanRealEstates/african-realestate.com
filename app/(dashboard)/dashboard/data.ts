import { prisma } from "@/lib/prisma";

const ITEMS_PER_PAGE = 5; // Adjust this value as needed

export async function getUserFavorites(
  userId: string | undefined,
  page: number = 1
) {
  const skip = (page - 1) * ITEMS_PER_PAGE;
  const [favorites, totalCount] = await Promise.all([
    prisma.like.findMany({
      where: { userId },
      include: {
        property: {
          select: {
            id: true,
            title: true,
            locality: true,
            county: true,
            currency: true,
            price: true,
            coverPhotos: true,
          },
        },
      },
      skip,
      take: ITEMS_PER_PAGE,
    }),
    prisma.like.count({ where: { userId } }),
  ]);

  return {
    items: favorites.map((favorite) => ({ ...favorite.property })),
    totalPages: Math.ceil(totalCount / ITEMS_PER_PAGE),
    currentPage: page,
  };
}

export async function getUserBookmarks(
  userId: string | undefined,
  page: number = 1
) {
  const skip = (page - 1) * ITEMS_PER_PAGE;
  const [bookmarks, totalCount] = await Promise.all([
    prisma.savedProperty.findMany({
      where: { userId },
      include: {
        property: {
          select: {
            id: true,
            title: true,
            locality: true,
            county: true,
            currency: true,
            price: true,
            coverPhotos: true,
          },
        },
      },
      skip,
      take: ITEMS_PER_PAGE,
    }),
    prisma.savedProperty.count({ where: { userId } }),
  ]);

  return {
    items: bookmarks.map((bookmark) => ({ ...bookmark.property })),
    totalPages: Math.ceil(totalCount / ITEMS_PER_PAGE),
    currentPage: page,
  };
}

export async function getUserProperties(
  userId: string | undefined,
  page: number = 1
) {
  const skip = (page - 1) * ITEMS_PER_PAGE;
  const [properties, totalCount] = await Promise.all([
    prisma.property.findMany({
      where: { userId },
      select: {
        id: true,
        title: true,
        locality: true,
        county: true,
        currency: true,
        price: true,
        coverPhotos: true,
      },
      skip,
      take: ITEMS_PER_PAGE,
    }),
    prisma.property.count({ where: { userId } }),
  ]);

  return {
    items: properties,
    totalPages: Math.ceil(totalCount / ITEMS_PER_PAGE),
    currentPage: page,
  };
}

// Keep other functions (getUserRatings, getUserStats, getPropertySummary) as they are

export async function getUserRatings(userId: string | undefined) {
  return prisma.rating.findMany({
    where: { userId },
    include: {
      property: {
        select: {
          id: true,
          title: true,
          locality: true,
          county: true,
          coverPhotos: true,
        },
      },
    },
  });
}

export async function getUserStats(userId: string | undefined) {
  const favoritesCount = await prisma.like.count({ where: { userId } });
  const bookmarksCount = await prisma.savedProperty.count({
    where: { userId },
  });
  const propertiesCount = await prisma.property.count({ where: { userId } });

  const ratings = await prisma.rating.findMany({
    where: { userId },
    select: { ratings: true },
  });

  const averageRating =
    ratings.length > 0
      ? ratings.reduce((sum, rating) => sum + Number(rating.ratings), 0) /
        ratings.length
      : 0;

  return {
    favoritesCount,
    bookmarksCount,
    propertiesCount,
    averageRating,
  };
}

export async function getPropertySummary(userId: string | undefined) {
  const userProperties = await prisma.property.findMany({
    where: { userId },
    include: {
      likes: true,
      savedBy: true,
      ratings: true,
    },
  });

  const totalLikes = userProperties.reduce(
    (sum, property) => sum + property.likes.length,
    0
  );
  const totalBookmarks = userProperties.reduce(
    (sum, property) => sum + property.savedBy.length,
    0
  );
  const allRatings = userProperties.flatMap((property) =>
    property.ratings.map((rating) => rating.ratings)
  );
  const averageRating =
    allRatings.length > 0
      ? allRatings.reduce((sum, rating) => sum + Number(rating), 0) /
        allRatings.length
      : 0;

  return {
    totalLikes,
    totalBookmarks,
    averageRating,
  };
}

export async function getAdminSummary() {
  const totalOrders = await prisma.order.count();
  const totalRevenue = await prisma.order.aggregate({
    _sum: {
      pricePaid: true,
    },
  });
  const activeProperties = await prisma.property.count({
    where: {
      isActive: true,
    },
  });
  const inActiveProperties = await prisma.property.count({
    where: {
      isActive: false,
    },
  });
  const expiredProperties = await prisma.property.count({
    where: {
      isActive: false,
      expiryDate: {
        lt: new Date(),
      },
    },
  });

  return {
    totalOrders,
    totalRevenue: totalRevenue._sum.pricePaid || 0,
    activeProperties,
    inActiveProperties,
    expiredProperties,
  };
}

export async function getRecentOrders(page: number = 1, pageSize: number = 10) {
  const skip = (page - 1) * pageSize;
  const orders = await prisma.order.findMany({
    skip,
    take: pageSize,
    orderBy: {
      createdAt: "desc",
    },
    include: {
      user: {
        select: {
          name: true,
          email: true,
        },
      },
      property: {
        select: {
          title: true,
          propertyDetails: true,
        },
      },
    },
  });

  const totalOrders = await prisma.order.count();

  return {
    orders,
    currentPage: page,
    totalPages: Math.ceil(totalOrders / pageSize),
  };
}

export async function getInactiveProperties(page = 1, pageSize = 5) {
  const skip = (page - 1) * pageSize;
  const [inactiveProperties, totalCount] = await Promise.all([
    prisma.property.findMany({
      where: {
        isActive: false,
      },
      include: {
        user: {
          select: {
            name: true,
            email: true,
            phoneNumber: true,
          },
        },
      },
      orderBy: {
        updatedAt: "desc",
      },
      skip,
      take: pageSize,
    }),
    prisma.property.count({
      where: {
        isActive: false,
      },
    }),
  ]);

  return {
    properties: inactiveProperties,
    currentPage: page,
    totalPages: Math.ceil(totalCount / pageSize),
  };
}
