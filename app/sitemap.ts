import type { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";

export const baseUrl = "https://www.african-realestate.com";

// Predefined blog topics
const BLOG_TOPICS = [
  { id: "tips", label: "Tips" },
  { id: "finance", label: "Finance" },
  { id: "investing", label: "Investing" },
  { id: "home-decor", label: "Home Decor" },
  { id: "housing", label: "Housing" },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Static routes
  const additionalPages = [
    {
      url: `${baseUrl}`,
      lastModified: new Date().toISOString(),
      changeFrequency: "daily" as const,
      priority: 1.0,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date().toISOString(),
      changeFrequency: "monthly" as const,
      priority: 0.5,
    },
    {
      url: `${baseUrl}/buy`,
      lastModified: new Date().toISOString(),
      changeFrequency: "hourly" as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/let`,
      lastModified: new Date().toISOString(),
      changeFrequency: "hourly" as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/agent/properties/create-property`,
      lastModified: new Date().toISOString(),
      changeFrequency: "monthly" as const,
      priority: 0.4,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date().toISOString(),
      changeFrequency: "daily" as const,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/properties`,
      lastModified: new Date().toISOString(),
      changeFrequency: "hourly" as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/guides`,
      lastModified: new Date().toISOString(),
      changeFrequency: "weekly" as const,
      priority: 0.6,
    },
  ];

  // Add topic pages to sitemap
  const topicPages = BLOG_TOPICS.map((topic) => ({
    url: `${baseUrl}/blog/${topic.id}`,
    lastModified: new Date().toISOString(),
    changeFrequency: "weekly" as const,
    priority: 0.6,
  }));

  try {
    // Fetch blog posts from the new Post model
    const blogPosts = await prisma.post.findMany({
      where: { published: true },
      select: {
        slug: true,
        updatedAt: true,
        topics: true,
      },
    });

    const blogPostsUrls = blogPosts.flatMap((post) => {
      // Filter post topics to only include valid predefined topics
      const validTopics = post.topics.filter((topic) =>
        BLOG_TOPICS.some((predefinedTopic) => predefinedTopic.id === topic)
      );

      // If no valid topics, use the first topic as default
      const postTopics = validTopics.length > 0 ? validTopics : ["tips"];

      return postTopics.map((topic) => ({
        url: `${baseUrl}/blog/${topic}/${post.slug}`,
        lastModified: post.updatedAt.toISOString(),
        changeFrequency: "daily" as const,
        priority: 0.7,
      }));
    });

    // Fetch properties
    const properties = await prisma.property.findMany({
      where: { isActive: true },
      select: {
        id: true,
        propertyDetails: true,
        updatedAt: true,
      },
    });

    const propertiesUrls = properties.map((property) => ({
      url: `${baseUrl}/properties/${property.propertyDetails}/${property.id}`,
      lastModified: property.updatedAt.toISOString(),
      changeFrequency: "hourly" as const,
      priority: 0.9,
    }));

    // Fetch locations (nearby towns)
    const locations = await prisma.property.findMany({
      distinct: ["nearbyTown"],
      select: {
        nearbyTown: true,
      },
      where: {
        isActive: true,
      },
    });

    const locationUrls = locations.map((location) => ({
      url: `${baseUrl}/properties/${location.nearbyTown}`,
      lastModified: new Date().toISOString(),
      changeFrequency: "weekly" as const,
      priority: 0.6,
    }));

    // Fetch property types
    const propertyTypes = await prisma.property.findMany({
      distinct: ["propertyType"],
      select: {
        propertyType: true,
      },
      where: {
        isActive: true,
      },
    });

    const propertyTypeUrls = propertyTypes.map((type) => ({
      url: `${baseUrl}/properties/type/${type.propertyType.toLowerCase().replace(/\s+/g, "-")}`,
      lastModified: new Date().toISOString(),
      changeFrequency: "weekly" as const,
      priority: 0.6,
    }));

    return [
      ...propertiesUrls,
      ...locationUrls,
      ...propertyTypeUrls,
      ...blogPostsUrls,
      ...topicPages,
      ...additionalPages,
    ];
  } catch (error) {
    console.error("Error generating sitemap:", error);
    return [...topicPages, ...additionalPages];
  }
}
