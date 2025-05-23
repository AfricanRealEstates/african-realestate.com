import { auth } from "@/auth";
import CityProperties from "@/components/landing/CityProperties";
import Facts from "@/components/landing/facts";
import FeaturedProperties from "@/components/landing/featured-properties";
import PropertyAdvice from "@/components/landing/property-advice";
import RecentlyViewedProperties from "@/components/landing/recently-viewed-properties";
import Reviews from "@/components/landing/reviews";
import OurServices from "@/components/landing/services/OurServices";
import Testing from "@/components/landing/testing";
import TrendingProperties from "@/components/landing/TrendingProperties";
import SearchHistoryCarousel from "@/components/search/SearchHistoryCarousel";
import { getUserLocation } from "@/lib/user-location";
import { getUserPreferences } from "@/lib/user-preferences";
import { Metadata, ResolvingMetadata } from "next";
import { Suspense } from "react";

// Generate dynamic metadata based on user location
export async function generateMetadata(
  params: {},
  parent: ResolvingMetadata
): Promise<Metadata> {
  // Get user location
  const location = await getUserLocation();

  // Get the default metadata from parent
  const previousMetadata = await parent;

  // Default location if not available
  const city = location.city || "Africa";
  const country = location.country || "Kenya";

  return {
    // title: `Find Your Dream Property in ${city}, ${country} | African Real Estate`,
    // description: `Discover residential, commercial, and land properties for sale and rent in ${city}, ${country}. African Real Estate offers the best selection of properties across Africa.`,
    // openGraph: {
    //   ...previousMetadata.openGraph,
    //   title: `Find Your Dream Property in ${city}, ${country} | African Real Estate`,
    //   description: `Discover residential, commercial, and land properties for sale and rent in ${city}, ${country}. African Real Estate offers the best selection of properties across Africa.`,
    // },
    // twitter: {
    //   ...previousMetadata.twitter,
    //   title: `Find Your Dream Property in ${city}, ${country} | African Real Estate`,
    //   description: `Discover residential, commercial, and land properties for sale and rent in ${city}, ${country}. African Real Estate offers the best selection of properties across Africa.`,
    // },
  };
}

export default async function Home() {
  const session = await auth();
  const userPreferences = await getUserPreferences();

  return (
    <>
      {/* Meta viewport override */}
      <meta
        name="viewport"
        content="width=device-width, initial-scale=1.0, maximum-scale=1.0"
      />

      {/* Schema.org breadcrumb */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              {
                "@type": "ListItem",
                position: 1,
                name: "Home",
                item: "https://www.african-realestate.com/",
              },
            ],
          }),
        }}
      />

      <div className="home-page">
        <h1 className="sr-only">Home page</h1>
        <Testing />

        {/* Recent Searches - Zillow style */}
        <Suspense fallback={<div className="h-24"></div>}>
          <SearchHistoryCarousel />
        </Suspense>

        {/* A/B Testing for Featured Content */}
        {/* <FeaturedContent userPreferences={userPreferences} /> */}

        {/* Trending Properties - For all users */}
        <TrendingProperties />

        {/* Featured Properties - Now personalized */}
        <Suspense
          fallback={
            <div className="h-96 flex items-center justify-center">
              Loading recommendations...
            </div>
          }
        >
          <FeaturedProperties />
        </Suspense>

        {/* Recently Viewed Properties - Client-side component */}
        <RecentlyViewedProperties />

        <OurServices />
        <Facts />
        {/* Location-based Properties */}
        <CityProperties />
        <PropertyAdvice />
        <Reviews />
      </div>
    </>
  );
}
