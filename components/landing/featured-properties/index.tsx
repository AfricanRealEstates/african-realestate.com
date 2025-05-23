import { Suspense } from "react";
import { Lexend } from "next/font/google";
import { Button } from "@/components/utils/Button";
import { PropertySkeletonGrid } from "./PropertySkeletonGrid";
import { getPersonalizedProperties } from "@/actions/getPersonalizedProperties";
import { getCurrentUser } from "@/lib/session";
import FeaturedPropertiesClient from "./FeaturedPropertiesClient";

const lexend = Lexend({
  subsets: ["latin"],
  weight: ["600"],
});

async function getProperties() {
  // Get personalized properties for the current user
  return getPersonalizedProperties(8); // Increased to 8 for better variety
}

export default async function FeaturedProperties() {
  const properties = await getProperties();
  const user = await getCurrentUser();

  // Determine if we're showing personalized recommendations
  const isPersonalized = user !== null;

  // Log properties to verify they're being fetched correctly
  console.log(`Fetched ${properties.length} properties for featured section`);

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
                    ? "Properties tailored for you"
                    : "Explore our featured properties"}
                </p>
                <h2
                  className={`${lexend.className} tracking-tight text-3xl font-bold sm:text-4xl my-1`}
                >
                  {isPersonalized
                    ? "Recommended For You"
                    : "Featured Properties"}
                </h2>
              </div>
            </div>

            {isPersonalized && (
              <div className="bg-white/60 backdrop-blur-sm border border-blue-200 rounded-lg p-4 max-w-2xl">
                <p className="text-sm text-gray-700 flex items-center gap-2">
                  <svg
                    className="h-4 w-4 text-blue-500"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Based on your browsing history, preferences, and interactions.
                  We&apos;re constantly learning to show you better matches.
                </p>
              </div>
            )}

            {!isPersonalized && (
              <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg p-4 max-w-2xl">
                <p className="text-sm flex items-center gap-2">
                  <svg
                    className="h-4 w-4"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M3 3a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414-1.414L12.414 15H15a2 2 0 002-2V5a1 1 0 100-2H3zm11.707 4.707a1 1 0 00-1.414-1.414L10 9.586 8.707 8.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Sign up to get personalized property recommendations based on
                  your preferences!
                </p>
              </div>
            )}
          </div>

          <Suspense fallback={<PropertySkeletonGrid count={8} />}>
            {/* Pass properties directly to client component */}
            <FeaturedPropertiesClient
              properties={properties}
              isPersonalized={isPersonalized}
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
                Recommendations update based on your activity
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
