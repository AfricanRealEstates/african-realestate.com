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
} from "lucide-react";
import { propertyTypes } from "../../PropertyData";
import { notFound } from "next/navigation";

interface PropertyDetailsPageProps {
  params: {
    propertyType: string;
    propertyDetails: string;
  };
  searchParams: {
    status?: string;
  };
}

export async function generateMetadata({
  params,
}: PropertyDetailsPageProps): Promise<Metadata> {
  const propertyType = decodeURIComponent(
    params.propertyType.replace(/-/g, " ")
  );
  const propertyDetails = decodeURIComponent(
    params.propertyDetails.replace(/-/g, " ")
  );

  const typeInfo = propertyTypes.find((type) => type.value === propertyType);
  const detailsInfo = typeInfo?.subOptions.find(
    (option) => option.value === propertyDetails
  );

  if (!typeInfo || !detailsInfo) {
    return {
      title: "Property Type Not Found",
    };
  }

  return {
    title: `${detailsInfo.label} Properties | African Real Estate`,
    description: `Learn about ${detailsInfo.label} properties in Africa. Find information on pricing, features, and investment potential.`,
    openGraph: {
      title: `${detailsInfo.label} Properties | African Real Estate`,
      description: `Comprehensive guide to ${detailsInfo.label} properties in Africa.`,
    },
  };
}

export default function PropertyDetailsPage({
  params,
  searchParams,
}: PropertyDetailsPageProps) {
  const propertyType = decodeURIComponent(
    params.propertyType.replace(/-/g, " ")
  );
  const propertyDetails = decodeURIComponent(
    params.propertyDetails.replace(/-/g, " ")
  );

  const typeInfo = propertyTypes.find((type) => type.value === propertyType);
  const detailsInfo = typeInfo?.subOptions.find(
    (option) => option.value === propertyDetails
  );

  if (!typeInfo || !detailsInfo) {
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
              {detailsInfo.label}
            </h1>
            <span className="text-gray-500 text-xl">
              (For {status === "sale" ? "Sale" : "Rent"})
            </span>
          </div>

          <p className="text-gray-600 max-w-3xl">
            Everything you need to know about {detailsInfo.label.toLowerCase()}{" "}
            in Africa. Find detailed information, pricing trends, and investment
            insights.
          </p>
        </div>
      </div>

      <div className="w-[95%] lg:max-w-7xl mx-auto py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden mb-8">
              <div className="aspect-video relative">
                <Image
                  src={`/assets/house-1.jpg`}
                  alt={detailsInfo.label}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  Guide to {status === "sale" ? "Buying" : "Renting"}{" "}
                  {detailsInfo.label}
                </h2>

                <div className="prose max-w-none">
                  <h3>What are {detailsInfo.label}?</h3>
                  <p>
                    {detailsInfo.label} are a type of{" "}
                    {typeInfo.label.toLowerCase()} property that offers unique
                    features and benefits. These properties are popular in many
                    African countries and provide excellent opportunities for
                    {status === "sale"
                      ? " investment and homeownership"
                      : " comfortable living arrangements"}
                    .
                  </p>

                  <h3>Key Features</h3>
                  <ul>
                    <li>Typical size and layout</li>
                    <li>Common amenities and facilities</li>
                    <li>Construction quality and materials</li>
                    <li>Location considerations</li>
                    <li>Price ranges and value factors</li>
                  </ul>

                  <h3>{status === "sale" ? "Buying" : "Renting"} Process</h3>
                  <p>
                    The process of{" "}
                    {status === "sale" ? "purchasing" : "renting"}{" "}
                    {detailsInfo.label.toLowerCase()} in Africa typically
                    involves several steps:
                  </p>
                  <ol>
                    <li>Property search and viewing</li>
                    <li>Negotiation and offer</li>
                    <li>
                      {status === "sale"
                        ? "Financing and mortgage options"
                        : "Lease agreement terms"}
                    </li>
                    <li>Legal considerations and documentation</li>
                    <li>
                      Closing the deal and{" "}
                      {status === "sale" ? "taking ownership" : "moving in"}
                    </li>
                  </ol>

                  <h3>Investment Potential</h3>
                  <p>
                    {detailsInfo.label} in Africa offer{" "}
                    {status === "sale"
                      ? "investment potential through:"
                      : "benefits including:"}
                  </p>
                  <ul>
                    <li>
                      {status === "sale"
                        ? "Capital appreciation in growing markets"
                        : "Flexible living arrangements"}
                    </li>
                    <li>
                      {status === "sale"
                        ? "Rental income opportunities"
                        : "Access to amenities and facilities"}
                    </li>
                    <li>
                      {status === "sale"
                        ? "Portfolio diversification"
                        : "Lower maintenance responsibilities"}
                    </li>
                    <li>Location advantages and accessibility</li>
                  </ul>
                </div>

                <div className="mt-8">
                  <Link
                    href={`/properties?propertyType=${encodeURIComponent(typeInfo.value)}&propertyDetails=${encodeURIComponent(detailsInfo.value)}&status=${status}`}
                    className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 transition-colors duration-300"
                  >
                    Browse {detailsInfo.label}
                  </Link>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 sticky top-8">
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                Quick Facts
              </h3>

              <div className="space-y-4">
                <div className="p-4 bg-blue-50 rounded-lg">
                  <h4 className="font-semibold text-blue-800">Average Price</h4>
                  <p className="text-blue-700">
                    {status === "sale"
                      ? "$150,000 - $500,000 (varies by location)"
                      : "$800 - $2,500 per month (varies by location)"}
                  </p>
                </div>

                <div className="p-4 bg-green-50 rounded-lg">
                  <h4 className="font-semibold text-green-800">
                    Popular Locations
                  </h4>
                  <p className="text-green-700">
                    Nairobi, Lagos, Cape Town, Accra, Dar es Salaam
                  </p>
                </div>

                <div className="p-4 bg-amber-50 rounded-lg">
                  <h4 className="font-semibold text-amber-800">Typical Size</h4>
                  <p className="text-amber-700">
                    {typeInfo.value === "Residential"
                      ? "120-350 square meters"
                      : typeInfo.value === "Commercial"
                        ? "200-1000 square meters"
                        : "500-5000 square meters"}
                  </p>
                </div>

                <div className="p-4 bg-purple-50 rounded-lg">
                  <h4 className="font-semibold text-purple-800">
                    Market Trend
                  </h4>
                  <p className="text-purple-700">
                    Growing demand with 5-8% annual appreciation in major cities
                  </p>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-gray-200">
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  Related Properties
                </h3>
                <ul className="space-y-3">
                  {typeInfo.subOptions
                    .filter((option) => option.value !== propertyDetails)
                    .slice(0, 5)
                    .map((option) => (
                      <li key={option.value}>
                        <Link
                          href={`/guides/${encodeURIComponent(typeInfo.value.replace(/\s+/g, "-"))}/${encodeURIComponent(option.value.replace(/\s+/g, "-"))}?status=${status}`}
                          className="text-blue-600 hover:text-blue-800 hover:underline"
                        >
                          {option.label}
                        </Link>
                      </li>
                    ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
