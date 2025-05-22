"use client";

import { useEffect } from "react";
import dynamic from "next/dynamic";
import { useABTest } from "./AbTestProvider";

// Dynamically import the components to avoid server/client mismatch
const FeaturedProperties = dynamic(
  () => import("@/components/landing/featured-properties"),
  {
    loading: () => (
      <div className="h-96 flex items-center justify-center">
        Loading recommendations...
      </div>
    ),
    ssr: false,
  }
);

const TrendingProperties = dynamic(
  () => import("@/components/landing/TrendingProperties"),
  {
    loading: () => (
      <div className="h-96 flex items-center justify-center">
        Loading trending properties...
      </div>
    ),
    ssr: false,
  }
);

const PopularInCategory = dynamic(
  () => import("@/components/landing/PopularInCategory"),
  {
    loading: () => (
      <div className="h-96 flex items-center justify-center">
        Loading popular properties...
      </div>
    ),
    ssr: false,
  }
);

export default function FeaturedContent({
  userPreferences,
}: {
  userPreferences: any;
}) {
  const { getVariant, trackEvent, isLoading } = useABTest();
  const variant = getVariant("featuredContent");

  // Track impression when component mounts
  useEffect(() => {
    if (variant) {
      trackEvent("featuredContent", "impression");
    }
  }, [variant, trackEvent]);

  if (isLoading) {
    return (
      <div className="h-96 flex items-center justify-center">
        Loading recommendations...
      </div>
    );
  }

  // Render different content based on A/B test variant
  if (variant === "A") {
    return <FeaturedProperties />;
  } else if (variant === "B") {
    return <TrendingProperties />;
  } else {
    return <PopularInCategory userPreferences={userPreferences} />;
  }
}
