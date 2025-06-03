"use client";
import { useState, useEffect } from "react";
import {
  ArrowRight,
  BookOpen,
  Home,
  Building,
  Warehouse,
  Map,
  DollarSign,
  Key,
  FileText,
  Search,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Guide {
  id: string;
  title: string;
  slug: string;
  propertyType: string;
  guideType: string;
  coverImage: string | null;
  published: boolean;
  publishedAt: Date | null;
  createdAt: Date;
}

// Helper functions
const getTypeIcon = (type: string) => {
  switch (type) {
    case "Residential":
      return <Home className="h-4 w-4" />;
    case "Commercial":
      return <Building className="h-4 w-4" />;
    case "Industrial":
      return <Warehouse className="h-4 w-4" />;
    case "Land":
      return <Map className="h-4 w-4" />;
    default:
      return <Home className="h-4 w-4" />;
  }
};

const getGuideTypeIcon = (type: string) => {
  switch (type) {
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

const getGuideTypeText = (type: string) => {
  switch (type) {
    case "sale":
      return "Buying";
    case "rent":
      return "Renting";
    case "sell":
      return "Selling";
    default:
      return "Guide";
  }
};

// Clean guide card component
const GuideCard = ({ guide }: { guide: Guide }) => {
  return (
    <Link href={`/guides/${guide.slug}`} className="block group">
      <article className="bg-white rounded-xl border border-gray-100 overflow-hidden transition-all duration-300 hover:shadow-lg hover:border-gray-200 h-full">
        <div className="relative h-48 overflow-hidden bg-gray-50">
          <Image
            src={guide.coverImage || "/placeholder.svg?height=300&width=400"}
            alt={guide.title}
            className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
            width={400}
            height={300}
          />
          <div className="absolute top-3 left-3">
            <div className="flex items-center gap-1.5 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1.5 text-xs font-medium text-gray-700">
              {getGuideTypeIcon(guide.guideType)}
              {getGuideTypeText(guide.guideType)}
            </div>
          </div>
        </div>

        <div className="p-5">
          <div className="flex items-center gap-2 mb-3">
            <div className="flex items-center gap-1.5 text-gray-600">
              {getTypeIcon(guide.propertyType)}
              <span className="text-sm font-medium">{guide.propertyType}</span>
            </div>
          </div>

          <h3 className="font-semibold text-gray-900 text-lg mb-3 line-clamp-2 group-hover:text-blue-600 transition-colors">
            {guide.title}
          </h3>

          <div className="flex items-center text-blue-600 text-sm font-medium group-hover:text-blue-700">
            <BookOpen className="h-4 w-4 mr-1.5" />
            Read Guide
            <ArrowRight className="h-4 w-4 ml-1 transition-transform group-hover:translate-x-1" />
          </div>
        </div>
      </article>
    </Link>
  );
};

export default function OurServices() {
  const [guides, setGuides] = useState<Guide[]>([]);
  const [filteredGuides, setFilteredGuides] = useState<Guide[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState<string>("all");
  const [selectedGuideType, setSelectedGuideType] = useState<string>("all");

  // Fetch guides from API
  useEffect(() => {
    const fetchGuides = async () => {
      try {
        const response = await fetch("/api/guides");
        const data = await response.json();
        setGuides(data);
        setFilteredGuides(data);
      } catch (error) {
        console.error("Failed to fetch guides:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchGuides();
  }, []);

  // Filter guides based on search and filters
  useEffect(() => {
    let filtered = guides;

    if (searchTerm) {
      filtered = filtered.filter(
        (guide) =>
          guide.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          guide.propertyType.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedType !== "all") {
      filtered = filtered.filter(
        (guide) => guide.propertyType === selectedType
      );
    }

    if (selectedGuideType !== "all") {
      filtered = filtered.filter(
        (guide) => guide.guideType === selectedGuideType
      );
    }

    setFilteredGuides(filtered);
  }, [guides, searchTerm, selectedType, selectedGuideType]);

  if (loading) {
    return (
      <section className="py-16 bg-gray-50/50">
        <div className="mx-auto w-full max-w-7xl px-4">
          <div className="text-center mb-12">
            <div className="h-8 bg-gray-200 rounded w-64 mx-auto mb-4 animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded w-96 mx-auto animate-pulse"></div>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="bg-white rounded-xl border border-gray-100 overflow-hidden"
              >
                <div className="h-48 bg-gray-200 animate-pulse"></div>
                <div className="p-5">
                  <div className="h-4 bg-gray-200 rounded w-20 mb-3 animate-pulse"></div>
                  <div className="h-6 bg-gray-200 rounded w-full mb-3 animate-pulse"></div>
                  <div className="h-4 bg-gray-200 rounded w-24 animate-pulse"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-gray-50/50">
      <div className="mx-auto w-full max-w-7xl px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Property Guides
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto mb-8">
            Expert guidance for buying, selling, and renting properties across
            Africa. Get the insights you need to make informed real estate
            decisions.
          </p>

          {/* Interactive Filters */}
          <div className="flex flex-col sm:flex-row gap-4 max-w-4xl mx-auto">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search guides..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-white border-gray-200"
              />
            </div>
            <Select value={selectedType} onValueChange={setSelectedType}>
              <SelectTrigger className="w-full sm:w-48 bg-white border-gray-200">
                <SelectValue placeholder="Property Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="Residential">Residential</SelectItem>
                <SelectItem value="Commercial">Commercial</SelectItem>
                <SelectItem value="Industrial">Industrial</SelectItem>
                <SelectItem value="Land">Land</SelectItem>
              </SelectContent>
            </Select>
            <Select
              value={selectedGuideType}
              onValueChange={setSelectedGuideType}
            >
              <SelectTrigger className="w-full sm:w-48 bg-white border-gray-200">
                <SelectValue placeholder="Guide Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Guides</SelectItem>
                <SelectItem value="sale">Buying</SelectItem>
                <SelectItem value="rent">Renting</SelectItem>
                <SelectItem value="sell">Selling</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Results */}
        {filteredGuides.length > 0 ? (
          <div className="relative">
            <Carousel
              opts={{
                align: "start",
                loop: true,
              }}
              className="w-full"
            >
              <CarouselContent className="-ml-4">
                {filteredGuides.map((guide) => (
                  <CarouselItem
                    key={guide.id}
                    className="pl-4 md:basis-1/2 lg:basis-1/3"
                  >
                    <GuideCard guide={guide} />
                  </CarouselItem>
                ))}
              </CarouselContent>
              <div className="flex justify-center gap-2 mt-8">
                <CarouselPrevious className="relative inset-0 translate-y-0 bg-white border border-gray-200 hover:bg-gray-50 shadow-sm" />
                <CarouselNext className="relative inset-0 translate-y-0 bg-white border border-gray-200 hover:bg-gray-50 shadow-sm" />
              </div>
            </Carousel>
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No guides found
            </h3>
            <p className="text-gray-600">
              Try adjusting your search or filters to find what you&apos;re
              looking for.
            </p>
          </div>
        )}

        {/* View All Link */}
        <div className="text-center mt-12">
          <Link
            href="/guides"
            className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            View All Guides
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
