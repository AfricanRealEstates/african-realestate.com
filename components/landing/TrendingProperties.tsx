import { prisma } from "@/lib/prisma";
import { Flame } from "lucide-react";
import PropertyCardEnhanced from "./featured-properties/property-card-enhanced";
import Link from "next/link";

export default async function TrendingProperties() {
  // Fetch all active properties sorted by views
  const allProperties = await prisma.property.findMany({
    where: {
      isActive: true,
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
    take: 50, // Fetch enough to ensure we have all property types
  });

  // Group properties by type
  const propertiesByType = allProperties.reduce(
    (acc, property) => {
      if (!acc[property.propertyType]) {
        acc[property.propertyType] = [];
      }
      acc[property.propertyType].push(property);
      return acc;
    },
    {} as Record<string, typeof allProperties>
  );

  // Get property types
  const propertyTypes = Object.keys(propertiesByType);

  // Select the hottest property from each type
  const representativeProperties = propertyTypes.map(
    (type) => propertiesByType[type][0] // Take the hottest property of each type
  );

  // Fill remaining slots with the hottest properties overall
  const remainingCount = 6 - representativeProperties.length;
  const additionalProperties = allProperties
    .filter(
      (property) => !representativeProperties.some((p) => p.id === property.id)
    )
    .slice(0, remainingCount >= 0 ? remainingCount : 0);

  // Combine and sort by view count
  const hottestProperties = [
    ...representativeProperties,
    ...additionalProperties,
  ]
    .sort((a, b) => b.views.length - a.views.length)
    .slice(0, 6); // Ensure we have exactly 6 properties

  return (
    <section className="mx-auto w-full max-w-7xl px-5 py-16 md:px-10">
      <div className="flex items-center justify-between flex-wrap gap-4 mb-10">
        <div>
          <h2 className="text-sm text-red-500 font-semibold mb-2 uppercase flex items-center">
            <Flame className="size-4 mr-1 text-red-500" />
            Hottest Properties
          </h2>
          <h3 className="text-2xl font-bold text-gray-700">
            Most Viewed Listings
          </h3>
        </div>
        <Link
          href="/properties?sort=hot&order=desc"
          className="text-[#636262] hover:text-red-500 group font-semibold relative flex items-center gap-x-2"
        >
          <span className="group-hover:underline group-hover:underline-offset-4">
            View All Hot Properties
          </span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="size-4 ml-1 transition-transform duration-300 group-hover:translate-x-1"
          >
            <path d="M5 12h14" />
            <path d="m12 5 7 7-7 7" />
          </svg>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {hottestProperties.map((property, index) => (
          <PropertyCardEnhanced
            key={property.id}
            property={property as any}
            index={index}
            showRecommendationBadge={false}
          />
        ))}
      </div>
    </section>
  );
}
