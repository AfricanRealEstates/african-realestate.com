import React from "react";
import { prisma } from "@/lib/prisma";
import { Raleway } from "next/font/google";
import { EnvelopeIcon, PhoneIcon } from "@heroicons/react/20/solid";
import {
  Banknote,
  Bath,
  Bed,
  Bus,
  BusFront,
  Church,
  ExpandIcon,
  FolderOpen,
  Home,
  Hospital,
  LandPlot,
  MapPin,
  School2,
  ShoppingBag,
  ShoppingBasket,
  ShoppingCart,
  Siren,
} from "lucide-react";
import { Metadata } from "next";
import ImageCarousel from "./_components/image-carousel";
import Link from "next/link";
import NotFound from "@/app/not-found";
import { auth } from "@/auth";
import Badge from "./_components/badge";
import Amenities from "./_components/amenities";
import OverviewInfo from "./_components/overview-info";
import Image from "next/image";
import { Button } from "@/components/utils/Button";
import MessageWidget from "./_components/message-widget";
import { calculatePercentageSavings, capitalizeWords } from "@/lib/utils";
import {
  FaBuyNLarge,
  FaChurch,
  FaGolfBall,
  FaMosque,
  FaPlaceOfWorship,
} from "react-icons/fa";
import SurroundingFeatures from "./_components/surrounding-features";
import PropertyCard from "@/components/properties/new/PropertyCard";
import { formatNumber } from "@/lib/formatter";
import { PropertyData, PropertyWithExtras } from "@/lib/types";
import PropertyActions from "./_components/PropertyActions";
import { getCurrentUser } from "@/lib/session";
import { recordPropertyView } from "@/actions/recordPropertyView";
import PropertyViewsStats from "./_components/PropertyViewsStats";

const amenityIcons: { [key: string]: JSX.Element } = {
  mosque: <FaMosque className="size-4 text-neutral-600" />,
  church: <Church className="size-4 text-neutral-600" />,
  temple: <FaPlaceOfWorship className="size-4 text-neutral-600" />,
  market: <ShoppingBag className="size-4 text-neutral-600" />,
  mall: <Home className="size-4 text-neutral-600" />,
  golf: <FaGolfBall className="size-4 text-neutral-600" />,
  shopping: <ShoppingCart className="size-4 text-neutral-600" />,
  supermarket: <ShoppingBasket className="size-4 text-neutral-600" />,
  playground: <LandPlot className="size-4 text-neutral-600" />,
  busstop: <Bus className="size-4 text-neutral-600" />,
  policestation: <Siren className="size-4 text-neutral-600" />,
  banks: <Banknote className="size-4 text-neutral-600" />,
};

// no cache
export const dynamic = "force-dynamic";

interface PropertyDetailsProps {
  params: {
    id: string;
    propertyDetails: string;
  };
}

export async function generateMetadata({
  params: { id },
}: PropertyDetailsProps): Promise<Metadata> {
  const property = await prisma.property.findUnique({
    where: { id },
  });

  if (!property) {
    return { title: "Property Not Found" };
  }

  const title = `${capitalizeWords(property.title)} | African Real Estate`;
  const description = property.description.substring(0, 200);
  const imageUrl =
    property.coverPhotos[0] || "/assets/default-property-image.jpg";
  const fullUrl = `https://www.african-realestate.com/properties/${property.propertyDetails}/${property.id}`;
  const formattedPrice = `${
    property.currency
  } ${property.price.toLocaleString()}`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: fullUrl,
      siteName: "African Real Estate",
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: property.title,
        },
      ],
      locale: "en_US",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      site: "@AfricanRealEsta",
      creator: "@AfricanRealEsta",
      images: [imageUrl],
    },
    alternates: {
      canonical: fullUrl,
    },
    other: {
      "og:price:amount": property.price.toString(),
      "og:price:currency": property.currency,
      "og:availability": property.status === "sale" ? "for sale" : "to let",
      "og:image:width": "1200",
      "og:image:height": "630",
      "twitter:label1": "Price",
      "twitter:data1": formattedPrice,
      "twitter:label2": "Status",
      "twitter:data2": property.status === "sale" ? "For Sale" : "To Let",
      "twitter:label3": "Location",
      "twitter:data3": `${property.locality}, ${property.county}`,
      "whatsapp:title": title,
      "whatsapp:description": `${description} - ${formattedPrice}`,
      "whatsapp:image": imageUrl,
    },
  };
}

const formatName = (name: string | null): string => {
  if (!name) return "N/A";

  const names = name.trim().split(/\s+/);
  if (names.length === 1) return name;

  const firstName = names[0];
  const lastName = names.slice(1).join(" ");
  return `${firstName[0]}. ${lastName}`;
};

function formatPhoneNumber(phoneNumber: any) {
  // Remove all non-digit characters
  const cleaned = ("" + phoneNumber).replace(/\D/g, "");

  // Check if the number has a country code
  if (cleaned.length > 10) {
    // If it does, format it with a plus sign
    return "+" + cleaned;
  } else {
    // If it doesn't, assume it's a local number and add the country code
    return "+1" + cleaned; // Replace +1 with your country code if not US/Canada
  }
}

export default async function PropertyDetails({
  params: { id },
}: PropertyDetailsProps) {
  const session = await auth();
  const user = await getCurrentUser();
  // const userId = await getUserId();

  const property = (await prisma.property.findUnique({
    where: {
      id: id,
    },
  })) as PropertyWithExtras;

  if (!property) {
    return <NotFound />;
  }

  // Only record view if the user is not the property owner
  if (user?.id !== property.userId) {
    await recordPropertyView(property.id);
  }

  const savings =
    property.leastPrice !== null
      ? calculatePercentageSavings(property.price, property.leastPrice)
      : null;

  let priceRange = {
    // Define default price range of +/- 50000 from the property's price
    gte: property.price - 50000,
    lte: property.price + 50000,
  };

  if (property.status === "sale") {
    // Adjust price range based on property status (sale)
    if (property.price >= 0 && property.price <= 10000000) {
      priceRange = {
        gte: 2000000, // Adjust price range for sale properties between 0 to 10 million
        lte: 4000000,
      };
    } else if (property.price > 10000000 && property.price <= 20000000) {
      priceRange = {
        gte: 4000000, // Adjust price range for sale properties between 11 to 20 million
        lte: 6000000,
      };
    } else if (property.price > 20000000 && property.price <= 30000000) {
      priceRange = {
        gte: 6000000, // Adjust price range for sale properties between 21 to 30 million
        lte: 10000000,
      };
    }
  }

  const relatedProperties = await prisma.property.findMany({
    where: {
      NOT: {
        id: id, // Exclude the current property
      },
      AND: [
        { propertyDetails: property.propertyDetails }, // First priority: same property details
        { status: property.status }, // Second priority: same status
        {
          price: {
            gte: property.price * 0.8, // Price range: 80% to 120% of the current property's price
            lte: property.price * 1.2,
          },
        },
        { county: property.county }, // Fourth priority: same county
      ],
    },
    orderBy: [
      { propertyDetails: "asc" },
      { status: "asc" },
      { price: "asc" },
      { county: "asc" },
    ],
    take: 3, // Limit to 3 related properties
  });

  const agent = await prisma.user.findUnique({
    where: {
      id: property.userId,
    },
    include: {
      properties: true,
    },
  });

  if (!agent) {
    return <NotFound />;
  }

  const getDetail = ({
    name,
    value,
  }: {
    name: string;
    value: string | number;
  }) => {
    return (
      <div className="flex justify-between">
        <span className="text-sm text-gray-600">{name}</span>
        <span className="text-sm text-gray-600">{value}</span>
      </div>
    );
  };

  const getSectionTitle = (title: string) => (
    <div>
      <h2 className="text-xl font-bold text-gray-700">{title}</h2>
      <hr className="border border-gray-50 my-3" />
    </div>
  );

  const convertToAcres = (size: number, units: string): number => {
    switch (units.toLowerCase()) {
      case "ha":
        // Conversion factor: 1 hectare = 2.47105 acres
        return size * 2.47105;
      case "acres":
        return size;
      case "sqft":
        // Conversion factor: 1 acre = 43560 square feet
        return size / 43560;
      case "sqm":
        // Conversion factor: 1 acre = 4046.86 square meters
        return size / 4046.86;
      default:
        return size;
    }
  };

  let convertedLandSize = null;
  if (property.landSize && property.landUnits) {
    convertedLandSize = convertToAcres(property.landSize, property.landUnits);
  }

  const renderSection1 = () => {
    return (
      <div className="w-full flex flex-col sm:rounded-2xl border-b sm:border-t sm:border-l sm:border-r border-neutral-200  sm:space-y-4 pb-1 px-0 sm:p-4 xl:p-4 !space-y-4">
        {/* 1 */}
        <div className="flex justify-between items-center w-full">
          <Badge name="Location Info" />
          {/* <PropertyViewsStats propertyId={property.id} /> */}
          <PropertyActions property={property} userId={user?.id} className="" />
        </div>

        <div className="flex items-center space-x-4 mb-8">
          <span className="flex items-center bg-neutral-100 rounded-full px-2">
            <MapPin className="size-4" />
            <span className="py-1.5 px-3 text-sm flex rounded-lg capitalize">
              {property.locality}, {property.county}
            </span>
          </span>
        </div>
        <div className="w-full border-b border-neutral-100 my-6" />
        <div className="flex flex-col space-y-2">
          <h2 className="text-2xl font-semibold mb-3">Salient Features</h2>
          <div className="grid grid-cols-3 xl:grid-cols-3 gap-6 text-sm text-neutral-700 mt-8">
            {property.bedrooms && property.bedrooms > 0 && (
              <div className="flex items-center space-x-3 ">
                <Bed className="size-4 text-blue-600" />
                <span className="ml-1">
                  {property.bedrooms}{" "}
                  <span className="sm:inline-block text-ellipsis">
                    {property.propertyType === "Commercial" ||
                    property.propertyType === "Industrial"
                      ? "Parkings"
                      : "Bedrooms"}
                  </span>
                </span>
              </div>
            )}
            {property.bathrooms && property.bathrooms > 0 && (
              <div className="flex items-center space-x-3">
                <Bath className="size-4 text-blue-600" />
                <span className="ml-1">
                  {property.bathrooms}{" "}
                  <span className="sm:inline-block text-ellipsis">baths</span>
                </span>
              </div>
            )}
            {convertedLandSize && (
              <div className="flex items-center space-x-3">
                <ExpandIcon className="size-4 text-blue-600" />
                <span className="">
                  {convertedLandSize.toPrecision(3)}{" "}
                  <span className="sm:inline-block capitalize text-ellipsis">
                    {" "}
                    acres
                  </span>
                </span>
              </div>
            )}
          </div>

          <Amenities amenities={property.appliances} />
        </div>
      </div>
    );
  };

  const getPropertyDetails = (property: any) => {
    switch (property.propertyType) {
      case "Residential":
        return (
          <>
            <p className="text-sm font-medium text-gray-500">
              Plinth Area:
              <span className="ml-2 bg-gray-50 text-indigo-500 px-2 py-1 rounded-full">
                {formatNumber(property.plinthArea)} Sq.m
              </span>
            </p>
            {property.bedrooms && (
              <p className="text-sm font-medium text-gray-500">
                Number of Bedrooms:
                <span className="ml-2 bg-gray-50 text-indigo-500 px-2 py-1 rounded-full">
                  {property.bedrooms}
                </span>
              </p>
            )}
            <p className="text-sm font-medium text-gray-500">
              Size of Land:
              <span className="ml-2 bg-gray-50 text-indigo-500 px-2 py-1 rounded-full">
                {convertedLandSize?.toPrecision(3)} Acres
              </span>
            </p>
          </>
        );
      case "Commercial":
      case "Industrial":
      case "Vacational / Social":
        return (
          <>
            <p className="text-sm font-medium text-gray-500">
              Plinth Area:
              <span className="ml-2 bg-gray-50 text-indigo-500 px-2 py-1 rounded-full">
                {formatNumber(property.plinthArea)} Sq.m
              </span>
            </p>
            {property.bathrooms && (
              <p className="text-sm font-medium text-gray-500">
                Number of Bathrooms:
                <span className="ml-2 bg-gray-50 text-indigo-500 px-2 py-1 rounded-full">
                  {property.bathrooms}
                </span>
              </p>
            )}
            {property.bedrooms && (
              <p className="text-sm font-medium text-gray-500">
                Number of Parkings:
                <span className="ml-2 bg-gray-50 text-indigo-500 px-2 py-1 rounded-full">
                  {property.bedrooms}
                </span>
              </p>
            )}
          </>
        );
      case "Land":
        return (
          <>
            <p className="text-sm font-medium text-gray-500">
              Land Size:
              <span className="ml-2 capitalize bg-gray-50 text-indigo-500 px-2 py-1 rounded-full">
                {convertedLandSize?.toPrecision(3)} Acres
              </span>
            </p>
            <p className="text-sm font-medium text-gray-500">
              Tenure:
              <span className="ml-2 capitalize bg-gray-50 text-indigo-500 px-2 py-1 rounded-full">
                {property.tenure}
              </span>
            </p>
            {property.tenure === "leasehold" ||
            property.tenure === "sectionalTitle" ? (
              <p className="text-sm font-medium text-gray-500">
                Years Left:
                <span className="ml-2 bg-gray-50 text-indigo-500 px-2 py-1 rounded-full">
                  {property.yearsLeft}
                </span>
              </p>
            ) : (
              <p className="text-sm font-medium text-gray-500">
                {/* Years Left: */}
                <span className="ml-2 bg-white text-indigo-500 px-2 py-1 rounded-full">
                  {/* {property.yearsLeft} */}
                </span>
              </p>
            )}
          </>
        );
      default:
        return null;
    }
  };

  const featureIcons: { [key: string]: JSX.Element } = {
    mosque: <FaMosque className="size-4 text-[#eb6753]" />,
    church: <FaChurch className="size-4 text-[#eb6753]" />,
    temple: <FaPlaceOfWorship className="size-4 text-[#eb6753]" />,
    market: <FaBuyNLarge className="size-4 text-[#eb6753]" />,
    mall: <ShoppingBag className="size-4 text-[#eb6753]" />,
    school: <School2 className="size-4 text-[#eb6753]" />,
    hospital: <Hospital className="size-4 text-[#eb6753]" />,
    golf: <FaGolfBall className="size-4 text-[#eb6753]" />,
    shopping: <ShoppingBag className="size-4 text-[#eb6753]" />,
    supermarket: <FaBuyNLarge className="size-4 text-[#eb6753]" />,
    playground: <LandPlot className="size-4 text-[#eb6753]" />,
    busstop: <BusFront className="size-4 text-[#eb6753]" />,
    policestation: <Siren className="size-4 text-[#eb6753]" />,
    banks: <Banknote className="size-4 text-[#eb6753]" />,
  };

  const renderSidebar = () => {
    return (
      <>
        <SurroundingFeatures property={property} />
      </>
    );
  };

  return (
    <div className="bg-white py-12 md:py-0">
      <div className="mx-auto max-w-7xl px-4 pt-12 lg:pt-32 pb-8 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-y-4 ">
          <nav aria-label="Breadcrumb">
            <ol className="mx-auto flex mt-4 items-center space-x-2 lg:max-w-7xl">
              <div className="flex items-center gap-4">
                <Link href="/">Home</Link>
                <svg
                  viewBox="0 0 6 20"
                  aria-hidden="true"
                  className="h-5 w-auto text-gray-300"
                >
                  <path
                    d="M4.878 4.34H3.551L.27 16.532h1.327l3.281-12.19z"
                    fill="currentColor"
                  />
                </svg>
                <Link href="/properties">Properties</Link>
                <svg
                  viewBox="0 0 6 20"
                  aria-hidden="true"
                  className="h-5 w-auto text-gray-300"
                >
                  <path
                    d="M4.878 4.34H3.551L.27 16.532h1.327l3.281-12.19z"
                    fill="currentColor"
                  />
                </svg>
              </div>
              <li className="text-sm overflow-hidden whitespace-nowrap max-w-[10rem] md:max-w-[15rem] lg:max-w-[20rem]">
                <Link
                  href={property.id}
                  aria-current="page"
                  className="text-indigo-400 hover:text-indigo-600"
                  title={property.title} // Add a title attribute with the full property title
                >
                  {property.title.length > 30
                    ? `${property.title.substring(0, 30)}...`
                    : property.title}{" "}
                </Link>
              </li>
            </ol>
          </nav>
          <p className="text-sm text-gray-500 inline-flex gap-1 items-center">
            #ARE:
            <Link
              href={`/properties/${property.propertyDetails}`}
              className="ml-1 rounded-full bg-neutral-50 px-2 py-1 text-sm text-indigo-500 hover:bg-blue-100 hover:text-indigo-600 transition-all"
            >
              {property.propertyDetails}
            </Link>
          </p>
          <h2 className="text-2xl font-bold tracking-tight text-gray-900 capitalize lg:text-4xl">
            {property.title}
          </h2>
        </div>

        <section className="flex flex-col lg:flex-row mt-8 w-full h-full">
          <ImageCarousel
            property={property}
            whatsappNumber={agent.whatsappNumber}
          />

          <div className="flex-grow lg:mt-0 h-full">
            <article className="flex flex-col-reverse h-full mb-8">
              <div className="flex flex-col gap-4">
                <div className="space-y-8 w-full flex flex-col sm:rounded-2xl border-b sm:border-t sm:border-l sm:border-r border-neutral-200 sm:space-y-6 px-0 sm:p-4 xl:p-4">
                  <div className="flex items-center justify-between pt-4 lg:pt-0">
                    <p className="rounded-full font-semibold w-fit bg-neutral-50 px-2 py-1 text-indigo-500">
                      {property.status === "let" ? "To " : "For "}
                      <span className="capitalize">{property.status}</span>
                    </p>
                    {savings && parseFloat(savings) > 0 ? (
                      <p className="text-xs font-medium text-rose-400 bg-gray-50 px-4 py-1 rounded-full">
                        Save {savings}%
                      </p>
                    ) : null}
                  </div>
                  <div className="flex items-center">
                    <div className="flex-1">
                      <h2 className="inline-flex text-xl font-medium gap-x-1.5 items-center text-gray-500">
                        {property.status === "let" ? (
                          <span>Rent:</span>
                        ) : (
                          <span>Price:</span>
                        )}
                        <span className="bg-gray-50 text-indigo-500 px-2 rounded-full text-xl font-semibold">
                          <span className="">
                            {property.currency === "USD" ? "$" : "Ksh. "}{" "}
                          </span>
                          <span className=" tracking-tight">
                            {property.price.toLocaleString()}
                          </span>
                        </span>
                      </h2>

                      {property.status === "let" && (
                        <span className="font-medium">
                          {property.propertyType === "Vacational / Social"
                            ? "/ Per Day"
                            : "/ Per Month"}
                        </span>
                      )}
                    </div>
                  </div>

                  <h2 id="information-heading" className="sr-only">
                    Property price
                  </h2>
                  {getPropertyDetails(property)}
                  {/* HEADING */}
                  <h2 className="text-2xl font-semibold">Agent Information</h2>
                  <div className="w-full border-b border-neutral-200"></div>

                  <section className="flex lg:flex-row gap-3">
                    <div className="space-y-3 flex-1">
                      <div className="flex items-center space-x-4">
                        <div>
                          {agent.role === "AGENCY" ? (
                            <>
                              <p className="block text-lg text-indigo-500 font-medium">
                                {formatName(agent?.name)} -{" "}
                                {agent.agentName || "No agency name yet"}
                              </p>
                            </>
                          ) : (
                            <p className="block text-lg text-indigo-500 font-medium">
                              {formatName(agent.name)}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="block text-neutral-500 space-y-4">
                        <h3 className="font-medium text-gray-900">
                          Contact Agent
                        </h3>
                        <ul
                          className="mt-4 flex items-center space-x-8"
                          role="list"
                        >
                          <li>
                            <Link
                              target="_blank"
                              rel="noopener noreferrer"
                              href={`https://wa.me/${agent.whatsappNumber}`}
                              className="flex size-6 items-center justify-center text-gray-400 hover:text-gray-500"
                            >
                              <span className="sr-only">
                                Contact on Whatsapp
                              </span>
                              <svg
                                viewBox="0 0 256 259"
                                width="256"
                                height="259"
                                xmlns="http://www.w3.org/2000/svg"
                                preserveAspectRatio="xMidYMid"
                                className="size-6"
                              >
                                <path
                                  d="m67.663 221.823 4.185 2.093c17.44 10.463 36.971 15.346 56.503 15.346 61.385 0 111.609-50.224 111.609-111.609 0-29.297-11.859-57.897-32.785-78.824-20.927-20.927-48.83-32.785-78.824-32.785-61.385 0-111.61 50.224-110.912 112.307 0 20.926 6.278 41.156 16.741 58.594l2.79 4.186-11.16 41.156 41.853-10.464Z"
                                  fill="#00E676"
                                />
                                <path
                                  d="M219.033 37.668C195.316 13.254 162.531 0 129.048 0 57.898 0 .698 57.897 1.395 128.35c0 22.322 6.278 43.947 16.742 63.478L0 258.096l67.663-17.439c18.834 10.464 39.76 15.347 60.688 15.347 70.453 0 127.653-57.898 127.653-128.35 0-34.181-13.254-66.269-36.97-89.986ZM129.048 234.38c-18.834 0-37.668-4.882-53.712-14.648l-4.185-2.093-40.458 10.463 10.463-39.76-2.79-4.186C7.673 134.63 22.322 69.058 72.546 38.365c50.224-30.692 115.097-16.043 145.79 34.181 30.692 50.224 16.043 115.097-34.18 145.79-16.045 10.463-35.576 16.043-55.108 16.043Zm61.385-77.428-7.673-3.488s-11.16-4.883-18.136-8.371c-.698 0-1.395-.698-2.093-.698-2.093 0-3.488.698-4.883 1.396 0 0-.697.697-10.463 11.858-.698 1.395-2.093 2.093-3.488 2.093h-.698c-.697 0-2.092-.698-2.79-1.395l-3.488-1.395c-7.673-3.488-14.648-7.674-20.229-13.254-1.395-1.395-3.488-2.79-4.883-4.185-4.883-4.883-9.766-10.464-13.253-16.742l-.698-1.395c-.697-.698-.697-1.395-1.395-2.79 0-1.395 0-2.79.698-3.488 0 0 2.79-3.488 4.882-5.58 1.396-1.396 2.093-3.488 3.488-4.883 1.395-2.093 2.093-4.883 1.395-6.976-.697-3.488-9.068-22.322-11.16-26.507-1.396-2.093-2.79-2.79-4.883-3.488H83.01c-1.396 0-2.79.698-4.186.698l-.698.697c-1.395.698-2.79 2.093-4.185 2.79-1.395 1.396-2.093 2.79-3.488 4.186-4.883 6.278-7.673 13.951-7.673 21.624 0 5.58 1.395 11.161 3.488 16.044l.698 2.093c6.278 13.253 14.648 25.112 25.81 35.575l2.79 2.79c2.092 2.093 4.185 3.488 5.58 5.58 14.649 12.557 31.39 21.625 50.224 26.508 2.093.697 4.883.697 6.976 1.395h6.975c3.488 0 7.673-1.395 10.464-2.79 2.092-1.395 3.487-1.395 4.882-2.79l1.396-1.396c1.395-1.395 2.79-2.092 4.185-3.487 1.395-1.395 2.79-2.79 3.488-4.186 1.395-2.79 2.092-6.278 2.79-9.765v-4.883s-.698-.698-2.093-1.395Z"
                                  fill="#FFF"
                                />
                              </svg>
                            </Link>
                          </li>
                          <li>
                            <Link
                              target="_blank"
                              rel="noopener noreferrer"
                              href={`tel:${formatPhoneNumber(
                                agent.phoneNumber
                              )}`}
                              className="flex size-6 items-center justify-center text-gray-400 hover:text-gray-500"
                            >
                              <span className="sr-only">Call Agent</span>
                              <PhoneIcon
                                className="size-6"
                                aria-hidden="true"
                              />
                            </Link>
                          </li>
                          <li>
                            <Link
                              target="_blank"
                              rel="noopener noreferrer"
                              href={`mailto:${agent.email}`}
                              className="flex size-6 items-center justify-center text-gray-400 hover:text-gray-500"
                            >
                              <span className="sr-only">Email Agent</span>
                              <EnvelopeIcon
                                className="size-6"
                                aria-hidden="true"
                              />
                            </Link>
                          </li>
                        </ul>
                      </div>
                    </div>

                    <div className="bg-white h-full border-l border-neutral-100 w-full flex-1 flex gap-y-4 lg:justify-center lg:items-center">
                      {agent.image ? (
                        <Image
                          height={100}
                          width={100}
                          src={agent.image}
                          alt="Agent"
                          className="object-cover lg:h-28 lg:w-28 h-36 w-36 ml-4 lg:ml-0 rounded-full border border-gray-200"
                        />
                      ) : (
                        <Image
                          height={100}
                          width={100}
                          src="/assets/placeholder.jpg"
                          alt="Placeholder"
                          className="object-cover lg:h-28 lg:w-28 h-36 w-36 ml-4 lg:ml-0 rounded-full"
                        />
                      )}
                    </div>
                  </section>

                  {/* == */}
                  <div className="w-full border-b border-neutral-200"></div>
                  <div className="flex lg:items-center lg:justify-center w-full mb-12">
                    <Button
                      href={
                        // user?.role === "AGENT"
                        //   ? `/agents/${agent.id}`
                        //   :
                        `/agencies/${agent.id}`
                      }
                      color="blue"
                      className="mb-8 lg:mb-0" // Added margin-bottom for mobile
                    >
                      {user?.role === "AGENT"
                        ? "View all agent's properties"
                        : "View all agency's properties"}
                    </Button>
                  </div>
                </div>
              </div>
            </article>
          </div>
        </section>

        <main className="relative z-10 mt-8 flex flex-col lg:flex-row h-full">
          <section className="w-full lg:w-3/5 xl:w-2/3 space-y-8 lg:space-y-10 lg:pr-10 flex flex-col">
            {renderSection1()}

            {/* Add SurroundingFeatures for mobile view */}
            <div className="lg:hidden mt-8">
              <SurroundingFeatures property={property} />
            </div>
            <div className="flex-grow">
              <OverviewInfo
                description={property.description}
                serviceCharge={property.serviceCharge}
                currency={property.currency}
              />
            </div>
          </section>
          <section className="hidden lg:flex lg:w-2/5 xl:w-1/3 mt-14 lg:mt-0 flex-col">
            <div className="flex-grow">
              <SurroundingFeatures property={property} />
            </div>
          </section>
        </main>

        <MessageWidget />
        <section className="mx-auto mt-12 max-w-2xl sm:mt-12 lg:max-w-none">
          <div className="flex items-center justify-between space-x-4">
            <h2 className="text-lg lg:text-xl font-medium text-gray-950">
              Related Properties
            </h2>
            <Link
              href="/properties"
              className="flex items-center gap-2 whitespace-nowrap text-base/6 font-medium hover:underline underline-offset-4 text-indigo-600 hover:text-indigo-500 transition-all ease-linear"
            >
              View all
              <span aria-hidden="true">&rarr;</span>
            </Link>
          </div>
          {relatedProperties.length > 0 ? (
            <div className="mt-6 grid grid-cols-1 gap-x-8 gap-y-8 sm:grid-cols-2 sm:gap-y-10 lg:grid-cols-3">
              {relatedProperties.map((property) => (
                <PropertyCard
                  key={property.id}
                  data={property as PropertyData}
                />
              ))}
            </div>
          ) : (
            <Link
              href="/properties"
              className="mt-6 flex flex-col gap-y-4 items-center justify-center relative w-full rounded-lg border-2 border-dashed border-gray-300 p-12 text-center hover:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              <FolderOpen className="size-9 text-indigo-400" />
              <span className="mt-2 block text-sm font-semibold text-gray-900">
                No related properties
              </span>
              <span>Explore more properties</span>
            </Link>
          )}
        </section>
      </div>
    </div>
  );
}
