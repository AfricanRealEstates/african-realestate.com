import GallerySlider from "@/components/animations/gallery-slider";
import { Property } from "@prisma/client";
import React from "react";
import StatusBadge from "./StatusBadge";
import { MapPinIcon } from "@heroicons/react/20/solid";
import Link from "next/link";
import { Bath, Bed, ExpandIcon, Eye, Heart, MapPinned } from "lucide-react";

import { Josefin_Sans, Raleway } from "next/font/google";
const josefin = Raleway({
  subsets: ["latin"],
  weight: ["600"],
});

export interface PropertyCardProps {
  className?: string;
  ratioClass?: string;
  data: Property;
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
    bedrooms,
    bathrooms,
    title,
    images,
    locality,
    county,
    propertyDetails,
  } = data;

  const renderSliderGallery = () => {
    return (
      <div className="relative w-full overflow-hidden ">
        <GallerySlider
          uniqueID={`ExperiencesCard_${id}`}
          ratioClass={ratioClass}
          galleryImgs={images}
          href={`/properties/${id}`}
        />
        {/* <BtnLikeIcon isLiked={like} className="absolute right-3 top-3" /> */}
        {/* {status && (
          <StatusBadge status={status} className="absolute left-3 top-3" />
        )} */}
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
            <li className="bg-[rgba(11,33,50,.4)] p-1 hover:bg-red-500 rounded flex items-center justify-center transition-all ease-linear cursor-pointer">
              <Heart className="size-5 text-white" />
            </li>
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
    return (
      <div
        className={`${josefin.className} inline-grid grid-cols-3 gap-2 px-4`}
      >
        {bedrooms && bedrooms > 0 && (
          <div className="flex items-center space-x-2">
            <span className="hidden sm:inline-block">
              <Bed className="size-5" />
            </span>
            <span className=" text-neutral-500 font-semibold">
              {bedrooms} beds
            </span>
          </div>
        )}

        {/* ---- */}
        {bathrooms && bathrooms > 0 && (
          <div className="flex items-center space-x-4">
            <span className="hidden sm:inline-block">
              <Bath className="size-5" />
            </span>
            <span className=" text-neutral-500  font-semibold">
              {bathrooms} baths
            </span>
          </div>
        )}

        {/* ---- */}
        <div className="flex items-center space-x-2">
          <span className="hidden sm:inline-block">
            <ExpandIcon className="size-5" />
          </span>
          <span className=" text-neutral-500 font-semibold">
            {plinthArea} Sq. Ft
          </span>
        </div>
      </div>
    );
  };

  const renderContent = () => {
    return (
      <div className={size === "default" ? "py-4 space-y-3" : "p-3 space-y-1"}>
        <div className="space-y-2 px-4">
          <div className="flex items-center space-x-2">
            <h2
              className={`${josefin.className} leading-relaxed font-semibold capitalize text-[17px] transition duration-300 ease-in-out hover:text-[#ed2027]
              }`}
            >
              <span className="line-clamp-1">{title}</span>
            </h2>
          </div>

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
                    /per month
                  </span>
                </>
              ) : (
                ""
              )}
            </h2>
          </div>
        </div>
        {/* <div className="flex justify-between items-center px-4">
          {size === "default" && (
            <span className="text-sm text-neutral-500 font-normal">Price</span>
          )}
          <span className="text-base font-semibold">
            {currency} {price.toLocaleString()}
          </span>
        </div> */}
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
