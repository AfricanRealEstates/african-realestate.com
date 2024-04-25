import { auth } from "@/auth";
import CTA from "@/components/landing/cta";
import Facts from "@/components/landing/facts";
import FeaturedProperties from "@/components/landing/featured-properties";
import GetQuote from "@/components/landing/get-quote";
import Hero from "@/components/landing/hero";
import HowItWorks from "@/components/landing/how-it-works";
import Sale from "@/components/landing/sale";
import Testing from "@/components/landing/testing";
import { getSEOTags, renderSchemaTags } from "@/lib/seo";

export const metadata = getSEOTags({
  title: "Home | African Real Estate",
  canonicalUrlRelative: "/",
});

export default async function Home() {
  const session = await auth();
  const user = session?.user;
  console.log(user);

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
      <Sale />
      <HowItWorks />
      <Facts />
      <CTA />
      {/* <GetQuote /> */}
    </div>
  );
}
