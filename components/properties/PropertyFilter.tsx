"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";

import { propertyTypes } from "../../constants/index";
import { trackSearchHistory } from "@/actions/trackSearchHistory";

const filterSchema = z.object({
  status: z.string().optional(),
  propertyType: z.string().optional(),
  propertyDetails: z.string().optional(),
  county: z.string().optional(),
  locality: z.string().optional(),
  minPrice: z.string().optional(),
  maxPrice: z.string().optional(),
});

type FilterValues = z.infer<typeof filterSchema>;

export default function PropertyFilter({
  pageType = "buy",
}: {
  pageType?: "buy" | "let" | "search" | "properties";
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isOpen, setIsOpen] = useState(false);
  const [selectedPropertyType, setSelectedPropertyType] = useState("");
  const [activeFilters, setActiveFilters] = useState<FilterValues>({});

  const { control, handleSubmit, watch, reset, setValue } =
    useForm<FilterValues>({
      resolver: zodResolver(filterSchema),
      defaultValues: {
        status:
          pageType === "buy"
            ? "sale"
            : pageType === "let"
              ? "let"
              : searchParams.get("status") || undefined,
        propertyType: searchParams.get("propertyType") || "",
        propertyDetails: searchParams.get("propertyDetails") || "",
        county: searchParams.get("county") || "",
        locality: searchParams.get("locality") || "",
        minPrice: searchParams.get("minPrice") || "",
        maxPrice: searchParams.get("maxPrice") || "",
      },
    });

  const watchPropertyType = watch("propertyType");
  const watchMinPrice = watch("minPrice");
  const watchMaxPrice = watch("maxPrice");

  useEffect(() => {
    const filters: FilterValues = {};
    searchParams.forEach((value, key) => {
      if (key in filterSchema.shape) {
        filters[key as keyof FilterValues] = value;
      }
    });
    setActiveFilters(filters);
  }, [searchParams]);

  const convertPriceToCents = (price: string): number => {
    // Remove commas and convert to a number
    const numericPrice = Number.parseFloat(price.replace(/,/g, ""));
    // Return the numeric price as is, without multiplying by 100
    return Math.round(numericPrice);
  };

  const onSubmit = async (data: FilterValues) => {
    const params = new URLSearchParams(searchParams);
    const filters: Record<string, string> = {};
    let hasChanges = false;

    Object.entries(data).forEach(([key, value]) => {
      if (value) {
        if (key === "county" || key === "locality") {
          params.set(key, value.toLowerCase());
          filters[key] = value.toLowerCase();
          hasChanges = true;
        } else if (key === "minPrice" || key === "maxPrice") {
          // Convert price to whole number
          const wholeNumberValue = convertPriceToCents(value);
          if (!isNaN(wholeNumberValue)) {
            params.set(key, wholeNumberValue.toString());
            filters[key] = wholeNumberValue.toString();
            hasChanges = true;
          } else {
            params.delete(key);
          }
        } else {
          params.set(key, value.toString());
          filters[key] = value.toString();
          hasChanges = true;
        }
      } else {
        params.delete(key);
      }
    });

    setActiveFilters(data);

    // Only track this filter selection if there are actual changes
    if (hasChanges) {
      // Fetch some property images to use as preview images
      let previewImages: string[] = [];
      try {
        const response = await fetch(
          `/api/properties/preview?${params.toString()}`
        );
        if (response.ok) {
          const data = await response.json();
          previewImages = data.previewImages || [];
        }
      } catch (error) {
        console.error("Error fetching preview images:", error);
      }

      // Track search history with the filter selection
      await trackSearchHistory("", filters, undefined, previewImages);
    }

    router.push(`/${pageType}?${params.toString()}`);
    setIsOpen(false);
  };

  // Update the useEffect hook to use the price values as is
  useEffect(() => {
    const filters: FilterValues = {};
    searchParams.forEach((value, key) => {
      if (key in filterSchema.shape) {
        filters[key as keyof FilterValues] = value;
      }
    });
    setActiveFilters(filters);
  }, [searchParams]);

  // Update the formatPrice function to handle large numbers
  const formatPrice = (price: string) => {
    const numericPrice = Number.parseFloat(price.replace(/,/g, ""));
    if (isNaN(numericPrice)) return "";
    return new Intl.NumberFormat("en-US", {
      maximumFractionDigits: 0,
    }).format(numericPrice);
  };

  const clearFilters = () => {
    reset({
      status:
        pageType === "buy" ? "sale" : pageType === "let" ? "let" : undefined,
    });
    setActiveFilters({});
    router.push(`/${pageType}`);
  };

  const removeFilter = (key: keyof FilterValues) => {
    if (key === "status" && (pageType === "buy" || pageType === "let")) {
      return; // Prevent removing status filter for buy and let pages
    }
    const newFilters = { ...activeFilters };
    delete newFilters[key];
    setActiveFilters(newFilters);
    setValue(key, undefined);
    const params = new URLSearchParams(searchParams);
    params.delete(key);
    router.push(`/${pageType}?${params.toString()}`);
  };

  const handlePriceChange = (type: "minPrice" | "maxPrice", value: string) => {
    const numericValue = value.replace(/,/g, "");
    setValue(type, numericValue);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2 mt-2">
        {Object.entries(activeFilters).map(([key, value]) => {
          if (value && (key !== "status" || pageType === "search")) {
            return (
              <Badge key={key} variant="secondary" className="text-sm">
                {key}:{" "}
                {key === "minPrice" || key === "maxPrice"
                  ? formatPrice(value)
                  : value}
                <Button
                  variant="ghost"
                  size="sm"
                  className="ml-2 h-auto p-0"
                  onClick={() => removeFilter(key as keyof FilterValues)}
                >
                  <X className="h-4 w-4" />
                  <span className="sr-only">Remove</span>
                </Button>
              </Badge>
            );
          }
          return null;
        })}
        {Object.keys(activeFilters).length > 0 && (
          <Button variant="outline" size="sm" onClick={clearFilters}>
            Clear All
          </Button>
        )}
      </div>
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild className="mb-8">
          <Button variant="outline">Filter Properties</Button>
        </SheetTrigger>
        <SheetContent className="flex flex-col h-full">
          <SheetHeader>
            <SheetTitle>Filter Properties</SheetTitle>
            <SheetDescription>
              Use the form below to filter properties based on your preferences.
            </SheetDescription>
          </SheetHeader>
          <div className="flex-grow overflow-y-auto">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-4">
              {/* Status field */}
              <div>
                <Label htmlFor="status">Status</Label>
                <Controller
                  name="status"
                  control={control}
                  render={({ field }) => (
                    <Select
                      onValueChange={field.onChange}
                      value={field.value || ""}
                      disabled={pageType === "buy" || pageType === "let"}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="sale">For Sale</SelectItem>
                        <SelectItem value="let">To Let</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>
              {/* Property Type field */}
              <div>
                <Label htmlFor="propertyType">Property Type</Label>
                <Controller
                  name="propertyType"
                  control={control}
                  render={({ field }) => (
                    <Select
                      onValueChange={(value) => {
                        field.onChange(value);
                        setSelectedPropertyType(value);
                      }}
                      value={field.value}
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
                  )}
                />
              </div>
              {/* Property Details field */}
              {watchPropertyType && (
                <div>
                  <Label htmlFor="propertyDetails">Property Details</Label>
                  <Controller
                    name="propertyDetails"
                    control={control}
                    render={({ field }) => (
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select property details" />
                        </SelectTrigger>
                        <SelectContent>
                          {propertyTypes
                            .find((type) => type.value === watchPropertyType)
                            ?.subOptions.map((subOption) => (
                              <SelectItem
                                key={subOption.value}
                                value={subOption.value}
                              >
                                {subOption.label}
                              </SelectItem>
                            ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                </div>
              )}
              {/* County field */}
              <div>
                <Label htmlFor="county">County</Label>
                <Controller
                  name="county"
                  control={control}
                  render={({ field }) => (
                    <Input {...field} placeholder="Enter county" />
                  )}
                />
              </div>
              {/* Locality field */}
              <div>
                <Label htmlFor="locality">Locality</Label>
                <Controller
                  name="locality"
                  control={control}
                  render={({ field }) => (
                    <Input {...field} placeholder="Enter locality" />
                  )}
                />
              </div>
              {/* Minimum Price field */}
              <div>
                <Label htmlFor="minPrice">Minimum Price</Label>
                <Controller
                  name="minPrice"
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      type="text"
                      placeholder="Enter minimum price"
                      onChange={(e) =>
                        handlePriceChange("minPrice", e.target.value)
                      }
                    />
                  )}
                />
                <span className="text-xs text-green-600 focus:shadow-[0_0_0_2px] focus:shadow-green-600 outline-none cursor-default">
                  {formatPrice(watchMinPrice || "")}
                </span>
              </div>
              {/* Maximum Price field */}
              <div>
                <Label htmlFor="maxPrice">Maximum Price</Label>
                <Controller
                  name="maxPrice"
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      type="text"
                      placeholder="Enter maximum price"
                      onChange={(e) =>
                        handlePriceChange("maxPrice", e.target.value)
                      }
                    />
                  )}
                />
                <span className="text-xs text-green-600 focus:shadow-[0_0_0_2px] focus:shadow-green-600 outline-none cursor-default">
                  {formatPrice(watchMaxPrice || "")}
                </span>
              </div>
            </form>
          </div>
          <div className="mt-auto pt-4">
            <Button
              type="submit"
              className="w-full bg-blue-500 hover:bg-blue-600 transition-colors"
              onClick={handleSubmit(onSubmit)}
            >
              Apply Filters
            </Button>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
