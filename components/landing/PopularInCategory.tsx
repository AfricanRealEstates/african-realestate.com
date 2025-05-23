import { prisma } from "@/lib/prisma";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";

export default async function PopularInCategory({
  userPreferences,
}: {
  userPreferences: any;
}) {
  // Use user preferences to determine which property type to show
  const preferredType =
    userPreferences.preferredPropertyTypes.length > 0
      ? userPreferences.preferredPropertyTypes[0]
      : "Residential"; // Default to Residential if no preferences

  // Fetch popular properties in the preferred category
  const popularProperties = await prisma.property.findMany({
    where: {
      isActive: true,
      propertyType: preferredType,
    },
    include: {
      _count: {
        select: {
          likes: true,
          savedBy: true,
        },
      },
    },
    orderBy: [
      {
        likes: {
          _count: "desc",
        },
      },
      {
        savedBy: {
          _count: "desc",
        },
      },
    ],
    take: 6,
  });

  return (
    <section className="mx-auto w-full max-w-7xl px-5 py-16 md:px-10">
      <div className="flex items-center justify-between flex-wrap gap-4 mb-10">
        <div>
          <h2 className="text-xs text-blue-500 font-semibold mb-2 uppercase">
            Popular {preferredType}
          </h2>
          <h3 className="text-2xl font-bold text-gray-600">
            Top {preferredType} Properties
          </h3>
        </div>
        <Link
          href={`/properties?propertyType=${encodeURIComponent(preferredType)}&sort=popular`}
          className="text-[#636262] hover:text-blue-500 group font-semibold relative flex items-center gap-x-2"
        >
          <span className="group-hover:underline group-hover:underline-offset-4">
            View All {preferredType} Properties
          </span>
          <ArrowRight className="size-4 ml-1 transition-transform duration-300 group-hover:translate-x-1" />
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {popularProperties.map((property) => (
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
              <div className="absolute bottom-4 left-4 bg-red-500 text-white px-2 py-1 rounded-md text-xs font-medium">
                {property._count.likes} likes
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
                {property.bedrooms && (
                  <div className="flex items-center gap-1">
                    <span>{property.bedrooms}</span>
                    <span>Beds</span>
                  </div>
                )}
                {property.bathrooms && (
                  <div className="flex items-center gap-1">
                    <span>{property.bathrooms}</span>
                    <span>Baths</span>
                  </div>
                )}
                {property.landSize && (
                  <div className="flex items-center gap-1">
                    <span>{property.landSize}</span>
                    <span>{property.landUnits}</span>
                  </div>
                )}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
