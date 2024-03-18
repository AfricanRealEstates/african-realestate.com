import { Property } from "@prisma/client";
import { Bath, Bed, ChevronLeft, ChevronRight, LandPlot } from "lucide-react";
import Link from "next/link";
import React from "react";
import prisma from "@/lib/prisma";
import { Plus_Jakarta_Sans, Raleway } from "next/font/google";
import Image from "next/image";
import PropertyCard from "@/components/properties/property-card";

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
  return (
    <div className={`${plusJakartaSans.className} bg-[#f6f6f7] text-[#4e4e4e]`}>
      <div className="w-[95%] lg:max-w-7xl mx-auto">
        <section className="flex items-center justify-start gap-12 flex-col w-full">
          <div className="flex flex-col items-center justify-center gap-5 mt-12">
            <h2 className="mt-4 text-2xl text-center font-semibold sm:text-3xl xl:text-[40px] relative">
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
        </section>
      </div>
    </div>
  );
}
