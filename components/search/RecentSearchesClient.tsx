"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { X } from "lucide-react";
import { RecentSearch } from "@/actions/getRecentReaches";

type RecentSearchesClientProps = {
  initialSearches: RecentSearch[];
};

export default function RecentSearchesClient({
  initialSearches,
}: RecentSearchesClientProps) {
  const [searches, setSearches] = useState<RecentSearch[]>(initialSearches);

  // Sync with localStorage on client-side
  useEffect(() => {
    const storedSearches = localStorage.getItem("recentSearches");
    if (storedSearches) {
      setSearches(JSON.parse(storedSearches));
    }
  }, []);

  const removeSearch = (id: string) => {
    const updatedSearches = searches.filter((search) => search.id !== id);
    setSearches(updatedSearches);
    localStorage.setItem("recentSearches", JSON.stringify(updatedSearches));
    document.cookie = `recentSearches=${JSON.stringify(updatedSearches)}; path=/; max-age=2592000`;
  };

  if (!searches.length) {
    return null;
  }

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-8">
      <h2 className="text-xl font-bold text-gray-900 mb-4">
        Based on your recent activity
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {searches.map((search) => (
          <div
            key={search.id}
            className="border border-gray-200 rounded-lg overflow-hidden bg-white shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="relative">
              <button
                onClick={() => removeSearch(search.id)}
                className="absolute right-2 top-2 z-10 bg-white/80 rounded-full p-1 hover:bg-white"
                aria-label="Remove search"
              >
                <X className="h-4 w-4 text-gray-500" />
              </button>

              <div className="flex h-24">
                {search.images && search.images.length > 0 ? (
                  search.images.slice(0, 3).map((image, i) => (
                    <div key={i} className="w-1/3 h-full relative">
                      <Image
                        src={image || "/placeholder.svg"}
                        alt={`Property in ${search.location}`}
                        fill
                        className="object-cover"
                      />
                    </div>
                  ))
                ) : (
                  <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                    <span className="text-gray-400">No images</span>
                  </div>
                )}
              </div>
            </div>

            <div className="p-4">
              <h3 className="font-semibold text-gray-900">{search.location}</h3>
              <p className="text-sm text-gray-500 mb-3">
                For {search.type === "let" ? "Rent" : "Sale"}
              </p>

              <Link
                href={`/properties?location=${encodeURIComponent(search.location)}&status=${search.type}`}
                className="text-blue-600 hover:text-blue-800 text-sm font-medium"
              >
                Continue your search
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
