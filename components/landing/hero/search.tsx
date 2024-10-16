"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2, X, SlidersHorizontal, Search } from "lucide-react";
import { debounce } from "lodash";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { propertyTypes } from "@/constants";

async function searchProperties(
  query: string,
  advancedParams: AdvancedSearchParams
) {
  const params = new URLSearchParams(query ? { q: query } : {});
  Object.entries(advancedParams).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      params.append(key, value.toString());
    }
  });
  try {
    const response = await fetch(`/api/search?${params.toString()}`);
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to fetch: ${response.status} ${errorText}`);
    }
    return response.json();
  } catch (error) {
    console.error("Search error:", error);
    throw error;
  }
}

interface AdvancedSearchParams {
  status?: string;
  minPrice?: number;
  maxPrice?: number;
  propertyType?: string;
  propertyDetails?: string;
  location?: string;
}

function AdvancedSearch({
  onSearch,
  initialParams,
  onApplyFilters,
}: {
  onSearch: (params: AdvancedSearchParams) => void;
  initialParams: AdvancedSearchParams;
  onApplyFilters: (params: AdvancedSearchParams) => void;
}) {
  const [params, setParams] = useState<AdvancedSearchParams>(initialParams);
  const [selectedPropertyType, setSelectedPropertyType] = useState<
    string | undefined
  >(initialParams.propertyType);
  const [minPriceInput, setMinPriceInput] = useState(
    initialParams.minPrice?.toString() || ""
  );
  const [maxPriceInput, setMaxPriceInput] = useState(
    initialParams.maxPrice?.toString() || ""
  );

  const router = useRouter();

  const handleChange = (key: keyof AdvancedSearchParams, value: any) => {
    setParams((prev) => ({ ...prev, [key]: value }));
  };

  const handleApplyFilters = () => {
    const filteredParams = Object.fromEntries(
      Object.entries(params).filter(
        ([_, value]) => value !== undefined && value !== null && value !== ""
      )
    );
    const searchParams = new URLSearchParams(
      filteredParams as Record<string, string>
    );
    router.push(`/search?${searchParams.toString()}`);
  };

  const getPropertyDetails = (propertyType: string) => {
    const selectedType = propertyTypes.find(
      (type) => type.value === propertyType
    );
    return selectedType ? selectedType.subOptions : [];
  };

  const formatPrice = (price: string) => {
    const numericPrice = parseFloat(price.replace(/,/g, ""));
    if (isNaN(numericPrice)) return "";
    return new Intl.NumberFormat("en-US", {
      maximumFractionDigits: 0,
    }).format(numericPrice);
  };

  const handlePriceChange = (type: "minPrice" | "maxPrice", value: string) => {
    const numericValue = parseFloat(value.replace(/,/g, ""));
    if (type === "minPrice") {
      setMinPriceInput(value);
      handleChange("minPrice", isNaN(numericValue) ? undefined : numericValue);
    } else {
      setMaxPriceInput(value);
      handleChange("maxPrice", isNaN(numericValue) ? undefined : numericValue);
    }
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <SlidersHorizontal className="h-4 w-4" />
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Advanced Search</SheetTitle>
          <SheetDescription>
            Refine your property search with advanced filters.
          </SheetDescription>
        </SheetHeader>
        <div className="grid gap-4 py-4">
          {/* Location input */}
          <div className="space-y-2">
            <Label>Location</Label>
            <Input
              type="text"
              placeholder="County, Nearby Town or Locality"
              value={params.location || ""}
              onChange={(e) => handleChange("location", e.target.value)}
            />
          </div>
          {/* Status select */}
          <div className="space-y-2">
            <Label>Status</Label>
            <Select
              value={params.status}
              onValueChange={(value) => handleChange("status", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="sale">For Sale</SelectItem>
                <SelectItem value="let">To Let</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {/* Price range inputs */}
          <div className="space-y-2">
            <Label>
              {params.status === "let" ? "Rent Range" : "Price Range"}
            </Label>
            <div className="flex space-x-2">
              <div className="flex-1">
                <Input
                  type="text"
                  placeholder="Min"
                  value={minPriceInput}
                  onChange={(e) =>
                    handlePriceChange("minPrice", e.target.value)
                  }
                />
                <span className="text-xs text-green-600 px-1 rounded">
                  {formatPrice(minPriceInput)}
                </span>
              </div>
              <div className="flex-1">
                <Input
                  type="text"
                  placeholder="Max"
                  value={maxPriceInput}
                  onChange={(e) =>
                    handlePriceChange("maxPrice", e.target.value)
                  }
                />
                <span className="text-xs text-green-600 px-1 rounded">
                  {formatPrice(maxPriceInput)}
                </span>
              </div>
            </div>
          </div>
          {/* Property Type select */}
          <div className="space-y-2">
            <Label>Property Type</Label>
            <Select
              value={selectedPropertyType}
              onValueChange={(value) => {
                setSelectedPropertyType(value);
                handleChange("propertyType", value);
                handleChange("propertyDetails", undefined);
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select property type" />
              </SelectTrigger>
              <SelectContent>
                {propertyTypes.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          {/* Property Details select */}
          {selectedPropertyType && (
            <div className="space-y-2">
              <Label>Property Details</Label>
              <Select
                value={params.propertyDetails}
                onValueChange={(value) =>
                  handleChange("propertyDetails", value)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select property details" />
                </SelectTrigger>
                <SelectContent>
                  {getPropertyDetails(selectedPropertyType).map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
          <SheetClose asChild>
            <Button
              onClick={handleApplyFilters}
              className="bg-blue-500 hover:bg-blue-600 transition-colors"
            >
              Apply Filters
            </Button>
          </SheetClose>
        </div>
      </SheetContent>
    </Sheet>
  );
}

export default function SearchBar() {
  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState<{ count: number } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [advancedParams, setAdvancedParams] = useState<AdvancedSearchParams>(
    {}
  );
  const router = useRouter();

  const debouncedSearch = useCallback(
    debounce(async (query: string, params: AdvancedSearchParams) => {
      if (query.trim().length >= 3 || Object.keys(params).length > 0) {
        setIsLoading(true);
        setError(null);
        try {
          const data = await searchProperties(query, params);
          setResults(data);
        } catch (error) {
          console.error("Search error:", error);
          setError("An error occurred while searching. Please try again.");
          setResults(null);
        } finally {
          setIsLoading(false);
        }
      } else {
        setResults(null);
      }
    }, 300),
    []
  );

  useEffect(() => {
    debouncedSearch(searchTerm, advancedParams);
    return () => debouncedSearch.cancel();
  }, [searchTerm, advancedParams, debouncedSearch]);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    navigateToSearchPage();
  };

  const navigateToSearchPage = () => {
    if (searchTerm.trim() || Object.keys(advancedParams).length > 0) {
      setIsSubmitting(true);
      try {
        const params = new URLSearchParams(searchTerm ? { q: searchTerm } : {});
        Object.entries(advancedParams).forEach(([key, value]) => {
          if (value !== undefined && value !== null && value !== "") {
            params.append(key, value.toString());
          }
        });
        router.push(`/search?${params.toString()}`);
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const handleClear = () => {
    setSearchTerm("");
    setResults(null);
    setError(null);
    setAdvancedParams({});
  };

  const handleAdvancedSearch = (params: AdvancedSearchParams) => {
    setAdvancedParams(params);
    debouncedSearch(searchTerm, params);
  };

  const handleApplyFilters = (params: AdvancedSearchParams) => {
    setAdvancedParams(params);
    navigateToSearchPage();
  };

  return (
    <form
      onSubmit={handleSearch}
      className="w-full max-w-[560px] mx-auto px-4 sm:px-6 lg:px-8"
    >
      <div className="relative w-full">
        <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-2">
          <div className="relative flex-grow w-full">
            <Input
              type="text"
              placeholder="Search properties..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-white pr-20 pl-10 w-full"
              aria-label="Search properties"
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center space-x-1">
              {searchTerm && (
                <button
                  type="button"
                  onClick={handleClear}
                  className="text-gray-400 hover:text-gray-600"
                  aria-label="Clear search"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
              <button
                type="button"
                className="text-gray-400 hover:text-gray-600"
                aria-label="Advanced search"
              >
                <AdvancedSearch
                  onSearch={handleAdvancedSearch}
                  initialParams={advancedParams}
                  onApplyFilters={handleApplyFilters}
                />
              </button>
            </div>
          </div>
          <Button
            type="submit"
            disabled={
              isSubmitting ||
              (searchTerm.trim().length < 3 &&
                Object.keys(advancedParams).length === 0)
            }
            className="w-full sm:w-auto bg-blue-400 text-white hover:bg-blue-500 transition-all"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                <span className="sr-only">Searching...</span>
              </>
            ) : (
              "Search"
            )}
          </Button>
        </div>
        {isLoading && (
          <div
            className="absolute left-0 right-0 bg-white p-2 shadow-md rounded-b-md mt-2"
            aria-live="polite"
          >
            Loading...
          </div>
        )}
        {error && (
          <div
            className="absolute left-0 right-0 bg-red-100 text-red-800 p-2 shadow-md rounded-b-md mt-2"
            aria-live="assertive"
          >
            {error}
          </div>
        )}
        {results && !isLoading && (
          <div
            className="absolute left-0 right-0 bg-white p-2 shadow-md rounded-b-md mt-2"
            aria-live="polite"
          >
            {results.count}{" "}
            {results.count === 1 ? "property matches" : "properties match"}
          </div>
        )}
      </div>
    </form>
  );
}
