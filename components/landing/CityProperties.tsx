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
} from "lucide-react";

export default async function CityProperties() {
  // Get user's location
  const location = await getUserLocation();

  // Default to Nairobi if location not available
  const city = location.city || "Nairobi";
  const country = location.country || "Kenya";

  // Fetch properties in the user's city or nearby
  const properties = await prisma.property.findMany({
    where: {
      OR: [
        { county: { contains: city, mode: "insensitive" } },
        { locality: { contains: city, mode: "insensitive" } },
        { nearbyTown: { contains: city, mode: "insensitive" } },
      ],
      isActive: true,
    },
    take: 6,
    orderBy: { createdAt: "desc" },
  });

  // If no properties found in the user's city, get properties from the country
  const countryProperties =
    properties.length === 0
      ? await prisma.property.findMany({
          where: {
            country: { contains: country, mode: "insensitive" },
            isActive: true,
          },
          take: 6,
          orderBy: { createdAt: "desc" },
        })
      : [];

  // Use either city properties or country properties
  const displayProperties =
    properties.length > 0 ? properties : countryProperties;

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
    <section className="mx-auto w-full max-w-7xl px-5 py-16 md:px-10">
      <div className="flex items-center justify-between flex-wrap gap-4 mb-10">
        <div>
          <h2 className="text-sm text-blue-500 font-semibold mb-2 uppercase">
            Local Properties
          </h2>
          <h3 className="text-[#636262] text-3xl md:text-4xl font-semibold">
            Properties in {city}
          </h3>
        </div>
        <Link
          href={`/properties?location=${encodeURIComponent(city)}`}
          className="text-[#636262] hover:text-blue-500 group font-semibold relative flex items-center gap-x-2"
        >
          <span className="group-hover:underline group-hover:underline-offset-4">
            View All Properties in {city}
          </span>
          <ArrowRight className="size-4 ml-1 transition-transform duration-300 group-hover:translate-x-1" />
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {displayProperties.map((property) => (
          <Link
            href={`/properties/${property.slug}`}
            key={property.id}
            className="group hover:cursor-pointer flex flex-col h-full transition-all ease-in-out border rounded-lg border-neutral-200 hover:border-neutral-100 hover:shadow-2xl hover:shadow-gray-600/10 bg-white overflow-hidden"
          >
            <div className="relative h-48 overflow-hidden">
              <Image
                src={
                  property.coverPhotos[0] ||
                  "/placeholder.svg?height=400&width=600" ||
                  "/placeholder.svg"
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
                  className={`absolute bottom-4 right-4 bg-${property.status === "sale" ? "green" : "blue"}-600 text-white px-2 py-1 rounded-md text-xs font-medium`}
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
