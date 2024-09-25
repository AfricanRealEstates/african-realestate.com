import { Metadata } from "next";
import { notFound } from "next/navigation";
import prisma from "@/lib/prisma";
import PropertyCard from "@/components/properties/new/PropertyCard";
import { PropertyData } from "@/lib/types";
import SortingOptions from "./SortingOptions";
import { Badge } from "@/components/ui/badge";
import PropertyFilter from "@/components/properties/PropertyFilter";

export async function generateMetadata({
  searchParams,
}: {
  searchParams: {
    q?: string;
    status?: string;
    propertyType?: string;
    propertyDetails?: string;
    location?: string;
    minPrice?: string;
    maxPrice?: string;
  };
}): Promise<Metadata> {
  const query = searchParams.q || "";
  const status = searchParams.status || "";
  const propertyType = searchParams.propertyType || "";
  const propertyDetails = searchParams.propertyDetails || "";
  const location = searchParams.location || "";
  const minPrice = searchParams.minPrice || "";
  const maxPrice = searchParams.maxPrice || "";

  let title = "Property Search";
  let description = "Find your perfect property in Africa.";

  if (query) {
    title = `${query} - Property Search Results`;
    description += ` Showing results for "${query}".`;
  }

  if (status) {
    title += ` | ${status === "sale" ? "For Sale" : "For Rent"}`;
    description += ` Properties ${
      status === "sale" ? "for sale" : "for rent"
    }.`;
  }

  if (propertyType) {
    title += ` | ${propertyType}`;
    description += ` ${propertyType} properties available.`;
  }

  if (location) {
    title += ` in ${location}`;
    description += ` Located in ${location}.`;
  }

  if (minPrice || maxPrice) {
    const priceRange =
      minPrice && maxPrice
        ? `${minPrice} - ${maxPrice}`
        : minPrice
        ? `from ${minPrice}`
        : `up to ${maxPrice}`;
    description += ` Price range: ${priceRange}.`;
  }

  // Fetch the first property to use its image in OpenGraph metadata
  const firstProperty = await prisma.property.findFirst({
    where: {
      OR: [
        { title: { contains: query, mode: "insensitive" } },
        { description: { contains: query, mode: "insensitive" } },
        { county: { contains: query, mode: "insensitive" } },
        { nearbyTown: { contains: query, mode: "insensitive" } },
        { user: { name: { contains: query, mode: "insensitive" } } },
      ],
      isActive: true,
      isAvailableForPurchase: true,
      ...(status ? { status: status } : {}),
      ...(propertyType ? { propertyType: propertyType } : {}),
      ...(propertyDetails ? { propertyDetails: propertyDetails } : {}),
      ...(location
        ? {
            OR: [
              { locality: { contains: location, mode: "insensitive" } },
              { nearbyTown: { contains: location, mode: "insensitive" } },
              { county: { contains: location, mode: "insensitive" } },
            ],
          }
        : {}),
    },
    select: {
      coverPhotos: true,
      title: true,
    },
  });

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: firstProperty?.coverPhotos[0]
        ? [{ url: firstProperty.coverPhotos[0], alt: firstProperty.title }]
        : [],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: firstProperty?.coverPhotos[0]
        ? [firstProperty.coverPhotos[0]]
        : [],
    },
  };
}

interface AdvancedSearchParams {
  minPrice?: number;
  maxPrice?: number;
  propertyType?: string;
  propertyDetails?: string;
  status?: string;
  location?: string;
}

async function getSearchResults(
  query: string,
  sortBy: string,
  sortOrder: "asc" | "desc",
  advancedParams: AdvancedSearchParams
) {
  const {
    minPrice,
    maxPrice,
    propertyType,
    propertyDetails,
    status,
    location,
  } = advancedParams;

  const properties = await prisma.property.findMany({
    where: {
      OR: [
        { title: { contains: query, mode: "insensitive" } },
        { description: { contains: query, mode: "insensitive" } },
        { county: { contains: query, mode: "insensitive" } },
        { nearbyTown: { contains: query, mode: "insensitive" } },
        { user: { name: { contains: query, mode: "insensitive" } } },
      ],
      isActive: true,
      isAvailableForPurchase: true,
      ...(status ? { status: status } : {}),
      ...(minPrice ? { price: { gte: minPrice } } : {}),
      ...(maxPrice ? { price: { lte: maxPrice } } : {}),
      ...(propertyType ? { propertyType: propertyType } : {}),
      ...(propertyDetails ? { propertyDetails: propertyDetails } : {}),
      ...(location
        ? {
            OR: [
              { locality: { contains: location, mode: "insensitive" } },
              { nearbyTown: { contains: location, mode: "insensitive" } },
              { county: { contains: location, mode: "insensitive" } },
            ],
          }
        : {}),
    },
    include: {
      user: true,
    },
    orderBy: {
      [sortBy]: sortOrder,
    },
  });

  return properties;
}

export default async function SearchPage({
  searchParams,
}: {
  searchParams: {
    q: string;
    sort: string;
    order: "asc" | "desc";
    status: string;
    minPrice?: string;
    maxPrice?: string;
    propertyType?: string;
    propertyDetails?: string;
    location?: string;
  };
}) {
  const query = searchParams.q || "";
  const sortBy = searchParams.sort || "createdAt";
  const sortOrder = searchParams.order || "desc";

  const advancedParams: AdvancedSearchParams = {
    minPrice: searchParams.minPrice
      ? parseInt(searchParams.minPrice)
      : undefined,
    maxPrice: searchParams.maxPrice
      ? parseInt(searchParams.maxPrice)
      : undefined,
    propertyType: searchParams.propertyType,
    propertyDetails: searchParams.propertyDetails,
    status: searchParams.status,
    location: searchParams.location,
  };

  const searchResults = await getSearchResults(
    query,
    sortBy,
    sortOrder,
    advancedParams
  );

  const activeFilters = Object.entries(advancedParams).filter(
    ([_, value]) => value !== undefined
  );

  return (
    <div className="w-[95%] lg:max-w-7xl mx-auto py-[100px] lg:py-[160px]">
      <div className="mb-8 flex justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-4">
            {query ? `Search Results for "${query}"` : "All Properties"}
          </h1>
          <p className="mb-4 md:mb-0 inline-flex items-center justify-center rounded px-[15px] text-sm leading-none h-[35px] bg-green-50 text-green-500 focus:shadow-[0_0_0_2px] focus:shadow-green-600 outline-none cursor-default">
            Showing
            <span className="font-semibold text-green-600 mx-1">
              {searchResults.length}
            </span>{" "}
            matched result
            {searchResults.length !== 1 ? "s" : ""}
          </p>
          {/* <p className="text-lg text-gray-600 mb-4"></p>
          {activeFilters.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {activeFilters.map(([key, value]) => (
                <Badge key={key} variant="secondary">
                  {key}: {Array.isArray(value) ? value.join(", ") : value}
                </Badge>
              ))}
            </div>
          )} */}
          <PropertyFilter />
        </div>
        <div className="flex items-center gap-3 flex-end">
          <SortingOptions
            currentSort={sortBy}
            currentOrder={sortOrder}
            currentStatus={advancedParams.status || ""}
            isActive={searchResults.length > 0}
          />
        </div>
      </div>
      {searchResults.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {searchResults.map((property) => (
            <PropertyCard key={property.id} data={property as any} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-xl text-gray-600 mb-4">
            No properties found matching your search criteria.
          </p>
          <p className="text-gray-500">
            Try adjusting your filters or search terms.
          </p>
        </div>
      )}
    </div>
  );
}
