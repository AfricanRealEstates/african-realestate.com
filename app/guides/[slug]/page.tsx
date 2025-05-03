import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { GuideContent } from "./guide-content";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Calendar, Clock } from "lucide-react";
import { format } from "date-fns";
import { getGuideBySlug } from "@/app/(dashboard)/dashboard/guides/actions";
import { Badge } from "@/components/ui/badge";

interface GuidePageProps {
  params: {
    slug: string;
  };
}

export async function generateMetadata({
  params,
}: GuidePageProps): Promise<Metadata> {
  const guide = await getGuideBySlug(params.slug);

  if (!guide || !guide.published) {
    return {
      title: "Guide Not Found | African Real Estate",
    };
  }

  return {
    title: `${guide.title} | African Real Estate Guides`,
    description: `Guide for ${guide.propertyType} properties - ${guide.guideType === "sale" ? "For Sale" : guide.guideType === "rent" ? "For Rent" : "To Sell"}`,
    openGraph: {
      title: guide.title,
      description: `Guide for ${guide.propertyType} properties - ${guide.guideType === "sale" ? "For Sale" : guide.guideType === "rent" ? "For Rent" : "To Sell"}`,
      type: "article",
      images: guide.coverImage ? [{ url: guide.coverImage }] : undefined,
    },
  };
}

export default async function GuidePage({ params }: GuidePageProps) {
  const guide = await getGuideBySlug(params.slug);

  if (!guide || !guide.published) {
    notFound();
  }

  // Format the guide type for display
  const guideTypeDisplay =
    guide.guideType === "sale"
      ? "For Sale"
      : guide.guideType === "rent"
        ? "For Rent"
        : "To Sell";

  // Calculate read time (rough estimate: 200 words per minute)
  const contentString = JSON.stringify(guide.content);
  const wordCount = contentString.split(/\s+/).length;
  const readTimeMinutes = Math.max(1, Math.ceil(wordCount / 200));

  return (
    <div className="min-h-screen bg-white py-20 md:py-32">
      <article className="max-w-7xl mx-auto">
        {/* Hero section with cover image */}
        <div className="relative h-full w-full">
          {/* 
        {guide.coverImage ? (
          <Image
            src={guide.coverImage || "/placeholder.svg"}
            alt={guide.title}
            fill
            className="object-cover"
            priority
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-blue-800" />
        )}
        
        <div className="absolute inset-0 bg-black/40" /> */}
          <div className="flex items-center justify-center">
            <div className="container mx-auto px-4 text-center">
              <h1 className="text-xl md:text-3xl lg:text-4xl font-bold mb-4">
                {guide.title}
              </h1>
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full ">
                <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                  {guide.propertyType}
                </Badge>
                <span className="w-1.5 h-1.5 rounded-full bg-gray-400" />
                <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-100">
                  {guideTypeDisplay}
                </Badge>
              </div>
            </div>
          </div>
        </div>

        {/* Content section */}
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-3xl mx-auto">
            <Link href="/guides">
              <Button variant="outline" className="mb-6 -ml-2">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Guides
              </Button>
            </Link>

            <div className="flex items-center text-sm text-muted-foreground mb-8 gap-6">
              <div className="flex items-center">
                <Calendar className="mr-2 h-4 w-4" />
                <time
                  dateTime={
                    guide.publishedAt?.toISOString() ||
                    guide.createdAt.toISOString()
                  }
                >
                  {guide.publishedAt
                    ? format(new Date(guide.publishedAt), "MMMM d, yyyy")
                    : format(new Date(guide.createdAt), "MMMM d, yyyy")}
                </time>
              </div>
              <div className="flex items-center">
                <Clock className="mr-2 h-4 w-4" />
                <span>{readTimeMinutes} min read</span>
              </div>
            </div>

            <GuideContent content={guide.content} />

            <div className="mt-12 pt-8 border-t">
              <h2 className="text-2xl font-bold mb-4">
                Looking for {guide.propertyType} Properties?
              </h2>
              <p className="text-muted-foreground mb-6">
                Browse our selection of {guide.propertyType.toLowerCase()}{" "}
                properties
                {guide.guideType === "sale"
                  ? " for sale"
                  : guide.guideType === "rent"
                    ? " for rent"
                    : " to sell"}{" "}
                in Africa.
              </p>
              <Link
                href={`/properties?propertyType=${encodeURIComponent(guide.propertyType)}&status=${guide.guideType}`}
              >
                <Button>View {guide.propertyType} Properties</Button>
              </Link>
            </div>
          </div>
        </div>
      </article>
    </div>
  );
}
