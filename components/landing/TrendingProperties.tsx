import { Flame } from "lucide-react";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import PropertyCardEnhanced from "./featured-properties/property-card-enhanced";

const TrendingProperties = async () => {
  // Fetch trending properties from the last week
  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

  // Get properties with the most views in the last week
  const trendingProperties = await prisma.property.findMany({
    where: {
      isActive: true,
    },
    include: {
      views: {
        where: {
          viewedAt: {
            gte: oneWeekAgo,
          },
        },
      },
      likes: {
        where: {
          createdAt: {
            gte: oneWeekAgo,
          },
        },
      },
      orders: {
        select: {
          tierName: true,
        },
      },
    },
    orderBy: [
      {
        views: {
          _count: "desc",
        },
      },
    ],
    take: 12, // Fetch more than needed to ensure diversity
  });

  // Calculate a "heat score" for each property based on recent activity
  const scoredProperties = trendingProperties.map((property) => {
    // Calculate heat score based on views, likes, and recency
    const viewsCount = property.views.length;
    const likesCount = property.likes.length;

    // Heat score formula: views + (likes * 2)
    const heatScore = viewsCount + likesCount * 2;

    return {
      ...property,
      heatScore,
    };
  });

  // Group properties by type
  const propertiesByType = scoredProperties.reduce(
    (acc, property) => {
      if (!acc[property.propertyType]) {
        acc[property.propertyType] = [];
      }
      acc[property.propertyType].push(property);
      return acc;
    },
    {} as Record<string, typeof scoredProperties>
  );

  // Get property types
  const propertyTypes = Object.keys(propertiesByType);

  // Select the hottest property from each type
  const representativeProperties = propertyTypes.map(
    (type) => propertiesByType[type][0] // Take the hottest property of each type
  );

  // Fill remaining slots with the hottest properties overall
  const remainingCount = 6 - representativeProperties.length;
  const additionalProperties = scoredProperties
    .filter(
      (property) => !representativeProperties.some((p) => p.id === property.id)
    )
    .slice(0, remainingCount >= 0 ? remainingCount : 0);

  // Combine and sort by heat score
  const hottestProperties = [
    ...representativeProperties,
    ...additionalProperties,
  ]
    .sort((a, b) => b.heatScore - a.heatScore)
    .slice(0, 6); // Ensure we have exactly 6 properties

  return (
    <div className="container max-w-7xl mx-auto py-10">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-sm text-red-500 font-semibold mb-2 uppercase flex items-center">
            <Flame className="size-4 mr-1 text-red-500" />
            This Week&apos;s Hottest Properties
          </h2>
          <h3 className="text-2xl font-bold text-gray-700">
            Trending This Week
          </h3>
        </div>
        <Link
          href="/properties?sort=hot&order=desc&period=week"
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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {hottestProperties.map((property, index) => (
          <div key={property.id} className="relative">
            {/* <div className="absolute top-2 right-2 z-10 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full flex items-center">
              <Flame className="size-3 mr-1" />
              {property.heatScore} Heat
            </div> */}
            <PropertyCardEnhanced
              property={property as any}
              index={index}
              showRecommendationBadge={false}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default TrendingProperties;
