import { Suspense } from "react";
import { Raleway } from "next/font/google";
import { getSEOTags } from "@/lib/seo";
import { getProperties } from "@/lib/getProperties";
import PropertyFilter from "@/components/properties/PropertyFilter";
import PropertyCard from "@/components/properties/new/PropertyCard";
import Loader from "@/components/globals/loader";
import { PropertyData } from "@/lib/types";
import SortingOptions from "@/app/search/SortingOptions";

const raleway = Raleway({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-nunitosans",
});

export const metadata = getSEOTags({
  title: "To Let Properties | African Real Estate",
  canonicalUrlRelative: "/let",
});

export default async function PropertyPage({
  params,
  searchParams,
}: {
  params: { type: "buy" | "let" };
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const sort = (searchParams.sort as string) || "createdAt";
  const order = (searchParams.order as string) || "desc";
  const status = params.type === "buy" ? "sale" : "let";

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
      <article className="flex justify-between">
        <div className="my-5">
          <PropertyFilter pageType="let" />
        </div>
        <div className="my-5">
          <SortingOptions
            currentSort={sort}
            currentOrder={order}
            currentStatus={status}
            isActive={isFiltered || properties.length > 0}
          />
        </div>
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
              <PropertyCard key={property.id} data={property as PropertyData} />
            ))}
          </section>
        )}
      </Suspense>
    </div>
  );
}
