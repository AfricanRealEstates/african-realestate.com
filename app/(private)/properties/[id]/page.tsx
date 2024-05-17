import React from "react";
import prisma from "@/lib/prisma";
import { Property } from "@prisma/client";
import LinkButton from "@/components/properties/link-button";
import { Carousel } from "antd";
import QueryModal from "@/components/globals/query-modal";
import { FaWater, FaWhatsapp } from "react-icons/fa6";
import Image from "next/image";
import { Raleway, IBM_Plex_Mono } from "next/font/google";
import { EnvelopeIcon, PhoneIcon } from "@heroicons/react/20/solid";
import {
  AirVentIcon,
  Bath,
  BathIcon,
  Bed,
  BedSingle,
  Cat,
  ExpandIcon,
  Fence,
  Flower2,
  FolderOpen,
  Grid2X2,
  Heater,
  Home,
  Mail,
  MapPin,
  ParkingCircle,
  Phone,
  Sofa,
  Thermometer,
  Tv,
  Undo,
  Wifi,
} from "lucide-react";

import { FaSwimmingPool } from "react-icons/fa";
import { useRouter } from "next/navigation";
import BackProperty from "@/components/globals/back-property";
import { Metadata } from "next";
import ImageCarousel from "./_components/image-carousel";
import Link from "next/link";
import dayjs from "dayjs";
import NotFound from "@/app/not-found";
import RelatedProperty from "./_components/related-property";
import PropertyCard from "@/components/properties/property-card";
import { auth } from "@/auth";
import Avatar from "@/components/globals/avatar";
import Badge from "./_components/badge";
import LikeSaveBtns from "./_components/like-save-btns";
import Amenities from "./_components/amenities";
import OverviewInfo from "./_components/overview-info";
import { ButtonSecondary } from "@/components/globals/button-secondary";

// no cache
export const dynamic = "force-dynamic";

const ibmPlex = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["700"],
  display: "swap",
  variable: "--font-ibmplex",
});

const raleway = Raleway({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-nunitosans",
});

interface PropertyDetailsProps {
  params: {
    id: string;
  };
}

export async function generateMetadata({
  params: { id },
}: PropertyDetailsProps): Promise<Metadata> {
  const property: Property =
    ((await prisma.property.findUnique({
      where: {
        id: id,
      },
    })) as Property) || null;

  return {
    title: `${property.title} | African Real Estate`,
    // description: post.description,
    // coverImageUrl: post.coverImageUrl,
  };
}

export default async function PropertyDetails({
  params: { id },
}: PropertyDetailsProps) {
  const session = await auth();
  const property: Property =
    ((await prisma.property.findUnique({
      where: {
        id: id,
      },
    })) as Property) || null;

  if (!property) {
    return <NotFound />;
  }

  const relatedProperties = await prisma.property.findMany({
    where: {
      NOT: {
        id: id, // Exclude the fetched property
      },
      AND: [
        {
          OR: [
            { location: property.location }, // Related properties with the same location
            { propertyDetails: property.propertyDetails }, // Related properties with the same property details
            { status: property.status }, // Related properties with the same status
          ],
        },
        {
          price: {
            // Define the price range based on the property's price
            gte: property.price - 50000, // Assuming a range of +/- 50000 from the property's price
            lte: property.price + 50000,
          },
        },
      ],
    },
  });

  if (!relatedProperties) {
    return (
      <>
        <p>No related property</p>
      </>
    );
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

  // Function to convert different land units to hectares
  const convertToHectares = (size: number, units: string): number => {
    switch (units.toLowerCase()) {
      case "ha":
        return size;
      case "acres":
        // Conversion factor: 1 acre = 0.404686 hectares
        return size * 0.404686;
      case "sqft":
        // Conversion factor: 1 hectare = 107639.104 square feet
        return size / 107639.104;
      case "sqm":
        // Conversion factor: 1 hectare = 10000 square meters
        return size / 10000;
      default:
        return size;
    }
  };

  // Converted land size in hectares
  const convertedLandSize = convertToHectares(
    property.landSize,
    property.landUnits
  );

  const renderSection1 = () => {
    return (
      <div className="w-full flex flex-col sm:rounded-2xl border-b sm:border-t sm:border-l sm:border-r border-neutral-200 dark:border-neutral-700 sm:space-y-8 pb-10 px-0 sm:p-4 xl:p-8 !space-y-6">
        {/* 1 */}
        <div className="flex justify-between items-center">
          <Badge name="Property Info" />
          <LikeSaveBtns />
        </div>

        {/* 2 */}
        {/* <h2 className="text-2xl sm:text-3xl lg:text-4xl font-semibold">
          Beach House in Collingwood
        </h2> */}

        {/* 3 */}
        <div className="flex items-center space-x-4">
          <span className="flex items-center bg-neutral-100 rounded-full px-2">
            <MapPin className="size-4" />
            <span className="py-1.5 px-3 text-sm flex rounded-lg">
              {property.locality}, {property.county}
            </span>
          </span>
        </div>

        {/* 4 */}
        <div className="flex items-center">
          <Avatar
            hasChecked
            sizeClass="h-10 w-10"
            radius="rounded-full"
            imgUrl={session?.user.image}
          />
          <span className="ml-2.5 text-neutral-500 dark:text-neutral-400">
            Agent{" "}
            <span className="text-neutral-900 text-sm font-medium">
              {session?.user.agentName}
            </span>
          </span>
        </div>

        {/* 5 */}
        <div className="w-full border-b border-neutral-100 dark:border-neutral-700" />

        {/* 6 */}
        <div className="flex items-center justify-between xl:justify-start space-x-8 xl:space-x-12 text-sm text-neutral-700 dark:text-neutral-300">
          {property.bedrooms > 0 && (
            <div className="flex items-center space-x-3 ">
              <Bed className="size-4 text-neutral-600" />
              <span className="ml-1">
                {property.bedrooms}{" "}
                <span className="hidden sm:inline-block">bedrooms</span>
              </span>
            </div>
          )}

          {property.bathrooms > 0 && (
            <div className="flex items-center space-x-3">
              <Bath className="size-4 text-neutral-600" />
              <span className="ml-1">
                {property.bathrooms}{" "}
                <span className="hidden sm:inline-block">baths</span>
              </span>
            </div>
          )}
          <div className="flex items-center space-x-3">
            <ExpandIcon className="size-4 text-neutral-600" />
            <span className=" ">
              {convertedLandSize.toPrecision(2)}{" "}
              <span className="hidden sm:inline-block">acres</span>
            </span>
          </div>
        </div>
      </div>
    );
  };

  const renderSidebar = () => {
    return (
      <div
        className={`w-full flex flex-col rounded-2xl border-b border-t border-l border-r border-neutral-200  space-y-4 xl:space-y-7 pb-10 p-2 sm:p-4 xl:px-8 xl:py-6 shadow-xl ${raleway.className}`}
      >
        <h2 className="text-xl font-semibold">Send a Quote</h2>
        <div className=" border-b border-neutral-100 dark:border-neutral-700" />
        <div className="text-neutral-600 text-sm">
          Make a quote today and <br /> let us turn your vision into reality!
        </div>
        <div className=" border-b border-neutral-100 dark:border-neutral-700" />
        <QueryModal propertyId={property.id} />
      </div>
    );
  };

  return (
    <div className="bg-white py-12 md:py-0">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
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
          <p className="text-sm text-gray-500">
            #ARE:
            <span className="rounded-full bg-neutral-50 px-2 py-1 text-sm text-indigo-500">
              {property.propertyDetails}
            </span>
          </p>
          <h2 className="text-2xl font-bold tracking-tight text-gray-900 capitalize lg:text-4xl">
            {property.title}
          </h2>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-y-6 lg:grid-cols-3 sm:gap-x-6 lg:gap-8">
          <ImageCarousel property={property} />
          <div className="sm:col-span-1 h-full">
            <article className="flex flex-col-reverse">
              <div className="flex flex-col gap-4">
                <div className="w-full flex flex-col sm:rounded-2xl border-b sm:border-t sm:border-l sm:border-r border-neutral-200 dark:border-neutral-700 space-y-4 sm:space-y-6 px-0 sm:p-4 xl:p-4">
                  <p className="rounded-full font-semibold w-fit bg-neutral-50 px-2 py-1 text-indigo-500">
                    For {property.status}
                  </p>
                  <h2 className="inline-flex text-xl font-medium gap-x-1.5 items-center text-gray-500">
                    Price:
                    <span className="bg-gray-50 text-indigo-500 px-2 rounded-full text-3xl font-semibold">
                      <span className="">{property.currency} </span>
                      <span className=" tracking-tight">
                        {property.price.toLocaleString()}
                      </span>
                    </span>
                  </h2>
                  <h2 id="information-heading" className="sr-only">
                    Property price
                  </h2>
                  <p className="text-sm font-medium text-gray-500">
                    Plinth Area:
                    <span className="ml-2 bg-gray-50 text-indigo-500 px-2 py-1 rounded-full">
                      {property.plinthArea} Sq.m
                    </span>
                  </p>
                  {property.bedrooms > 0 && (
                    <p className="text-sm font-medium text-gray-500">
                      Number of Bedrooms:
                      <span className="ml-2 bg-gray-50 text-indigo-500 px-2 py-1 rounded-full">
                        {property.bedrooms}
                      </span>
                    </p>
                  )}
                  <p className="text-sm font-medium text-gray-500">
                    Size of Land:{" "}
                    <span className="ml-2 bg-gray-50 text-indigo-500 px-2 py-1 rounded-full">
                      {convertedLandSize.toPrecision(2)} Acres
                    </span>
                  </p>
                  {/* HEADING */}
                  <h2 className="text-2xl font-semibold">Agent Information</h2>
                  <div className="w-full border-b border-neutral-200"></div>

                  {/* host */}
                  <div className="flex items-center space-x-4">
                    <Avatar
                      hasChecked
                      hasCheckedClass="w-4 h-4 -top-0.5 right-0.5"
                      sizeClass="size-8"
                      radius="rounded-full"
                      imgUrl={session?.user.image}
                    />
                    <div>
                      <Link className="block text-xl font-medium" href="##">
                        {session?.user.agentName}
                      </Link>
                      <div className="mt-1 flex items-center text-sm text-neutral-500">
                        All properties
                        <span className="mx-2">·</span>
                        <span>{23}</span>
                      </div>
                    </div>
                  </div>

                  {/* info */}
                  <div className="block text-neutral-500 ml-12 space-y-1.5">
                    <h3 className=" font-medium text-gray-900">
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
                          href={`https://wa.me/${session?.user.whatsappNumber}`}
                          className="flex size-6 items-center justify-center text-gray-400 hover:text-gray-500"
                        >
                          <span className="sr-only">Contact on Whatsapp</span>
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
                          href={`tel:${session?.user.officeLine}`}
                          className="flex size-6 items-center justify-center text-[#777f8a] hover:text-gray-500"
                        >
                          <span className="sr-only">Contact on Call</span>
                          <PhoneIcon
                            className="h-5 w-5 text-gray-400"
                            aria-hidden="true"
                          />
                        </Link>
                      </li>
                      <li>
                        <Link
                          target="_blank"
                          rel="noopener noreferrer"
                          href={`mailto:${session?.user.email}`}
                          className="flex size-6 items-center justify-center text-[#777f8a] hover:text-gray-500"
                        >
                          <span className="sr-only">Contact on Email</span>
                          <EnvelopeIcon
                            className="h-5 w-5 text-gray-400"
                            // aria-hidden="true"
                          />
                          {/* Email */}
                        </Link>
                      </li>
                    </ul>
                  </div>

                  {/* == */}
                  <div className="w-full border-b border-neutral-200"></div>
                  <div className="flex items-center">
                    <Link
                      href="/"
                      className="font-medium border bg-white border-neutral-200 text-neutral-700 text-center hover:bg-neutral-100 px-3 rounded-full text-lg"
                    >
                      See agent profile
                    </Link>
                  </div>
                </div>
              </div>
            </article>
          </div>
        </div>

        {/*
        <section className="mt-10 pt-10 border-t border-gray-200">
          <h3 className="text-lg lg:text-xl font-medium text-gray-950">
            Overview
          </h3>
          <pre
            className={`${raleway.className} max-w-4xl text-sm whitespace-pre-wrap leading-9 text-gray-600`}
          >
            {property.description}
          </pre>
        </section> */}

        <main className="relative z-10 mt-16 flex flex-col lg:flex-row">
          <section className="w-full lg:w-3/5 xl:w-2/3 space-y-8 lg:space-y-10 lg:pr-10">
            {renderSection1()}
            <OverviewInfo description={property.description} />
            <Amenities amenities={property.appliances} />
          </section>
          <section className="hidden lg:block flex-grow mt-14 lg:mt-0">
            <div className="sticky top-28">{renderSidebar()}</div>
          </section>
        </main>

        {/* Related properties */}
        <section className="mx-auto mt-24 max-w-2xl sm:mt-32 lg:max-w-none">
          <div className="flex items-center justify-between space-x-4">
            <h2 className="text-lg lg:text-xl font-medium text-gray-950">
              Related Properties
            </h2>
            <Link
              href="/properties"
              className="flex items-center gap-2 whitespace-nowrap text-sm font-medium hover:underline underline-offset-4 text-indigo-600 hover:text-indigo-500 transition-all ease-linear"
            >
              View all
              <span aria-hidden="true">&rarr;</span>
            </Link>
          </div>
          {relatedProperties.length > 0 ? (
            <div className="mt-6 grid grid-cols-1 gap-x-8 gap-y-8 sm:grid-cols-2 sm:gap-y-10 lg:grid-cols-3">
              {relatedProperties.slice(0, 3).map((property) => {
                return <PropertyCard key={property.id} property={property} />;
              })}
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
