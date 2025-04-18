"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";

type SearchTrackerProps = {
  images?: string[];
};

export default function SearchTracker({ images = [] }: SearchTrackerProps) {
  const searchParams = useSearchParams();

  useEffect(() => {
    // Only track if we have search parameters
    if (!searchParams.toString()) return;

    const location =
      searchParams.get("location") ||
      searchParams.get("county") ||
      "All Locations";
    const type = searchParams.get("status") || "sale";

    // Create a search object
    const search = {
      id: crypto.randomUUID(),
      location,
      type,
      images: images.slice(0, 3), // Store up to 3 images
      timestamp: new Date().toISOString(),
    };

    // Get existing searches
    const existingSearchesJson = localStorage.getItem("recentSearches");
    const existingSearches = existingSearchesJson
      ? JSON.parse(existingSearchesJson)
      : [];

    // Check if this search already exists (by location and type)
    const existingIndex = existingSearches.findIndex(
      (s: any) => s.location === search.location && s.type === search.type
    );

    // If it exists, update it; otherwise add it
    if (existingIndex !== -1) {
      // Update the existing search with new timestamp and images
      existingSearches[existingIndex] = {
        ...existingSearches[existingIndex],
        timestamp: search.timestamp,
        images: search.images.length
          ? search.images
          : existingSearches[existingIndex].images,
      };
    } else {
      // Add the new search
      existingSearches.unshift(search);
    }

    // Keep only the 5 most recent searches
    const updatedSearches = existingSearches.slice(0, 5);

    // Save to localStorage
    localStorage.setItem("recentSearches", JSON.stringify(updatedSearches));

    // Also save to cookies for server-side access
    document.cookie = `recentSearches=${JSON.stringify(updatedSearches)}; path=/; max-age=2592000`; // 30 days
  }, [searchParams, images]);

  return null;
}
