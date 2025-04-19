"use client";

import type React from "react";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Heart } from "lucide-react";
import type { PropertyData } from "@/lib/types";
import { formatNumber } from "@/lib/formatter";

interface PropertyCardCompactProps {
  property: PropertyData;
}

export default function PropertyCardCompact({
  property,
}: PropertyCardCompactProps) {
  const [isFavorite, setIsFavorite] = useState(false);

  const toggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsFavorite(!isFavorite);
  };

  // Get the first tag to display (could be property type, status, or a special feature)
  const getTag = () => {
    if (
      property.surroundingFeatures &&
      property.surroundingFeatures.includes("fruit trees")
    ) {
      return { text: "Fruit trees", color: "bg-orange-500" };
    }

    if (property.leastPrice && property.leastPrice < property.price) {
      const discount = formatNumber(property.price - property.leastPrice);
      return {
        text: `Price cut: ${property.currency} ${discount}`,
        color: "bg-red-500",
      };
    }

    return { text: property.propertyDetails, color: "bg-[#198754]" };
  };

  const tag = getTag();

  // Format the address
  const formatAddress = () => {
    return `${property.locality}, ${property.county}, ${property.country}`;
  };

  return (
    <div className="group relative rounded-lg overflow-hidden border border-gray-200 bg-white shadow-sm hover:shadow-md transition-shadow">
      {/* Image with tags and favorite button */}
      <div className="relative aspect-[4/3] overflow-hidden">
        <Link href={`/properties/${property.propertyDetails}/${property.id}`}>
          <Image
            src={
              property.coverPhotos?.[0] ||
              property.images?.[0] ||
              "/placeholder.svg"
            }
            alt={property.title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </Link>

        {/* Tag */}
        <div className="absolute top-2 left-2 z-10">
          <span
            className={`${tag.color} text-white text-xs font-medium px-2 py-1 rounded`}
          >
            {tag.text}
          </span>
        </div>

        {/* Favorite button */}
        <button
          onClick={toggleFavorite}
          className="absolute top-2 right-2 z-10 bg-white/80 rounded-full p-1.5 hover:bg-white"
          aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
        >
          <Heart
            className={`h-5 w-5 ${isFavorite ? "fill-red-500 text-red-500" : "text-gray-500"}`}
          />
        </button>
      </div>

      {/* Property details */}
      <Link href={`/properties/${property.propertyDetails}/${property.id}`}>
        <div className="p-4">
          {/* Price */}
          <div className="mb-1">
            <span className="text-xl font-bold text-gray-900">
              {property.currency === "USD" ? "$" : "Ksh. "}
              {property.price.toLocaleString()}
            </span>
          </div>

          {/* Specs */}
          <div className="flex items-center gap-2 text-sm text-gray-700 mb-2">
            <span>{property.bedrooms} bds</span>
            <span className="text-gray-300">|</span>
            <span>{property.bathrooms} ba</span>
            <span className="text-gray-300">|</span>
            <span>
              {property.landSize
                ? `${property.landSize} ${property.landUnits}`
                : `${property.plinthArea} sqft`}
            </span>
            <span className="text-gray-300">|</span>
            <span className="capitalize">
              {property.status === "sale" ? "Active" : property.status}
            </span>
          </div>

          {/* Address */}
          <p className="text-sm text-gray-700 mb-2 truncate">
            {property.title}
          </p>
          <p className="text-sm text-gray-500 truncate">{formatAddress()}</p>

          {/* Agent/MLS info */}
          <div className="mt-2 text-xs text-gray-400 truncate">
            #{property.propertyNumber} • {property.propertyDetails}
          </div>
        </div>
      </Link>
    </div>
  );
}
