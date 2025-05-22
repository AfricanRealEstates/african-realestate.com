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

export default async function CityProperties() {
  // Get user's location
  const location = await getUserLocation();

  console.log("User location detected:", location);

  // Use detected location or fallback
  const city = location.city || "Nairobi";
  const country = location.country || "Kenya";
  const region = location.region;

  // Create search terms array
  const searchTerms = [city];
  if (region && region !== city) {
    searchTerms.push(region);
  }

  // Create OR conditions for each search term
  const searchConditions = searchTerms.flatMap((term) => [
    { county: { contains: term, mode: Prisma.QueryMode.insensitive } },
    { locality: { contains: term, mode: Prisma.QueryMode.insensitive } },
    { nearbyTown: { contains: term, mode: Prisma.QueryMode.insensitive } },
    { district: { contains: term, mode: Prisma.QueryMode.insensitive } },
  ]);

  // Fetch properties in the user's city or nearby with more flexible matching
  const properties = await prisma.property.findMany({
    where: {
      OR: searchConditions,
      isActive: true,
    },
    take: 6,
    orderBy: { createdAt: "desc" },
  });

  // If no properties found in the user's city/region, expand search to country
  const countryProperties =
    properties.length === 0
      ? await prisma.property.findMany({
          where: {
            country: { contains: country, mode: Prisma.QueryMode.insensitive },
            isActive: true,
          },
          take: 6,
          orderBy: { createdAt: "desc" },
        })
      : [];

  // If still no properties, get any recent properties
  const fallbackProperties =
    properties.length === 0 && countryProperties.length === 0
      ? await prisma.property.findMany({
          where: { isActive: true },
          take: 6,
          orderBy: { createdAt: "desc" },
        })
      : [];

  // Use the best available properties
  const displayProperties =
    properties.length > 0
      ? properties
      : countryProperties.length > 0
        ? countryProperties
        : fallbackProperties;

  // Determine the display location
  const displayLocation =
    properties.length > 0
      ? city
      : countryProperties.length > 0
        ? country
        : "Available Areas";

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
    <section className="mx-auto w-full max-w-7xl px-4 py-8 lg:py-16">
      <div className="flex items-center justify-between flex-wrap gap-4 mb-10">
        <div>
          <h2 className="text-sm text-blue-500 font-semibold mb-2 uppercase flex items-center">
            <MapPin className="size-4 mr-1" />
            Local Properties
          </h2>
          <h3 className="text-2xl font-bold text-gray-900">
            Properties in {displayLocation}
          </h3>
          {location.city && location.city !== "Nairobi" && (
            <p className="text-sm text-gray-500 mt-1">
              Showing properties near your location: {location.city},{" "}
              {location.country}
            </p>
          )}
        </div>
        <Link
          href={`/properties?location=${encodeURIComponent(displayLocation)}`}
          className="text-[#636262] hover:text-blue-500 group font-semibold relative flex items-center gap-x-2"
        >
          <span className="group-hover:underline group-hover:underline-offset-4">
            View All Properties in {displayLocation}
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
