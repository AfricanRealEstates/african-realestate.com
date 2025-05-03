"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import {
  ArrowRight,
  Info,
  Home,
  Building,
  Warehouse,
  MapPin,
  DollarSign,
  Key,
  Palmtree,
  Map,
  FileText,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface PropertyType {
  value: string;
  label: string;
  subOptions: {
    value: string;
    label: string;
  }[];
}

interface PropertyStatus {
  value: string;
  label: string;
}

interface Guide {
  id: string;
  title: string;
  slug: string;
  propertyType: string;
  guideType: string;
  coverImage: string | null;
  published: boolean;
}

interface GuidesContentProps {
  propertyTypes: PropertyType[];
  propertyStatuses: PropertyStatus[];
  guides: Guide[];
}

export default function GuidesContent({
  propertyTypes,
  propertyStatuses,
  guides,
}: GuidesContentProps) {
  const [activeType, setActiveType] = useState(propertyTypes[0].value);
  const [activeStatus, setActiveStatus] = useState("sale");
  const [isClient, setIsClient] = useState(false);

  // Prevent hydration mismatch
  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return null;
  }

  // Get icon based on property type
  const getTypeIcon = (type: string) => {
    switch (type) {
      case "Residential":
        return <Home className="h-5 w-5" />;
      case "Commercial":
        return <Building className="h-5 w-5" />;
      case "Industrial":
        return <Warehouse className="h-5 w-5" />;
      case "Vacational / Social":
        return <Palmtree className="h-5 w-5" />;
      case "Land":
        return <Map className="h-5 w-5" />;
      default:
        return <MapPin className="h-5 w-5" />;
    }
  };

  // Get icon based on property status
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "sale":
        return <DollarSign className="h-5 w-5" />;
      case "rent":
        return <Key className="h-5 w-5" />;
      case "sell":
        return <FileText className="h-5 w-5" />;
      default:
        return <DollarSign className="h-5 w-5" />;
    }
  };

  // Filter guides based on active type and status
  const filteredGuides = guides.filter(
    (guide) =>
      guide.propertyType === activeType && guide.guideType === activeStatus
  );

  // Get guide content based on property type and status
  const getGuideContent = (propertyDetails: string, status: string) => {
    return status === "sale"
      ? `Guide to buying ${propertyDetails}. Learn about pricing trends, investment potential, and what to look for when purchasing.`
      : status === "rent"
        ? `Guide to renting ${propertyDetails}. Understand rental terms, tenant rights, and what to expect from your landlord.`
        : `Guide to selling ${propertyDetails}. Learn how to prepare your property, set the right price, and attract potential buyers.`;
  };

  return (
    <div className="flex flex-col gap-8">
      {/* Status tabs */}
      <Tabs
        defaultValue={activeStatus}
        onValueChange={setActiveStatus}
        className="w-full"
      >
        <div className="flex justify-center mb-8">
          <TabsList className="grid w-full max-w-md grid-cols-3">
            {propertyStatuses.map((status) => (
              <TabsTrigger
                key={status.value}
                value={status.value}
                className="flex items-center gap-2"
              >
                {getStatusIcon(status.value)}
                {status.value === "sell" ? "To Sell" : `For ${status.label}`}
              </TabsTrigger>
            ))}
          </TabsList>
        </div>

        {/* Content for each status */}
        {propertyStatuses.map((status) => (
          <TabsContent key={status.value} value={status.value} className="mt-0">
            <div className="flex flex-col lg:flex-row gap-8">
              {/* Property types sidebar */}
              <div className="lg:w-1/4">
                <div className="sticky top-8 bg-white rounded-lg shadow-sm border border-gray-100 p-6">
                  <h2 className="text-2xl font-semibold mb-6 text-gray-800">
                    Property Types
                  </h2>
                  <ScrollArea className="h-full">
                    <nav className="space-y-2">
                      {propertyTypes.map((type) => (
                        <button
                          key={type.value}
                          onClick={() => setActiveType(type.value)}
                          className={cn(
                            "w-full text-left px-4 py-3 rounded-md transition-all duration-300 ease-in-out flex items-center gap-3",
                            activeType === type.value
                              ? "bg-blue-50 text-blue-700 font-medium"
                              : "hover:bg-gray-50 text-gray-600"
                          )}
                        >
                          {getTypeIcon(type.value)}
                          {type.label}
                        </button>
                      ))}
                    </nav>
                  </ScrollArea>
                </div>
              </div>

              {/* Property details grid */}
              <div className="lg:w-3/4">
                <div className="mb-8">
                  <h3 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                    {getTypeIcon(activeType)}
                    {
                      propertyTypes.find((type) => type.value === activeType)
                        ?.label
                    }{" "}
                    Properties
                    <span className="text-gray-500 font-normal text-lg ml-2">
                      (
                      {status.value === "sell"
                        ? "To Sell"
                        : `For ${status.label}`}
                      )
                    </span>
                  </h3>
                  <p className="text-gray-600 mt-2">
                    Explore our comprehensive guides for{" "}
                    {propertyTypes
                      .find((type) => type.value === activeType)
                      ?.label.toLowerCase()}{" "}
                    properties
                    {status.value === "sale"
                      ? " available for purchase"
                      : status.value === "rent"
                        ? " available for rent"
                        : " you want to sell"}{" "}
                    in African Real Estate.
                  </p>
                </div>

                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2">
                  {/* First check if we have guides for this combination */}
                  {filteredGuides.length > 0
                    ? filteredGuides.map((guide) => (
                        <Link
                          key={guide.id}
                          href={`/guides/${guide.slug}`}
                          className="group bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all duration-300 ease-in-out flex flex-col h-full"
                        >
                          <div className="h-48 relative overflow-hidden">
                            <Image
                              src={guide.coverImage || `/assets/house-1.jpg`}
                              alt={guide.title}
                              fill
                              className="object-cover transition-transform duration-500 group-hover:scale-105"
                            />
                            <div className="absolute top-0 left-0 bg-blue-600 text-white px-3 py-1 text-sm font-medium">
                              {status.value === "sell"
                                ? "To Sell"
                                : `For ${status.label}`}
                            </div>
                          </div>
                          <div className="p-6 flex-grow flex flex-col">
                            <h3 className="text-xl font-semibold mb-2 text-gray-800 group-hover:text-blue-600 transition-colors">
                              {guide.title}
                            </h3>
                            <div className="flex items-center text-sm text-gray-500 mb-4">
                              <Info className="h-4 w-4 mr-2 text-blue-500" />
                              Guide for{" "}
                              {status.value === "sell"
                                ? "selling"
                                : status.value === "sale"
                                  ? "buying"
                                  : "renting"}
                            </div>
                            <div className="flex items-center text-blue-600 font-medium mt-auto group-hover:translate-x-1 transition-transform duration-300">
                              Read Guide
                              <ArrowRight className="ml-2 h-4 w-4" />
                            </div>
                          </div>
                        </Link>
                      ))
                    : // If no guides, show the default sub-options
                      propertyTypes
                        .find((type) => type.value === activeType)
                        ?.subOptions.map((subOption) => (
                          <Link
                            key={subOption.value}
                            href={`/properties?propertyType=${encodeURIComponent(activeType)}&propertyDetails=${encodeURIComponent(subOption.value)}&status=${activeStatus}`}
                            className="group bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all duration-300 ease-in-out flex flex-col h-full"
                          >
                            <div className="h-48 relative overflow-hidden">
                              <Image
                                src={`/assets/house-1.jpg`}
                                alt={subOption.label}
                                fill
                                className="object-cover transition-transform duration-500 group-hover:scale-105"
                              />
                              <div className="absolute top-0 left-0 bg-blue-600 text-white px-3 py-1 text-sm font-medium">
                                {status.value === "sell"
                                  ? "To Sell"
                                  : `For ${status.label}`}
                              </div>
                              <Badge
                                variant="secondary"
                                className="absolute top-0 right-0 m-2"
                              >
                                No Guide Yet
                              </Badge>
                            </div>
                            <div className="p-6 flex-grow flex flex-col">
                              <h3 className="text-xl font-semibold mb-2 text-gray-800 group-hover:text-blue-600 transition-colors">
                                {subOption.label}
                              </h3>
                              <div className="flex items-center text-sm text-gray-500 mb-4">
                                <Info className="h-4 w-4 mr-2 text-blue-500" />
                                Guide for{" "}
                                {status.value === "sell"
                                  ? "selling"
                                  : status.value === "sale"
                                    ? "buying"
                                    : "renting"}
                              </div>
                              <p className="text-gray-600 mb-4 flex-grow">
                                {getGuideContent(
                                  subOption.label.toLowerCase(),
                                  activeStatus
                                )}
                              </p>
                              <div className="flex items-center text-blue-600 font-medium group-hover:translate-x-1 transition-transform duration-300">
                                View Properties
                                <ArrowRight className="ml-2 h-4 w-4" />
                              </div>
                            </div>
                          </Link>
                        ))}
                </div>
              </div>
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
