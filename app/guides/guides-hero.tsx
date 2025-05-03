import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function GuidesHero() {
  return (
    <div className="relative bg-gradient-to-r from-white to-white py-8 border-b border-gray-300">
      <div className="max-w-7xl mx-auto px-4">
        <div className="max-w-3xl">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
            Property Guides for African Real Estate
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Explore our comprehensive guides to help you navigate the African
            real estate market. Whether you&apos;re buying, selling, or renting,
            we&apos;ve got you covered.
          </p>
          <div className="flex flex-wrap gap-4">
            <Button>
              Browse Properties
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <Button variant="outline">Contact an Agent</Button>
          </div>
        </div>
      </div>

      {/* Decorative elements */}
      <div
        className="absolute bottom-0 left-0 w-full h-16 bg-white"
        style={{ clipPath: "polygon(0 100%, 100% 100%, 100% 0)" }}
      />
    </div>
  );
}
