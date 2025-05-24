import { getUserLocation } from "@/lib/user-location";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  Home,
  Building,
  Factory,
  Umbrella,
  Map,
  MapPin,
} from "lucide-react";
import { Prisma } from "@prisma/client";

interface NearbyTownWithCount {
  nearbyTown: string;
  count: number;
  properties: any[];
}

export default async function CityProperties() {
  // Get user's location
  const location = await getUserLocation();

  console.log("User location detected:", location);

  // Use detected location or fallback
  const city = location.city || "Nairobi";
  const county = location.county || "Nairobi";
  const country = location.country || "Kenya";

  let displayProperties: any[] = [];
  let selectedNearbyTown = "";
  let displayLocation = "";

  if (country === "Kenya" && county) {
    // Step 1: Find all nearbyTowns in the user's county and count properties
    const nearbyTownsWithCounts = await prisma.property.groupBy({
      by: ["nearbyTown"],
      where: {
        county: {
          contains: county,
          mode: Prisma.QueryMode.insensitive,
        },
        isActive: true,
        nearbyTown: {
          not: "",
        },
      },
      _count: {
        id: true,
      },
      orderBy: {
        _count: {
          id: "desc",
        },
      },
    });

    console.log("Nearby towns with counts:", nearbyTownsWithCounts);

    // Step 2: Try to get properties from towns with most properties first
    const targetPropertyCount = 6;
    const collectedProperties: any[] = [];

    for (const townData of nearbyTownsWithCounts) {
      if (collectedProperties.length >= targetPropertyCount) break;

      const remainingNeeded = targetPropertyCount - collectedProperties.length;

      const townProperties = await prisma.property.findMany({
        where: {
          nearbyTown: townData.nearbyTown,
          county: {
            contains: county,
            mode: Prisma.QueryMode.insensitive,
          },
          isActive: true,
        },
        take: remainingNeeded,
        orderBy: { createdAt: "desc" },
      });

      if (townProperties.length > 0) {
        collectedProperties.push(...townProperties);

        // Set the primary nearby town (the one with most properties that we're showing)
        if (!selectedNearbyTown) {
          selectedNearbyTown = townData.nearbyTown;
        }
      }
    }

    displayProperties = collectedProperties;
    displayLocation = county;

    // If we found properties, use the selected nearby town for the link
    if (selectedNearbyTown) {
      console.log("Selected nearby town:", selectedNearbyTown);
    }
  }

  // Fallback 1: If no properties found in county's towns, search broader county area
  if (displayProperties.length === 0 && county) {
    const countyProperties = await prisma.property.findMany({
      where: {
        OR: [
          { county: { contains: county, mode: Prisma.QueryMode.insensitive } },
          {
            locality: { contains: county, mode: Prisma.QueryMode.insensitive },
          },
          {
            district: { contains: county, mode: Prisma.QueryMode.insensitive },
          },
        ],
        isActive: true,
      },
      take: 6,
      orderBy: { createdAt: "desc" },
    });

    if (countyProperties.length > 0) {
      displayProperties = countyProperties;
      displayLocation = county;
      selectedNearbyTown = countyProperties[0]?.nearbyTown || county;
    }
  }

  // Fallback 2: If still no properties, search by city
  if (displayProperties.length === 0 && city) {
    const cityProperties = await prisma.property.findMany({
      where: {
        OR: [
          { locality: { contains: city, mode: Prisma.QueryMode.insensitive } },
          {
            nearbyTown: { contains: city, mode: Prisma.QueryMode.insensitive },
          },
          { district: { contains: city, mode: Prisma.QueryMode.insensitive } },
        ],
        isActive: true,
      },
      take: 6,
      orderBy: { createdAt: "desc" },
    });

    if (cityProperties.length > 0) {
      displayProperties = cityProperties;
      displayLocation = city;
      selectedNearbyTown = cityProperties[0]?.nearbyTown || city;
    }
  }

  // Fallback 3: If still no properties, get country-wide properties
  if (displayProperties.length === 0) {
    const countryProperties = await prisma.property.findMany({
      where: {
        country: { contains: country, mode: Prisma.QueryMode.insensitive },
        isActive: true,
      },
      take: 6,
      orderBy: { createdAt: "desc" },
    });

    if (countryProperties.length > 0) {
      displayProperties = countryProperties;
      displayLocation = country;
      selectedNearbyTown = countryProperties[0]?.nearbyTown || "Kenya";
    }
  }

  // Final fallback: Get any recent properties
  if (displayProperties.length === 0) {
    const fallbackProperties = await prisma.property.findMany({
      where: { isActive: true },
      take: 6,
      orderBy: { createdAt: "desc" },
    });

    if (fallbackProperties.length > 0) {
      displayProperties = fallbackProperties;
      displayLocation = "Available Areas";
      selectedNearbyTown = fallbackProperties[0]?.nearbyTown || "properties";
    }
  }

  // If still no properties, return null (component won't render)
  if (displayProperties.length === 0) {
    return null;
  }

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
    <section className="mx-auto w-full max-w-7xl px-4 py-16">
      <div className="flex items-center justify-between flex-wrap gap-4 mb-10">
        <div>
          <h2 className="text-xs text-blue-500 font-semibold mb-2 uppercase flex items-center">
            <MapPin className="size-4 mr-1" />
            {country === "Kenya" ? "Properties near you" : "Local Properties"}
          </h2>
          <h3 className="text-2xl font-bold text-gray-600">
            Properties in {displayLocation}
          </h3>
          {selectedNearbyTown && selectedNearbyTown !== displayLocation && (
            <p className="text-sm text-gray-500 mt-1">
              Featuring properties from {selectedNearbyTown} and nearby areas
            </p>
          )}
        </div>
        <Link
          href={`/properties/town/${encodeURIComponent(selectedNearbyTown)}`}
          className="text-[#636262] hover:text-blue-500 group font-semibold relative flex items-center gap-x-2"
        >
          <span className="group-hover:underline group-hover:underline-offset-4">
            View All Properties in {selectedNearbyTown}
          </span>
          <ArrowRight className="size-4 ml-1 transition-transform duration-300 group-hover:translate-x-1" />
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {displayProperties.map((property) => (
          <Link
            href={`/properties/${property.propertyDetails}/${property.id}`}
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
              {property.status && (
                <div
                  className={`absolute bottom-4 right-4 ${
                    property.status === "sale" ? "bg-green-600" : "bg-blue-600"
                  } text-white px-2 py-1 rounded-md text-xs font-medium`}
                >
                  {property.status === "sale" ? "For Sale" : "For Rent"}
                </div>
              )}
            </div>

            <div className="p-4">
              <h4 className="font-bold text-lg text-[#636262] mb-2 line-clamp-1">
                {property.title}
              </h4>
              <p className="text-[#5c6368] text-sm mb-2 line-clamp-1">
                {property.nearbyTown}, {property.county}
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

      {/* Additional info section */}
      {country === "Kenya" && county && selectedNearbyTown && (
        <div className="mt-8 text-center">
          <div className="inline-flex items-center gap-2 bg-blue-50 px-4 py-2 rounded-full text-sm text-blue-700">
            <MapPin className="h-4 w-4" />
            <span>
              Showing properties from {selectedNearbyTown} in {county} County
            </span>
          </div>
        </div>
      )}
    </section>
  );
}
