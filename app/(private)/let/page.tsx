import { Suspense } from "react";
import { Raleway } from "next/font/google";
import { getSEOTags } from "@/lib/seo";
import { getProperties } from "@/lib/getProperties";
import PropertyFilter from "@/components/properties/PropertyFilter";
import PropertyCardEnhanced from "@/components/landing/featured-properties/property-card-enhanced";
import SortingOptions from "@/app/search/SortingOptions";
import Pagination from "@/components/globals/Pagination";
import { PropertySkeleton } from "@/components/globals/PropertySkeleton";

const raleway = Raleway({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-nunitosans",
});

export const metadata = getSEOTags({
  title: "To Let Properties | African Real Estate",
  canonicalUrlRelative: "/let",
  description:
    "Browse our extensive list of properties available for rent in Africa. Find your perfect home with our easy-to-use search filters.",
});

export default async function PropertyPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const sort = (searchParams.sort as string) || "createdAt";
  const order = (searchParams.order as string) || "desc";
  const status = "let";
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
      className={`${raleway.className} w-full px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto py-[90px] lg:py-[120px]`}
    >
      <h1 className="text-3xl font-semibold mb-8">Properties to Let</h1>
      <div className="flex flex-col gap-6">
        <div className="">
          <div className="flex w-full items-center justify-between">
            <div className="mb-8">
              <PropertyFilter pageType="let" />
            </div>
            <SortingOptions
              currentSort={sort}
              currentOrder={order}
              currentStatus={status}
              isActive={isFiltered || properties.length > 0}
            />
          </div>
          <Suspense fallback={<PropertySkeletonGrid />}>
            {properties.length === 0 ? (
              <div className="flex h-full items-center justify-center mt-8">
                No properties matched your search query. Please try again with a
                different term.
              </div>
            ) : (
              <>
                <section className="mx-auto mb-8 gap-8 grid w-full grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 justify-center">
                  {properties.map((property: any, index: number) => (
                    <PropertyCardEnhanced
                      key={property.id}
                      property={property}
                      index={index}
                    />
                  ))}
                </section>
                <Pagination currentPage={page} totalPages={totalPages} />
              </>
            )}
          </Suspense>
        </div>
      </div>
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
