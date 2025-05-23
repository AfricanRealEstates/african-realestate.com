"use client";

import type React from "react";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  ChevronLeft,
  ChevronRight,
  X,
  Search,
  MapPin,
  Home,
  Building,
  Factory,
  Umbrella,
  Map,
  Clock,
  CheckCircle2,
  XCircle,
  Eye,
} from "lucide-react";
import {
  SearchHistoryEntry,
  removeSearchEntry,
  markSearchAsSuccessful,
} from "@/actions/trackSearchHistory";

interface SearchHistoryCarouselClientProps {
  initialHistory: (SearchHistoryEntry & { locationContext?: string })[];
}

export default function SearchHistoryCarouselClient({
  initialHistory,
}: SearchHistoryCarouselClientProps) {
  const [searchHistory, setSearchHistory] = useState(initialHistory);
  const [scrollPosition, setScrollPosition] = useState(0);
  const [maxScroll, setMaxScroll] = useState(0);
  const [showInterestPrompt, setShowInterestPrompt] = useState<
    Record<string, boolean>
  >({});
  const carouselRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    if (carouselRef.current) {
      const { scrollWidth, clientWidth } = carouselRef.current;
      setMaxScroll(scrollWidth - clientWidth);
    }
  }, [searchHistory]);

  // Show interest prompt for searches older than 7 days
  useEffect(() => {
    const promptState: Record<string, boolean> = {};

    searchHistory.forEach((entry) => {
      const lastViewed = new Date(entry.lastViewed || entry.timestamp);
      const daysSinceLastView = Math.floor(
        (Date.now() - lastViewed.getTime()) / (1000 * 60 * 60 * 24)
      );

      // Show prompt for searches older than 7 days
      if (daysSinceLastView > 7) {
        promptState[entry.id] = true;
      }
    });

    setShowInterestPrompt(promptState);
  }, [searchHistory]);

  const scroll = (direction: "left" | "right") => {
    if (!carouselRef.current) return;

    const { clientWidth } = carouselRef.current;
    const scrollAmount = clientWidth * 0.8; // Scroll 80% of the visible width

    const newPosition =
      direction === "left"
        ? Math.max(scrollPosition - scrollAmount, 0)
        : Math.min(scrollPosition + scrollAmount, maxScroll);

    carouselRef.current.scrollTo({
      left: newPosition,
      behavior: "smooth",
    });

    setScrollPosition(newPosition);
  };

  const handleRemoveSearch = async (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    await removeSearchEntry(id);
    setSearchHistory(searchHistory.filter((entry) => entry.id !== id));
  };

  const navigateToSearch = async (
    entry: SearchHistoryEntry & { locationContext?: string }
  ) => {
    const params = new URLSearchParams(entry.query ? { q: entry.query } : {});

    // Add all filters to the search params
    Object.entries(entry.filters).forEach(([key, value]) => {
      if (value) {
        params.append(key, value);
      }
    });

    // Add location context if available and no location filter exists
    if (
      entry.locationContext &&
      !entry.filters.location &&
      !entry.filters.county &&
      !entry.filters.locality
    ) {
      params.append("county", entry.locationContext);
    }

    // Mark this search as successful
    await markSearchAsSuccessful(entry.id);

    // Update local state
    setSearchHistory((prev) =>
      prev.map((item) =>
        item.id === entry.id
          ? {
              ...item,
              isSuccessful: true,
              lastViewed: new Date().toISOString(),
              viewCount: (item.viewCount || 0) + 1,
            }
          : item
      )
    );

    // Navigate to search page
    router.push(`/search?${params.toString()}`);
  };

  // Handle interest response
  const handleInterestResponse = async (
    entry: SearchHistoryEntry,
    interested: boolean,
    e: React.MouseEvent
  ) => {
    e.preventDefault();
    e.stopPropagation();

    // Remove the prompt
    setShowInterestPrompt((prev) => ({
      ...prev,
      [entry.id]: false,
    }));

    if (interested) {
      // If interested, navigate to the search
      navigateToSearch(entry);
    } else {
      // If not interested, remove the search
      await removeSearchEntry(entry.id);
      setSearchHistory(searchHistory.filter((item) => item.id !== entry.id));
    }
  };

  // Get property type icon
  const getPropertyTypeIcon = (type?: string) => {
    if (!type) return <Search className="h-4 w-4" />;

    switch (type) {
      case "Residential":
        return <Home className="h-4 w-4" />;
      case "Commercial":
        return <Building className="h-4 w-4" />;
      case "Industrial":
        return <Factory className="h-4 w-4" />;
      case "Vacational / Social":
      case "Vacational":
      case "Social":
        return <Umbrella className="h-4 w-4" />;
      case "Land":
        return <Map className="h-4 w-4" />;
      default:
        return <Search className="h-4 w-4" />;
    }
  };

  // Format the search entry for display
  const formatSearchEntry = (
    entry: SearchHistoryEntry & { locationContext?: string }
  ): string => {
    const parts = [];

    if (entry.query) {
      parts.push(`"${entry.query}"`);
    }

    const filterParts = [];
    if (entry.filters.status) {
      filterParts.push(entry.filters.status === "sale" ? "For Sale" : "To Let");
    }

    if (entry.filters.propertyType) {
      filterParts.push(entry.filters.propertyType);
    }

    // Location information
    const locationInfo =
      entry.filters.location ||
      entry.filters.county ||
      entry.filters.locality ||
      entry.locationContext;

    if (locationInfo) {
      filterParts.push(locationInfo);
    }

    if (filterParts.length) {
      parts.push(filterParts.join(" • "));
    }

    return parts.join(" - ") || "All Properties";
  };

  // Format the time since last viewed
  const formatTimeSince = (timestamp: string): string => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return "Just now";

    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;

    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h ago`;

    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}d ago`;

    const diffInWeeks = Math.floor(diffInDays / 7);
    if (diffInWeeks < 4) return `${diffInWeeks}w ago`;

    const diffInMonths = Math.floor(diffInDays / 30);
    return `${diffInMonths}mo ago`;
  };

  if (!searchHistory.length) return null;

  return (
    <div className="w-full py-8 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              Recent Searches
            </h2>
            <p className="text-sm text-gray-500">
              Based on your search activity
            </p>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => scroll("left")}
              disabled={scrollPosition <= 0}
              className={`rounded-full p-2 border ${
                scrollPosition <= 0
                  ? "text-gray-300 cursor-not-allowed"
                  : "text-gray-100 bg-blue-300 hover:bg-blue-400 transition-all"
              }`}
              aria-label="Scroll left"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              onClick={() => scroll("right")}
              disabled={scrollPosition >= maxScroll}
              className={`rounded-full p-2 border ${
                scrollPosition >= maxScroll
                  ? "text-gray-300 cursor-not-allowed"
                  : "text-gray-100 bg-blue-300 hover:bg-blue-400 transition-all"
              }`}
              aria-label="Scroll right"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div
          ref={carouselRef}
          className="flex overflow-x-auto scrollbar-hide snap-x snap-mandatory gap-4 pb-4"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {searchHistory.map((entry) => (
            <div key={entry.id} className="snap-start flex-shrink-0 w-[350px]">
              <div
                className={`group relative rounded-lg overflow-hidden border ${
                  entry.isSuccessful ? "border-blue-200" : "border-gray-200"
                } bg-white shadow-sm hover:shadow-md transition-shadow cursor-pointer`}
                onClick={() => navigateToSearch(entry)}
              >
                {/* Images section */}
                <div className="relative h-40 bg-gray-100">
                  {entry.previewImages && entry.previewImages.length > 0 ? (
                    <div className="h-full w-full relative">
                      <Image
                        src={
                          entry.previewImages[0] ||
                          "/placeholder.svg?height=160&width=350"
                        }
                        alt="Property preview"
                        fill
                        className="object-cover"
                      />
                      {/* Property type badge */}
                      {entry.filters.propertyType && (
                        <div className="absolute top-2 left-2 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-md text-xs font-medium flex items-center">
                          {getPropertyTypeIcon(entry.filters.propertyType)}
                          <span className="ml-1">
                            {entry.filters.propertyType}
                          </span>
                        </div>
                      )}
                      {/* Location badge if available */}
                      {(entry.filters.county || entry.locationContext) && (
                        <div className="absolute bottom-2 left-2 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-md text-xs font-medium flex items-center">
                          <MapPin className="h-3 w-3 mr-1" />
                          <span>
                            {entry.filters.county || entry.locationContext}
                          </span>
                        </div>
                      )}

                      {/* Successful search badge */}
                      {entry.isSuccessful && (
                        <div className="absolute top-2 right-2 bg-blue-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                          Viewed
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="h-full w-full relative">
                      <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                        <div className="bg-white/90 rounded-full p-3">
                          <Search className="h-8 w-8 text-gray-500" />
                        </div>
                      </div>
                      {/* Property type badge */}
                      {entry.filters.propertyType && (
                        <div className="absolute top-2 left-2 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-md text-xs font-medium flex items-center">
                          {getPropertyTypeIcon(entry.filters.propertyType)}
                          <span className="ml-1">
                            {entry.filters.propertyType}
                          </span>
                        </div>
                      )}
                      {/* Location badge if available */}
                      {(entry.filters.county || entry.locationContext) && (
                        <div className="absolute bottom-2 left-2 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-md text-xs font-medium flex items-center">
                          <MapPin className="h-3 w-3 mr-1" />
                          <span>
                            {entry.filters.county || entry.locationContext}
                          </span>
                        </div>
                      )}

                      {/* Successful search badge */}
                      {entry.isSuccessful && (
                        <div className="absolute top-2 right-2 bg-blue-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                          Viewed
                        </div>
                      )}
                    </div>
                  )}

                  {/* Remove button */}
                  <button
                    onClick={(e) => handleRemoveSearch(entry.id, e)}
                    className="absolute top-2 right-2 z-10 bg-white/80 rounded-full p-1.5 hover:bg-white"
                    aria-label="Remove search"
                  >
                    <X className="h-4 w-4 text-gray-500" />
                  </button>
                </div>

                {/* Content section */}
                <div className="p-4">
                  <h3 className="font-medium text-gray-900 mb-1">
                    {formatSearchEntry(entry)}
                  </h3>

                  <div className="flex justify-between items-center mb-3">
                    {entry.resultCount !== undefined && (
                      <p className="text-sm text-gray-500">
                        {entry.resultCount}{" "}
                        {entry.resultCount === 1 ? "result" : "results"}
                      </p>
                    )}

                    <div className="flex items-center text-xs text-gray-400">
                      <Clock className="h-3 w-3 mr-1" />
                      <span>
                        {formatTimeSince(entry.lastViewed || entry.timestamp)}
                      </span>

                      {entry.viewCount && entry.viewCount > 1 && (
                        <div className="flex items-center ml-2">
                          <Eye className="h-3 w-3 mr-1" />
                          <span>{entry.viewCount}x</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Interest prompt for old searches */}
                  {showInterestPrompt[entry.id] ? (
                    <div className="mt-2 border-t pt-2 text-sm">
                      <p className="text-gray-600 mb-2">
                        Still interested in this search?
                      </p>
                      <div className="flex space-x-2">
                        <button
                          onClick={(e) =>
                            handleInterestResponse(entry, true, e)
                          }
                          className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-1 rounded-md flex items-center justify-center"
                        >
                          <CheckCircle2 className="h-3 w-3 mr-1" />
                          Yes
                        </button>
                        <button
                          onClick={(e) =>
                            handleInterestResponse(entry, false, e)
                          }
                          className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 py-1 rounded-md flex items-center justify-center"
                        >
                          <XCircle className="h-3 w-3 mr-1" />
                          No
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="text-blue-600 text-sm font-medium">
                      Continue this search
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
