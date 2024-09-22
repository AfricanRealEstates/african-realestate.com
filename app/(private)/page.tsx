import { auth } from "@/auth";
import CityProperties from "@/components/landing/CityProperties";
import CTA from "@/components/landing/cta";
import Facts from "@/components/landing/facts";
import FeaturedProperties from "@/components/landing/featured-properties";
import PartnersCTA from "@/components/landing/partners-cta";
import PropertyAdvice from "@/components/landing/property-advice";
import PropertyType from "@/components/landing/property-type";
import Reviews from "@/components/landing/reviews";
import OurServices from "@/components/landing/services/OurServices";
import Testing from "@/components/landing/testing";
import { getSEOTags, renderSchemaTags } from "@/lib/seo";
import React from "react";

export const metadata = getSEOTags({
  title: "African Real Estate | Premier Properties in Kenya",
  description:
    "Discover your dream home in Kenya with African Real Estate. Browse over 75,000 properties including luxury mansions, apartments, and bungalows in Nairobi, Kiambu, and more.",
  keywords: [
    "Kenya real estate",
    "Nairobi properties",
    "luxury homes Kenya",
    "apartments for rent Nairobi",
    "houses for sale Kiambu",
  ],
  openGraph: {
    title: "Find Your Dream Home in Kenya | African Real Estate",
    description:
      "Explore over 75,000 premium properties across Kenya. From luxurious mansions to modern apartments, find your perfect home with African Real Estate.",
    images: [
      {
        url: "https://africanrealestate.com/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "African Real Estate - Premium Properties in Kenya",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@AfricanRealEstate",
    title: "Discover Your Ideal Property in Kenya",
    description:
      "Browse thousands of high-quality properties across Kenya. Find your dream home with African Real Estate today!",
    images: "https://africanrealestate.com/twitter-card-image.jpg",
  },
  canonicalUrlRelative: "/",
});

export default async function Home() {
  return (
    <div className="home-page">
      {renderSchemaTags()}
      <h1 className="sr-only">
        African Real Estate - Premier Properties in Kenya
      </h1>
      <Testing />
      <FeaturedProperties />
      <OurServices />
      <Facts />
      <CityProperties />
      <PropertyAdvice />
      <Reviews />
    </div>
  );
}
