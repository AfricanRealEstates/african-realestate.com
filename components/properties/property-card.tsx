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

  // Converted land size in hectares
  const convertedLandSize = convertToHectares(landSize, landUnits);

  return (
    <>
      <section className="flex p-3 rounded-lg shadow bg-white flex-col relative">
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
            {bedrooms > 0 && (
              <div>
                <div className="flex gap-1 items-center">
                  <Bed className="size-5" />
                  <span className="font-extrabold">{bedrooms}</span>
                </div>
                <div className="text-xs font-semibold uppercase">Beds</div>
              </div>
            )}
            {bathrooms > 0 && (
              <div>
                <div className="flex gap-1 items-center">
                  <Bath className="size-5" />
                  <span className="font-extrabold">{bathrooms}</span>
                </div>
                <div className="text-xs font-semibold uppercase">Baths</div>
              </div>
            )}

            {landSize > 0 && (
              <div>
                <div className="flex gap-1 items-center">
                  <LandPlot className="size-5" />
                  <span className="font-extrabold">
                    {convertedLandSize.toFixed(3)}
                  </span>
                </div>
                <div className="text-xs font-semibold uppercase">Acres</div>
              </div>
            )}
          </div>
        </article>
      </section>
    </>
    // <Link
    //   key={id}
    //   href={`/properties/${id}`}
    //   className="relative px-2 py-3 bg-white text-inherit no-underline lg:shadow-none shadow-md"
    // >
    //   <div className="card-wrapper group pointer-events-auto relative grid aspect-square h-full w-full min-w-[335px] grid-rows-[1fr_auto] gap-3 rounded-lg group-[.is]/marker:!grid-rows-[150px_auto] sm:aspect-ratio">
    //     <article className="transition duration-300 ease-in-out group-hover:scale-[0.97] relative isolate h-full w-full overflow-hidden rounded-lg">
    //       <div className="scrollbar-hide pointer-events-auto relative inset-0 flex snap-x snap-mandatory overflow-x-auto @xs/marker:rounded-b-none w-full rounded-lg object-cover h-full">
    //         <div className="h-full w-full flex-none snap-center snap-always overflow-hidden object-cover relative isolate">
    //           {images.map((image) => {
    //             return (
    //               <Image
    //                 key={uuidv4()}
    //                 src={image}
    //                 alt=""
    //                 width={350}
    //                 height={300}
    //                 className="opacity-90 w-full h-full flex-none snap-center snap-always overflow-hidden object-cover delay-100 absolute z-[-1] transition-opacity"
    //               />
    //             );
    //           })}
    //         </div>
    //       </div>
    //       <p className="backdrop-blur-xs pointer-events-auto absolute top-2 z-50  transition-opacity bg-[#276ef1] text-white rounded-md px-2 py-.5 group-hover:opacity-100 md:grid left-4">
    //         For {status}
    //       </p>
    //       <p className="bg-black/40 backdrop-blur-xs pointer-events-auto absolute bottom-2 z-50  transition-opacity font-medium text-xl text-white rounded-md px-2 py-.5 group-hover:opacity-100 md:grid left-4">
    //         {currency} {price.toLocaleString()}
    //       </p>
    //     </article>
    //     <article className="flex h-full gap-2 flex-col group-[.is]/marker:px-3 group-[.is]/marker:pb-3">
    //       <p className="text-[#4e4e4e] uppercase text-sm font-medium">
    //         {location}, {county}
    //       </p>
    //       <p className="mb-0.5 flex text-[17px] text-black items-end gap-2 font-medium">
    //         {title}
    //       </p>

    //       <div className="flex items-center">
    //         <div className="grid w-full grid-cols-[min-content,auto] gap-x-2">
    //           <div className="flex items-center gap-2 text-sm">
    //             {bedrooms > 0 && (
    //               <div className="flex items-center justify-center gap-1">
    //                 <Bed className="h-4 w-4" />
    //                 <span className="whitespace-nowrap">
    //                   {bedrooms} Bedrooms
    //                 </span>
    //               </div>
    //             )}
    //             <div className="flex items-center justify-center gap-1">
    //               <LandPlot className="h-4 w-4" />
    //               <p className="flex items-center gap-0.5 whitespace-nowrap font-medium">
    //                 <span>{convertedLandSize.toFixed(3)}</span>
    //                 <span>ha</span>
    //               </p>
    //             </div>
    //             <div className="flex items-center justify-center gap-1 font-medium">
    //               <p className="whitespace-nowrap">Plinth area</p>
    //               <span>{plinthArea}</span>
    //               <span>sqm²</span>
    //             </div>
    //           </div>
    //         </div>
    //       </div>
    //     </article>
    //   </div>
    // </Link>
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
