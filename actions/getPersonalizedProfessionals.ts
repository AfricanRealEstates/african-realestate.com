import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session";

interface ProfessionalFilters {
  role?: "AGENT" | "AGENCY" | "ALL";
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: "properties" | "views" | "newest" | "random";
  refreshSeed?: number;
}

// Fisher-Yates shuffle algorithm for randomization
function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

// Generate a user-specific seed for consistent randomization
function getUserSeed(userId?: string, refreshSeed?: number): number {
  let baseSeed = 0;

  if (!userId) {
    // For anonymous users, use a daily seed so they see the same order for the day
    const today = new Date().toDateString();
    baseSeed = today
      .split("")
      .reduce((acc, char) => acc + char.charCodeAt(0), 0);
  } else {
    // For logged-in users, use their ID to create a consistent seed
    baseSeed = userId
      .split("")
      .reduce((acc, char) => acc + char.charCodeAt(0), 0);
  }

  // Add refresh seed if provided to get different results
  return baseSeed + (refreshSeed || 0);
}

// Seeded random function for consistent randomization
function seededRandom(seed: number): () => number {
  let currentSeed = seed;
  return () => {
    currentSeed = (currentSeed * 9301 + 49297) % 233280;
    return currentSeed / 233280;
  };
}

export async function getPersonalizedProfessionals(
  filters: ProfessionalFilters = {}
) {
  const {
    role = "ALL",
    page = 1,
    limit = 12,
    search,
    sortBy = "random",
    refreshSeed,
  } = filters;
  const user = await getCurrentUser();
  const skip = (page - 1) * limit;

  // Calculate date for 2 weeks ago for views filtering
  const twoWeeksAgo = new Date();
  twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14);

  // Base where clause - only professionals with active properties
  const baseWhere: any = {
    properties: {
      some: {
        isActive: true,
      },
    },
  };

  // Add role filter if specified
  if (role !== "ALL") {
    baseWhere.role = role;
  } else {
    baseWhere.role = { in: ["AGENT", "AGENCY"] };
  }

  // Add search filter if provided
  if (search && search.trim()) {
    const searchTerm = search.trim();
    baseWhere.OR = [
      {
        name: {
          contains: searchTerm,
          mode: "insensitive",
        },
      },
      {
        agentName: {
          contains: searchTerm,
          mode: "insensitive",
        },
      },
      {
        agentLocation: {
          contains: searchTerm,
          mode: "insensitive",
        },
      },
      {
        bio: {
          contains: searchTerm,
          mode: "insensitive",
        },
      },
    ];
  }

  // Get total count for pagination
  const totalCount = await prisma.user.count({ where: baseWhere });

  // Determine ordering based on sortBy
  let orderBy: any = {};

  switch (sortBy) {
    case "properties":
      orderBy = {
        properties: {
          _count: "desc",
        },
      };
      break;
    case "views":
      // This is a simplified approach - in a real app you'd need a more complex query
      orderBy = {
        properties: {
          _count: "desc", // Fallback to property count for now
        },
      };
      break;
    case "newest":
      orderBy = {
        createdAt: "desc",
      };
      break;
    case "random":
    default:
      orderBy = {
        properties: {
          _count: "desc",
        },
      };
      break;
  }

  // Fetch professionals
  const professionals = await prisma.user.findMany({
    where: baseWhere,
    select: {
      id: true,
      name: true,
      agentName: true,
      agentLocation: true,
      profilePhoto: true,
      coverPhoto: true,
      bio: true,
      role: true,
      createdAt: true,
      phoneNumber: user ? true : false,
      whatsappNumber: user ? true : false,
      agentEmail: user ? true : false,
      email: user ? true : false,
      _count: {
        select: {
          properties: {
            where: {
              isActive: true,
            },
          },
        },
      },
      // Get views from last 2 weeks
      properties: {
        select: {
          views: {
            where: {
              viewedAt: {
                gte: twoWeeksAgo,
              },
            },
          },
        },
      },
    },
    orderBy,
  });

  // Calculate 2-week views for each professional
  const professionalsWithViews = professionals.map((professional) => {
    const twoWeekViews = professional.properties.reduce(
      (total, property) => total + property.views.length,
      0
    );

    return {
      ...professional,
      twoWeekViews,
      properties: undefined, // Remove the nested properties data
    };
  });

  // Apply randomization if sortBy is random
  let finalProfessionals = professionalsWithViews;
  if (sortBy === "random") {
    const userSeed = getUserSeed(user?.id, refreshSeed);
    const random = seededRandom(userSeed + page);

    finalProfessionals = [...professionalsWithViews];
    for (let i = finalProfessionals.length - 1; i > 0; i--) {
      const j = Math.floor(random() * (i + 1));
      [finalProfessionals[i], finalProfessionals[j]] = [
        finalProfessionals[j],
        finalProfessionals[i],
      ];
    }
  } else if (sortBy === "views") {
    // Sort by 2-week views
    finalProfessionals = professionalsWithViews.sort(
      (a, b) => b.twoWeekViews - a.twoWeekViews
    );
  }

  // Apply pagination
  const paginatedProfessionals = finalProfessionals.slice(skip, skip + limit);

  // Limit total pages to 6
  const maxPages = 6;
  const actualTotalPages = Math.ceil(totalCount / limit);
  const limitedTotalPages = Math.min(actualTotalPages, maxPages);

  return {
    professionals: paginatedProfessionals,
    totalCount,
    totalPages: limitedTotalPages,
    actualTotalPages,
    currentPage: page,
    hasMore: actualTotalPages > maxPages,
  };
}

export async function getTopProfessionals(limit = 3, refreshSeed?: number) {
  const user = await getCurrentUser();

  // Calculate date for 2 weeks ago
  const twoWeeksAgo = new Date();
  twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14);

  // Get top professionals by property count
  const topProfessionals = await prisma.user.findMany({
    where: {
      role: {
        in: ["AGENT", "AGENCY"],
      },
      properties: {
        some: {
          isActive: true,
        },
      },
    },
    select: {
      id: true,
      name: true,
      agentName: true,
      agentLocation: true,
      profilePhoto: true,
      coverPhoto: true,
      bio: true,
      role: true,
      createdAt: true,
      phoneNumber: user ? true : false,
      whatsappNumber: user ? true : false,
      agentEmail: user ? true : false,
      email: user ? true : false,
      _count: {
        select: {
          properties: {
            where: {
              isActive: true,
            },
          },
        },
      },
      properties: {
        select: {
          views: {
            where: {
              viewedAt: {
                gte: twoWeeksAgo,
              },
            },
          },
        },
      },
    },
    orderBy: {
      properties: {
        _count: "desc",
      },
    },
    take: limit * 3, // Get more than needed for randomization
  });

  // Calculate 2-week views and clean up data
  const professionalsWithViews = topProfessionals.map((professional) => {
    const twoWeekViews = professional.properties.reduce(
      (total, property) => total + property.views.length,
      0
    );

    return {
      ...professional,
      twoWeekViews,
      properties: undefined,
    };
  });

  // Apply user-specific randomization
  const userSeed = getUserSeed(user?.id, refreshSeed);
  const random = seededRandom(userSeed);

  const shuffledTop = [...professionalsWithViews];
  for (let i = shuffledTop.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [shuffledTop[i], shuffledTop[j]] = [shuffledTop[j], shuffledTop[i]];
  }

  return shuffledTop.slice(0, limit);
}

export async function getProfessionalCounts() {
  const totalProfessionals = await prisma.user.count({
    where: {
      role: {
        in: ["AGENT", "AGENCY"],
      },
      properties: {
        some: {
          isActive: true,
        },
      },
    },
  });

  const totalAgencies = await prisma.user.count({
    where: {
      role: "AGENCY",
      properties: {
        some: {
          isActive: true,
        },
      },
    },
  });

  const totalAgents = await prisma.user.count({
    where: {
      role: "AGENT",
      properties: {
        some: {
          isActive: true,
        },
      },
    },
  });

  return {
    totalProfessionals,
    totalAgencies,
    totalAgents,
  };
}
