import { Suspense } from "react";
import { Raleway } from "next/font/google";
import { getSEOTags } from "@/lib/seo";
import { getProperties } from "@/lib/getProperties";
import PropertyFilter from "@/components/properties/PropertyFilter";
import PropertyCard from "@/components/properties/new/PropertyCard";
import Loader from "@/components/globals/loader";
import { PropertyData } from "@/lib/types";

const raleway = Raleway({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-nunitosans",
});

export const metadata = getSEOTags({
  title: "Buy Properties | African Real Estate",
  canonicalUrlRelative: "/buy",
});

export default async function Buy({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const properties = await getProperties(searchParams, "sale");

  return (
    <div
      className={`${raleway.className} w-[95%] lg:max-w-7xl mx-auto py-[90px] lg:py-[120px]`}
    >
      <div className="my-5">
        <PropertyFilter pageType="buy" />
      </div>
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
