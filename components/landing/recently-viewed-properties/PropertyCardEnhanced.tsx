"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Heart,
  MapPin,
  Home,
  Building,
  Factory,
  Umbrella,
  Map,
  Clock,
  Sparkles,
  TrendingUp,
  Share2,
} from "lucide-react";
import type { PropertyData } from "@/lib/types";

interface PropertyCardEnhancedProps {
  property: PropertyData;
  isRecommended?: boolean;
  viewedRecently?: boolean;
  index?: number;
}

export default function PropertyCardEnhanced({
  property,
  isRecommended = false,
  viewedRecently = false,
  index = 0,
}: PropertyCardEnhancedProps) {
  const [isLiked, setIsLiked] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  // Get property type icon
  const getTypeIcon = (type: string) => {
    switch (type) {
      case "Residential":
        return <Home className="size-3 mr-1" />;
      case "Commercial":
        return <Building className="size-3 mr-1" />;
      case "Industrial":
        return <Factory className="size-3 mr-1" />;
      case "Vacational / Social":
        return <Umbrella className="size-3 mr-1" />;
      case "Land":
        return <Map className="size-3 mr-1" />;
      default:
        return <Home className="size-3 mr-1" />;
    }
  };

  // Get property type color
  const getTypeColor = (type: string) => {
    switch (type) {
      case "Residential":
        return "bg-blue-100 text-blue-700";
      case "Commercial":
        return "bg-purple-100 text-purple-700";
      case "Industrial":
        return "bg-amber-100 text-amber-700";
      case "Vacational / Social":
        return "bg-emerald-100 text-emerald-700";
      case "Land":
        return "bg-orange-100 text-orange-700";
      default:
        return "bg-blue-100 text-blue-700";
    }
  };

  // Render property features based on type
  const renderPropertyFeatures = () => {
    const features = [];

    switch (property.propertyType) {
      case "Land":
        if (property.tenure) {
          features.push(
            <div
              key="tenure"
              className="flex items-center gap-1 text-xs text-gray-600"
            >
              <span className="font-medium">Tenure:</span>
              <span className="capitalize">{property.tenure}</span>
            </div>
          );
        }
        if (property.yearsLeft) {
          features.push(
            <div
              key="yearsLeft"
              className="flex items-center gap-1 text-xs text-gray-600"
            >
              <span>{property.yearsLeft}</span>
              <span>Years Left</span>
            </div>
          );
        }
        break;

      case "Commercial":
      case "Industrial":
        if (property.bedrooms) {
          features.push(
            <div
              key="parkings"
              className="flex items-center gap-1 text-xs text-gray-600"
            >
              <span>{property.bedrooms}</span>
              <span>Parkings</span>
            </div>
          );
        }
        if (property.bathrooms) {
          features.push(
            <div
              key="bathrooms"
              className="flex items-center gap-1 text-xs text-gray-600"
            >
              <span>{property.bathrooms}</span>
              <span>Baths</span>
            </div>
          );
        }
        if (property.plinthArea) {
          features.push(
            <div
              key="plinthArea"
              className="flex items-center gap-1 text-xs text-gray-600"
            >
              <span>{property.plinthArea}</span>
              <span>sqm</span>
            </div>
          );
        }
        break;

      default:
        if (property.bedrooms) {
          features.push(
            <div
              key="bedrooms"
              className="flex items-center gap-1 text-xs text-gray-600"
            >
              <span>{property.bedrooms}</span>
              <span>Beds</span>
            </div>
          );
        }
        if (property.bathrooms) {
          features.push(
            <div
              key="bathrooms"
              className="flex items-center gap-1 text-xs text-gray-600"
            >
              <span>{property.bathrooms}</span>
              <span>Baths</span>
            </div>
          );
        }
        if (property.plinthArea) {
          features.push(
            <div
              key="plinthArea"
              className="flex items-center gap-1 text-xs text-gray-600"
            >
              <span>{property.plinthArea}</span>
              <span>sqm</span>
            </div>
          );
        }
    }

    if (property.landSize) {
      features.push(
        <div
          key="landSize"
          className="flex items-center gap-1 text-xs text-gray-600"
        >
          <span>{property.landSize}</span>
          <span>{property.landUnits || "acres"}</span>
        </div>
      );
    }

    return features;
  };

  return (
    <div
      className={`group relative bg-white rounded-2xl shadow-sm hover:shadow-sm transition-all duration-300 overflow-hidden border ${
        isRecommended
          ? "border-gray-100 ring-1 ring-gray-50"
          : "border-gray-200"
      }`}
      style={{
        animationDelay: `${index * 100}ms`,
      }}
    >
      {/* Recommendation Badge */}
      {isRecommended && (
        <div className="absolute top-3 left-3 z-20 bg-gradient-to-r from-blue-500 to-purple-600 text-white px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1">
          <Sparkles className="h-3 w-3" />
          Recommended
        </div>
      )}

      {/* Recently Viewed Badge */}
      {viewedRecently && (
        <div className="absolute top-3 left-3 z-20 bg-gray-900 text-white px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1">
          <Clock className="h-3 w-3" />
          Recently Viewed
        </div>
      )}

      <Link
        href={`/properties/${property.propertyDetails}/${property.id}`}
        className="block"
      >
        {/* Image Section */}
        <div className="relative h-56 overflow-hidden">
          <div
            className={`absolute inset-0 bg-gray-200 animate-pulse transition-opacity duration-300 ${
              imageLoaded ? "opacity-0" : "opacity-100"
            }`}
          />
          <Image
            src={
              property.coverPhotos?.[0] ||
              "/placeholder.svg?height=400&width=600"
            }
            alt={property.title}
            fill
            className={`object-cover transition-all duration-500 group-hover:scale-110 ${
              imageLoaded ? "opacity-100" : "opacity-0"
            }`}
            onLoad={() => setImageLoaded(true)}
          />

          {/* Property Type Badge */}
          <div
            className={`absolute top-3 right-3 px-2 py-1 rounded-lg text-xs font-medium flex items-center ${getTypeColor(
              property.propertyType
            )}`}
          >
            {getTypeIcon(property.propertyType)}
            {property.propertyType}
          </div>

          {/* Price Badge */}
          <div className="absolute bottom-3 left-3 bg-white/95 backdrop-blur-sm px-3 py-2 rounded-lg">
            <div className="text-lg font-bold text-gray-900">
              {property.currency} {property.price.toLocaleString()}
            </div>
            {property.status && (
              <div className="text-xs text-gray-600">
                {property.status === "sale" ? "For Sale" : "To Let"}
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <button
              onClick={(e) => {
                e.preventDefault();
                setIsLiked(!isLiked);
              }}
              className={`p-2 rounded-full backdrop-blur-sm transition-all ${
                isLiked
                  ? "bg-red-500 text-white"
                  : "bg-white/80 text-gray-700 hover:bg-white"
              }`}
            >
              <Heart className={`h-4 w-4 ${isLiked ? "fill-current" : ""}`} />
            </button>
            <button
              onClick={(e) => {
                e.preventDefault();
                // Handle share functionality
              }}
              className="p-2 rounded-full bg-white/80 text-gray-700 hover:bg-white backdrop-blur-sm transition-all"
            >
              <Share2 className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Content Section */}
        <div className="p-5">
          <h3 className="font-bold text-lg text-gray-900 mb-2 line-clamp-1 group-hover:text-blue-600 transition-colors">
            {property.title}
          </h3>

          <div className="flex items-center gap-1 text-gray-600 mb-3">
            <MapPin className="h-4 w-4" />
            <span className="text-sm line-clamp-1">
              {property.locality}, {property.county}
            </span>
          </div>

          {/* Property Features */}
          <div className="flex flex-wrap gap-3 mb-4">
            {renderPropertyFeatures()}
          </div>

          {/* Property Details */}
          {property.propertyDetails && (
            <div className="text-xs text-gray-500 italic mb-3 line-clamp-1">
              {property.propertyDetails}
            </div>
          )}

          {/* Call to Action */}
          <div className="flex items-center justify-between">
            <div className="text-blue-600 text-sm font-medium group-hover:text-blue-700 transition-colors">
              View Details
            </div>
            {isRecommended && (
              <div className="flex items-center gap-1 text-xs text-gray-500">
                <TrendingUp className="h-3 w-3" />
                <span>Match</span>
              </div>
            )}
          </div>
        </div>
      </Link>
    </div>
  );
}
