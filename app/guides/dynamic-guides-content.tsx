"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import {
  ArrowRight,
  Home,
  Building,
  Warehouse,
  MapPin,
  DollarSign,
  Key,
  Palmtree,
  Map,
  FileText,
  Calendar,
  Clock,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { GuideContent } from "./[slug]/guide-content";

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
  content: any;
  publishedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
  images?: string[];
}

interface DynamicGuidesContentProps {
  propertyTypes: PropertyType[];
  propertyStatuses: PropertyStatus[];
  guides: Guide[];
}

export default function DynamicGuidesContent({
  propertyTypes,
  propertyStatuses,
  guides,
}: DynamicGuidesContentProps) {
  const [activeType, setActiveType] = useState(propertyTypes[0].value);
  const [activeStatus, setActiveStatus] = useState("sale");
  const [isClient, setIsClient] = useState(false);

  // Prevent hydration mismatch
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Get the appropriate guide for the current property type and status
  const getCurrentGuide = (): Guide | null => {
    const matchingGuides = guides.filter(
      (guide) =>
        guide.propertyType === activeType && guide.guideType === activeStatus
    );
    return matchingGuides.length > 0 ? matchingGuides[0] : null;
  };

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

  // Format the guide type for display
  const getGuideTypeDisplay = (guideType: string) => {
    return guideType === "sale"
      ? "For Sale"
      : guideType === "rent"
        ? "For Rent"
        : "To Sell";
  };

  // Calculate read time (rough estimate: 200 words per minute)
  const calculateReadTime = (content: any) => {
    const contentString = JSON.stringify(content);
    const wordCount = contentString.split(/\s+/).length;
    return Math.max(1, Math.ceil(wordCount / 200));
  };

  // Get the current guide based on selected property type and status
  const currentGuide = getCurrentGuide();
  const guideTypeDisplay = currentGuide
    ? getGuideTypeDisplay(currentGuide.guideType)
    : getGuideTypeDisplay(activeStatus);
  const readTimeMinutes = currentGuide
    ? calculateReadTime(currentGuide.content)
    : 5; // Default read time

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

              {/* Guide content area */}
              <div className="lg:w-3/4">
                {currentGuide ? (
                  <article className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
                    <div className="mb-6">
                      <h1 className="text-2xl md:text-3xl font-bold mb-4">
                        {currentGuide.title}
                      </h1>
                      <div className="flex items-center gap-2">
                        <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                          {currentGuide.propertyType}
                        </Badge>
                        <span className="w-1.5 h-1.5 rounded-full bg-gray-400" />
                        <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-100">
                          {guideTypeDisplay}
                        </Badge>
                      </div>

                      <div className="flex items-center text-sm text-muted-foreground mt-4 gap-6">
                        <div className="flex items-center">
                          <Calendar className="mr-2 h-4 w-4" />
                          <time
                            dateTime={
                              currentGuide.publishedAt?.toISOString() ||
                              currentGuide.createdAt.toISOString()
                            }
                          >
                            {currentGuide.publishedAt
                              ? format(
                                  new Date(currentGuide.publishedAt),
                                  "MMMM d, yyyy"
                                )
                              : format(
                                  new Date(currentGuide.createdAt),
                                  "MMMM d, yyyy"
                                )}
                          </time>
                        </div>
                        <div className="flex items-center">
                          <Clock className="mr-2 h-4 w-4" />
                          <span>{readTimeMinutes} min read</span>
                        </div>
                      </div>
                    </div>

                    {/* Guide content would go here */}
                    <GuideContent content={currentGuide.content} />

                    {/* <div className="prose max-w-none">
                    
                      <p>
                        {JSON.stringify(currentGuide.content) !== "{}" &&
                          `This is a guide about ${currentGuide.propertyType} properties for ${currentGuide.guideType === "sale" ? "buying" : currentGuide.guideType === "rent" ? "renting" : "selling"}.`}
                      </p>
                    </div> */}

                    <div className="mt-12 pt-8 border-t">
                      <h2 className="text-2xl font-bold mb-4">
                        Looking for {currentGuide.propertyType} Properties?
                      </h2>
                      <p className="text-muted-foreground mb-6">
                        Browse our selection of{" "}
                        {currentGuide.propertyType.toLowerCase()} properties
                        {currentGuide.guideType === "sale"
                          ? " for sale"
                          : currentGuide.guideType === "rent"
                            ? " for rent"
                            : " to sell"}{" "}
                        in Africa.
                      </p>
                      <Link
                        href={`/properties?propertyType=${encodeURIComponent(currentGuide.propertyType)}&status=${currentGuide.guideType}`}
                      >
                        <Button>
                          View {currentGuide.propertyType} Properties
                        </Button>
                      </Link>
                    </div>
                  </article>
                ) : (
                  <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
                    <div className="mb-8">
                      <h3 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                        {getTypeIcon(activeType)}
                        {
                          propertyTypes.find(
                            (type) => type.value === activeType
                          )?.label
                        }{" "}
                        Properties
                        <span className="text-gray-500 font-normal text-lg ml-2">
                          (
                          {activeStatus === "sell"
                            ? "To Sell"
                            : `For ${propertyStatuses.find((s) => s.value === activeStatus)?.label || activeStatus}`}
                          )
                        </span>
                      </h3>
                      <p className="text-gray-600 mt-2">
                        No specific guide is available for this combination.
                        Here&apos;s some general information about{" "}
                        {propertyTypes
                          .find((type) => type.value === activeType)
                          ?.label.toLowerCase()}{" "}
                        properties
                        {activeStatus === "sale"
                          ? " available for purchase"
                          : activeStatus === "rent"
                            ? " available for rent"
                            : " you want to sell"}{" "}
                        in African Real Estate.
                      </p>
                    </div>

                    <div className="prose max-w-none">
                      <h2>
                        Guide to{" "}
                        {activeStatus === "sale"
                          ? "Buying"
                          : activeStatus === "rent"
                            ? "Renting"
                            : "Selling"}{" "}
                        {
                          propertyTypes.find(
                            (type) => type.value === activeType
                          )?.label
                        }{" "}
                        Properties
                      </h2>

                      <p>
                        {getGuideContent(
                          propertyTypes
                            .find((type) => type.value === activeType)
                            ?.label.toLowerCase() || "",
                          activeStatus
                        )}
                      </p>

                      <h3>Key Considerations</h3>
                      <ul>
                        <li>Location and accessibility</li>
                        <li>Property condition and maintenance</li>
                        <li>Legal documentation and compliance</li>
                        <li>Market trends and valuation</li>
                        <li>Financing options and requirements</li>
                      </ul>

                      <div className="mt-8">
                        <Link
                          href={`/properties?propertyType=${encodeURIComponent(activeType)}&status=${activeStatus}`}
                        >
                          <Button>
                            View{" "}
                            {
                              propertyTypes.find(
                                (type) => type.value === activeType
                              )?.label
                            }{" "}
                            Properties
                            <ArrowRight className="ml-2 h-4 w-4" />
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
