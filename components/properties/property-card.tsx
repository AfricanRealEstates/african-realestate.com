import { formatCurrency } from "@/lib/formatter";
import { Property } from "@prisma/client";
import { Bath, Bed, Heart, LandPlot, MapPin } from "lucide-react";
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
    bathrooms,
    plinthArea,
    images,
    landSize,
    landUnits,
    county,
    location,
    price,
    status,
    currency,
    propertyDetails,
    propertyType,
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

  let convertedLandSize = null;
  if (landSize && landUnits) {
    convertedLandSize = convertToHectares(landSize, landUnits);
  }

  // Converted land size in hectares
  // const convertedLandSize = convertToHectares(landSize, landUnits);

  return (
    <>
      <Link href={`/properties/${id}`} className="">
        <section className="flex p-3 rounded-lg shadow hover:shadow-xl transition-shadow bg-white flex-col relative border-solid border-[#e4e4e4]">
          <label
            aria-label="Favorite"
            className="absolute end-6 top-6 z-10 rounded-full cursor-pointer"
          >
            <input type="checkbox" className="peer sr-only" />
            <span className="group size-9 inline-flex items-center justify-center rounded-full bg-white">
              <Heart className="size-5 text-neutral-500 peer-checked:group-[]:text-red-600" />
            </span>
          </label>
          <div className="group w-full min-h-[12rem] pt-[56.25%] relative rounded-sm">
            {images.map((image) => {
              return (
                <Image
                  key={uuidv4()}
                  src={image}
                  width={350}
                  height={300}
                  priority
                  className="absolute rounded-md top-0 w-full h-full object-cover transition duration-300 group-hover:scale-[1.02]"
                  alt=""
                />
              );
            })}
          </div>
          <article className="flex h-full flex-col gap-0.5">
            <div className="flex gap-1 flex-wrap justify-between mt-3">
              <div className="flex gap-1 flex-wrap overflow-hidden">
                {/* <span className="inline-flex items-center gap-1 rounded-sm px-2 py-1 bg-sky-200 text-neutral-900 text-sm overflow-hidden">
                <span className="overflow-hidden text-ellipsis whitespace-nowrap">
                  {propertyType}
                </span>
              </span> */}
                <span className="inline-flex items-center gap-1 rounded-sm px-2 py-1 bg-neutral-50 text-indigo-600 text-sm overflow-hidden">
                  <span className="overflow-hidden text-ellipsis whitespace-nowrap">
                    {propertyDetails}
                  </span>
                </span>
              </div>
              <div className="flex gap-1 flex-wrap overflow-hidden ">
                <span className="inline-flex items-center gap-1 rounded-sm px-2 py-1 bg-green-50 text-green-500 text-sm overflow-hidden">
                  <span className="overflow-hidden text-ellipsis whitespace-nowrap">
                    For {status}
                  </span>
                </span>
              </div>
            </div>
            <Link
              href={`/properties/${id}`}
              className="group flex gap-3 justify-between mt-3 transition-all ease-linear"
            >
              <div className="text-start group-hover:text-blue-400">
                <h4 className="text-lg text-neutral-600 font-bold capitalize leading-6 line-clamp-2">
                  {title}
                </h4>
                {/* <div className="text-base line-clamp-2 mt-2 flex items-center gap-2">
                <MapPin className="size-4" /> {location}, {county}
              </div> */}
              </div>
              <div className="text-end">
                <p className="font-bold">{plinthArea}</p>
                <div className="text-sm font-semibold uppercase">
                  <span>sqm</span>
                  <sup>2</sup>
                </div>
              </div>
            </Link>
            <div className="mt-2">
              <span className="text-lg font-extrabold text-blue-600">
                {currency} {price.toLocaleString()}
              </span>
              {status.toLowerCase() === "let" && (
                <span className="text-sm text-neutral-500 ml-2">Per Month</span>
              )}
            </div>
            <div className="mt-auto pt-2 border-b border-neutral-100"></div>
            <div className="flex gap-3 mt-2 flex-wrap justify-between text-gray-400">
              {bedrooms && bedrooms > 0 && (
                <div>
                  <div className="flex gap-1 items-center">
                    <Bed className="size-5" />
                    <span className="font-extrabold">{bedrooms}</span>
                  </div>
                  <div className="text-xs font-semibold uppercase">Beds</div>
                </div>
              )}
              {bathrooms && bathrooms > 0 && (
                <div>
                  <div className="flex gap-1 items-center">
                    <Bath className="size-5" />
                    <span className="font-extrabold">{bathrooms}</span>
                  </div>
                  <div className="text-xs font-semibold uppercase">Baths</div>
                </div>
              )}

              {landSize && landSize > 0 && (
                <div>
                  <div className="flex gap-1 items-center">
                    <LandPlot className="size-5" />
                    <span className="font-extrabold">
                      {convertedLandSize?.toFixed(3)}
                    </span>
                  </div>
                  <div className="text-xs font-semibold uppercase">Acres</div>
                </div>
              )}
            </div>
          </article>
        </section>
      </Link>
    </>
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
