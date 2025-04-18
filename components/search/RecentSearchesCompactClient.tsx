"use client";

import type React from "react";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { X } from "lucide-react";
import { RecentSearch } from "@/actions/getRecentReaches";

type RecentSearchesCompactClientProps = {
  initialSearches: RecentSearch[];
};

export default function RecentSearchesCompactClient({
  initialSearches,
}: RecentSearchesCompactClientProps) {
  const [searches, setSearches] = useState<RecentSearch[]>(initialSearches);

  // Sync with localStorage on client-side
  useEffect(() => {
    const storedSearches = localStorage.getItem("recentSearches");
    if (storedSearches) {
      setSearches(JSON.parse(storedSearches));
    }
  }, []);

  const removeSearch = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const updatedSearches = searches.filter((search) => search.id !== id);
    setSearches(updatedSearches);
    localStorage.setItem("recentSearches", JSON.stringify(updatedSearches));
    document.cookie = `recentSearches=${JSON.stringify(updatedSearches)}; path=/; max-age=2592000`;
  };

  if (!searches.length) {
    return null;
  }

  // Just show the most recent search
  const mostRecentSearch = searches[0];

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-6">
      <h2 className="text-xl font-bold text-gray-900 mb-4">
        Based on your recent activity
      </h2>

      <div className="max-w-md border border-gray-200 rounded-lg overflow-hidden bg-white shadow-sm">
        <Link
          href={`/properties?location=${encodeURIComponent(mostRecentSearch.location)}&status=${mostRecentSearch.type}`}
          className="block"
        >
          <div className="flex p-4">
            <div className="flex space-x-1 mr-4">
              {mostRecentSearch.images && mostRecentSearch.images.length > 0 ? (
                mostRecentSearch.images.slice(0, 3).map((image, i) => (
                  <div
                    key={i}
                    className="w-20 h-20 relative rounded overflow-hidden"
                  >
                    <Image
                      src={image || "/placeholder.svg"}
                      alt={`Property in ${mostRecentSearch.location}`}
                      fill
                      className="object-cover"
                    />
                  </div>
                ))
              ) : (
                <div className="w-20 h-20 bg-gray-100 flex items-center justify-center rounded">
                  <span className="text-gray-400 text-xs">No image</span>
                </div>
              )}
            </div>

            <div className="flex-1">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold text-gray-900">
                    {mostRecentSearch.location}
                  </h3>
                  <p className="text-sm text-gray-500">
                    For {mostRecentSearch.type === "let" ? "Rent" : "Sale"}
                  </p>
                </div>

                <button
                  onClick={(e) => removeSearch(mostRecentSearch.id, e)}
                  className="text-gray-400 hover:text-gray-600"
                  aria-label="Remove search"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="mt-4">
                <span className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                  Continue your search
                </span>
              </div>
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
}
