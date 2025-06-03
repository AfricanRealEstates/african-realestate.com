"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
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
  Loader2,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import GuideContent from "./[slug]/guide-content";

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
}

export default function DynamicGuidesContent({
  propertyTypes,
  propertyStatuses,
}: DynamicGuidesContentProps) {
  const [activeType, setActiveType] = useState(propertyTypes[0].value);
  const [activeStatus, setActiveStatus] = useState("sale");
  const [guides, setGuides] = useState<Guide[]>([]);
  const [loading, setLoading] = useState(true);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Fetch guides from API
  useEffect(() => {
    const fetchGuides = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `/api/guides/filtered?propertyType=${activeType}&guideType=${activeStatus}`
        );
        const data = await response.json();
        setGuides(data);
      } catch (error) {
        console.error("Failed to fetch guides:", error);
        setGuides([]);
      } finally {
        setLoading(false);
      }
    };

    if (isClient) {
      fetchGuides();
    }
  }, [activeType, activeStatus, isClient]);

  if (!isClient) {
    return null;
  }

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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "sale":
        return <DollarSign className="h-4 w-4" />;
      case "rent":
        return <Key className="h-4 w-4" />;
      case "sell":
        return <FileText className="h-4 w-4" />;
      default:
        return <DollarSign className="h-4 w-4" />;
    }
  };

  const getGuideTypeDisplay = (guideType: string) => {
    return guideType === "sale" ? "Buy" : guideType === "rent" ? "Let" : "Sell";
  };

  const calculateReadTime = (content: any) => {
    if (!content || typeof content !== "object") return 5;

    let wordCount = 0;
    if (content.type === "doc" && content.content) {
      content.content.forEach((node: any) => {
        if (node.type === "paragraph" && node.content) {
          node.content.forEach((textNode: any) => {
            if (textNode.type === "text" && textNode.text) {
              wordCount += textNode.text.split(/\s+/).length;
            }
          });
        }
      });
    }
    return Math.max(1, Math.ceil(wordCount / 200));
  };

  const currentGuide = guides.length > 0 ? guides[0] : null;

  return (
    <div className="max-w-7xl mx-auto">
      <Tabs
        defaultValue={activeStatus}
        onValueChange={setActiveStatus}
        className="w-full"
      >
        <div className="flex justify-center mb-12">
          <TabsList className="grid w-full max-w-md grid-cols-3 bg-gray-100 p-1 rounded-xl">
            {propertyStatuses.map((status) => (
              <TabsTrigger
                key={status.value}
                value={status.value}
                className="flex items-center gap-2 rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm"
              >
                {getStatusIcon(status.value)}
                <span className="hidden sm:inline">
                  {status.value === "sell" ? "Sell" : `${status.label}`}
                </span>
                <span className="sm:hidden">
                  {status.value === "sell" ? "Sell" : status.label}
                </span>
              </TabsTrigger>
            ))}
          </TabsList>
        </div>

        {propertyStatuses.map((status) => (
          <TabsContent key={status.value} value={status.value} className="mt-0">
            <div className="grid lg:grid-cols-4 gap-8">
              <div className="lg:col-span-1">
                <div className="bg-white rounded-xl border border-gray-100 p-6 sticky top-8">
                  <h3 className="font-semibold text-gray-900 mb-4">
                    Property Types
                  </h3>
                  <nav className="space-y-1">
                    {propertyTypes.map((type) => (
                      <button
                        key={type.value}
                        onClick={() => setActiveType(type.value)}
                        className={cn(
                          "w-full text-left px-3 py-2.5 rounded-lg transition-colors flex items-center gap-3 text-sm",
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
                </div>
              </div>

              <div className="lg:col-span-3">
                {loading ? (
                  <div className="bg-white rounded-xl border border-gray-100 p-8">
                    <div className="flex items-center justify-center py-12">
                      <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
                    </div>
                  </div>
                ) : currentGuide ? (
                  <article className="bg-white rounded-xl border border-gray-100 p-8">
                    {/* Guide Header */}
                    <div className="mb-8 pb-6 border-b border-gray-100">
                      <div className="flex items-center gap-3 mb-4">
                        <Badge
                          variant="secondary"
                          className="bg-blue-50 text-blue-700 border-blue-200"
                        >
                          {currentGuide.propertyType}
                        </Badge>
                        <Badge
                          variant="secondary"
                          className="bg-green-50 text-green-700 border-green-200"
                        >
                          {getGuideTypeDisplay(currentGuide.guideType)}
                        </Badge>
                      </div>

                      <h1 className="text-3xl font-bold text-gray-900 mb-4">
                        {currentGuide.title}
                      </h1>

                      <div className="flex items-center gap-6 text-sm text-gray-500">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4" />
                          <time>
                            {currentGuide.publishedAt
                              ? format(
                                  new Date(currentGuide.publishedAt),
                                  "MMM d, yyyy"
                                )
                              : format(
                                  new Date(currentGuide.createdAt),
                                  "MMM d, yyyy"
                                )}
                          </time>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4" />
                          <span>
                            {calculateReadTime(currentGuide.content)} min read
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Full Guide Content */}
                    <div className="prose prose-lg max-w-none mb-8">
                      <GuideContent content={currentGuide.content} />
                    </div>

                    {/* Call to Action */}
                    <div className="bg-gray-50 rounded-lg p-6 mt-8">
                      <h3 className="font-semibold text-gray-900 mb-2">
                        Ready to explore{" "}
                        {currentGuide.propertyType.toLowerCase()} properties?
                      </h3>
                      <p className="text-gray-600 mb-4">
                        Browse our curated selection of properties that match
                        your needs.
                      </p>
                      <Link
                        href={`/properties?propertyType=${encodeURIComponent(currentGuide.propertyType)}&status=${currentGuide.guideType}`}
                      >
                        <Button className="bg-blue-600 hover:bg-blue-700">
                          View Properties
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                      </Link>
                    </div>
                  </article>
                ) : (
                  <div className="bg-white rounded-xl border border-gray-100 p-8">
                    <div className="text-center py-12">
                      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        {getTypeIcon(activeType)}
                      </div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">
                        {
                          propertyTypes.find(
                            (type) => type.value === activeType
                          )?.label
                        }{" "}
                        Properties
                      </h3>
                      <p className="text-gray-600 mb-6">
                        No specific guide available for this combination.
                        Explore our general property information below.
                      </p>
                      <Link
                        href={`/properties?propertyType=${encodeURIComponent(activeType)}&status=${activeStatus}`}
                      >
                        <Button variant="outline">
                          Browse Properties
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                      </Link>
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
