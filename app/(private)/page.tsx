import CityProperties from "@/components/landing/CityProperties";
import Facts from "@/components/landing/facts";
import FeaturedProperties from "@/components/landing/featured-properties";
import PropertyAdvice from "@/components/landing/property-advice";
import Reviews from "@/components/landing/reviews";
import OurServices from "@/components/landing/services/OurServices";
import Testing from "@/components/landing/testing";
import { getSEOTags, renderSchemaTags } from "@/lib/seo";

export const metadata = getSEOTags({
  title: "Home | African Real Estate",
  canonicalUrlRelative: "/",
});

export default async function Home() {
  return (
    <div className="home-page">
      {renderSchemaTags()}
      <h1 className="sr-only">Home page</h1>
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
