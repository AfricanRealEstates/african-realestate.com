import { Suspense } from "react";
import { Raleway } from "next/font/google";
import { Metadata } from "next";
import { Property } from "@prisma/client";
import SortingOptions from "@/app/search/SortingOptions";
import Loader from "@/components/globals/loader";
import PropertyCard from "@/components/properties/new/PropertyCard";
import { prisma } from "@/lib/prisma";
import { PropertyData } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";

const raleway = Raleway({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-nunitosans",
});

interface PropertyDetailsProps {
  params: {
    propertyDetails: string;
  };
  searchParams: {
    sort?: string;
    order?: string;
    status?: string;
    [key: string]: string | undefined;
  };
}

export async function generateMetadata({
  params: { propertyDetails },
}: PropertyDetailsProps): Promise<Metadata> {
  const decodedPropertyDetails = decodeURIComponent(propertyDetails);

  const properties = (await prisma.property.findMany({
    where: {
      propertyDetails: decodedPropertyDetails,
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

const ActiveFilters = ({
  searchParams,
}: {
  searchParams: PropertyDetailsProps["searchParams"];
}) => {
  const filters = Object.entries(searchParams).filter(
    ([key, value]) => value && !["sort", "order"].includes(key)
  );

  if (filters.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-2 mb-4">
      {filters.map(([key, value]) => (
        <Badge key={key} variant="secondary" className="text-sm">
          {key}: {value}
          <X className="h-4 w-4 ml-2 cursor-pointer" />
        </Badge>
      ))}
    </div>
  );
};

export default async function PropertyDetails({
  params: { propertyDetails },
  searchParams,
}: PropertyDetailsProps) {
  const decodedPropertyDetails = decodeURIComponent(propertyDetails);

  const sort = searchParams.sort || "updatedAt";
  const order = searchParams.order || "desc";
  const status = searchParams.status || "";

  const searchProperties: Property[] = await prisma.property.findMany({
    where: {
      AND: Object.entries(searchParams).map(([key, value]) => {
        if (key === "sort" || key === "order" || key === "status") return {};
        if (!isNaN(parseFloat(value as string))) {
          return { [key]: parseFloat(value as string) };
        }
        return { [key]: value };
      }),
      propertyDetails: decodedPropertyDetails,
      isActive: true,
      ...(status && { status }),
    },
    orderBy: {
      [sort]: order,
    },
  });

  const key = JSON.stringify(searchParams);

  return (
    <div
      className={`${raleway.className} w-[95%] lg:max-w-7xl mx-auto py-[90px] lg:py-[120px]`}
    >
      <article className="flex flex-col md:flex-row justify-between items-start md:items-center my-8 space-y-4 md:space-y-0">
        <div className="w-full md:w-2/3">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 leading-tight mb-2">
            All{" "}
            <span className="text-[#eb6753] font-extrabold">
              {searchProperties.length}
            </span>{" "}
            <span className="text-[#eb6753] font-bold capitalize">
              {decodedPropertyDetails}
            </span>{" "}
            <span className="block md:inline">Available Right Now</span>
          </h2>
          <p className="text-gray-600 text-lg mt-2">
            Explore our curated selection of properties
          </p>
        </div>
        <div className="w-full md:w-1/3 z-10">
          <ActiveFilters searchParams={searchParams} />
          <SortingOptions
            currentSort={sort}
            currentOrder={order}
            currentStatus={status}
            isActive={true}
            showStatusFilter={true}
          />
        </div>
      </article>
      <Suspense fallback={<Loader />} key={key}>
        {searchProperties.length === 0 ? (
          <div className="flex h-full items-center justify-center mt-8 text-gray-600 text-lg">
            No properties matched your search query. Please try again with a
            different term.
          </div>
        ) : (
          <section className="mx-auto mb-8 gap-8 grid w-full grid-cols-[repeat(auto-fill,minmax(335px,1fr))] justify-center">
            {searchProperties.map((property) => (
              <PropertyCard key={property.id} data={property as PropertyData} />
            ))}
          </section>
        )}
      </Suspense>
    </div>
  );
}
