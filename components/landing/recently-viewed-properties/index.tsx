import { cookies } from "next/headers";
import {
  getRecentlyViewedProperties,
  getPersonalizedRecommendations,
} from "@/actions/getRecentlyViewedProperties";

import { getCurrentUser } from "@/lib/session";
import RecentlyViewedCarousel from "../property-carousel";
import RecentlyViewedPropertiesScript from "./RecentlyViewedPropertiesScript";

export default async function RecentlyViewedProperties() {
  return (
    <>
      {/* Client-side script to pass localStorage data to server */}
      <RecentlyViewedPropertiesScript />

      {/* Server component with enhanced carousel */}
      <RecentlyViewedPropertiesLoader />
    </>
  );
}

async function RecentlyViewedPropertiesLoader() {
  const user = await getCurrentUser();

  // For logged-in users, we'll get data from the database
  if (user) {
    const [recentlyViewed, recommendations] = await Promise.all([
      getRecentlyViewedProperties(),
      getPersonalizedRecommendations(user.id!),
    ]);

    // If no recently viewed properties, show recommendations only
    if (!recentlyViewed.length && !recommendations.length) {
      return null;
    }

    return (
      <RecentlyViewedCarousel
        recentlyViewed={recentlyViewed}
        recommendations={recommendations}
        isLoggedIn={true}
      />
    );
  }

  // For anonymous users, get property IDs from cookies
  const propertyIdsCookie = cookies().get("recentlyViewedProperties");
  const propertyIds = propertyIdsCookie
    ? JSON.parse(propertyIdsCookie.value)
    : [];

  // If no property IDs, don't render anything
  if (!propertyIds.length) {
    return null;
  }

  // Fetch properties using server action
  const recentlyViewed = await getRecentlyViewedProperties(propertyIds);

  // If no properties found, don't render anything
  if (!recentlyViewed.length) {
    return null;
  }

  return (
    <RecentlyViewedCarousel
      recentlyViewed={recentlyViewed}
      recommendations={[]}
      isLoggedIn={false}
    />
  );
}
