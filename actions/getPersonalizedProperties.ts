import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session";

interface PersonalizationFactors {
  viewedPropertyTypes: string[];
  likedPropertyTypes: string[];
  priceRange: { min: number; max: number };
  preferredLocations: string[];
  recentSearches: string[];
}

export async function getPersonalizedProperties(limit = 8) {
  const user = await getCurrentUser();

  // Get base date for "new" properties (last 30 days)
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  if (!user) {
    // For non-authenticated users, show newest and most popular properties
    return await prisma.property.findMany({
      where: {
        isActive: true,
      },
      include: {
        views: {
          take: 1, // Just to check if there are views
        },
        likes: {
          take: 1, // Just to check if there are likes
        },
        orders: {
          select: {
            tierName: true,
          },
        },
      },
      orderBy: [
        {
          createdAt: "desc", // Prioritize newest
        },
        {
          views: {
            _count: "desc",
          },
        },
      ],
      take: limit,
    });
  }

  // Get user's personalization factors
  const personalizationFactors = await getUserPersonalizationFactors(user.id!);

  // Get new properties first (last 30 days)
  const newProperties = await prisma.property.findMany({
    where: {
      isActive: true,
      createdAt: {
        gte: sevenDaysAgo,
      },
    },
    include: {
      views: true,
      likes: true,
      orders: {
        select: {
          tierName: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
    take: Math.ceil(limit * 0.4), // 40% new properties
  });

  // Get personalized properties based on user behavior
  const personalizedProperties = await getPersonalizedRecommendations(
    user.id!,
    personalizationFactors,
    Math.ceil(limit * 0.6) // 60% personalized
  );

  // Combine and deduplicate
  const allProperties = [...newProperties, ...personalizedProperties];
  const uniqueProperties = allProperties.filter(
    (property, index, self) =>
      index === self.findIndex((p) => p.id === property.id)
  );

  // If we don't have enough properties, fill with popular ones
  if (uniqueProperties.length < limit) {
    const additionalProperties = await prisma.property.findMany({
      where: {
        isActive: true,
        id: {
          notIn: uniqueProperties.map((p) => p.id),
        },
      },
      include: {
        views: true,
        likes: true,
        orders: {
          select: {
            tierName: true,
          },
        },
      },
      orderBy: {
        views: {
          _count: "desc",
        },
      },
      take: limit - uniqueProperties.length,
    });

    uniqueProperties.push(...additionalProperties);
  }

  // Shuffle the final results to add variety
  return shuffleArray(uniqueProperties.slice(0, limit));
}

async function getUserPersonalizationFactors(
  userId: string
): Promise<PersonalizationFactors> {
  // Get user's viewed properties
  const viewedProperties = await prisma.propertyView.findMany({
    where: {
      userId,
    },
    include: {
      property: {
        select: {
          propertyType: true,
          price: true,
          currency: true,
          locality: true,
          county: true,
        },
      },
    },
    orderBy: {
      viewedAt: "desc",
    },
    take: 50, // Last 50 views
  });

  // Get user's liked properties
  const likedProperties = await prisma.like.findMany({
    where: {
      userId,
    },
    include: {
      property: {
        select: {
          propertyType: true,
          price: true,
          currency: true,
          locality: true,
          county: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
    take: 20, // Last 20 likes
  });

  // Get user's search history
  const searchHistory = await prisma.searchHistory.findMany({
    where: {
      userId,
    },
    orderBy: {
      createdAt: "desc",
    },
    take: 10, // Last 10 searches
  });

  // Extract property types from views and likes
  const viewedPropertyTypes = viewedProperties.map(
    (v) => v.property.propertyType
  );
  const likedPropertyTypes = likedProperties.map(
    (l) => l.property.propertyType
  );

  // Calculate price range from viewed/liked properties
  const allPrices = [
    ...viewedProperties.map((v) => v.property.price),
    ...likedProperties.map((l) => l.property.price),
  ].filter((price) => price > 0);

  const priceRange =
    allPrices.length > 0
      ? {
          min: Math.min(...allPrices) * 0.8, // 20% below minimum
          max: Math.max(...allPrices) * 1.2, // 20% above maximum
        }
      : { min: 0, max: Number.MAX_SAFE_INTEGER };

  // Extract preferred locations
  const preferredLocations = [
    ...viewedProperties.map((v) => v.property.locality),
    ...viewedProperties.map((v) => v.property.county),
    ...likedProperties.map((l) => l.property.locality),
    ...likedProperties.map((l) => l.property.county),
  ].filter(Boolean);

  // Extract recent search terms
  const recentSearches = searchHistory.map((s) => s.query);

  return {
    viewedPropertyTypes,
    likedPropertyTypes,
    priceRange,
    preferredLocations,
    recentSearches,
  };
}

async function getPersonalizedRecommendations(
  userId: string,
  factors: PersonalizationFactors,
  limit: number
) {
  // Build dynamic where clause based on personalization factors
  const whereClause: any = {
    isActive: true,
  };

  // Property type preferences (combine viewed and liked types)
  const preferredTypes = [
    ...new Set([...factors.viewedPropertyTypes, ...factors.likedPropertyTypes]),
  ];

  if (preferredTypes.length > 0) {
    whereClause.propertyType = {
      in: preferredTypes,
    };
  }

  // Price range filter
  if (
    factors.priceRange.min > 0 ||
    factors.priceRange.max < Number.MAX_SAFE_INTEGER
  ) {
    whereClause.price = {
      gte: factors.priceRange.min,
      lte: factors.priceRange.max,
    };
  }

  // Location preferences
  if (factors.preferredLocations.length > 0) {
    whereClause.OR = [
      {
        locality: {
          in: factors.preferredLocations,
        },
      },
      {
        county: {
          in: factors.preferredLocations,
        },
      },
    ];
  }

  // Exclude properties the user has already viewed recently
  const recentViews = await prisma.propertyView.findMany({
    where: {
      userId,
      viewedAt: {
        gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // Last 7 days
      },
    },
    select: {
      propertyId: true,
    },
  });

  if (recentViews.length > 0) {
    whereClause.id = {
      notIn: recentViews.map((v) => v.propertyId),
    };
  }

  const personalizedProperties = await prisma.property.findMany({
    where: whereClause,
    include: {
      views: true,
      likes: true,
      orders: {
        select: {
          tierName: true,
        },
      },
    },
    orderBy: [
      {
        likes: {
          _count: "desc",
        },
      },
      {
        views: {
          _count: "desc",
        },
      },
      {
        createdAt: "desc",
      },
    ],
    take: limit * 2, // Get more than needed for better shuffling
  });

  return personalizedProperties.slice(0, limit);
}

// Fisher-Yates shuffle algorithm
function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

// Track recommendation events for analytics
export async function trackRecommendationEvent(
  userId: string,
  propertyIds: string[],
  recommendationType: string
) {
  if (!userId) return;

  await prisma.recommendationEvent.create({
    data: {
      userId,
      propertyIds,
      recommendationType,
    },
  });
}
