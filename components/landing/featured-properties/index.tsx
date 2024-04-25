import { Property } from "@prisma/client";
import {
  ArrowRight,
  Bath,
  Bed,
  ChevronLeft,
  ChevronRight,
  LandPlot,
} from "lucide-react";
import Link from "next/link";
import React from "react";
import prisma from "@/lib/prisma";
import { Plus_Jakarta_Sans, Raleway } from "next/font/google";
import Image from "next/image";
import PropertyCard, {
  PropertyCardSkeleton,
} from "@/components/properties/property-card";
import { cache } from "@/lib/cache";
import FeaturedCard from "@/components/properties/featured-card";
import { Button } from "@/components/utils/Button";

const plusJakartaSans = Raleway({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-nunitosans",
});

const getMostPopularProperties = cache(
  () => {
    return prisma.property.findMany({
      where: { isAvailableForPurchase: true },
      orderBy: { queries: { _count: "desc" } },
      take: 3,
    });
  },
  ["/", "getMostPopularProperties"],
  { revalidate: 60 * 60 * 24 }
);

const getNewestProperties = cache(
  () => {
    return prisma.property.findMany({
      where: { isAvailableForPurchase: true },
      orderBy: { createdAt: "desc" },
      take: 3,
    });
  },
  ["/", "getNewestProperties"],
  { revalidate: 60 * 60 * 24 }
);

export default async function FeaturedProperties() {
  const properties: Property[] = await prisma.property.findMany({
    orderBy: {
      updatedAt: "desc",
    },
  });

  if (!properties) return <>No Featured properties</>;
  return (
    <div
      className={`${plusJakartaSans.className} border-b border-neutral-100  mb-4 text-[#4e4e4e]`}
    >
      <div className="mx-auto w-[95%] max-w-7xl px-5 py-16 md:px-10 md:py-24 lg:py-32">
        <section className="flex items-center justify-start gap-12 flex-col w-full">
          <div className="flex flex-col items-center justify-center gap-5">
            <h2 className="text-center text-3xl font-bold md:text-5xl mt-4 text-[#181a20]">
              Featured Properties
            </h2>
            <p className="text-[13px] text-center md:text-[17px] text-[#4e4e4e]">
              Explore our featured properties
            </p>
          </div>
          <div className="mx-auto mb-8 gap-8 grid w-full max-w-screen-xl grid-cols-[repeat(auto-fill,_minmax(335px,1fr))] justify-center">
            {properties.slice(0, 3).map((property) => {
              return (
                <>
                  {/* <PropertyCard key={property.id} property={property} /> */}
                  <FeaturedCard key={property.id} property={property} />
                </>
              );
            })}
          </div>

          {/* <ProductGridSection
            title="Most popular"
            propertiesFetcher={getMostPopularProperties}
          /> */}
          {/* <ProductGridSection
            title="Newest"
            propertiesFetcher={getNewestProperties}
          /> */}

          {properties.length === 0 && (
            <div className="flex flex-col items-center gap-1 text-center">
              <h3 className="text-2xl font-bold tracking-tight">
                There are no featured listings at the moment
              </h3>

              <Button
                href="/properties"
                type="submit"
                color="blue"
                className="mt-4 flex-none"
              >
                <span className="hidden lg:inline">View Listings</span>
                <span className="lg:hidden">View More Property Listings</span>
              </Button>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

interface ProductGridSectionProps {
  propertiesFetcher: () => Promise<Property[]>;
  title: string;
}

async function ProductGridSection({
  propertiesFetcher,
  title,
}: ProductGridSectionProps) {
  return (
    <div className="space-y-4">
      <div className="flex gap-4 items-center justify-between">
        <h2 className="text-3xl font-bold">{title}</h2>
        <Button variant="outline">
          <Link href="/properties">
            <span>View All</span>
            <ArrowRight />
          </Link>
        </Button>
      </div>
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {(await propertiesFetcher()).map((property) => (
          <PropertyCard key={property.id} property={property} />
        ))}
      </section>
    </div>
  );
}
