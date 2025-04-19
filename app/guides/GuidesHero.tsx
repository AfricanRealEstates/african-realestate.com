import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function GuidesHero() {
  return (
    <div className="relative bg-gray-900 text-white py-16">
      {/* Background Image with dark overlay */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-black opacity-90 z-10"></div>
        <div className="absolute inset-0 bg-[url('/assets/house-1.jpg')] bg-center bg-cover z-0"></div>
      </div>

      <div className="relative z-20 w-[95%] lg:max-w-7xl mx-auto py-16 lg:py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
            Property Guides
          </h1>
          <p className="mt-6 text-xl text-gray-300 max-w-3xl">
            Comprehensive resources to help you understand different property
            types, investment opportunities, and what to expect when buying or
            renting in Africa.
          </p>

          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              href="/properties"
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 transition-colors duration-300"
            >
              Browse Properties
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
            <Link
              href="/blog"
              className="inline-flex items-center px-6 py-3 border border-white text-base font-medium rounded-md text-white hover:bg-white/10 transition-colors duration-300"
            >
              Read Our Blog
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
