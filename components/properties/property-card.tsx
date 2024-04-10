import { Property } from "@prisma/client";
import { Bed, LandPlot } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { v4 as uuidv4 } from "uuid";

interface PropertyCardProps {
  property: Property;
}

export default function PropertyCard({ property }: PropertyCardProps) {
  const {
    id,
    title,
    bedrooms,
    plinthArea,
    images,
    landSize,
    landUnits,
    county,
    location,
    price,
    status,
    currency,
  } = property;

  // Function to convert different land units to hectares
  const convertToHectares = (size: number, units: string): number => {
    switch (units.toLowerCase()) {
      case "ha":
        return size;
      case "acres":
        // Conversion factor: 1 acre = 0.404686 hectares
        return size * 0.404686;
      case "sqft":
        // Conversion factor: 1 hectare = 107639.104 square feet
        return size / 107639.104;
      case "sqm":
        // Conversion factor: 1 hectare = 10000 square meters
        return size / 10000;
      default:
        return size;
    }
  };

  // Converted land size in hectares
  const convertedLandSize = convertToHectares(landSize, landUnits);

  return (
    <Link
      key={id}
      href={`/properties/${id}`}
      className="relative px-2 py-3 bg-white text-inherit no-underline lg:shadow-none shadow-md"
    >
      <div className="card-wrapper group pointer-events-auto relative grid aspect-square h-full w-full min-w-[335px] grid-rows-[1fr_auto] gap-3 rounded-lg group-[.is]/marker:!grid-rows-[150px_auto] sm:aspect-ratio">
        <article className="transition duration-300 ease-in-out group-hover:scale-[0.97] relative isolate h-full w-full overflow-hidden rounded-lg">
          <div className="scrollbar-hide pointer-events-auto relative inset-0 flex snap-x snap-mandatory overflow-x-auto @xs/marker:rounded-b-none w-full rounded-lg object-cover h-full">
            <div className="h-full w-full flex-none snap-center snap-always overflow-hidden object-cover relative isolate">
              {images.map((image) => {
                return (
                  <Image
                    // key={image}
                    key={uuidv4()}
                    src={image}
                    alt=""
                    width={350}
                    height={300}
                    className="opacity-90 w-full h-full flex-none snap-center snap-always overflow-hidden object-cover delay-100 absolute z-[-1] transition-opacity"
                  />
                );
              })}
            </div>
          </div>
          <p className="backdrop-blur-xs pointer-events-auto absolute top-2 z-50  transition-opacity bg-[#276ef1] text-white rounded-md px-2 py-.5 group-hover:opacity-100 md:grid left-4">
            For {status}
          </p>
          <p className="bg-black/40 backdrop-blur-xs pointer-events-auto absolute bottom-2 z-50  transition-opacity font-medium text-xl text-white rounded-md px-2 py-.5 group-hover:opacity-100 md:grid left-4">
            {currency} {price.toLocaleString()}
          </p>
        </article>
        <article className="flex h-full gap-2 flex-col group-[.is]/marker:px-3 group-[.is]/marker:pb-3">
          <p className="text-[#4e4e4e] uppercase text-sm font-medium">
            {location}, {county}
          </p>
          <p className="mb-0.5 flex text-[17px] text-black items-end gap-2 font-medium">
            {title}
          </p>

          <div className="flex items-center">
            <div className="grid w-full grid-cols-[min-content,auto] gap-x-2">
              <div className="flex items-center gap-2 text-sm">
                {bedrooms > 0 && (
                  <div className="flex items-center justify-center gap-1">
                    <Bed className="h-4 w-4" />
                    <span className="whitespace-nowrap">
                      {bedrooms} Bedrooms
                    </span>
                  </div>
                )}
                <div className="flex items-center justify-center gap-1">
                  <LandPlot className="h-4 w-4" />
                  <p className="flex items-center gap-0.5 whitespace-nowrap font-medium">
                    <span>{convertedLandSize.toFixed(3)}</span>
                    <span>ha</span>
                  </p>
                </div>
                <div className="flex items-center justify-center gap-1 font-medium">
                  <p className="whitespace-nowrap">Plinth area</p>
                  <span>{plinthArea}</span>
                  <span>sqm²</span>
                </div>
              </div>
            </div>
          </div>
        </article>
      </div>
    </Link>
  );
}

export function PropertyCardSkeleton({ property }: PropertyCardProps) {
  return (
    <section className="overflow-hidden flex flex-col animate-pulse">
      <div className="w-full aspect-video bg-gray-300" />
      <article>
        <div className="w-1/2 h-6 rounded-full bg-gray-300"></div>
      </article>
      <article>
        <div className="w-1/2 h-4 rounded-full bg-gray-300"></div>
      </article>
    </section>
  );
}
