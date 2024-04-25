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
  BathIcon,
  BedSingle,
  Cat,
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
        id: property.id, // Exclude the fetched property
      },
      OR: [
        { location: property.location },
        { propertyDetails: property.propertyDetails },
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

        <div className="mt-6 grid grid-cols-1 gap-y-6 sm:grid-cols-3 sm:gap-x-6 lg:gap-8">
          <ImageCarousel property={property} />
          <div className="sm:col-span-1">
            <article className="flex flex-col-reverse">
              <div className="flex flex-col gap-4">
                <p className="rounded-full font-semibold w-fit bg-neutral-50 px-2 py-1 text-indigo-500">
                  For {property.status}
                </p>
                <h2 className="inline-flex font-medium gap-x-1.5 items-center text-gray-500">
                  Price:
                  <span className="bg-gray-50 text-indigo-500 px-2 py-1 rounded-full">
                    <span className="">{property.currency} </span>
                    <span className="text-xl tracking-tight sm:text-2xl font-semibold">
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
                <div className="mt-5 border-t border-gray-200 pt-5">
                  <h3 className=" font-medium text-gray-900">Contact Agent</h3>
                  <ul className="mt-4 flex items-center space-x-8" role="list">
                    <li>
                      <Link
                        target="_blank"
                        rel="noopener noreferrer"
                        href="#"
                        // href={`https://wa.me/${property.whatsappNumber}`}
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
                        href="#"
                        // href={`tel:${property.officeLine}`}
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
                        href="#"
                        // href={`mailto:${property.email}`}
                        className="flex size-6 items-center justify-center text-[#777f8a] hover:text-gray-500"
                      >
                        <span className="sr-only">Contact on Email</span>
                        <EnvelopeIcon
                          className="h-5 w-5 text-gray-400"
                          aria-hidden="true"
                        />
                        Email
                      </Link>
                    </li>
                  </ul>
                </div>
                <div className="mt-5 border-t border-gray-200 pt-5">
                  <h3 className="font-medium text-gray-900">
                    Agent Information
                  </h3>

                  <div className="flex space-x-4 text-sm text-gray-500">
                    <div className="flex-none py-5">
                      <Image
                        height={50}
                        width={50}
                        src={session?.user.image || "/assets/placeholder.jpg"}
                        alt="Agent"
                        className="h-10 w-10 rounded-full bg-gray-100"
                      />
                    </div>
                    <div className="flex-1 py-4 space-y-4">
                      <h3 className="flex gap-1">
                        Agent name:
                        <span className="font-medium text-gray-900">
                          {/* {property.agentName} */}
                        </span>
                      </h3>
                      <p className="">
                        Agent since:{" "}
                        <span className="font-medium text-gray-900">
                          {dayjs(property.createdAt).format(
                            "DD MMM YYYY hh:mm A"
                          ) || ""}
                        </span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </article>
          </div>
        </div>

        <section className="mt-5 pt-5">
          <h3 className="text-lg lg:text-xl font-medium text-gray-950">
            Location
          </h3>
          <p className="mt-4 text-sm text-gray-400 flex items-center gap-2">
            <MapPin className="size-4 text-indigo-400" /> {property.locality},{" "}
            {property.location}
          </p>
        </section>
        <section className="mt-10 pt-10 border-t border-gray-200">
          <h3 className="text-lg lg:text-xl font-medium text-gray-950">
            Amenities
          </h3>
          <div className="grid grid-cols-2 gap-px sm:grid-cols-3 mt-4 text-sm max-w-4xl">
            {property.appliances.map((appliance) => {
              return (
                <div
                  key={appliance}
                  className="capitalize text-gray-400 bg-neutral-50 grid
    h-[92px]
    gap-5
    bg-w-90015
    p-3
    first:rounded-tl-lg
    last:rounded-br-lg
    max-sm:[&:nth-child(2)]:rounded-tr-lg
    max-sm:[&:nth-child(2n+1):nth-last-child(-n+2)]:rounded-bl-lg
    max-sm:[&:nth-child(2n+2):nth-last-child(-n+2)]:rounded-br-lg
    sm:[&:nth-child(3)]:rounded-tr-lg
    sm:[&:nth-child(3n+1):nth-last-child(-n+3)]:rounded-bl-lg
    sm:[&:nth-child(3n+3):nth-last-child(-n+3)]:rounded-br-lg
    "
                >
                  {appliance.toLowerCase() === "parking" ? (
                    <>
                      <ParkingCircle className="text-indigo-400" />
                      Parking
                    </>
                  ) : (
                    <></>
                  )}
                  {appliance.toLowerCase() === "flower" ? (
                    <>
                      <Flower2 className="text-indigo-400" />
                      Flow Garden
                    </>
                  ) : (
                    <></>
                  )}
                  {appliance.toLowerCase() === "swimming" ? (
                    <>
                      <FaSwimmingPool className="text-indigo-400" />
                      Swimming Pool
                    </>
                  ) : (
                    <></>
                  )}
                  {appliance.toLowerCase() === "internet" ? (
                    <>
                      <Wifi className="text-indigo-400" />
                      Internet
                    </>
                  ) : (
                    <></>
                  )}
                  {appliance.toLowerCase() === "heating" ? (
                    <>
                      <Thermometer className="text-indigo-400" />
                      Heating
                    </>
                  ) : (
                    <></>
                  )}
                  {appliance.toLowerCase() === "dstv" ? (
                    <>
                      <Tv className="text-indigo-400" />
                      DSTV / Cables
                    </>
                  ) : (
                    <></>
                  )}
                  {appliance.toLowerCase() === "air" ? (
                    <>
                      <AirVentIcon className="text-indigo-400" />
                      Air Condition
                    </>
                  ) : (
                    <></>
                  )}
                  {appliance.toLowerCase() === "furnitures" ? (
                    <>
                      <Sofa className="text-indigo-400" />
                      Furnitures
                    </>
                  ) : (
                    <></>
                  )}
                  {appliance.toLowerCase() === "pet" ? (
                    <>
                      <Cat className="text-indigo-400" />
                      Pet Friendly
                    </>
                  ) : (
                    <></>
                  )}
                  {appliance.toLowerCase() === "energy" ? (
                    <>
                      <Heater className="text-indigo-400" />
                      Energy Efficient
                    </>
                  ) : (
                    <></>
                  )}
                  {appliance.toLowerCase() === "gates" ? (
                    <>
                      <Fence className="text-indigo-400" />
                      Gated Estate
                    </>
                  ) : (
                    <></>
                  )}
                  {appliance.toLowerCase() === "servant" ? (
                    <>
                      <Home className="text-indigo-400" />
                      Servant Quarters
                    </>
                  ) : (
                    <></>
                  )}
                  {appliance.toLowerCase() === "borehole" ? (
                    <>
                      <FaWater className="text-indigo-400" />
                      Borehole
                    </>
                  ) : (
                    <></>
                  )}
                </div>
              );
            })}
          </div>
        </section>
        <section className="mt-10 pt-10 border-t border-gray-200">
          <h3 className="text-lg lg:text-xl font-medium text-gray-950">
            Overview
          </h3>
          <pre
            className={`${raleway.className} max-w-4xl text-sm whitespace-pre-wrap leading-9 text-gray-600`}
          >
            {property.description}
          </pre>
        </section>

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

    //     <div
    //       className={` ${raleway.className} w-[95%] lg:max-w-7xl mx-auto py-[90px] lg:py-[120px]`}
    //     >
    //       <div className="mb-4">
    //         <BackProperty />
    //       </div>

    //       <section className="h-full max-h-[550px] w-full grid-cols-3 gap-6 md:grid">
    //         <div className="relative col-span-2 row-span-2 mr-4 aspect-video h-full w-full rounded-xl">
    //           <div className="rounded-xl object-cover relative isolate h-full w-full">
    //             <Carousel
    //               autoplay
    //               className="rounded-xl object-cover relative isolate h-full w-full"
    //             >
    //               {property.images &&
    //                 property.images.map((image) => {
    //                   return (
    //                     <Image
    //                       priority
    //                       width={400}
    //                       height={400}
    //                       key={image}
    //                       alt="Property Image"
    //                       className="h-full w-full rounded-xl object-contain delay-200  opacity-100 inset-0 z-[-1]"
    //                       src={image}
    //                     />
    //                   );
    //                 })}
    //             </Carousel>
    //           </div>
    //           <div className="h-8 min-w-fit rounded-sm px-2 !absolute bottom-6 right-3 flex cursor-pointer items-center justify-center gap-2 bg-white font-medium leading-6">
    //             {property.images.length} Photos
    //           </div>
    //         </div>
    //         <div className="hr h-px bg-[#f6f7f6] mt-9 md:mt-0 lg:hidden"></div>
    //         <div className="hidden lg:block relative max-h-[254px] w-full rounded-xl">
    //           <article className=" ">
    //             <div className="mb-4 max-w-fit px-2 py-1 rounded-md text-white bg-[rgba(38,38,38,.8)] uppercase font-medium mt-8 lg:mt-0">
    //               For {property.status}
    //             </div>
    //             <div className="mb-6 grid grid-cols-1 gap-6">
    //               <div className="grid grid-cols-3 gap-2">
    //                 <div>Price:</div>
    //                 <div className="font-medium col-span-2">
    //                   {property.currency} {property.price.toLocaleString()}
    //                 </div>
    //               </div>
    //               <div className="grid grid-cols-3 gap-2">
    //                 <div className="">Property Type:</div>
    //                 <div className="font-medium">{property.propertyDetails}</div>
    //               </div>
    //               <div className="grid grid-cols-3 gap-2">
    //                 <div className="">Land size:</div>
    //                 <div className="font-medium">
    //                   <span>{convertedLandSize.toFixed(3)}</span>
    //                   <span>ha</span>
    //                 </div>
    //               </div>
    //             </div>
    //           </article>
    //         </div>

    //         <div className="hidden md:block relative max-h-[254px] w-full cursor-pointer rounded-xl">
    //           <article>
    //             <div className="mb-2 text-[#4e4e4e] uppercase text-sm">
    //               Need to take a tour?
    //             </div>
    //             <div className="text-2xl mb-2 font-medium">Agent Information</div>
    //             <div className="flex items-center">
    //               <div className="relative my-5">
    //                 <Image
    //                   src={currentUser?.user.image || "/assets/placeholder.jpg"}
    //                   height={38}
    //                   width={38}
    //                   alt={currentUser?.user.name || "Agent"}
    //                   className="rounded-full object-cover"
    //                 />
    //               </div>
    //               <div className="ml-4 leading-3">
    //                 <h4 className="mb-1 font-extrabold">{property.agentName}</h4>
    //                 <span className="text-sm opacity-70">Agent</span>
    //               </div>
    //             </div>
    //             <div className="w-full flex flex-wrap gap-4 mb-2">
    //               <li className="flex items-center gap-4">
    //                 <Mail className="h-5 w-5 text-[#4e4e4e]" />
    //                 <div>
    //                   <span className="text-[rgb(38,38,38,.8)] font-medium">
    //                     {property.email}
    //                   </span>
    //                 </div>
    //               </li>
    //               <li className="flex items-center gap-4">
    //                 <Phone className="h-5 w-5 text-[#4e4e4e]" />
    //                 <div>
    //                   <span className="text-[rgb(38,38,38,.8)] font-medium">
    //                     {property.officeLine}
    //                   </span>
    //                 </div>
    //               </li>
    //               <li className="flex items-center gap-4">
    //                 <FaWhatsapp className="h-5 w-5 text-[#4e4e4e]" />
    //                 <div>
    //                   <span className="text-[rgb(38,38,38,.8)] font-medium">
    //                     {property.whatsappNumber}
    //                   </span>
    //                 </div>
    //               </li>
    //             </div>
    //           </article>
    //         </div>
    //       </section>

    //       <section className=" z-40 mx-auto mt-[1.5rem] lg:mt-[3.5rem] flex w-full flex-col justify-between gap-6 rounded-xl md:flex-row">
    //         <article className="w-full lg:w-[calc(100%_-_420px)]">
    //           <div className="mb-3 text-base font-medium capitalize text-[#4e4e4e] flex items-center space-x-2">
    //             <MapPin className="h-4 w-4" />
    //             <span>
    //               {property.locality}, {property.county}, {property.country}
    //             </span>
    //           </div>
    //           <h1
    //             className={`mb-4 ${ibmPlex.className} text-[rgba(38,38,38,.9)] text-2xl font-medium lg:text-4xl`}
    //           >
    //             {property.title}
    //           </h1>
    //           <div className="flex flex-wrap items-center gap-3 md:gap-6 mb-6">
    //             {property.bedrooms > 0 && (
    //               <div className="flex items-center gap-1 text-sm">
    //                 <BedSingle className="h-4 w-4" />
    //                 <span>{property.bedrooms} bedrooms</span>
    //               </div>
    //             )}
    //             {property.bathrooms > 0 && (
    //               <div className="flex items-center gap-1 text-sm">
    //                 <BathIcon className="h-4 w-4" />
    //                 <span>{property.bathrooms} bathrooms</span>
    //               </div>
    //             )}
    //             {property.plinthArea && (
    //               <div className="flex items-center gap-1 text-sm">
    //                 <Grid2X2 className="h-4 w-4" />
    //                 <span>{property.plinthArea} sq ft</span>
    //               </div>
    //             )}
    //           </div>
    //           <div className="hr mt-4 h-px bg-[#f6f7f6] lg:mt-6"></div>
    //           <pre
    //             className={`${raleway.className} mb-16 mt-6 leading-6 text-[#4e4e4e]`}
    //           >
    //             {property.description}
    //           </pre>

    //           <div className="relative mb-10 lg:mb-12 flex flex-col md:mb-14">
    //             <h3 className="mb-5 text-2xl font-medium">Amenities</h3>
    //             <div className="grid grid-cols-2 gap-px sm:grid-cols-3">
    //               {property.appliances.map((appliance) => {
    //                 return (
    //                   <div
    //                     key={appliance}
    //                     className="capitalize text-[#4e4e4e] bg-[#fafafa] grid
    // h-[92px]
    // gap-5
    // bg-w-90015
    // p-3
    // first:rounded-tl-lg
    // last:rounded-br-lg
    // max-sm:[&:nth-child(2)]:rounded-tr-lg
    // max-sm:[&:nth-child(2n+1):nth-last-child(-n+2)]:rounded-bl-lg
    // max-sm:[&:nth-child(2n+2):nth-last-child(-n+2)]:rounded-br-lg
    // sm:[&:nth-child(3)]:rounded-tr-lg
    // sm:[&:nth-child(3n+1):nth-last-child(-n+3)]:rounded-bl-lg
    // sm:[&:nth-child(3n+3):nth-last-child(-n+3)]:rounded-br-lg
    // "
    //                   >
    //                     {appliance.toLowerCase() === "parking" ? (
    //                       <>
    //                         <ParkingCircle />
    //                         Parking
    //                       </>
    //                     ) : (
    //                       <></>
    //                     )}
    //                     {appliance.toLowerCase() === "flower" ? (
    //                       <>
    //                         <Flower2 />
    //                         Flow Garden
    //                       </>
    //                     ) : (
    //                       <></>
    //                     )}
    //                     {appliance.toLowerCase() === "swimming" ? (
    //                       <>
    //                         <FaSwimmingPool />
    //                         Swimming Pool
    //                       </>
    //                     ) : (
    //                       <></>
    //                     )}
    //                     {appliance.toLowerCase() === "internet" ? (
    //                       <>
    //                         <Wifi />
    //                         Internet
    //                       </>
    //                     ) : (
    //                       <></>
    //                     )}
    //                     {appliance.toLowerCase() === "heating" ? (
    //                       <>
    //                         <Thermometer />
    //                         Heating
    //                       </>
    //                     ) : (
    //                       <></>
    //                     )}
    //                     {appliance.toLowerCase() === "dstv" ? (
    //                       <>
    //                         <Tv />
    //                         DSTV / Cables
    //                       </>
    //                     ) : (
    //                       <></>
    //                     )}
    //                     {appliance.toLowerCase() === "air" ? (
    //                       <>
    //                         <AirVentIcon />
    //                         Air Condition
    //                       </>
    //                     ) : (
    //                       <></>
    //                     )}
    //                     {appliance.toLowerCase() === "furnitures" ? (
    //                       <>
    //                         <Sofa />
    //                         Furnitures
    //                       </>
    //                     ) : (
    //                       <></>
    //                     )}
    //                     {appliance.toLowerCase() === "pet" ? (
    //                       <>
    //                         <Cat />
    //                         Pet Friendly
    //                       </>
    //                     ) : (
    //                       <></>
    //                     )}
    //                     {appliance.toLowerCase() === "energy" ? (
    //                       <>
    //                         <Heater />
    //                         Energy Efficient
    //                       </>
    //                     ) : (
    //                       <></>
    //                     )}
    //                     {appliance.toLowerCase() === "gates" ? (
    //                       <>
    //                         <Fence />
    //                         Gated Estate
    //                       </>
    //                     ) : (
    //                       <></>
    //                     )}
    //                     {appliance.toLowerCase() === "servant" ? (
    //                       <>
    //                         <Home />
    //                         Servant Quarters
    //                       </>
    //                     ) : (
    //                       <></>
    //                     )}
    //                     {appliance.toLowerCase() === "borehole" ? (
    //                       <>
    //                         <FaWater />
    //                         Borehole
    //                       </>
    //                     ) : (
    //                       <></>
    //                     )}
    //                   </div>
    //                 );
    //               })}
    //             </div>
    //           </div>
    //         </article>
    //         <article className="block min-w-[385px]">
    //           <div className="sticky top-[5.5rem]">
    //             <div className="relative z-10 mb-6 rounded-xl p-5 backdrop-blur-2xl border-[1.2px_solid_#404040]">
    //               <div className="-mb-5 flex flex-col">
    //                 <div className="text-[#404040]">
    //                   <div className="mb-1 flex text-xl font-semibold text-[rgb(38,38,38)]">
    //                     Make a Query about this Property
    //                   </div>
    //                   <div className="mb-2 flex text-sm">
    //                     You can make an offer of the property directly to the owner.
    //                   </div>
    //                   <div className="-mx-5 flex items-center gap-4 border-t border-w-[rgb(64,64,64)] px-5 pb-5 pt-4 w-full">
    //                     <QueryModal propertyId={property.id} />
    //                   </div>
    //                 </div>
    //               </div>
    //             </div>
    //           </div>
    //         </article>
    //       </section>
    //     </div>
  );
}

// interface RelatedPropertyProps {
//   property: Property;
// }

// const RelatedProperty = ({ property }: RelatedPropertyProps) => {
//   return (
//     <>
//       {property.images &&
//         property.images.map((image) => {
//           return (
//             <>
//               <Image
//                 key={image}
//                 height={400}
//                 width={400}
//                 src={image}
//                 alt={property.title}
//                 className="object-cover object-center"
//               />
//               <article className="group relative">
//                 <div className="aspect-h-3 aspect-w-4 overflow-hidden rounded-lg bg-gray-100">
//                   <div
//                     className="flex items-end p-4 opacity-0 group-hover:opacity-100"
//                     aria-hidden="true"
//                   >
//                     <div className="w-full rounded-md bg-white bg-opacity-75 px-4 py-2 text-center text-sm font-medium text-gray-900 backdrop-blur backdrop-filter">
//                       View Product
//                     </div>
//                   </div>
//                 </div>

//                 <div className="mt-4 flex items-center justify-between space-x-8 text-base font-medium text-gray-900">
//                   <h3>
//                     <a href="#">
//                       <span aria-hidden="true" className="absolute inset-0" />
//                       {property.title}
//                     </a>
//                   </h3>
//                   <p>{property.price}</p>
//                 </div>
//                 <p className="mt-1 text-sm text-gray-500">
//                   {property.propertyType}
//                 </p>
//               </article>
//             </>
//           );
//         })}
//     </>
//   );
// };
