import Filter from "@/components/globals/filters";
import Loader from "@/components/globals/loader";
import AllProperties from "@/components/properties/all-properties";
import { getSEOTags } from "@/lib/seo";
import { Property } from "@prisma/client";
import { Raleway } from "next/font/google";
import React, { Suspense } from "react";
import prisma from "@/lib/prisma";
import PropertyCard from "@/components/properties/property-card";

const raleway = Raleway({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-nunitosans",
});

export const metadata = getSEOTags({
  title: "Let Properties | African Real Estate",
  canonicalUrlRelative: "/let",
});

export default async function Properties({
  searchParams,
}: {
  searchParams: string;
}) {
  const key = JSON.stringify(searchParams);

  // Modify where clause to handle integer or float values
  const letProperties: Property[] = await prisma.property.findMany({
    where: {
      // Convert searchParams entries to appropriate Prisma query format
      AND: Object.entries(searchParams).map(([key, value]) => {
        // Check if value is numeric
        if (!isNaN(parseFloat(value as string))) {
          // If numeric, convert value to float
          return { [key]: parseFloat(value as string) };
        }
        // If not numeric, return as is
        return { [key]: value };
      }),
      // Add status filter
      status: "let", // Assuming "let" is the desired status
    },
    orderBy: {
      updatedAt: "desc",
    },
  });

  return (
    <div
      className={`${raleway.className} w-[95%] lg:max-w-7xl mx-auto py-[90px] lg:py-[120px]`}
    >
      <Filter searchParams={searchParams} />
      <Suspense fallback={<Loader />} key={key}>
        {searchParams.length === 0 ? (
          <div className="flex h-full items-center justify-center mt-8">
            No properties matched your search query. Please try again with a
            different term.
          </div>
        ) : (
          <section className="mx-auto mb-8 gap-8 grid w-full grid-cols-[repeat(auto-fill,minmax(335px,1fr))] justify-center">
            {letProperties.map((property) => {
              return <PropertyCard key={property.id} property={property} />;
            })}
          </section>
        )}
      </Suspense>
    </div>
  );
}
