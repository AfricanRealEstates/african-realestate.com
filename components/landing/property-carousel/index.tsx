"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { PropertyData } from "@/lib/types";
import PropertyCardCompact from "../property-card-compact";

interface PropertyCarouselProps {
  properties: PropertyData[];
  title: string;
  subtitle: string;
}

export default function PropertyCarousel({
  properties,
  title,
  subtitle,
}: PropertyCarouselProps) {
  const [scrollPosition, setScrollPosition] = useState(0);
  const [maxScroll, setMaxScroll] = useState(0);
  const carouselRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (carouselRef.current) {
      const { scrollWidth, clientWidth } = carouselRef.current;
      setMaxScroll(scrollWidth - clientWidth);
    }
  }, [properties]);

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

  if (!properties.length) return null;

  return (
    <div className="w-full py-8 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
            <p className="text-sm text-gray-500">{subtitle}</p>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => scroll("left")}
              disabled={scrollPosition <= 0}
              className={`rounded-full p-2 border transition ${
                scrollPosition <= 0
                  ? "text-gray-300 border-gray-200 cursor-not-allowed"
                  : "text-white bg-blue-300 border-blue-300 hover:bg-blue-400 shadow-md"
              }`}
              aria-label="Scroll left"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              onClick={() => scroll("right")}
              disabled={scrollPosition >= maxScroll}
              className={`rounded-full p-2 border transition ${
                scrollPosition >= maxScroll
                  ? "text-gray-300 border-gray-200 cursor-not-allowed"
                  : "text-white bg-blue-300 border-blue-300 hover:bg-blue-400 shadow-md"
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
          {properties.map((property) => (
            <div
              key={property.id}
              className="snap-start flex-shrink-0 w-[350px]"
            >
              <PropertyCardCompact property={property} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
