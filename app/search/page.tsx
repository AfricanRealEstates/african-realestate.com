import { Metadata } from "next";
import { notFound } from "next/navigation";
import prisma from "@/lib/prisma";
import PropertyCard from "@/components/properties/new/PropertyCard";
import { PropertyData } from "@/lib/types";
import SortingOptions from "./SortingOptions";

export const metadata: Metadata = {
  title: `Search Results | African Real Estate`,
  description: "Find your perfect property with our advanced search.",
};

async function getSearchResults(
  query: string,
  sortBy: string,
  sortOrder: "asc" | "desc",
  status: string
) {
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
  };
}) {
  const query = searchParams.q;
  const sortBy = searchParams.sort || "createdAt";
  const sortOrder = searchParams.order || "desc";
  const status = searchParams.status || "";

  if (!query) {
    notFound();
  }

  const searchResults = await getSearchResults(
    query,
    sortBy,
    sortOrder,
    status
  );

  return (
    <div className={`w-[95%] lg:max-w-7xl mx-auto py-[100px] lg:py-[160px]`}>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold mb-6">
          Search Results for &ldquo;{query}&rdquo;
        </h1>
        <SortingOptions
          currentSort={sortBy}
          currentOrder={sortOrder}
          currentStatus={status}
        />
      </div>
      {searchResults.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {searchResults.map((property) => (
            <PropertyCard key={property.id} data={property as any} />
          ))}
        </div>
      ) : (
        <p>No properties found matching your search criteria.</p>
      )}
    </div>
  );
}
