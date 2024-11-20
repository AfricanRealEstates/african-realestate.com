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
