"use server";

import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session";

export async function getPersonalizedBlogPosts(limit = 3) {
  try {
    const user = await getCurrentUser();

    // If no user is logged in, return popular posts
    if (!user) {
      return getPopularBlogPosts(limit);
    }

    // Get user's property interactions to understand their interests
    const [
      userLikedPosts,
      userViewedProperties,
      userLikedProperties,
      userSavedProperties,
    ] = await Promise.all([
      // Posts the user has liked
      prisma.post.findMany({
        where: {
          likes: {
            some: {
              id: user.id,
            },
          },
        },
        select: {
          topics: true,
        },
      }),

      // Properties the user has viewed
      prisma.propertyView.findMany({
        where: {
          userId: user.id,
        },
        include: {
          property: {
            select: {
              propertyType: true,
              propertyDetails: true,
            },
          },
        },
        orderBy: {
          viewedAt: "desc",
        },
        take: 20,
      }),

      // Properties the user has liked
      prisma.like.findMany({
        where: {
          userId: user.id,
        },
        include: {
          property: {
            select: {
              propertyType: true,
              propertyDetails: true,
            },
          },
        },
      }),

      // Properties the user has saved
      prisma.savedProperty.findMany({
        where: {
          userId: user.id,
        },
        include: {
          property: {
            select: {
              propertyType: true,
              propertyDetails: true,
            },
          },
        },
      }),
    ]);

    // Extract topics the user is interested in from liked posts
    const postTopics = userLikedPosts.flatMap((post) => post.topics);

    // Extract property types and details from user's property interactions
    const propertyTypes = [
      ...userViewedProperties.map((view) => view.property?.propertyType),
      ...userLikedProperties.map((like) => like.property?.propertyType),
      ...userSavedProperties.map((saved) => saved.property?.propertyType),
    ].filter(Boolean) as string[];

    // Extract keywords from property details
    const propertyDetails = [
      ...userViewedProperties.map((view) => view.property?.propertyDetails),
      ...userLikedProperties.map((like) => like.property?.propertyDetails),
      ...userSavedProperties.map((saved) => saved.property?.propertyDetails),
    ].filter(Boolean) as string[];

    // Combine all user interests
    const userInterests = [...postTopics, ...propertyTypes];

    // Extract keywords from property details
    const detailsKeywords = propertyDetails
      .join(" ")
      .toLowerCase()
      .split(/\s+/)
      .filter((word) => word.length > 4) // Only consider meaningful words
      .filter(
        (word) => !["property", "house", "apartment", "office"].includes(word)
      ); // Filter out common words

    // Add relevant keywords to user interests
    userInterests.push(...detailsKeywords);

    // If user has no interests, return popular posts
    if (userInterests.length === 0) {
      return getPopularBlogPosts(limit);
    }

    // Count interest frequency to find most interested topics
    const interestCounts = userInterests.reduce(
      (acc, interest) => {
        const normalizedInterest = interest.toLowerCase();
        acc[normalizedInterest] = (acc[normalizedInterest] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>
    );

    // Sort interests by frequency
    const sortedInterests = Object.entries(interestCounts)
      .sort((a, b) => b[1] - a[1])
      .map((entry) => entry[0]);

    // Get posts based on user's top interests
    const recommendedPosts = await prisma.post.findMany({
      where: {
        published: true,
        OR: [
          // Match by topics
          {
            topics: {
              hasSome: sortedInterests.slice(0, 5), // Use top 5 interests
            },
          },
          // Match by content containing user interests
          {
            OR: sortedInterests.slice(0, 3).map((interest) => ({
              content: {
                contains: interest,
                mode: "insensitive",
              },
            })),
          },
          // Match by title containing user interests
          {
            OR: sortedInterests.slice(0, 3).map((interest) => ({
              title: {
                contains: interest,
                mode: "insensitive",
              },
            })),
          },
        ],
        NOT: {
          likes: {
            some: {
              id: user.id, // Exclude posts user has already liked
            },
          },
        },
      },
      orderBy: [{ viewCount: "desc" }, { createdAt: "desc" }],
      include: {
        likes: true,
        author: true,
      },
      take: limit,
    });

    // Track this recommendation event
    await prisma.recommendationEvent.create({
      data: {
        userId: user.id!,
        propertyIds: [], // No properties in this case
        recommendationType: "blog_posts",
      },
    });

    // If we don't have enough recommended posts, fill with popular posts
    if (recommendedPosts.length < limit) {
      const popularPosts = await getPopularBlogPosts(
        limit - recommendedPosts.length,
        recommendedPosts.map((post) => post.id)
      );

      return [...recommendedPosts, ...popularPosts];
    }

    return recommendedPosts;
  } catch (error) {
    console.error("Error fetching personalized blog posts:", error);
    return getPopularBlogPosts(limit);
  }
}

// Fallback function to get popular blog posts
async function getPopularBlogPosts(limit: number, excludeIds: string[] = []) {
  return prisma.post.findMany({
    where: {
      published: true,
      id: {
        notIn: excludeIds,
      },
    },
    orderBy: [
      { viewCount: "desc" },
      { shareCount: "desc" },
      { createdAt: "desc" },
    ],
    include: {
      likes: true,
      author: true,
    },
    take: limit,
  });
}
