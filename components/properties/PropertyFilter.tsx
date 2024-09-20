"use client";

import React, { useState, useEffect } from "react";
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

// Import the propertyTypes constant
import { properyTypes } from "../../constants/index";

const filterSchema = z.object({
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
  pageType?: "buy" | "let";
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isOpen, setIsOpen] = useState(false);
  const [selectedPropertyType, setSelectedPropertyType] = useState("");
  const [activeFilters, setActiveFilters] = useState<FilterValues>({});

  const { control, handleSubmit, watch, reset } = useForm<FilterValues>({
    resolver: zodResolver(filterSchema),
    defaultValues: {
      propertyType: searchParams.get("propertyType") || "",
      propertyDetails: searchParams.get("propertyDetails") || "",
      county: searchParams.get("county") || "",
      locality: searchParams.get("locality") || "",
      minPrice: searchParams.get("minPrice") || "",
      maxPrice: searchParams.get("maxPrice") || "",
    },
  });

  const watchPropertyType = watch("propertyType");

  useEffect(() => {
    const subscription = watch((value) => {
      setActiveFilters(value);
    });
    return () => subscription.unsubscribe();
  }, [watch]);

  const onSubmit = (data: FilterValues) => {
    const params = new URLSearchParams(searchParams);
    Object.entries(data).forEach(([key, value]) => {
      if (value) {
        params.set(key, value.toString());
      } else {
        params.delete(key);
      }
    });
    router.push(`/${pageType}?${params.toString()}`);
    setIsOpen(false);
  };

  const clearFilters = () => {
    reset();
    setActiveFilters({});
    router.push(`/${pageType}`);
  };

  const removeFilter = (key: keyof FilterValues) => {
    const newFilters = { ...activeFilters };
    delete newFilters[key];
    setActiveFilters(newFilters);
    const params = new URLSearchParams(searchParams);
    params.delete(key);
    router.push(`/${pageType}?${params.toString()}`);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {Object.entries(activeFilters).map(([key, value]) => {
          if (value) {
            return (
              <Badge key={key} variant="secondary" className="text-sm">
                {key}: {value}
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
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Filter Properties</SheetTitle>
            <SheetDescription>
              Use the form below to filter properties based on your preferences.
            </SheetDescription>
          </SheetHeader>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-4">
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
                      {properyTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
            {watchPropertyType && (
              <div>
                <Label htmlFor="propertyDetails">Property Details</Label>
                <Controller
                  name="propertyDetails"
                  control={control}
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select property details" />
                      </SelectTrigger>
                      <SelectContent>
                        {properyTypes
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
            <div>
              <Label htmlFor="minPrice">Minimum Price</Label>
              <Controller
                name="minPrice"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    type="number"
                    placeholder="Enter minimum price"
                  />
                )}
              />
            </div>
            <div>
              <Label htmlFor="maxPrice">Maximum Price</Label>
              <Controller
                name="maxPrice"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    type="number"
                    placeholder="Enter maximum price"
                  />
                )}
              />
            </div>
            <Button
              type="submit"
              className="bg-blue-500 hover:bg-blue-600 transition-colors"
            >
              Apply Filters
            </Button>
          </form>
        </SheetContent>
      </Sheet>
    </div>
  );
}
