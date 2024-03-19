import FeaturedProperties from "@/components/landing/featured-properties";
import Hero from "@/components/landing/hero";
import HowItWorks from "@/components/landing/how-it-works";
import Sale from "@/components/landing/sale";

export default async function Home() {
  return (
    <div className="">
      {/* <div className="bg-[#181a20] p-8">
      <h1 className="text-[#eb6753] bg-[#ffffff0a] p-4">Home page</h1>
      <p className="text-white hover:text-[#bebdbd] bg-[#f7f7f7]">White</p>
    </div> */}

      <Hero />
      <Sale />
      <FeaturedProperties />
      <HowItWorks />
    </div>
  );
}
