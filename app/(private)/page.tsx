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
  title: "Home | African Real Estate",
  canonicalUrlRelative: "/",
});

export default async function Home() {
  const session = await auth();
  const user = session?.user;

  return (
    <div className="">
      {renderSchemaTags()}
      {/* <div className="bg-[#181a20] p-8">
      <h1 className="text-[#eb6753] bg-[#ffffff0a] p-4">Home page</h1>
      <p className="text-white hover:text-[#bebdbd] bg-[#f7f7f7]">White</p>
    </div> */}

      <Testing />
      {/* <Hero /> */}
      <FeaturedProperties />
      {/* <PropertyType /> */}
      <OurServices />
      {/* <Sale />
      <HowItWorks /> */}
      <Facts />
      {/* <PartnersCTA /> */}
      <CityProperties />
      <PropertyAdvice />
      <Reviews />
      {/* <CTA /> */}

      {/* <GetQuote /> */}
    </div>
  );
}
