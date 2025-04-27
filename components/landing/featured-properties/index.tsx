import { Suspense } from "react";
import { Lexend } from "next/font/google";
import { Button } from "@/components/utils/Button";
import PropertyCard from "@/components/properties/new/PropertyCard";
import { PropertySkeletonGrid } from "./PropertySkeletonGrid";
import { getPersonalizedProperties } from "@/actions/getPersonalizedProperties";
import { getCurrentUser } from "@/lib/session";

const lexend = Lexend({
  subsets: ["latin"],
  weight: ["600"],
});

async function getProperties() {
  // Get personalized properties for the current user
  return getPersonalizedProperties(6);
}

function PropertyList({ properties }: any) {
  if (properties.length === 0) {
    return (
      <div className="flex flex-col items-center gap-1 text-center">
        <h3 className="text-2xl font-bold tracking-tight">
          There are no featured listings at the moment
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

export default async function FeaturedProperties() {
  const properties = await getProperties();
  const user = await getCurrentUser();

  // Determine if we're showing personalized recommendations
  const isPersonalized = user !== null;

  return (
    <div className={`border-b border-neutral-100 mb-4 text-[#4e4e4e]`}>
      <div className="mx-auto w-[95%] max-w-7xl px-2 py-8 md:px-2 md:py-12 lg:py-16">
        <section className="flex items-center justify-start gap-8 flex-col w-full">
          <div className="flex flex-col items-center justify-center gap-2">
            <p
              className={`text-[12px] uppercase text-blue-600 font-semibold leading-relaxed ${lexend.className}`}
            >
              {isPersonalized
                ? "Properties tailored for you"
                : "Explore our featured properties"}
            </p>
            <h2
              className={`${lexend.className} text-center tracking-tight text-3xl font-bold sm:text-4xl my-1`}
            >
              Recommended For You
            </h2>
            {isPersonalized && (
              <p className="text-sm text-gray-500 text-center max-w-2xl">
                Based on your browsing history, preferences, and interactions
              </p>
            )}
          </div>

          <Suspense fallback={<PropertySkeletonGrid count={6} />}>
            <PropertyList properties={properties} />
          </Suspense>

          <Button color="blue" href={`/properties`}>
            View all Properties
          </Button>
        </section>
      </div>
    </div>
  );
}
