import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session";

export async function getPersonalizedBlogPosts(limit = 3) {
  try {
    const user = await getCurrentUser();

    // If no user is logged in, return popular posts
    if (!user) {
      return getPopularBlogPosts(limit);
    }

    // Get posts the user has interacted with (liked or viewed)
    const userLikedPosts = await prisma.post.findMany({
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
    });

    // Extract topics the user is interested in
    const userInterests = userLikedPosts.flatMap((post) => post.topics);

    // If user has no interests, return popular posts
    if (userInterests.length === 0) {
      return getPopularBlogPosts(limit);
    }

    // Count topic frequency to find most interested topics
    const topicCounts = userInterests.reduce(
      (acc, topic) => {
        acc[topic] = (acc[topic] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>
    );

    // Sort topics by frequency
    const sortedTopics = Object.entries(topicCounts)
      .sort((a, b) => b[1] - a[1])
      .map((entry) => entry[0]);

    // Get posts based on user's top interests
    const recommendedPosts = await prisma.post.findMany({
      where: {
        published: true,
        topics: {
          hasSome: sortedTopics.slice(0, 3), // Use top 3 topics
        },
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
