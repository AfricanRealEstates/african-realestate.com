import { Property } from "@prisma/client";
import { Heart, MapPin } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { v4 as uuidv4 } from "uuid";

interface PropertyCardsProps {
  property: Property;
}
export default function FeaturedCard({ property }: PropertyCardsProps) {
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
    nearbyTown,
    location,
    price,
    status,
    currency,
    propertyDetails,
    propertyType,
  } = property;
  return (
    <section className="flex flex-col rounded-lg shadow-2xl bg-white relative">
      <div className="relative w-full min-h-[20rem] pt-[56.25%] overflow-hidden rounded-lg text-white">
        {images.map((image) => {
          return (
            <Image
              key={uuidv4()}
              src={image}
              width={350}
              height={300}
              priority
              className="absolute rounded-md top-0 w-full h-full object-cover"
              alt=""
            />
          );
        })}
        <div className="flex flex-col justify-between w-full h-full absolute top-0 p-4 bg-gradient-to-t from-black to-75%">
          <article className="flex gap-3 justify-between items-start">
            <div className="flex gap-1 flex-wrap overflow-hidden">
              <span className="inline-flex gap-1 items-center text-sm overflow-hidden px-2 py-1 rounded bg-white text-neutral-900">
                <span className="overflow-hidden text-ellipsis whitespace-nowrap">
                  For {status}
                </span>
              </span>
            </div>
            <label htmlFor="" className="rounded-full cursor-pointer">
              <input type="checkbox" className="peer sr-only" />
              <span className="group inline-flex justify-center items-center size-9 rounded-full bg-white">
                <Heart className="size-5 text-neutral-500 peer-checked:group-[]:text-red-600" />
              </span>
            </label>
          </article>
          <Link
            href={`/properties/${id}`}
            className="flex flex-col mt-auto pt-4"
          >
            {/* <div className="flex gap-1 flex-wrap oveflow-hidden mb-3">
              <span className="inline-flex items-center text-xs overflow-hidden bg-white gap-1 rounded-sm px-2 py-1 text-neutral-900">
                {propertyType}
              </span>
              <span className="inline-flex items-center text-xs overflow-hidden bg-white gap-1 rounded-sm px-2 py-1 text-neutral-900">
                {propertyDetails}
              </span>
            </div> */}
            <div className="flex gap-3 justify-between mt-4">
              <div className="text-start">
                <h4 className="capitalize text-base font-bold leading-6 line-clamp-2">
                  {title}
                </h4>
                <p className="text-sm mt-4 line-clamp-2 flex items-center gap-1">
                  <MapPin className="size-3" />
                  {nearbyTown}, {county}
                </p>
              </div>
              <div className="text-end">
                <p className="font-bold">{plinthArea}</p>
                <p className="text-sm font-semibold uppercase">Sq.ft</p>
              </div>
            </div>
            <div className="mt-4">
              <span className="text-lg font-extrabold">
                {currency} {price.toLocaleString()}
              </span>
            </div>
          </Link>
        </div>
      </div>
    </section>
  );
}
