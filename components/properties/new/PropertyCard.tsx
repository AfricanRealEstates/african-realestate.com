"use client";

import GallerySlider from "@/components/animations/gallery-slider";
import { Property } from "@prisma/client";
import React from "react";
import StatusBadge from "./StatusBadge";
import { MapPinIcon } from "@heroicons/react/20/solid";
import Link from "next/link";
import { Bath, Bed, ExpandIcon, Eye, Heart, MapPinned } from "lucide-react";

import { Josefin_Sans, Raleway } from "next/font/google";
import { calculatePercentageSavings, formatNumber } from "@/lib/utils";
import LikeButton from "../LikeButton";
import { PropertyData } from "@/lib/types";
import { useSession } from "next-auth/react";

const josefin = Raleway({
  subsets: ["latin"],
  weight: ["600"],
});

export interface PropertyCardProps {
  className?: string;
  ratioClass?: string;
  data: PropertyData;
  size?: "default" | "small";
}

export default function PropertyCard({
  size = "default",
  className = "",
  data,
  ratioClass = "aspect-w-3 aspect-h-3",
}: PropertyCardProps) {
  const {
    id,
    status,
    plinthArea,
    currency,
    price,
    leastPrice,
    bedrooms,
    bathrooms,
    title,
    images,
    coverPhotos,
    locality,
    county,
    landSize,
    landUnits,
    propertyDetails,
    propertyType,
    tenure,
  } = data;

  const session = useSession();
  const user = session.data?.user;

  const renderSliderGallery = () => {
    return (
      <div className="relative w-full overflow-hidden">
        <GallerySlider
          uniqueID={`ExperiencesCard_${id}`}
          ratioClass={ratioClass}
          galleryImgs={images}
          coverPhotos={coverPhotos}
          href={`/properties/${id}`}
        />
        <div className="left-4 right-4 top-4 flex justify-between absolute items-start gap-2 flex-wrap">
          <ul className="flex gap-2">
            <li className="text-white bg-[#198754] font-semibold text-[12px] leading-5 uppercase text-center inline-block px-2 rounded transition-all cursor-pointer">
              Featured
            </li>
            <li className="text-white bg-[rgba(11,33,50,.4)] font-semibold text-[12px] leading-5 uppercase text-center inline-block px-2 rounded transition-all cursor-pointer">
              For {status}
            </li>
          </ul>
          <ul className="flex gap-1">
            <LikeButton
              propertyId={data.id}
              initialState={{
                likes: data._count?.likes || 0,
                isLikedByUser:
                  data.likes?.some((like) => like.userId === user?.id) || false,
              }}
            />
            <Link
              href={`/properties/${id}`}
              className="bg-[rgba(11,33,50,.4)] p-1 hover:bg-red-500 rounded flex items-center justify-center transition-all ease-linear cursor-pointer"
            >
              <Eye className="size-5 text-white" />
            </Link>
          </ul>
        </div>
        <div
          className={`${josefin.className} absolute left-4 bottom-4 font-semibold uppercase text-center inline-block px-1 py-0.5 rounded transition-all ease-in-out cursor-pointer bg-white hover:bg-[#ed2027] hover:text-white text-[#161e2d] text-xs leading-6 tracking-wider`}
        >
          {propertyDetails}
        </div>
      </div>
    );
  };

  const renderTienIch = () => {
    const convertToAcres = (size: number, units: string): number => {
      switch (units.toLowerCase()) {
        case "ha":
          // Conversion factor: 1 hectare = 2.47105 acres
          return size * 2.47105;
        case "acres":
          return size;
        case "sqft":
          // Conversion factor: 1 acre = 43560 square feet
          return size / 43560;
        case "sqm":
          // Conversion factor: 1 acre = 4046.86 square meters
          return size / 4046.86;
        default:
          return size;
      }
    };

    let convertedLandSize = null;
    if (landSize && landUnits) {
      convertedLandSize = convertToAcres(landSize, landUnits);
    }
    return (
      <div
        className={`${josefin.className} grid ${
          propertyType.toLowerCase() === "land" ? "grid-cols-2" : "grid-cols-3"
        } gap-2 px-4`}
      >
        {propertyType.toLowerCase() === "land" ? (
          <>
            {landSize && (
              <div className="flex items-center space-x-2 col-span-1">
                <span className="hidden sm:inline-block">
                  <ExpandIcon className="size-5" />
                </span>
                <span className="text-neutral-500 font-semibold">
                  {convertedLandSize?.toPrecision(3)} Acres
                </span>
              </div>
            )}

            {tenure && (
              <div className="items-center flex col-span-1">
                <span className="flex-grow text-neutral-500 font-semibold capitalize">
                  {tenure}
                  {(tenure.toLowerCase() === "leasehold" ||
                    tenure.toLowerCase() === "sectionalTitle") &&
                    ` - ${data.yearsLeft} yrs`}
                </span>
              </div>
            )}
          </>
        ) : (
          <>
            {bedrooms && bedrooms > 0 && (
              <div className="flex items-center space-x-2 col-span-1">
                <span className="hidden sm:inline-block">
                  <Bed className="size-5" />
                </span>
                <span className="text-neutral-500 font-semibold">
                  {bedrooms} beds
                </span>
              </div>
            )}

            {bathrooms && bathrooms > 0 && (
              <div className="flex items-center space-x-4 col-span-1">
                <span className="hidden sm:inline-block">
                  <Bath className="size-5" />
                </span>
                <span className="text-neutral-500 font-semibold">
                  {bathrooms} baths
                </span>
              </div>
            )}

            {plinthArea && (
              <div className="flex items-center space-x-2 col-span-1">
                <span className="hidden sm:inline-block">
                  <ExpandIcon className="size-5" />
                </span>
                <span className="text-neutral-500 font-semibold">
                  {formatNumber(plinthArea)} Sq.m
                </span>
              </div>
            )}
          </>
        )}
      </div>
    );
  };

  const renderContent = () => {
    const savings = calculatePercentageSavings(price, leastPrice);
    return (
      <div className={size === "default" ? "py-4 space-y-3" : "p-3 space-y-1"}>
        <div className="space-y-2 px-4">
          <div className="flex items-center space-x-2">
            <h2
              className={`${josefin.className} leading-relaxed font-semibold capitalize text-[17px] transition duration-300 ease-in-out hover:text-[#ed2027]`}
            >
              <span className="line-clamp-1">{title}</span>
            </h2>
          </div>

          <div className="flex items-center justify-between">
            <div
              className={` ${josefin.className} leading-relaxed gap-4 text-[14px] flex items-center`}
            >
              {size === "default" && (
                <MapPinned className="size-4 text-[#5c6368]" />
              )}
              <p className="inline-flex gap-1 capitalize text-[#5c6368]">
                <span>{locality},</span>
                <span className="">{county}</span>
              </p>
            </div>
            {savings && parseFloat(savings) > 0 ? (
              <p className="text-xs font-medium text-rose-400">
                Save {savings}%
              </p>
            ) : null}
          </div>
        </div>
        {renderTienIch()}
        <div className="border-b border-neutral-100"></div>
        <div className="flex items-center justify-between flex-wrap gap-1.5 px-4 py-2">
          <div className="flex items-center gap-8">
            <span>Price</span>
          </div>
          <div className="flex items-center">
            <h2 className="flex items-center gap-x-0.5 text-lg leading-7 font-semibold">
              <span>{currency}</span>
              {price.toLocaleString()}

              {status === "let" ? (
                <>
                  <span className="text-[#5c6368] text-sm font-normal">
                    {propertyType === "Vacational / Social"
                      ? "/ Per Day"
                      : "/ Per Month"}
                  </span>
                </>
              ) : (
                ""
              )}
            </h2>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div
      className={`group relative rounded-xl border border-[#e4e4e4] ${className}`}
    >
      {renderSliderGallery()}
      <Link href={`/properties/${id}`} className="">
        {renderContent()}
      </Link>
    </div>
  );
}
