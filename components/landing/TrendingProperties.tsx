import { prisma } from "@/lib/prisma";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  Flame,
  Home,
  Building,
  Factory,
  Umbrella,
  Map,
} from "lucide-react";

export default async function TrendingProperties() {
  // Fetch all active properties sorted by views
  const allProperties = await prisma.property.findMany({
    where: {
      isActive: true,
    },
    include: {
      _count: {
        select: {
          views: true,
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
    .sort((a, b) => b._count.views - a._count.views)
    .slice(0, 6); // Ensure we have exactly 6 properties

  // Get color based on property type
  const getTypeColor = (type: string) => {
    switch (type) {
      case "Residential":
        return "blue";
      case "Commercial":
        return "purple";
      case "Industrial":
        return "amber";
      case "Vacational / Social":
        return "emerald";
      case "Land":
        return "orange";
      default:
        return "blue";
    }
  };

  // Get icon based on property type
  const getTypeIcon = (type: string) => {
    switch (type) {
      case "Residential":
        return <Home className="size-3 mr-1" />;
      case "Commercial":
        return <Building className="size-3 mr-1" />;
      case "Industrial":
        return <Factory className="size-3 mr-1" />;
      case "Vacational / Social":
        return <Umbrella className="size-3 mr-1" />;
      case "Land":
        return <Map className="size-3 mr-1" />;
      default:
        return <Home className="size-3 mr-1" />;
    }
  };

  // Function to render property features based on property type
  const renderPropertyFeatures = (property: any) => {
    const features = [];

    switch (property.propertyType) {
      case "Land":
        // For Land properties, show tenure and land size
        if (property.tenure) {
          features.push(
            <div key="tenure" className="flex items-center gap-1">
              <span className="font-medium">Tenure:</span>
              <span className="capitalize">{property.tenure}</span>
            </div>
          );
        }
        if (property.yearsLeft) {
          features.push(
            <div key="yearsLeft" className="flex items-center gap-1">
              <span>{property.yearsLeft}</span>
              <span>Years Left</span>
            </div>
          );
        }
        break;

      case "Commercial":
      case "Industrial":
        // For Commercial and Industrial, show parkings instead of bedrooms
        if (property.bedrooms) {
          features.push(
            <div key="parkings" className="flex items-center gap-1">
              <span>{property.bedrooms}</span>
              <span>Parkings</span>
            </div>
          );
        }
        if (property.bathrooms) {
          features.push(
            <div key="bathrooms" className="flex items-center gap-1">
              <span>{property.bathrooms}</span>
              <span>Baths</span>
            </div>
          );
        }
        if (property.plinthArea) {
          features.push(
            <div key="plinthArea" className="flex items-center gap-1">
              <span>{property.plinthArea}</span>
              <span>sqm</span>
            </div>
          );
        }
        break;

      default:
        // For Residential and Vacational/Social, show bedrooms and bathrooms
        if (property.bedrooms) {
          features.push(
            <div key="bedrooms" className="flex items-center gap-1">
              <span>{property.bedrooms}</span>
              <span>Beds</span>
            </div>
          );
        }
        if (property.bathrooms) {
          features.push(
            <div key="bathrooms" className="flex items-center gap-1">
              <span>{property.bathrooms}</span>
              <span>Baths</span>
            </div>
          );
        }
        if (property.plinthArea) {
          features.push(
            <div key="plinthArea" className="flex items-center gap-1">
              <span>{property.plinthArea}</span>
              <span>sqm</span>
            </div>
          );
        }
    }

    // Land size is common but optional for some types
    if (property.landSize) {
      features.push(
        <div key="landSize" className="flex items-center gap-1">
          <span>{property.landSize}</span>
          <span>{property.landUnits || "acres"}</span>
        </div>
      );
    }

    return features;
  };

  return (
    <section className="mx-auto w-full max-w-7xl px-4 py-16 ">
      <div className="flex items-center justify-between flex-wrap gap-4 mb-10">
        <div>
          <h2 className="text-sm text-red-500 font-semibold mb-2 uppercase flex items-center">
            <Flame className="size-4 mr-1 text-red-500" />
            Hottest Properties
          </h2>
          <h3 className="text-2xl font-bold text-gray-900">
            Most Viewed Listings
          </h3>
        </div>
        <Link
          href="/properties?sort=hot"
          className="text-[#636262] hover:text-red-500 group font-semibold relative flex items-center gap-x-2"
        >
          <span className="group-hover:underline group-hover:underline-offset-4">
            View All Hot Properties
          </span>
          <ArrowRight className="size-4 ml-1 transition-transform duration-300 group-hover:translate-x-1" />
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {hottestProperties.map((property) => (
          <Link
            href={`/properties/${property.slug}`}
            key={property.id}
            className="group hover:cursor-pointer flex flex-col h-full transition-all ease-in-out border rounded-lg border-neutral-200 hover:border-neutral-100 hover:shadow-2xl hover:shadow-gray-600/10 bg-white overflow-hidden"
          >
            <div className="relative h-48 overflow-hidden">
              <Image
                src={
                  property.coverPhotos[0] ||
                  "/placeholder.svg?height=400&width=600"
                }
                alt={property.title}
                className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-110"
                width={600}
                height={400}
              />
              <div className="absolute top-4 right-4 bg-white px-2 py-1 rounded-md text-sm font-semibold">
                {property.currency} {property.price.toLocaleString()}
              </div>
              <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-md text-xs font-medium flex items-center">
                {getTypeIcon(property.propertyType)}
                {property.propertyType}
              </div>
              <div
                className={`absolute bottom-4 left-4 bg-${getTypeColor(
                  property.propertyType
                )}-600 text-white px-2 py-1 rounded-md text-xs font-medium flex items-center`}
              >
                <Flame className="size-3 mr-1" />
                {property._count.views} views
              </div>
            </div>

            <div className="p-4">
              <h4 className="font-bold text-lg text-[#636262] mb-2 line-clamp-1">
                {property.title}
              </h4>
              <p className="text-[#5c6368] text-sm mb-2 line-clamp-1">
                {property.locality}, {property.county}
              </p>

              <div className="flex items-center gap-4 text-sm text-gray-600 mt-2">
                {renderPropertyFeatures(property)}
              </div>

              {/* Show property details */}
              {property.propertyDetails && (
                <div className="mt-2 text-xs text-gray-500 italic">
                  {property.propertyDetails}
                </div>
              )}
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
