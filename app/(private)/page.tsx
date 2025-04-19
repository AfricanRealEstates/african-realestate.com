import { auth } from "@/auth";
import CityProperties from "@/components/landing/CityProperties";
import Facts from "@/components/landing/facts";
import FeaturedProperties from "@/components/landing/featured-properties";
import PropertyAdvice from "@/components/landing/property-advice";
import RecentlyViewedProperties from "@/components/landing/recently-viewed-properties";
import Reviews from "@/components/landing/reviews";
import OurServices from "@/components/landing/services/OurServices";
import Testing from "@/components/landing/testing";
import SearchHistoryCarousel from "@/components/search/SearchHistoryCarousel";
import { Suspense } from "react";

export default async function Home() {
  const session = await auth();

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

        {/* Trending Properties - For all users */}
        {/* <TrendingProperties /> */}

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
        <CityProperties />
        <PropertyAdvice />
        <Reviews />
      </div>
    </>
  );
}
