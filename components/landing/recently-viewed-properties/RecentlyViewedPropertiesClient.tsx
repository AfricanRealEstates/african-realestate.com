"use client";

import type React from "react";

import { useEffect, useState } from "react";
import { Lexend } from "next/font/google";
import { PropertySkeletonGrid } from "../featured-properties/PropertySkeletonGrid";

const lexend = Lexend({
  subsets: ["latin"],
  weight: ["600"],
});

export default function RecentlyViewedPropertiesClient({
  children,
}: {
  children: React.ReactNode;
}) {
  const [loading, setLoading] = useState(true);
  const [hasProperties, setHasProperties] = useState(false);

  useEffect(() => {
    // Function to load property IDs from localStorage
    const loadPropertyIds = () => {
      try {
        const storedProperties = localStorage.getItem(
          "recentlyViewedProperties"
        );
        return storedProperties ? JSON.parse(storedProperties) : [];
      } catch (error) {
        console.error("Error loading recently viewed properties:", error);
        return [];
      }
    };

    // Check if there are any recently viewed properties
    const propertyIds = loadPropertyIds();
    setHasProperties(propertyIds.length > 0);
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div className="border-b border-neutral-100 mb-4 text-[#4e4e4e]">
        <div className="mx-auto w-[95%] max-w-7xl px-2 py-16 md:px-2 md:py-12 lg:py-16">
          <PropertySkeletonGrid count={3} />
        </div>
      </div>
    );
  }

  if (!hasProperties) {
    return null;
  }

  return (
    <div className="border-b border-neutral-100 mb-4 text-[#4e4e4e]">
      <div className="mx-auto w-[95%] max-w-7xl px-2 py-16 md:px-2 md:py-12 lg:py-16">
        <section className="flex items-center justify-start gap-8 flex-col w-full">
          <div className="flex flex-col items-center justify-center gap-2">
            <p
              className={`text-[12px] uppercase text-blue-600 font-semibold leading-relaxed ${lexend.className}`}
            >
              Based on properties you recently viewed
            </p>
            <h2
              className={`${lexend.className} text-center tracking-tight text-3xl font-bold sm:text-4xl my-1`}
            >
              Continue Exploring
            </h2>
          </div>

          {children}
        </section>
      </div>
    </div>
  );
}
