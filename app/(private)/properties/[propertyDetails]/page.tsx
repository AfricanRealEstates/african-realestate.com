import Filters from "@/components/globals/filters";
import Loader from "@/components/globals/loader";
import PropertyCard from "@/components/properties/new/PropertyCard";
import prisma from "@/lib/prisma";
import { PropertyData } from "@/lib/types";
import { Property } from "@prisma/client";
import { Metadata } from "next";
import { Raleway } from "next/font/google";
import { Suspense } from "react";

const raleway = Raleway({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-nunitosans",
});

interface PropertyDetailsProps {
  params: {
    propertyDetails: string;
  };
  searchParams: string;
}

export async function generateMetadata({
  params: { propertyDetails },
}: PropertyDetailsProps): Promise<Metadata> {
  // Decode the propertyDetails parameter
  const decodedPropertyDetails = decodeURIComponent(propertyDetails);

  const properties = (await prisma.property.findMany({
    where: {
      propertyDetails: decodedPropertyDetails, // Match exactly as decoded
      isActive: true,
    },
  })) as PropertyData[];

  if (properties.length === 0) {
    return {
      title: "Properties Not Found | African Real Estate",
    };
  }

  return {
    title: `All ${decodedPropertyDetails}'s Category Properties | African Real Estate`,
    description: `Found ${properties.length} properties matching ${decodedPropertyDetails}.`,
  };
}

export default async function PropertyDetails({
  params: { propertyDetails },
  searchParams,
}: PropertyDetailsProps) {
  // Decode the propertyDetails parameter
  const decodedPropertyDetails = decodeURIComponent(propertyDetails);

  // Fetch the property data based on the decoded propertyDetails parameter
  const properties = (await prisma.property.findMany({
    where: {
      propertyDetails: decodedPropertyDetails, // Match exactly as decoded
      isActive: true,
    },
  })) as PropertyData[];

  if (properties.length === 0) {
    return (
      <div className="bg-white py-12 md:py-0">
        <div className="mx-auto max-w-7xl px-4 pt-32 pb-8 sm:px-6 lg:px-8">
          <h1 className="text-2xl font-semibold">No Properties Found</h1>
        </div>
      </div>
    );
  }

  const key = JSON.stringify(searchParams);

  const searchProperties: Property[] = await prisma.property.findMany({
    where: {
      AND: Object.entries(searchParams).map(([key, value]) => {
        if (!isNaN(parseFloat(value as string))) {
          return { [key]: parseFloat(value as string) };
        }
        return { [key]: value };
      }),
      propertyDetails: decodedPropertyDetails, // Match exactly as decoded
      isActive: true,
    },
    orderBy: {
      updatedAt: "desc",
    },
  });

  return (
    <div
      className={`${raleway.className} w-[95%] lg:max-w-7xl mx-auto py-[90px] lg:py-[120px]`}
    >
      <h2 className="text-3xl text-gray-900 md:text-4xl my-4 mb-8">
        All{" "}
        <span className="text-[#eb6753] font-bold">
          {decodedPropertyDetails}{" "}
        </span>
        Available Right Now.
      </h2>
      <Filters searchParams={searchParams} />
      <Suspense fallback={<Loader />} key={key}>
        {searchParams.length === 0 ? (
          <div className="flex h-full items-center justify-center mt-8">
            No properties matched your search query. Please try again with a
            different term.
          </div>
        ) : (
          <section className="mx-auto mb-8 gap-8 grid w-full grid-cols-[repeat(auto-fill,minmax(335px,1fr))] justify-center">
            {searchProperties.map((property) => (
              <PropertyCard key={property.id} data={property as PropertyData} />
            ))}

            {searchProperties.length === 0 && (
              <p className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
                No {decodedPropertyDetails} properties category so far!.
              </p>
            )}
          </section>
        )}
      </Suspense>
    </div>
  );
}
