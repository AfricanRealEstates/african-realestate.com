import { Metadata } from "next";
import { notFound } from "next/navigation";
import prisma from "@/lib/prisma";
import PropertyCard from "@/components/properties/new/PropertyCard";
import { PropertyData } from "@/lib/types";
import SortingOptions from "./SortingOptions";
import { Badge } from "@/components/ui/badge";

export async function generateMetadata({
  searchParams,
}: {
  searchParams: { q?: string };
}): Promise<Metadata> {
  const query = searchParams.q || "properties";
  return {
    title: `Search Results for "${query}" | African Real Estate`,
    description: `Find your perfect property in Africa. Showing results for "${query}".`,
  };
}

interface AdvancedSearchParams {
  minBedrooms?: number;
  maxBedrooms?: number;
  minBathrooms?: number;
  maxBathrooms?: number;
  minPrice?: number;
  maxPrice?: number;
  propertyType?: string[];
}

async function getSearchResults(
  query: string,
  sortBy: string,
  sortOrder: "asc" | "desc",
  status: string,
  advancedParams: AdvancedSearchParams
) {
  const {
    minBedrooms,
    maxBedrooms,
    minBathrooms,
    maxBathrooms,
    minPrice,
    maxPrice,
    propertyType,
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
      ...(minBedrooms ? { bedrooms: { gte: minBedrooms } } : {}),
      ...(maxBedrooms ? { bedrooms: { lte: maxBedrooms } } : {}),
      ...(minBathrooms ? { bathrooms: { gte: minBathrooms } } : {}),
      ...(maxBathrooms ? { bathrooms: { lte: maxBathrooms } } : {}),
      ...(minPrice ? { price: { gte: minPrice } } : {}),
      ...(maxPrice ? { price: { lte: maxPrice } } : {}),
      ...(propertyType && propertyType.length > 0
        ? { propertyType: { in: propertyType } }
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
    minBedrooms?: string;
    maxBedrooms?: string;
    minBathrooms?: string;
    maxBathrooms?: string;
    minPrice?: string;
    maxPrice?: string;
    propertyType?: string;
  };
}) {
  const query = searchParams.q || "";
  const sortBy = searchParams.sort || "createdAt";
  const sortOrder = searchParams.order || "desc";
  const status = searchParams.status || "";

  const advancedParams: AdvancedSearchParams = {
    minBedrooms: searchParams.minBedrooms
      ? parseInt(searchParams.minBedrooms)
      : undefined,
    maxBedrooms: searchParams.maxBedrooms
      ? parseInt(searchParams.maxBedrooms)
      : undefined,
    minBathrooms: searchParams.minBathrooms
      ? parseInt(searchParams.minBathrooms)
      : undefined,
    maxBathrooms: searchParams.maxBathrooms
      ? parseInt(searchParams.maxBathrooms)
      : undefined,
    minPrice: searchParams.minPrice
      ? parseInt(searchParams.minPrice)
      : undefined,
    maxPrice: searchParams.maxPrice
      ? parseInt(searchParams.maxPrice)
      : undefined,
    propertyType: searchParams.propertyType
      ? searchParams.propertyType.split(",")
      : undefined,
  };

  const searchResults = await getSearchResults(
    query,
    sortBy,
    sortOrder,
    status,
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
          <p className="text-lg text-gray-600 mb-4"></p>
          {activeFilters.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {activeFilters.map(([key, value]) => (
                <Badge key={key} variant="secondary">
                  {key}: {Array.isArray(value) ? value.join(", ") : value}
                </Badge>
              ))}
            </div>
          )}
        </div>
        <div className="flex-end">
          <SortingOptions
            currentSort={sortBy}
            currentOrder={sortOrder}
            currentStatus={status}
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
