import { Suspense } from "react";
import { Raleway } from "next/font/google";
import { getSEOTags } from "@/lib/seo";
import SortingOptions from "@/app/search/SortingOptions";
import PropertyFilter from "@/components/properties/PropertyFilter";
import { getProperties } from "@/lib/getProperties";
import Pagination from "@/components/globals/Pagination";
import { PropertySkeleton } from "@/components/globals/PropertySkeleton";
import PropertyCardEnhanced from "@/components/landing/featured-properties/property-card-enhanced";

const raleway = Raleway({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-nunitosans",
});

export const metadata = getSEOTags({
  title: "Buy Properties | African Real Estate",
  canonicalUrlRelative: "/buy",
});

export default async function BuyPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const sort = (searchParams.sort as string) || "createdAt";
  const order = (searchParams.order as string) || "desc";
  const status = "sale";
  const page = Number.parseInt(searchParams.page as string) || 1;
  const pageSize = 12;

  const { properties, totalCount, totalPages } = await getProperties(
    searchParams,
    status,
    page,
    pageSize
  );

  const isFiltered = Object.keys(searchParams).some((key) =>
    [
      "propertyType",
      "propertyDetails",
      "county",
      "locality",
      "minPrice",
      "maxPrice",
    ].includes(key)
  );

  return (
    <div
      className={`${raleway.className} w-[95%] lg:max-w-7xl mx-auto py-[90px] lg:py-[120px] px-4 sm:px-6 lg:px-8`}
    >
      <h1 className="text-3xl font-semibold mb-8">Properties for Sale</h1>
      <article className="flex flex-col md:flex-row md:items-center justify-between w-full mb-8">
        <div className="mb-4 md:mb-0">
          <PropertyFilter pageType="buy" />
        </div>

        <SortingOptions
          currentSort={sort}
          currentOrder={order}
          currentStatus={status}
          isActive={isFiltered || properties.length > 0}
        />
      </article>
      <Suspense fallback={<PropertySkeletonGrid />}>
        {properties.length === 0 ? (
          <div className="flex h-full items-center justify-center mt-8">
            No properties matched your search query. Please try again with
            different criteria.
          </div>
        ) : (
          <>
            <section className="mx-auto mb-8 gap-8 grid w-full grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 justify-center">
              {properties.map((property, index) => (
                <PropertyCardEnhanced
                  key={property.id}
                  property={property as any}
                  index={index}
                />
              ))}
            </section>
            <Pagination currentPage={page} totalPages={totalPages} />
          </>
        )}
      </Suspense>
    </div>
  );
}

// Grid of property skeletons for loading state
function PropertySkeletonGrid() {
  return (
    <section className="mx-auto mb-8 gap-8 grid w-full grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 justify-center">
      {Array.from({ length: 6 }).map((_, index) => (
        <PropertySkeleton key={index} />
      ))}
    </section>
  );
}
