import { prisma } from "@/lib/prisma";

export async function generateLocationSitemapUrls() {
  // Get unique locations for sitemap generation
  const locations = await prisma.property.findMany({
    where: { isActive: true },
    select: {
      locality: true,
      nearbyTown: true,
      county: true,
      propertyType: true,
      status: true,
      updatedAt: true,
    },
    distinct: ["locality"],
  });

  const locationUrls: Array<{
    url: string;
    lastModified: string;
    changeFrequency: "weekly" | "monthly";
    priority: number;
  }> = [];

  // Generate general location pages
  locations.forEach((location) => {
    const locationSlug = (location.locality || location.nearbyTown)
      ?.toLowerCase()
      .replace(/\s+/g, "-");

    if (locationSlug) {
      locationUrls.push({
        url: `https://www.african-realestate.com/${locationSlug}`,
        lastModified: location.updatedAt.toISOString(),
        changeFrequency: "weekly",
        priority: 0.7,
      });

      // Generate specific property type + location pages
      if (location.propertyType === "Land") {
        locationUrls.push({
          url: `https://www.african-realestate.com/plots-for-sale-${locationSlug}`,
          lastModified: location.updatedAt.toISOString(),
          changeFrequency: "weekly",
          priority: 0.8,
        });
      }

      if (location.status === "sale" && location.propertyType !== "Land") {
        locationUrls.push({
          url: `https://www.african-realestate.com/houses-for-sale-${locationSlug}`,
          lastModified: location.updatedAt.toISOString(),
          changeFrequency: "weekly",
          priority: 0.8,
        });
      }
    }
  });

  return locationUrls;
}

export async function generateCountySitemapUrls() {
  const counties = await prisma.property.findMany({
    where: { isActive: true },
    select: { county: true, updatedAt: true },
    distinct: ["county"],
  });

  return counties.map((county) => ({
    url: `https://www.african-realestate.com/properties/${county.county.toLowerCase().replace(/\s+/g, "-")}`,
    lastModified: county.updatedAt.toISOString(),
    changeFrequency: "weekly" as const,
    priority: 0.6,
  }));
}
