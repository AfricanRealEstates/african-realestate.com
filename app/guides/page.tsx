import { Metadata } from "next";
import { propertyTypes, propertyStatuses } from "./PropertyData";
import GuidesContent from "./GuidesContent";

export const metadata: Metadata = {
  title: "Property Guides | African Real Estate",
  description:
    "Comprehensive guides on various property types in Africa, including residential, commercial, industrial, and more.",
  openGraph: {
    title: "Property Guides | African Real Estate",
    description:
      "Explore our detailed guides on different property types across Africa. From residential to commercial, find the information you need.",
    url: "https://www.african-realestate.com/guides",
    siteName: "African Real Estate",
    images: [
      {
        url: "https://www.african-realestate.com/opengraph-image.jpg",
        width: 1200,
        height: 630,
        alt: "African Real Estate Property Guides",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Property Guides | African Real Estate",
    description:
      "Comprehensive guides on various property types in Africa. Explore residential, commercial, industrial, and more.",
    images: ["https://www.african-realestate.com/twitter-image.jpg"],
  },
  alternates: {
    canonical: "https://www.african-realestate.com/guides",
  },
};

export default function GuidesPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="w-[95%] lg:max-w-7xl mx-auto py-[100px] lg:py-[160px]">
        <h1 className="text-3xl font-bold mb-12 text-center text-gray-500 tracking-tight">
          Property Guides
        </h1>
        <GuidesContent
          propertyTypes={propertyTypes}
          propertyStatuses={propertyStatuses}
        />
      </div>
    </div>
  );
}
