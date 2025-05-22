"use client";

import type React from "react";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { ChevronLeft, ChevronRight, X, Search } from "lucide-react";
import type { SearchHistoryEntry } from "@/actions/trackSearchHistory";
import { removeSearchEntry } from "@/actions/trackSearchHistory";

interface SearchHistoryCarouselClientProps {
  initialHistory: SearchHistoryEntry[];
}

export default function SearchHistoryCarouselClient({
  initialHistory,
}: SearchHistoryCarouselClientProps) {
  const [searchHistory, setSearchHistory] = useState(initialHistory);
  const [scrollPosition, setScrollPosition] = useState(0);
  const [maxScroll, setMaxScroll] = useState(0);
  const carouselRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    if (carouselRef.current) {
      const { scrollWidth, clientWidth } = carouselRef.current;
      setMaxScroll(scrollWidth - clientWidth);
    }
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

  const navigateToSearch = (entry: SearchHistoryEntry) => {
    const params = new URLSearchParams(entry.query ? { q: entry.query } : {});

    // Add all filters to the search params
    Object.entries(entry.filters).forEach(([key, value]) => {
      if (value) {
        params.append(key, value);
      }
    });

    router.push(`/search?${params.toString()}`);
  };

  // Format the search entry for display
  const formatSearchEntry = (entry: SearchHistoryEntry): string => {
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

    if (
      entry.filters.location ||
      entry.filters.county ||
      entry.filters.locality
    ) {
      filterParts.push(
        entry.filters.location || entry.filters.county || entry.filters.locality
      );
    }

    if (filterParts.length) {
      parts.push(filterParts.join(" • "));
    }

    return parts.join(" - ") || "All Properties";
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
                  ? "text-gray-300  cursor-not-allowed"
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
                  ? "text-gray-300  cursor-not-allowed"
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
                className="group relative rounded-lg overflow-hidden border border-gray-200 bg-white shadow-sm hover:shadow-md transition-shadow cursor-pointer"
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
                    </div>
                  ) : (
                    <div className="h-full w-full relative">
                      <Image
                        src="/assets/house-1.jpg"
                        alt="Property search"
                        fill
                        className="object-cover bg-gray-100"
                      />
                      <div className="absolute inset-0 flex items-center justify-center bg-black/10">
                        <div className="bg-white/90 rounded-full p-3">
                          <Search className="h-8 w-8 text-gray-500" />
                        </div>
                      </div>
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

                  {entry.resultCount !== undefined && (
                    <p className="text-sm text-gray-500 mb-3">
                      {entry.resultCount}{" "}
                      {entry.resultCount === 1 ? "result" : "results"}
                    </p>
                  )}

                  <div className="text-blue-600 text-sm font-medium">
                    Continue this search
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
