import GallerySlider from "@/components/animations/gallery-slider";
import { Property } from "@prisma/client";
import React from "react";
import StatusBadge from "./StatusBadge";
import { MapPinIcon } from "@heroicons/react/20/solid";
import Link from "next/link";
import { Bath, Bed, ExpandIcon } from "lucide-react";

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
  } = data;

  const renderSliderGallery = () => {
    return (
      <div className="relative w-full rounded-2xl overflow-hidden ">
        <GallerySlider
          uniqueID={`ExperiencesCard_${id}`}
          ratioClass={ratioClass}
          galleryImgs={images}
          href={`/properties/${id}`}
        />
        {/* <BtnLikeIcon isLiked={like} className="absolute right-3 top-3" /> */}
        {status && (
          <StatusBadge status={status} className="absolute left-3 top-3" />
        )}
      </div>
    );
  };

  const renderTienIch = () => {
    return (
      <div className="inline-grid grid-cols-3 gap-2">
        {bedrooms && bedrooms > 0 && (
          <div className="flex items-center space-x-2">
            <span className="hidden sm:inline-block">
              <Bed className="size-3" />
            </span>
            <span className="text-xs text-neutral-500 dark:text-neutral-400">
              {bedrooms} beds
            </span>
          </div>
        )}

        {/* ---- */}
        {bathrooms && bathrooms > 0 && (
          <div className="flex items-center space-x-4">
            <span className="hidden sm:inline-block">
              <Bath className="size-3" />
            </span>
            <span className="text-xs text-neutral-500 dark:text-neutral-400">
              {bathrooms} baths
            </span>
          </div>
        )}

        {/* ---- */}
        <div className="flex items-center space-x-2">
          <span className="hidden sm:inline-block">
            <ExpandIcon className="size-3" />
          </span>
          <span className="text-xs text-neutral-500 dark:text-neutral-400">
            {plinthArea} Sq. Ft
          </span>
        </div>
      </div>
    );
  };

  const renderContent = () => {
    return (
      <div className={size === "default" ? "py-4 space-y-3" : "p-3 space-y-1"}>
        <div className="space-y-2">
          <div className="flex items-center text-neutral-500 text-sm space-x-2">
            {size === "default" && <MapPinIcon className="size-4" />}
            <p className="inline-flex gap-1 capitalize">
              <span>{locality},</span>
              <span className="font-medium text-indigo-500">{county}</span>
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <h2
              className={`font-medium capitalize ${
                size === "default"
                  ? "text-lg font-medium capitalize"
                  : "text-base"
              }`}
            >
              <span className="line-clamp-1">{title}</span>
            </h2>
          </div>
        </div>
        {renderTienIch()}
        <div className="border-b border-neutral-100"></div>
        <div className="flex justify-between items-center">
          {size === "default" && (
            <span className="text-sm text-neutral-500 font-normal">Price</span>
          )}
          <span className="text-base font-semibold">
            {currency} {price.toLocaleString()}
          </span>
        </div>
      </div>
    );
  };
  return (
    <div className={`group relative ${className}`}>
      {renderSliderGallery()}
      <Link href={`/properties/${id}`}>{renderContent()}</Link>
    </div>
  );
}
