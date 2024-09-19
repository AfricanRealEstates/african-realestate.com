import Filter from "@/components/globals/filters";
import Loader from "@/components/globals/loader";
import AllProperties from "@/components/properties/all-properties";
import { getSEOTags } from "@/lib/seo";
import { Raleway } from "next/font/google";
import React, { Suspense } from "react";
import { Metadata } from "next";
import { baseUrl } from "@/app/sitemap";

const raleway = Raleway({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-nunitosans",
});

export async function generateMetadata(): Promise<Metadata> {
  const title = "Properties | African Real Estate";
  const description =
    "Explore our wide range of properties across Africa. Find your dream home or next investment opportunity.";
  const canonicalUrlRelative = "/properties";

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "website",
      url: `${baseUrl}${canonicalUrlRelative}`,
      images: [
        {
          url: `${baseUrl}/assets/properties-og.jpg`,
          width: 1200,
          height: 630,
          alt: "African Real Estate Properties",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [`${baseUrl}/assets/properties-og.jpg`],
    },
    alternates: {
      canonical: `${baseUrl}${canonicalUrlRelative}`,
    },
  };
}

export default function Properties({ searchParams }: { searchParams: string }) {
  const key = JSON.stringify(searchParams);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "RealEstateAgent",
            name: "African Real Estate",
            description:
              "Explore our wide range of properties across Africa. Find your dream home or next investment opportunity.",
            url: `${baseUrl}/properties`,
            logo: `${baseUrl}/assets/logo.png`,
            sameAs: [
              "https://web.facebook.com/AfricanRealEstateMungaiKihara",
              "https://www.tiktok.com/@africanrealestate",
              "https://www.instagram.com/africanrealestate_/",
            ],
            address: {
              "@type": "PostalAddress",
              streetAddress: "Moi Avenue",
              addressLocality: "Nairobi",
              addressRegion: "Nairobi",
              postalCode: "00100",
              addressCountry: "KE",
            },
            geo: {
              "@type": "GeoCoordinates",
              latitude: "-1.2921",
              longitude: "36.8219",
            },
            openingHoursSpecification: [
              {
                "@type": "OpeningHoursSpecification",
                dayOfWeek: [
                  "Monday",
                  "Tuesday",
                  "Wednesday",
                  "Thursday",
                  "Friday",
                ],
                opens: "07:00",
                closes: "20:00",
              },
            ],
          }),
        }}
      />
      <div
        className={`${raleway.className} w-[95%] lg:max-w-7xl mx-auto py-[90px] lg:py-[120px]`}
      >
        <h1 className="text-3xl font-bold mb-8">Explore Our Properties</h1>
        <Filter searchParams={searchParams} />
        <Suspense fallback={<Loader />} key={key}>
          {searchParams.length === 0 ? (
            <div className="flex h-full items-center justify-center mt-8">
              No properties matched your search query. Please try again with a
              different term.
            </div>
          ) : (
            <div className="mt-8">
              <AllProperties searchParams={searchParams} />
            </div>
          )}
        </Suspense>
      </div>
    </>
  );
}
