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
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

async function searchProperties(
  query: string,
  advancedParams: AdvancedSearchParams
) {
  const params = new URLSearchParams(query ? { q: query } : {});
  Object.entries(advancedParams).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      if (Array.isArray(value)) {
        params.append(key, value.join(","));
      } else {
        params.append(key, value.toString());
      }
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
  status?: string[];
  minBedrooms?: number;
  maxBedrooms?: number;
  minBathrooms?: number;
  maxBathrooms?: number;
  minPrice?: number;
  maxPrice?: number;
  propertyType?: string[];
}

function AdvancedSearch({
  onSearch,
  initialParams,
}: {
  onSearch: (params: AdvancedSearchParams) => void;
  initialParams: AdvancedSearchParams;
}) {
  const [params, setParams] = useState<AdvancedSearchParams>(initialParams);

  const handleChange = (key: keyof AdvancedSearchParams, value: any) => {
    setParams((prev) => ({ ...prev, [key]: value }));
  };

  const handleApplyFilters = () => {
    onSearch(params);
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        {/* <Button variant="outline" size="icon">
        </Button> */}
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
          <div className="space-y-2">
            <Label>Status</Label>
            <div className="flex space-x-4">
              <Checkbox
                id="sale"
                checked={params.status?.includes("sale")}
                onCheckedChange={(checked) => {
                  const newStatus = params.status || [];
                  if (checked) {
                    handleChange("status", [...newStatus, "sale"]);
                  } else {
                    handleChange(
                      "status",
                      newStatus.filter((s) => s !== "sale")
                    );
                  }
                }}
              />
              <Label htmlFor="sale">For Sale</Label>
              <Checkbox
                id="let"
                checked={params.status?.includes("let")}
                onCheckedChange={(checked) => {
                  const newStatus = params.status || [];
                  if (checked) {
                    handleChange("status", [...newStatus, "let"]);
                  } else {
                    handleChange(
                      "status",
                      newStatus.filter((s) => s !== "let")
                    );
                  }
                }}
              />
              <Label htmlFor="let">For Let</Label>
            </div>
          </div>
          <div className="space-y-2">
            <Label>Bedrooms</Label>
            <div className="flex space-x-2">
              <Input
                type="number"
                placeholder="Min"
                value={params.minBedrooms || ""}
                onChange={(e) =>
                  handleChange(
                    "minBedrooms",
                    e.target.value ? parseInt(e.target.value) : undefined
                  )
                }
              />
              <Input
                type="number"
                placeholder="Max"
                value={params.maxBedrooms || ""}
                onChange={(e) =>
                  handleChange(
                    "maxBedrooms",
                    e.target.value ? parseInt(e.target.value) : undefined
                  )
                }
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Bathrooms</Label>
            <div className="flex space-x-2">
              <Input
                type="number"
                placeholder="Min"
                value={params.minBathrooms || ""}
                onChange={(e) =>
                  handleChange(
                    "minBathrooms",
                    e.target.value ? parseInt(e.target.value) : undefined
                  )
                }
              />
              <Input
                type="number"
                placeholder="Max"
                value={params.maxBathrooms || ""}
                onChange={(e) =>
                  handleChange(
                    "maxBathrooms",
                    e.target.value ? parseInt(e.target.value) : undefined
                  )
                }
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Price Range</Label>
            <div className="flex space-x-2">
              <Input
                type="number"
                placeholder="Min"
                value={params.minPrice || ""}
                onChange={(e) =>
                  handleChange(
                    "minPrice",
                    e.target.value ? parseInt(e.target.value) : undefined
                  )
                }
              />
              <Input
                type="number"
                placeholder="Max"
                value={params.maxPrice || ""}
                onChange={(e) =>
                  handleChange(
                    "maxPrice",
                    e.target.value ? parseInt(e.target.value) : undefined
                  )
                }
              />
            </div>
          </div>
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
    if (searchTerm.trim() || Object.keys(advancedParams).length > 0) {
      setIsSubmitting(true);
      try {
        const params = new URLSearchParams(searchTerm ? { q: searchTerm } : {});
        Object.entries(advancedParams).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            params.append(
              key,
              Array.isArray(value) ? value.join(",") : value.toString()
            );
          }
        });
        await router.push(`/search?${params.toString()}`);
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
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        searchParams.append(
          key,
          Array.isArray(value) ? value.join(",") : value.toString()
        );
      }
    });
    router.push(`/search?${searchParams.toString()}`);
  };

  return (
    <form
      onSubmit={handleSearch}
      className="flex w-full max-w-3xl mx-auto items-center space-x-2 relative ml-10"
    >
      <div className="relative w-full max-w-md">
        <div className="relative">
          <Input
            type="text"
            placeholder="Search properties..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-white pr-20 pl-10"
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
              />
            </button>
            {/* <Sheet>
              <SheetTrigger asChild>
                <button
                  type="button"
                  className="text-gray-400 hover:text-gray-600"
                  aria-label="Advanced search"
                >
                  <SlidersHorizontal className="h-4 w-4" />
                </button>
              </SheetTrigger>
              <SheetContent>
                <AdvancedSearch
                  onSearch={handleAdvancedSearch}
                  initialParams={advancedParams}
                />
              </SheetContent>
            </Sheet> */}
          </div>
        </div>
      </div>
      <Button
        type="submit"
        disabled={
          isSubmitting ||
          (searchTerm.trim().length < 3 &&
            Object.keys(advancedParams).length === 0)
        }
        className="min-w-[80px] bg-blue-400 text-white hover:bg-blue-500 transition-all"
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
      {isLoading && (
        <div
          className="absolute top-full left-0 right-0 bg-white p-2 shadow-md rounded-b-md"
          aria-live="polite"
        >
          Loading...
        </div>
      )}
      {error && (
        <div
          className="absolute top-full left-0 right-0 bg-red-100 text-red-800 p-2 shadow-md rounded-b-md"
          aria-live="assertive"
        >
          {error}
        </div>
      )}
      {results && !isLoading && (
        <div
          className="absolute top-full left-0 right-0 bg-white p-2 shadow-md rounded-b-md mt-2"
          aria-live="polite"
        >
          {results.count}{" "}
          {results.count === 1 ? "property matches" : "properties match"}
        </div>
      )}
    </form>
  );
}
