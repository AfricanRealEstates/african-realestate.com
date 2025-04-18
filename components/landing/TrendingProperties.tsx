import { Lexend } from "next/font/google";
import PropertyCard from "@/components/properties/new/PropertyCard";
import { Suspense } from "react";
import { getTrendingProperties } from "@/actions/getTrendingProperties";
import { PropertySkeletonGrid } from "./featured-properties/PropertySkeletonGrid";

const lexend = Lexend({
  subsets: ["latin"],
  weight: ["600"],
});

async function TrendingPropertiesList() {
  const properties = await getTrendingProperties(6);

  if (properties.length === 0) {
    return (
      <div className="flex flex-col items-center gap-1 text-center">
        <h3 className="text-2xl font-bold tracking-tight">
          No trending properties available
        </h3>
      </div>
    );
  }

  return (
    <article className="mx-auto mb-8 gap-8 grid w-full max-w-screen-xl grid-cols-[repeat(auto-fill,_minmax(335px,1fr))] justify-center">
      {properties.map((property: any) => (
        <PropertyCard
          key={property.id}
          data={property}
          tierName={property.displayTier}
        />
      ))}
    </article>
  );
}

export default function TrendingProperties() {
  return (
    <div className="border-b border-neutral-100 mb-4 text-[#4e4e4e]">
      <div className="mx-auto w-[95%] max-w-7xl px-2 py-16 md:px-2 md:py-12 lg:py-16">
        <section className="flex items-center justify-start gap-8 flex-col w-full">
          <div className="flex flex-col items-center justify-center gap-2">
            <p
              className={`text-[12px] uppercase text-red-600 font-semibold leading-relaxed ${lexend.className}`}
            >
              Hot on the market
            </p>
            <h2
              className={`${lexend.className} text-center tracking-tight text-3xl font-bold sm:text-4xl my-1`}
            >
              Trending Properties
            </h2>
            <p className="text-sm text-gray-500 text-center max-w-2xl">
              Discover the most viewed and popular properties this week
            </p>
          </div>

          <Suspense fallback={<PropertySkeletonGrid count={6} />}>
            <TrendingPropertiesList />
          </Suspense>
        </section>
      </div>
    </div>
  );
}
