import { Property } from "@prisma/client";
import { Bath, Bed, ChevronLeft, ChevronRight, LandPlot } from "lucide-react";
import Link from "next/link";
import React from "react";
import prisma from "@/lib/prisma";
import { Plus_Jakarta_Sans, Raleway } from "next/font/google";
import Image from "next/image";
import PropertyCard from "@/components/properties/property-card";
import { Button } from "@/components/ui/button";

const plusJakartaSans = Raleway({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-nunitosans",
});

export default async function FeaturedProperties() {
  const properties: Property[] = await prisma.property.findMany({
    orderBy: {
      updatedAt: "desc",
    },
  });

  if (!properties) return <>No Featured properties</>;
  return (
    <div className={`${plusJakartaSans.className} bg-[#f2f2f7] text-[#4e4e4e]`}>
      <div className="mx-auto w-[95%] max-w-7xl px-5 py-16 md:px-10 md:py-24">
        <section className="flex items-center justify-start gap-12 flex-col w-full">
          <div className="flex flex-col items-center justify-center gap-5">
            <h2 className="text-center text-3xl font-bold md:text-5xl mt-4 text-[#181a20]">
              Featured Properties
            </h2>
            <p className="text-[13px] text-center md:text-[17px] text-[#4e4e4e]">
              Explore our featured properties
            </p>
          </div>
          <div className="mx-auto mb-8 gap-8 grid w-full max-w-screen-xl grid-cols-[repeat(auto-fill,_minmax(335px,1fr))] justify-center overflow-hidden">
            {properties.slice(0, 6).map((property) => {
              return <PropertyCard key={property.id} property={property} />;
            })}
          </div>

          {properties.length === 0 && (
            <div className="flex flex-col items-center gap-1 text-center">
              <h3 className="text-2xl font-bold tracking-tight">
                You have no products
              </h3>
              {/* <p className="text-sm text-gray-500">
                You can start selling as soon as you add a property.
              </p> */}
              <Button className="mt-4" asChild>
                <Link href="/agent/properties/create-property">
                  Add Property
                </Link>
              </Button>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
