import React from "react";
import prisma from "@/lib/prisma";
import { Property } from "@prisma/client";
import LinkButton from "@/components/properties/link-button";
import { Carousel } from "antd";
import QueryModal from "@/components/globals/query-modal";
import { FaWater, FaWhatsapp } from "react-icons/fa6";
import Image from "next/image";
import { Raleway, IBM_Plex_Mono } from "next/font/google";
import {
  AirVentIcon,
  BathIcon,
  BedSingle,
  Cat,
  Fence,
  Flower2,
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
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";

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
export default async function PropertyDetails({
  params: { id },
}: PropertyDetailsProps) {
  const currentUser = await getServerSession(authOptions);
  const property: Property =
    ((await prisma.property.findUnique({
      where: {
        id: id,
      },
    })) as Property) || null;

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
    <div
      className={` ${raleway.className} w-[95%] lg:max-w-7xl mx-auto py-[90px] lg:py-[120px]`}
    >
      <div className="mb-4">
        {/* <LinkButton title={`${undo} Back to Properties`} path="/properties" /> */}
        <BackProperty />
      </div>

      <section className="h-full max-h-[550px] w-full grid-cols-3 gap-6 md:grid">
        <div className="relative col-span-2 row-span-2 mr-4 aspect-video h-full w-full rounded-xl">
          <div className="rounded-xl object-cover relative isolate h-full w-full">
            <Carousel
              autoplay
              className="rounded-xl object-cover relative isolate h-full w-full"
            >
              {property.images &&
                property.images.map((image) => {
                  return (
                    <Image
                      priority
                      width={400}
                      height={400}
                      key={image}
                      alt="Property Image"
                      className="h-full w-full rounded-xl object-contain delay-200  opacity-100 inset-0 z-[-1]"
                      src={image}
                    />
                  );
                })}
            </Carousel>
          </div>
          <div className="h-8 min-w-fit rounded-sm px-2 !absolute bottom-6 right-3 flex cursor-pointer items-center justify-center gap-2 bg-white font-medium leading-6">
            {property.images.length} Photos
          </div>
        </div>
        <div className="hr h-px bg-[#f6f7f6] mt-9 md:mt-0 lg:hidden"></div>
        <div className="hidden lg:block relative max-h-[254px] w-full rounded-xl">
          <article className=" ">
            <div className="mb-4 max-w-fit px-2 py-1 rounded-md text-white bg-[rgba(38,38,38,.8)] uppercase font-medium mt-8 lg:mt-0">
              For {property.status}
            </div>
            <div className="mb-6 grid grid-cols-1 gap-6">
              <div className="grid grid-cols-3 gap-2">
                <div>Price:</div>
                <div className="font-medium col-span-2">
                  {property.currency} {property.price.toLocaleString()}
                </div>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <div className="">Property Type:</div>
                <div className="font-medium">{property.propertyDetails}</div>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <div className="">Land size:</div>
                <div className="font-medium">
                  <span>{convertedLandSize.toFixed(3)}</span>
                  <span>ha</span>
                </div>
              </div>
            </div>
          </article>
        </div>

        <div className="hidden md:block relative max-h-[254px] w-full cursor-pointer rounded-xl">
          <article>
            <div className="mb-2 text-[#4e4e4e] uppercase text-sm">
              Need to take a tour?
            </div>
            <div className="text-2xl mb-2 font-medium">Agent Information</div>
            <div className="flex items-center">
              <div className="relative my-5">
                <Image
                  src={currentUser?.user.image || "/assets/placeholder.jpg"}
                  height={38}
                  width={38}
                  alt={currentUser?.user.name || "Agent"}
                  className="rounded-full object-cover"
                />
              </div>
              <div className="ml-4 leading-3">
                <h4 className="mb-1 font-extrabold">{property.agentName}</h4>
                <span className="text-sm opacity-70">Agent</span>
              </div>
            </div>
            <div className="w-full flex flex-wrap gap-4 mb-2">
              <li className="flex items-center gap-4">
                <Mail className="h-5 w-5 text-[#4e4e4e]" />
                <div>
                  <span className="text-[rgb(38,38,38,.8)] font-medium">
                    {property.email}
                  </span>
                </div>
              </li>
              <li className="flex items-center gap-4">
                <Phone className="h-5 w-5 text-[#4e4e4e]" />
                <div>
                  <span className="text-[rgb(38,38,38,.8)] font-medium">
                    {property.officeLine}
                  </span>
                </div>
              </li>
              <li className="flex items-center gap-4">
                <FaWhatsapp className="h-5 w-5 text-[#4e4e4e]" />
                <div>
                  <span className="text-[rgb(38,38,38,.8)] font-medium">
                    {property.whatsappNumber}
                  </span>
                </div>
              </li>
            </div>
          </article>
        </div>
      </section>

      <section className=" z-40 mx-auto mt-[1.5rem] lg:mt-[3.5rem] flex w-full flex-col justify-between gap-6 rounded-xl md:flex-row">
        <article className="w-full lg:w-[calc(100%_-_420px)]">
          <div className="mb-3 text-base font-medium capitalize text-[#4e4e4e] flex items-center space-x-2">
            <MapPin className="h-4 w-4" />
            <span>
              {property.locality}, {property.county}, {property.country}
            </span>
          </div>
          <h1
            className={`mb-4 ${ibmPlex.className} text-[rgba(38,38,38,.9)] text-2xl font-medium lg:text-4xl`}
          >
            {property.title}
          </h1>
          <div className="flex flex-wrap items-center gap-3 md:gap-6 mb-6">
            {property.bedrooms > 0 && (
              <div className="flex items-center gap-1 text-sm">
                <BedSingle className="h-4 w-4" />
                <span>{property.bedrooms} bedrooms</span>
              </div>
            )}
            {property.bathrooms > 0 && (
              <div className="flex items-center gap-1 text-sm">
                <BathIcon className="h-4 w-4" />
                <span>{property.bathrooms} bathrooms</span>
              </div>
            )}
            {property.plinthArea && (
              <div className="flex items-center gap-1 text-sm">
                <Grid2X2 className="h-4 w-4" />
                <span>{property.plinthArea} sq ft</span>
              </div>
            )}
          </div>
          <div className="hr mt-4 h-px bg-[#f6f7f6] lg:mt-6"></div>
          <pre
            className={`${raleway.className} mb-16 mt-6 leading-6 text-[#4e4e4e]`}
          >
            {property.description}
          </pre>

          <div className="relative mb-10 lg:mb-12 flex flex-col md:mb-14">
            <h3 className="mb-5 text-2xl font-medium">Amenities</h3>
            <div className="grid grid-cols-2 gap-px sm:grid-cols-3">
              {property.appliances.map((appliance) => {
                return (
                  <div
                    key={appliance}
                    className="capitalize text-[#4e4e4e] bg-[#fafafa] grid
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
                        <ParkingCircle />
                        Parking
                      </>
                    ) : (
                      <></>
                    )}
                    {appliance.toLowerCase() === "flower" ? (
                      <>
                        <Flower2 />
                        Flow Garden
                      </>
                    ) : (
                      <></>
                    )}
                    {appliance.toLowerCase() === "swimming" ? (
                      <>
                        <FaSwimmingPool />
                        Swimming Pool
                      </>
                    ) : (
                      <></>
                    )}
                    {appliance.toLowerCase() === "internet" ? (
                      <>
                        <Wifi />
                        Internet
                      </>
                    ) : (
                      <></>
                    )}
                    {appliance.toLowerCase() === "heating" ? (
                      <>
                        <Thermometer />
                        Heating
                      </>
                    ) : (
                      <></>
                    )}
                    {appliance.toLowerCase() === "dstv" ? (
                      <>
                        <Tv />
                        DSTV / Cables
                      </>
                    ) : (
                      <></>
                    )}
                    {appliance.toLowerCase() === "air" ? (
                      <>
                        <AirVentIcon />
                        Air Condition
                      </>
                    ) : (
                      <></>
                    )}
                    {appliance.toLowerCase() === "furnitures" ? (
                      <>
                        <Sofa />
                        Furnitures
                      </>
                    ) : (
                      <></>
                    )}
                    {appliance.toLowerCase() === "pet" ? (
                      <>
                        <Cat />
                        Pet Friendly
                      </>
                    ) : (
                      <></>
                    )}
                    {appliance.toLowerCase() === "energy" ? (
                      <>
                        <Heater />
                        Energy Efficient
                      </>
                    ) : (
                      <></>
                    )}
                    {appliance.toLowerCase() === "gates" ? (
                      <>
                        <Fence />
                        Gated Estate
                      </>
                    ) : (
                      <></>
                    )}
                    {appliance.toLowerCase() === "servant" ? (
                      <>
                        <Home />
                        Servant Quarters
                      </>
                    ) : (
                      <></>
                    )}
                    {appliance.toLowerCase() === "borehole" ? (
                      <>
                        <FaWater />
                        Borehole
                      </>
                    ) : (
                      <></>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </article>
        <article className="block min-w-[385px]">
          <div className="sticky top-[5.5rem]">
            <div className="relative z-10 mb-6 rounded-xl p-5 backdrop-blur-2xl border-[1.2px_solid_#404040]">
              <div className="-mb-5 flex flex-col">
                <div className="text-[#404040]">
                  <div className="mb-1 flex text-xl font-semibold text-[rgb(38,38,38)]">
                    Make a Query about this Property
                  </div>
                  <div className="mb-2 flex text-sm">
                    You can make an offer of the property directly to the owner.
                  </div>
                  <div className="-mx-5 flex items-center gap-4 border-t border-w-[rgb(64,64,64)] px-5 pb-5 pt-4 w-full">
                    <QueryModal propertyId={property.id} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </article>
      </section>
    </div>
  );
}

{
  /* <button className="border-[hsla(0, 0%, 100%, .2)] w-full text-lg flex h-12 cursor-pointer gap-2 items-center justify-center rounded-lg px-[10px] font-medium leading-6 tracking-tight bg-[rgb(64,64,64)] hover:bg-black text-white transition-all ease-out delay-150 border-[1px] hover:bg-[hsla(0, 0%, 100%, .2)]">
                      Make Query
                    </button> */
}
