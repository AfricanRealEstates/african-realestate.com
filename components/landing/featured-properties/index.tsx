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
import {
  Josefin_Sans,
  Lexend,
  Plus_Jakarta_Sans,
  Raleway,
} from "next/font/google";
import Image from "next/image";

import { cache } from "@/lib/cache";
import FeaturedCard from "@/components/properties/featured-card";
import { Button } from "@/components/utils/Button";
import PropertyCard from "@/components/properties/new/PropertyCard";
import { PropertyData } from "@/lib/types";

const raleway = Raleway({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-nunitosans",
});

const lexend = Lexend({
  subsets: ["latin"],
  weight: ["600"],
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

  console.log(properties);

  if (!properties) return <>No Featured properties</>;
  return (
    <div className={`border-b border-neutral-100  mb-4 text-[#4e4e4e]`}>
      <div className="mx-auto w-[95%] max-w-7xl px-2 py-16 md:px-2 md:py-12 lg:py-16">
        <section className="flex items-center justify-start gap-8 flex-col w-full">
          <div className="flex flex-col items-center justify-center gap-2">
            <p
              className={`text-[12px] uppercase text-blue-600 font-semibold leading-relaxed ${lexend.className}`}
            >
              Explore our featured properties
            </p>
            <h2
              className={`${lexend.className} text-center tracking-tight text-3xl font-bold sm:text-4xl my-1`}
            >
              Recommended For You
            </h2>
          </div>

          <div className="my-10 grid grid-cols-3"></div>
          {/* <div className="mx-auto mb-8 gap-8 grid w-full max-w-screen-xl grid-cols-[repeat(auto-fill,_minmax(335px,1fr))] justify-center"></div> */}
          {/* <article className="grid grid-cols-1 gap-6 md:gap-8 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 w-full">
            {properties.slice(0, 4).map((property) => {
              return <PropertyCard key={property.id} data={property} />;
            })}
          </article> */}

          <article className="mx-auto mb-8 gap-8 grid w-full max-w-screen-xl grid-cols-[repeat(auto-fill,_minmax(335px,1fr))] justify-center">
            {properties.map((property) => {
              return (
                <>
                  <h2>{property.title}</h2>
                  <img src={property.images[6]} alt={""} key={property.id} />
                </>
              );
            })}
            {/* {properties.slice(0, 6).map((property) => {
              return (
                <PropertyCard
                  key={property.id}
                  data={property as PropertyData}
                />
              );
            })} */}
          </article>

          <Button color="blue" href={`/properties`}>
            View all Properties
          </Button>

          {properties.length === 0 && (
            <div className="flex flex-col items-center gap-1 text-center">
              <h3 className="text-2xl font-bold tracking-tight">
                There are no featured listings at the moment
              </h3>

              {/* <Button
                href="/properties"
                type="submit"
                color="blue"
                className="mt-4 flex-none"
              >
                <span className="hidden lg:inline">View Listings</span>
                <span className="lg:hidden">View More Property Listings</span>
              </Button> */}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
