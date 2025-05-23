"use client";

import { useState, useRef, useEffect } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Eye,
  Clock,
  TrendingUp,
  Sparkles,
} from "lucide-react";
import type { PropertyData } from "@/lib/types";
import PropertyCardEnhanced from "../recently-viewed-properties/PropertyCardEnhanced";

interface RecentlyViewedCarouselProps {
  recentlyViewed: PropertyData[];
  recommendations: PropertyData[];
  isLoggedIn: boolean;
}

export default function RecentlyViewedCarousel({
  recentlyViewed,
  recommendations,
  isLoggedIn,
}: RecentlyViewedCarouselProps) {
  const [activeTab, setActiveTab] = useState<"recent" | "recommended">(
    "recent"
  );
  const [scrollPosition, setScrollPosition] = useState(0);
  const [maxScroll, setMaxScroll] = useState(0);
  const carouselRef = useRef<HTMLDivElement>(null);

  // Switch to recommendations if no recent properties
  useEffect(() => {
    if (!recentlyViewed.length && recommendations.length) {
      setActiveTab("recommended");
    }
  }, [recentlyViewed.length, recommendations.length]);

  useEffect(() => {
    if (carouselRef.current) {
      const { scrollWidth, clientWidth } = carouselRef.current;
      setMaxScroll(scrollWidth - clientWidth);
    }
  }, [activeTab, recentlyViewed, recommendations]);

  const scroll = (direction: "left" | "right") => {
    if (!carouselRef.current) return;

    const { clientWidth } = carouselRef.current;
    const scrollAmount = clientWidth * 0.8;

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

  const currentProperties =
    activeTab === "recent" ? recentlyViewed : recommendations;

  if (!recentlyViewed.length && !recommendations.length) return null;

  return (
    <div className="border-t border-gray-50">
      <section className="w-full py-12">
        <div className="max-w-7xl mx-auto px-4">
          {/* Header with tabs */}
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8">
            <div className="mb-4 lg:mb-0">
              <div className="flex items-center gap-2 mb-2">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Eye className="h-5 w-5 text-blue-600" />
                </div>
                <h2 className="text-3xl font-bold text-gray-900">
                  Continue Your Journey
                </h2>
              </div>
              <p className="text-gray-600">
                {activeTab === "recent"
                  ? "Pick up where you left off"
                  : "Discover properties tailored just for you"}
              </p>
            </div>

            {/* Tab Navigation */}
            {recentlyViewed.length > 0 && recommendations.length > 0 && (
              <div className="flex bg-white rounded-lg p-1 shadow-sm border">
                <button
                  onClick={() => setActiveTab("recent")}
                  className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${
                    activeTab === "recent"
                      ? "bg-blue-500 text-white shadow-sm"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  <Clock className="h-4 w-4" />
                  Recently Viewed ({recentlyViewed.length})
                </button>
                <button
                  onClick={() => setActiveTab("recommended")}
                  className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${
                    activeTab === "recommended"
                      ? "bg-blue-500 text-white shadow-sm"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  <Sparkles className="h-4 w-4" />
                  For You ({recommendations.length})
                </button>
              </div>
            )}

            {/* Scroll Controls */}
            <div className="flex space-x-2 mt-4 lg:mt-0">
              <button
                onClick={() => scroll("left")}
                disabled={scrollPosition <= 0}
                className={`rounded-full p-3 border transition-all ${
                  scrollPosition <= 0
                    ? "text-gray-300 border-gray-200 cursor-not-allowed"
                    : "text-white bg-blue-500 border-blue-500 hover:bg-blue-600 shadow-lg hover:shadow-xl"
                }`}
                aria-label="Scroll left"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                onClick={() => scroll("right")}
                disabled={scrollPosition >= maxScroll}
                className={`rounded-full p-3 border transition-all ${
                  scrollPosition >= maxScroll
                    ? "text-gray-300 border-gray-200 cursor-not-allowed"
                    : "text-white bg-blue-500 border-blue-500 hover:bg-blue-600 shadow-lg hover:shadow-xl"
                }`}
                aria-label="Scroll right"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Properties Carousel */}
          <div
            ref={carouselRef}
            className="flex overflow-x-auto scrollbar-hide snap-x snap-mandatory gap-6 pb-4"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {currentProperties.map((property, index) => (
              <div
                key={property.id}
                className="snap-start flex-shrink-0 w-[380px]"
              >
                <PropertyCardEnhanced
                  property={property}
                  isRecommended={activeTab === "recommended"}
                  viewedRecently={activeTab === "recent"}
                  index={index}
                />
              </div>
            ))}
          </div>

          {/* Engagement Footer */}
          <div className="mt-8 text-center">
            <div className="inline-flex items-center gap-2 bg-white px-6 py-3 rounded-full shadow-sm border">
              <TrendingUp className="h-4 w-4 text-blue-500" />
              <span className="text-sm text-gray-600">
                {isLoggedIn
                  ? "We're learning your preferences to show better recommendations"
                  : "Sign up to get personalized property recommendations"}
              </span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
