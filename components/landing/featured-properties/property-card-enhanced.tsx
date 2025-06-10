"use client";

import type React from "react";

import { useState, useEffect } from "react";
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
import {
  likeProperty,
  unlikeProperty,
  saveProperty,
  unsaveProperty,
} from "@/actions/property-actions";
import { getCurrentUser } from "@/lib/session";
import { useRouter } from "next/navigation";

// Add or update this file to include proper type definitions
import type { Property, PropertyView, Like, User, Order } from "@prisma/client";

// Define the PropertyData type to include all possible relations
export type PropertyData = Property & {
  views?: PropertyView[];
  likes?: Like[];
  orders?: Order[];
  user?: User;
  _count?: {
    views?: number;
    likes?: number;
  };
};

interface PropertyCardEnhancedProps {
  property: PropertyData;
  isRecommended?: boolean;
  viewedRecently?: boolean;
  index?: number;
  showRecommendationBadge?: boolean;
}

export default function PropertyCardEnhanced({
  property,
  isRecommended = false,
  viewedRecently = false,
  index = 0,
  showRecommendationBadge = false,
}: PropertyCardEnhancedProps) {
  const [isLiked, setIsLiked] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [user, setUser] = useState<any>(null);
  const router = useRouter();

  // Check if property is liked or saved by current user
  useEffect(() => {
    const checkUserInteractions = async () => {
      try {
        const currentUser = await getCurrentUser();
        setUser(currentUser);

        if (currentUser) {
          // Check if property is in user's favorites
          setIsLiked(currentUser.favoriteIds?.includes(property.id) || false);

          // We could also check saved properties here if needed
          // This would require a separate API call to check if property is saved
        }
      } catch (error) {
        console.error("Error checking user interactions:", error);
      }
    };

    checkUserInteractions();
  }, [property.id]);

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

  // Check if property is new (less than 7 days old)
  const isNewProperty = () => {
    const createdDate = new Date(property.createdAt);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - createdDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 7 && property.isActive;
  };

  // Format view count with K/M suffix or show "New" for new properties
  const formatViewCount = (count: number) => {
    // Show "New" for properties that are 7 days old or newer
    if (isNewProperty()) {
      return "New";
    }

    if (!count) return "0 views";
    if (count >= 1000000) return `${(count / 1000000).toFixed(1)}M views`;
    if (count >= 1000) return `${(count / 1000).toFixed(1)}K views`;
    return `${count} views`;
  };

  // Get view count from property
  const getViewCount = () => {
    // Check if views exists and is an array before accessing length
    if (property.views && Array.isArray(property.views)) {
      return property.views.length;
    }
    return 0;
  };

  // Handle like/unlike property
  const handleLikeProperty = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      // Redirect to login if not logged in
      router.push(
        "/login?redirect=" +
          encodeURIComponent(
            `/properties/${property.propertyDetails}/${property.id}`
          )
      );
      return;
    }

    try {
      if (isLiked) {
        await unlikeProperty(property.id);
        setIsLiked(false);
      } else {
        await likeProperty(property.id);
        setIsLiked(true);
      }
    } catch (error) {
      console.error("Error toggling property like:", error);
    }
  };

  // Handle save/unsave property
  const handleSaveProperty = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      // Redirect to login if not logged in
      router.push(
        "/login?redirect=" +
          encodeURIComponent(
            `/properties/${property.propertyDetails}/${property.id}`
          )
      );
      return;
    }

    try {
      if (isSaved) {
        await unsaveProperty(property.id);
        setIsSaved(false);
      } else {
        await saveProperty(property.id);
        setIsSaved(true);
      }
    } catch (error) {
      console.error("Error toggling property save:", error);
    }
  };

  // Handle share property
  const handleShareProperty = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const shareUrl = `${window.location.origin}/properties/${property.propertyDetails}/${property.id}`;

    try {
      if (navigator.share) {
        await navigator.share({
          title: property.title,
          text: `Check out this property: ${property.title}`,
          url: shareUrl,
        });
      } else {
        // Fallback for browsers that don't support navigator.share
        await navigator.clipboard.writeText(shareUrl);
        alert("Link copied to clipboard!");
      }
    } catch (error) {
      console.error("Error sharing property:", error);
    }
  };

  return (
    <div
      className={`group relative bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border ${
        isRecommended
          ? "border-blue-200 ring-1 ring-blue-100"
          : "border-gray-200"
      }`}
      style={{
        animationDelay: `${index * 100}ms`,
      }}
    >
      {/* Recommendation Badge */}
      {showRecommendationBadge && (
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

      {/* New Property Badge - Only show if not showing other badges and property is new */}
      {isNewProperty() && !viewedRecently && !showRecommendationBadge && (
        <div className="absolute top-3 left-3 z-20 bg-green-500 text-white px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1">
          <span className="h-2 w-2 bg-white rounded-full animate-pulse mr-1"></span>
          New
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

          {/* View Count or New Badge */}
          {/* <div
            className={`absolute bottom-3 right-3 px-2 py-1 rounded-md text-xs flex items-center ${
              isNewProperty()
                ? "bg-green-500 text-white"
                : "bg-black/70 text-white"
            }`}
          >
            {isNewProperty() ? (
              <>
                <span className="h-2 w-2 bg-white rounded-full animate-pulse mr-1"></span>
                New
              </>
            ) : (
              <>
                <Eye className="h-3 w-3 mr-1" />
                {formatViewCount(getViewCount())}
              </>
            )}
          </div> */}

          {/* Action Buttons */}
          <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <button
              onClick={handleLikeProperty}
              className={`p-2 rounded-full backdrop-blur-sm transition-all ${
                isLiked
                  ? "bg-red-500 text-white"
                  : "bg-white/80 text-gray-700 hover:bg-white"
              }`}
              aria-label={isLiked ? "Unlike property" : "Like property"}
            >
              <Heart className={`h-4 w-4 ${isLiked ? "fill-current" : ""}`} />
            </button>
            <button
              onClick={handleShareProperty}
              className="p-2 rounded-full bg-white/80 text-gray-700 hover:bg-white backdrop-blur-sm transition-all"
              aria-label="Share property"
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
            <span className="text-sm line-clamp-1 capitalize">
              {property.locality},{" "}
              <span className="capitalize">{property.county}</span>
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
