import type { Metadata } from "next";
import GuidesHero from "./guides-hero";
import DynamicGuidesContent from "./dynamic-guides-content";

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

// Define property types and statuses
const propertyTypes = [
  {
    label: "Residential",
    value: "Residential",
    subOptions: [
      { label: "Bungalows", value: "Bungalows" },
      { label: "Mansions", value: "Mansions" },
      { label: "Villas", value: "Villas" },
      { label: "Town Houses", value: "Town Houses" },
      { label: "Duplexes", value: "Duplexes" },
      { label: "Apartments", value: "Apartments" },
      { label: "Others", value: "Others" },
    ],
  },
  {
    label: "Commercial",
    value: "Commercial",
    subOptions: [
      { label: "Office Spaces", value: "Office Spaces" },
      { label: "Shops", value: "shops" },
      { label: "Stalls", value: "Stalls" },
      { label: "Others", value: "Others" },
    ],
  },
  {
    label: "Industrial",
    value: "Industrial",
    subOptions: [
      { label: "Warehouses", value: "Warehouses" },
      { label: "Go Downs", value: "Go Downs" },
      { label: "Parks", value: "Parks" },
      { label: "Flex Spaces", value: "Flex Spaces" },
    ],
  },
  {
    label: "Vacational / Social",
    value: "Vacational / Social",
    subOptions: [
      { label: "Airbnbs", value: "Airbnbs" },
      { label: "Cabins", value: "Cabins" },
      { label: "Cottages", value: "Cottages" },
      { label: "Vacational Homes", value: "Vacational Homes" },
      { label: "Others", value: "Others" },
    ],
  },
  {
    label: "Land",
    value: "Land",
    subOptions: [
      { label: "Plots", value: "Plots" },
      { label: "Farms", value: "Farms" },
      { label: "Others", value: "Others" },
    ],
  },
];

const propertyStatuses = [
  { value: "sale", label: "Sale" },
  { value: "rent", label: "Rent" },
  { value: "sell", label: "Sell" },
];

export default async function GuidesPage() {
  return (
    <div className="min-h-screen bg-white py-16 md:py-24">
      <GuidesHero />
      <div className="max-w-7xl mx-auto py-8 px-4">
        <DynamicGuidesContent
          propertyTypes={propertyTypes}
          propertyStatuses={propertyStatuses}
        />
      </div>
    </div>
  );
}
