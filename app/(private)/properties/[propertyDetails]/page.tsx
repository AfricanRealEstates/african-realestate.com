import Filters from "@/components/globals/filters";
import Loader from "@/components/globals/loader";
import PropertyCard from "@/components/properties/new/PropertyCard";
import prisma from "@/lib/prisma";
import { PropertyData } from "@/lib/types";
import { Property } from "@prisma/client";
import { Loader2 } from "lucide-react";
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
  // Split the propertyDetails string into an array of types
  const propertyTypes = propertyDetails.split(",").map((type) => type.trim());

  // Fetch all properties that match any of the property types
  const properties = (await prisma.property.findMany({
    where: {
      propertyDetails,
      isActive: true, // Ensure the properties are active
    },
  })) as PropertyData[];

  if (properties.length === 0) {
    // Handle case where no properties are found
    return {
      title: "Properties Not Found | African Real Estate",
    };
  }

  return {
    title: `All ${propertyDetails}'s Category Properties | African Real Estate`,
    description: `Found ${properties.length} properties matching ${propertyDetails}.`,
    // Add other metadata fields as needed
  };
}

// Define the PropertyDetails component
export default async function PropertyDetails({
  params: { propertyDetails },
  searchParams,
}: PropertyDetailsProps) {
  // Fetch the property data based on the propertyDetails parameter
  const properties = (await prisma.property.findMany({
    where: {
      propertyDetails,
      isActive: true, // Ensure the properties are active
    },
  })) as PropertyData[];

  // Handle the case where the property is not found
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
      propertyDetails,
      isActive: true, // Ensure the properties are active
      //   // Add status filter
      //   status: "sale", // Assuming "let" is the desired status
    },
    orderBy: {
      updatedAt: "desc",
    },
  });

  // Render the property details
  return (
    <div
      className={`${raleway.className} w-[95%] lg:max-w-7xl mx-auto py-[90px] lg:py-[120px]`}
    >
      <h2 className="text-3xl  text-gray-900 md:text-4xl my-4 mb-8">
        All <span className="text-[#eb6753] font-bold">{propertyDetails} </span>
        Right Now.
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
            {searchProperties.map((property) => {
              return (
                <PropertyCard
                  key={property.id}
                  data={property as PropertyData}
                />
              );
            })}

            {searchProperties.length === 0 && (
              <p className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
                No {propertyDetails} properties category so far!.
              </p>
            )}
          </section>
        )}
      </Suspense>
    </div>
  );
}
