import { Suspense } from "react";
import { Raleway } from "next/font/google";
import { getSEOTags } from "@/lib/seo";
import { getProperties } from "@/lib/getProperties";
import dynamic from "next/dynamic";
import Loader from "@/components/globals/loader";
import { PropertyData } from "@/lib/types";
import SortingOptions from "@/app/search/SortingOptions";

const PropertyFilter = dynamic(
  () => import("@/components/properties/PropertyFilter"),
  {
    loading: () => <Loader />,
  }
);

const PropertyCard = dynamic(
  () => import("@/components/properties/new/PropertyCard"),
  {
    loading: () => <Loader />,
  }
);

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

  const properties = await getProperties(searchParams, status);

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
      className={`${raleway.className} w-[95%] lg:max-w-7xl mx-auto py-[90px] lg:py-[120px]`}
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
      <Suspense fallback={<Loader />}>
        {properties.length === 0 ? (
          <div className="flex h-full items-center justify-center mt-8">
            No properties matched your search query. Please try again with a
            different term.
          </div>
        ) : (
          <section className="mx-auto mb-8 gap-8 grid w-full grid-cols-[repeat(auto-fill,minmax(335px,1fr))] justify-center">
            {properties.map((property) => (
              <Suspense key={property.id} fallback={<Loader />}>
                <PropertyCard data={property as PropertyData} />
              </Suspense>
            ))}
          </section>
        )}
      </Suspense>
    </div>
  );
}
