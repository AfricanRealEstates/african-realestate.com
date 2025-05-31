import { Suspense } from "react";
import { Lexend } from "next/font/google";
import { Button } from "@/components/utils/Button";
import { PropertySkeletonGrid } from "./PropertySkeletonGrid";
import {
  getPersonalizedProperties,
  trackRecommendationEvent,
} from "@/actions/getPersonalizedProperties";
import { getCurrentUser } from "@/lib/session";
import FeaturedPropertiesClient from "./FeaturedPropertiesClient";

const lexend = Lexend({
  subsets: ["latin"],
  weight: ["600"],
});

async function getProperties() {
  return getPersonalizedProperties(8);
}

export default async function FeaturedProperties() {
  const properties = await getProperties();
  const user = await getCurrentUser();

  // Determine if we're showing personalized recommendations
  const isPersonalized = user !== null;

  // Track recommendation event for analytics
  if (user && properties.length > 0) {
    await trackRecommendationEvent(
      user.id!,
      properties.map((p) => p.id),
      isPersonalized ? "personalized_featured" : "general_featured"
    );
  }

  // Calculate personalization stats
  const newPropertiesCount = properties.filter((p) => {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    return new Date(p.createdAt) >= sevenDaysAgo;
  }).length;

  return (
    <div className="border-t border-neutral-100 mb-4 text-[#4e4e4e] bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="mx-auto w-[95%] max-w-7xl px-2 py-12 md:px-4 md:py-16 lg:py-20">
        <section className="flex justify-start gap-8 flex-col w-full">
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <svg
                  className="h-6 w-6 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
              </div>
              <div>
                <p
                  className={`text-[12px] uppercase text-blue-600 font-semibold leading-relaxed ${lexend.className}`}
                >
                  {isPersonalized
                    ? "Properties curated for you"
                    : "Explore our newest and most popular properties"}
                </p>
                <h2
                  className={`${lexend.className} tracking-tight text-3xl font-bold sm:text-4xl my-1`}
                >
                  {isPersonalized
                    ? "Your Personal Recommendations"
                    : "Featured Properties"}
                </h2>
              </div>
            </div>

            {isPersonalized && (
              <div className="bg-white/60 backdrop-blur-sm border border-blue-200 rounded-lg p-4 max-w-2xl">
                <div className="flex items-start gap-3">
                  <div className="p-1.5 bg-blue-100 rounded-lg">
                    <svg
                      className="h-4 w-4 text-blue-600"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-700 mb-2">
                      Based on your browsing history, preferences, and
                      interactions.
                      {newPropertiesCount > 0 && (
                        <span className="ml-1 text-green-600 font-medium">
                          Including {newPropertiesCount} new listing
                          {newPropertiesCount > 1 ? "s" : ""}!
                        </span>
                      )}
                    </p>
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <span className="flex items-center gap-1">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        Personalized
                      </span>
                      <span className="flex items-center gap-1">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        Fresh content
                      </span>
                      <span className="flex items-center gap-1">
                        <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                        Trending
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {!isPersonalized && (
              <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg p-4 max-w-2xl">
                <div className="flex items-start gap-3">
                  <svg
                    className="h-5 w-5 mt-0.5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M3 3a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414-1.414L12.414 15H15a2 2 0 002-2V5a1 1 0 100-2H3zm11.707 4.707a1 1 0 00-1.414-1.414L10 9.586 8.707 8.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <div>
                    <p className="text-sm font-medium mb-1">
                      Get Personalized Recommendations
                    </p>
                    <p className="text-sm opacity-90">
                      Sign up to see properties tailored to your preferences,
                      budget, and location interests!
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          <Suspense fallback={<PropertySkeletonGrid count={8} />}>
            <FeaturedPropertiesClient
              properties={properties as any}
              isPersonalized={isPersonalized}
              newPropertiesCount={newPropertiesCount}
            />
          </Suspense>

          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            <Button color="blue" href="/properties" className="w-fit">
              View all Properties
            </Button>

            {isPersonalized && (
              <div className="text-sm text-gray-500 flex items-center gap-2">
                <svg
                  className="h-4 w-4"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z"
                    clipRule="evenodd"
                  />
                </svg>
                Recommendations refresh based on your activity
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
