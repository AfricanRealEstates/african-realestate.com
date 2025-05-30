"use client";
import { useState, useEffect } from "react";
import { Sparkles, TrendingUp, Filter, Clock } from "lucide-react";
import type { PropertyData } from "@/lib/types";
import PropertyCardEnhanced from "./property-card-enhanced";

interface FeaturedPropertiesClientProps {
  properties: PropertyData[];
  isPersonalized: boolean;
  newPropertiesCount: number;
}

export default function FeaturedPropertiesClient({
  properties,
  isPersonalized,
  newPropertiesCount,
}: FeaturedPropertiesClientProps) {
  const [displayedProperties, setDisplayedProperties] = useState(properties);
  const [sortBy, setSortBy] = useState<
    "recommended" | "price" | "newest" | "popular"
  >("recommended");
  const [showFilters, setShowFilters] = useState(false);
  const [activePropertyType, setActivePropertyType] = useState<string | null>(
    null
  );
  const [showNewOnly, setShowNewOnly] = useState(false);

  // Apply sorting and filtering
  useEffect(() => {
    let filtered = [...properties];

    // Apply new properties filter
    if (showNewOnly) {
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      filtered = filtered.filter(
        (property) => new Date(property.createdAt) >= sevenDaysAgo
      );
    }

    // Apply property type filter if active
    if (activePropertyType) {
      filtered = filtered.filter(
        (property) => property.propertyType === activePropertyType
      );
    }

    // Apply sorting
    switch (sortBy) {
      case "price":
        // Group by currency and sort within each group
        const currencyGroups: Record<string, PropertyData[]> = {};

        filtered.forEach((property) => {
          if (!currencyGroups[property.currency]) {
            currencyGroups[property.currency] = [];
          }
          currencyGroups[property.currency].push(property);
        });

        Object.keys(currencyGroups).forEach((currency) => {
          currencyGroups[currency].sort((a, b) => a.price - b.price);
        });

        const priorityCurrencies = ["USD", "KES", "EUR", "GBP"];
        const sortedByCurrency: PropertyData[] = [];

        priorityCurrencies.forEach((currency) => {
          if (currencyGroups[currency]) {
            sortedByCurrency.push(...currencyGroups[currency]);
            delete currencyGroups[currency];
          }
        });

        Object.values(currencyGroups).forEach((group) => {
          sortedByCurrency.push(...group);
        });

        filtered = sortedByCurrency;
        break;

      case "newest":
        filtered.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        break;

      case "popular":
        filtered.sort((a, b) => {
          const aScore = (a.views.length || 0) + (a.likes?.length || 0) * 2;
          const bScore = (b.views.length || 0) + (b.likes?.length || 0) * 2;
          return bScore - aScore;
        });
        break;

      case "recommended":
      default:
        // Keep original personalized order
        break;
    }

    setDisplayedProperties(filtered);
  }, [sortBy, properties, activePropertyType, showNewOnly]);

  // Get unique property types
  const propertyTypes = Array.from(
    new Set(properties.map((p) => p.propertyType))
  );

  if (properties.length === 0) {
    return (
      <div className="flex flex-col items-center gap-6 text-center py-12">
        <div className="p-4 bg-gray-100 rounded-full">
          <svg
            className="h-12 w-12 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
            />
          </svg>
        </div>
        <div>
          <h3 className="text-2xl font-bold tracking-tight text-gray-900 mb-2">
            No featured listings at the moment
          </h3>
          <p className="text-gray-600">
            Check back soon for new property recommendations!
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Enhanced Sort and Filter Controls */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            {isPersonalized ? (
              <>
                <Sparkles className="h-4 w-4 text-blue-500" />
                <span>Personalized for you</span>
              </>
            ) : (
              <>
                <TrendingUp className="h-4 w-4 text-gray-500" />
                <span>Popular properties</span>
              </>
            )}
          </div>
          <div className="text-sm text-gray-500">•</div>
          <div className="text-sm text-gray-600">
            {displayedProperties.length} properties
          </div>
          {newPropertiesCount > 0 && (
            <>
              <div className="text-sm text-gray-500">•</div>
              <div className="flex items-center gap-1 text-sm text-green-600">
                <Clock className="h-3 w-3" />
                <span>{newPropertiesCount} new</span>
              </div>
            </>
          )}
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          <select
            value={sortBy}
            onChange={(e) =>
              setSortBy(
                e.target.value as "recommended" | "price" | "newest" | "popular"
              )
            }
            className="text-sm border border-gray-300 rounded-lg px-3 py-2 bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="recommended">
              {isPersonalized ? "Recommended" : "Featured"}
            </option>
            <option value="newest">Newest First</option>
            <option value="popular">Most Popular</option>
            <option value="price">Price: Low to High</option>
          </select>

          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-2 text-sm border rounded-lg px-3 py-2 transition-colors ${
              showFilters
                ? "bg-blue-500 text-white border-blue-500"
                : "border-gray-300 bg-white text-gray-600 hover:bg-gray-50"
            }`}
          >
            <Filter className="h-4 w-4" />
            Filters
          </button>
        </div>
      </div>

      {/* Enhanced Filters */}
      {showFilters && (
        <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm space-y-4">
          <div>
            <h4 className="font-medium text-gray-700 mb-3">Property Type</h4>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setActivePropertyType(null)}
                className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                  activePropertyType === null
                    ? "bg-blue-500 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                All Types
              </button>
              {propertyTypes.map((type) => (
                <button
                  key={type}
                  onClick={() => setActivePropertyType(type)}
                  className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                    activePropertyType === type
                      ? "bg-blue-500 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          {newPropertiesCount > 0 && (
            <div>
              <h4 className="font-medium text-gray-700 mb-3">Listing Age</h4>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={showNewOnly}
                  onChange={(e) => setShowNewOnly(e.target.checked)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700 flex items-center gap-1">
                  <Clock className="h-4 w-4 text-green-500" />
                  Show only new properties (last 7 days)
                </span>
              </label>
            </div>
          )}
        </div>
      )}

      {/* Properties Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {displayedProperties.slice(0, 6).map((property, index) => {
          const isNew = (() => {
            const sevenDaysAgo = new Date();
            sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
            return new Date(property.createdAt) >= sevenDaysAgo;
          })();

          return (
            <div key={property.id} className="relative">
              {/* {isNew && (
                <div className="absolute top-2 left-2 z-10 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full flex items-center">
                  <Clock className="size-3 mr-1" />
                  New
                </div>
              )} */}
              <PropertyCardEnhanced
                property={property as any}
                isRecommended={isPersonalized}
                index={index}
                showRecommendationBadge={isPersonalized && index < 3}
              />
            </div>
          );
        })}
      </div>

      {/* Empty State */}
      {displayedProperties.length === 0 && (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <Filter className="h-6 w-6 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-1">
            No properties match your filters
          </h3>
          <p className="text-gray-500 mb-4">
            Try changing your filter criteria
          </p>
          <button
            onClick={() => {
              setActivePropertyType(null);
              setShowNewOnly(false);
              setSortBy("recommended");
            }}
            className="text-blue-500 font-medium hover:underline"
          >
            Reset filters
          </button>
        </div>
      )}

      {/* Enhanced Personalization Insights */}
      {isPersonalized && displayedProperties.length > 0 && (
        <div className="mt-8 bg-white/80 backdrop-blur-sm border border-blue-200 rounded-xl p-6">
          <div className="flex items-start gap-4">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Sparkles className="h-5 w-5 text-blue-600" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900 mb-2">
                Why these properties?
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span>Based on your viewing history</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>Matches your search preferences</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  <span>Similar to properties you liked</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                  <span>Fresh listings in your area</span>
                </div>
              </div>
              <div className="mt-3 text-xs text-gray-500">
                Your recommendations improve as you interact with more
                properties
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
