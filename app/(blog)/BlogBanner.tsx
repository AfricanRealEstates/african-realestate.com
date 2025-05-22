"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getPropertyCount } from "./property-count";

export default function BlogBanner() {
  const [propertyCount, setPropertyCount] = useState<number | null>(null);

  useEffect(() => {
    const fetchCount = async () => {
      try {
        const count = await getPropertyCount();
        setPropertyCount(count);
      } catch (error) {
        console.error("Error fetching property count:", error);
        setPropertyCount(0);
      }
    };

    fetchCount();
  }, []);

  // Format the number with commas (e.g., 10,000)
  const formattedCount =
    propertyCount !== null ? propertyCount.toLocaleString() : "10,000"; // Fallback while loading

  return (
    <div
      id="banner"
      tabIndex={-1}
      className="z-50 hidden sm:flex justify-center w-full px-4 py-3 border border-gray-100 bg-neutral-50 lg:py-4"
    >
      <div className="flex flex-col sm:flex-row items-center">
        <p className="text-sm font-medium text-gray-900 text-center sm:text-left my-2 sm:my-0">
          <span className="bg-blue-100 text-ken-primary text-xs font-semibold mr-2 px-2.5 py-0.5 rounded inline-block">
            New
          </span>
          We have posted new properties in addition to our {formattedCount}+
          listings!
          <Link
            href="/properties"
            className="inline-flex items-center ml-2 text-sm font-medium text-ken-primary md:ml-2 hover:underline group"
          >
            Check them out{" "}
            <svg
              className="size-3 ml-1.5 text-blue-600 dark:text-blue-500 transition-transform duration-300 group-hover:translate-x-[2px]"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 14 10"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M1 5h12m0 0L9 1m4 4L9 9"
              ></path>
            </svg>
          </Link>
        </p>
      </div>
    </div>
  );
}
