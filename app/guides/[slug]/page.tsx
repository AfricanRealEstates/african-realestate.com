import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { format } from "date-fns";
import {
  Calendar,
  Clock,
  ArrowLeft,
  Home,
  Building,
  Warehouse,
  Map,
  DollarSign,
  Key,
  FileText,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import GuideContent from "./guide-content";

interface Props {
  params: {
    slug: string;
  };
}

async function getGuide(slug: string) {
  try {
    const guide = await prisma.guide.findUnique({
      where: {
        slug,
        published: true,
      },
    });
    return guide;
  } catch (error) {
    console.error("Failed to fetch guide:", error);
    return null;
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const guide = await getGuide(params.slug);

  if (!guide) {
    return {
      title: "Guide Not Found",
    };
  }

  return {
    title: `${guide.title} | African Real Estate`,
    description: `Comprehensive guide on ${guide.propertyType.toLowerCase()} properties for ${guide.guideType === "sale" ? "buying" : guide.guideType === "rent" ? "renting" : "selling"} in Africa.`,
    openGraph: {
      title: guide.title,
      description: `Expert guide on ${guide.propertyType.toLowerCase()} properties`,
      images: guide.coverImage ? [guide.coverImage] : [],
    },
  };
}

const getTypeIcon = (type: string) => {
  switch (type) {
    case "Residential":
      return <Home className="h-5 w-5" />;
    case "Commercial":
      return <Building className="h-5 w-5" />;
    case "Industrial":
      return <Warehouse className="h-5 w-5" />;
    case "Land":
      return <Map className="h-5 w-5" />;
    default:
      return <Home className="h-5 w-5" />;
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
      return "Buying Guide";
    case "rent":
      return "Renting Guide";
    case "sell":
      return "Selling Guide";
    default:
      return "Property Guide";
  }
};

const calculateReadTime = (content: any) => {
  const contentString = JSON.stringify(content);
  const wordCount = contentString.split(/\s+/).length;
  return Math.max(1, Math.ceil(wordCount / 200));
};

export default async function GuidePage({ params }: Props) {
  const guide = await getGuide(params.slug);

  if (!guide) {
    notFound();
  }

  const readTime = calculateReadTime(guide.content);

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="bg-gray-50 border-b border-gray-100">
        <div className="max-w-5xl mx-auto px-4 py-24">
          <Link
            href="/guides"
            className="pt-8 inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-8 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Guides
          </Link>

          <div className="flex items-center gap-3 mb-6">
            <Badge className="bg-blue-50 text-blue-700 border-blue-200 flex items-center gap-1.5">
              {getTypeIcon(guide.propertyType)}
              {guide.propertyType}
            </Badge>
            <Badge className="bg-green-50 text-green-700 border-green-200 flex items-center gap-1.5">
              {getGuideTypeIcon(guide.guideType)}
              {getGuideTypeText(guide.guideType)}
            </Badge>
          </div>

          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 leading-tight">
            {guide.title}
          </h1>

          <div className="flex items-center gap-6 text-gray-600">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <time>
                {guide.publishedAt
                  ? format(new Date(guide.publishedAt), "MMMM d, yyyy")
                  : format(new Date(guide.createdAt), "MMMM d, yyyy")}
              </time>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              <span>{readTime} min read</span>
            </div>
          </div>
        </div>
      </div>

      {/* Cover Image */}
      {guide.coverImage && (
        <div className="max-w-5xl mx-auto px-4 py-8">
          <div className="relative h-64 md:h-96 rounded-xl overflow-hidden">
            <Image
              src={guide.coverImage || "/placeholder.svg"}
              alt={guide.title}
              fill
              className="object-cover"
            />
          </div>
        </div>
      )}

      {/* Content */}
      <div className="max-w-5xl mx-auto px-4 py-8">
        <article className="prose prose-lg max-w-none">
          <GuideContent content={guide.content} />
        </article>

        {/* Call to Action */}
        <div className="mt-16 bg-gray-50 rounded-xl p-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Ready to explore {guide.propertyType.toLowerCase()} properties?
          </h2>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            Browse our curated selection of {guide.propertyType.toLowerCase()}{" "}
            properties
            {guide.guideType === "sale"
              ? " for sale"
              : guide.guideType === "rent"
                ? " for rent"
                : " to sell"}
            across Africa.
          </p>
          <Link
            href={`/properties?propertyType=${encodeURIComponent(guide.propertyType)}&status=${guide.guideType}`}
          >
            <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
              View {guide.propertyType} Properties
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
