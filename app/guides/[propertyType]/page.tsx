import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowLeft,
  Home,
  Building,
  Warehouse,
  MapPin,
  Palmtree,
  Map,
  ArrowRight,
} from "lucide-react";
import { propertyTypes } from "../PropertyData";
import { notFound } from "next/navigation";

interface PropertyTypePageProps {
  params: {
    propertyType: string;
  };
  searchParams: {
    status?: string;
  };
}

export async function generateMetadata({
  params,
}: PropertyTypePageProps): Promise<Metadata> {
  const propertyType = decodeURIComponent(
    params.propertyType.replace(/-/g, " ")
  );
  const typeInfo = propertyTypes.find((type) => type.value === propertyType);

  if (!typeInfo) {
    return {
      title: "Property Type Not Found",
    };
  }

  return {
    title: `${typeInfo.label} Properties | African Real Estate`,
    description: `Learn about ${typeInfo.label} properties in Africa. Find information on pricing, features, and investment potential.`,
    openGraph: {
      title: `${typeInfo.label} Properties | African Real Estate`,
      description: `Comprehensive guide to ${typeInfo.label} properties in Africa.`,
    },
  };
}

export default function PropertyTypePage({
  params,
  searchParams,
}: PropertyTypePageProps) {
  const propertyType = decodeURIComponent(
    params.propertyType.replace(/-/g, " ")
  );
  const typeInfo = propertyTypes.find((type) => type.value === propertyType);

  if (!typeInfo) {
    notFound();
  }

  const status = searchParams.status || "sale";

  // Get icon based on property type
  const getTypeIcon = (type: string) => {
    switch (type) {
      case "Residential":
        return <Home className="h-6 w-6" />;
      case "Commercial":
        return <Building className="h-6 w-6" />;
      case "Industrial":
        return <Warehouse className="h-6 w-6" />;
      case "Vacational / Social":
        return <Palmtree className="h-6 w-6" />;
      case "Land":
        return <Map className="h-6 w-6" />;
      default:
        return <MapPin className="h-6 w-6" />;
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
        <div className="w-[95%] lg:max-w-7xl mx-auto py-8 lg:py-12">
          <Link
            href="/guides"
            className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-6"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Guides
          </Link>

          <div className="flex items-center gap-3 mb-2">
            {getTypeIcon(typeInfo.value)}
            <h1 className="text-3xl font-bold text-gray-900">
              {typeInfo.label} Properties
            </h1>
            <span className="text-gray-500 text-xl">
              (For {status === "sale" ? "Sale" : "Rent"})
            </span>
          </div>

          <p className="text-gray-600 max-w-3xl">
            Everything you need to know about {typeInfo.label.toLowerCase()}{" "}
            properties in Africa. Find detailed information, pricing trends, and
            investment insights.
          </p>
        </div>
      </div>

      <div className="w-[95%] lg:max-w-7xl mx-auto py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {typeInfo.subOptions.map((subOption) => (
            <Link
              key={subOption.value}
              href={`/guides/${encodeURIComponent(typeInfo.value.replace(/\s+/g, "-"))}/${encodeURIComponent(subOption.value.replace(/\s+/g, "-"))}?status=${status}`}
              className="group bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all duration-300 ease-in-out flex flex-col h-full"
            >
              <div className="h-48 relative overflow-hidden">
                <Image
                  src={`/assets/house-1.jpg`}
                  alt={subOption.label}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute top-0 left-0 bg-blue-600 text-white px-3 py-1 text-sm font-medium">
                  For {status === "sale" ? "Sale" : "Rent"}
                </div>
              </div>
              <div className="p-6 flex-grow flex flex-col">
                <h3 className="text-xl font-semibold mb-2 text-gray-800 group-hover:text-blue-600 transition-colors">
                  {subOption.label}
                </h3>
                <p className="text-gray-600 mb-4 flex-grow">
                  Learn everything about {subOption.label.toLowerCase()}{" "}
                  properties, including pricing, features, and what to expect
                  when {status === "sale" ? "buying" : "renting"}.
                </p>
                <div className="flex items-center text-blue-600 font-medium group-hover:translate-x-1 transition-transform duration-300">
                  View Guide
                  <ArrowRight className="ml-2 h-4 w-4" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
