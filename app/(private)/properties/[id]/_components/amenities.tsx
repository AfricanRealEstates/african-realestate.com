"use client";

import Link from "next/link";
import { Route } from "@/types/types";
import ButtonClose from "@/components/globals/button-close";
import { Dialog, Transition } from "@headlessui/react";
import React, { Fragment, ButtonHTMLAttributes, FC, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import {
  AirVentIcon,
  Building,
  Cat,
  Fence,
  Flower,
  GlassWater,
  Heater,
  ParkingCircle,
  Sofa,
  Thermometer,
  Trash,
  Tv,
  Wifi,
} from "lucide-react";
import { appliances } from "@/constants";
import { FaSwimmingPool } from "react-icons/fa";
import { ButtonSecondary } from "@/components/globals/button-secondary";

interface AmenitiesProps {
  amenities: string[];
}

export default function Amenities({ amenities }: AmenitiesProps) {
  const [isOpenModalAmenities, setIsOpenModalAmenities] = useState(false);
  const thisPathname = usePathname();
  const router = useRouter();

  function closeModalAmenities() {
    setIsOpenModalAmenities(false);
  }

  function openModalAmenities() {
    setIsOpenModalAmenities(true);
  }

  const amenityIcons: { [key: string]: JSX.Element } = {
    parking: <ParkingCircle className="size-4 text-neutral-600" />,
    flower: <Flower className="size-4 text-neutral-600" />,
    swimming: <FaSwimmingPool className="size-4 text-neutral-600" />,
    internet: <Wifi className="size-4 text-neutral-600" />,
    heating: <Heater className="size-4 text-neutral-600" />,
    dstv: <Tv className="size-4 text-neutral-600" />,
    air: <AirVentIcon className="size-4 text-neutral-600" />,
    furnitures: <Sofa className="size-4 text-neutral-600" />,
    pet: <Cat className="size-4 text-neutral-600" />,
    energy: <Thermometer className="size-4 text-neutral-600" />,
    gates: <Fence className="size-4 text-neutral-600" />,
    servant: <Building className="size-4 text-neutral-600" />,
    borehole: <GlassWater className="size-4 text-neutral-600" />,
    waste: <Trash className="size-4 text-neutral-600" />,
  };

  const renderSection3 = () => {
    return (
      <div className="w-full flex flex-col sm:rounded-2xl border-b sm:border-t sm:border-l sm:border-r border-neutral-200 dark:border-neutral-700 space-y-6 sm:space-y-8 pb-10 px-0 sm:p-4 xl:p-8">
        <div>
          <h2 className="text-2xl font-semibold">Amenities </h2>
          <span className="block mt-2 text-neutral-500 dark:text-neutral-400">
            {` About the property's amenities and services`}
          </span>
        </div>
        <div className="w-14 border-b border-neutral-200 dark:border-neutral-700"></div>
        {/* 6 */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 text-sm text-neutral-700">
          {amenities
            .filter((amenity) =>
              appliances.find((app) => app.value === amenity)
            ) // Filter out amenities that don't have corresponding icons
            .slice(0, 6)
            .map((amenity) => (
              <div key={amenity} className="flex items-center space-x-3">
                {amenityIcons[amenity]} {/* Render the corresponding icon */}
                <span className="capitalize">
                  {appliances.find((app) => app.value === amenity)?.label}
                </span>
              </div>
            ))}
        </div>

        {/* ----- */}
        <div className="w-14 border-b border-neutral-200"></div>
        <div>
          <ButtonSecondary onClick={openModalAmenities}>
            View all amenities
          </ButtonSecondary>
        </div>
        {renderModalAmenities()}
      </div>
    );
  };

  const renderModalAmenities = () => {
    return (
      <Transition appear show={isOpenModalAmenities} as={Fragment}>
        <Dialog
          as="div"
          className="fixed inset-0 z-50 overflow-y-auto"
          onClose={closeModalAmenities}
        >
          <div className="min-h-screen px-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Dialog.Overlay className="fixed inset-0 bg-black bg-opacity-40" />
            </Transition.Child>

            {/* This element is to trick the browser into centering the modal contents. */}
            <span
              className="inline-block h-screen align-middle"
              aria-hidden="true"
            >
              &#8203;
            </span>
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <div className="inline-block w-full max-w-4xl p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white dark:bg-neutral-900 dark:border dark:border-neutral-700 dark:text-neutral-100 shadow-xl rounded-2xl">
                <div className="relative flex-shrink-0 px-6 py-4 border-b border-neutral-200 dark:border-neutral-800 text-center">
                  <h3
                    className="text-lg font-medium leading-6 text-gray-900"
                    id="headlessui-dialog-title-70"
                  >
                    Amenities
                  </h3>
                  <span className="absolute left-3 top-3">
                    <ButtonClose onClick={closeModalAmenities} />
                  </span>
                </div>

                <div className="px-8 overflow-auto text-neutral-700 dark:text-neutral-300 divide-y divide-neutral-200">
                  {amenities
                    .filter((amenity) =>
                      appliances.find((app) => app.value === amenity)
                    ) // Filter out amenities that don't have corresponding icons
                    .map((amenity) => (
                      <div
                        key={amenity}
                        className="flex items-center py-2.5 sm:py-4 lg:py-5 space-x-5 lg:space-x-8"
                      >
                        {amenityIcons[amenity]}{" "}
                        {/* Render the corresponding icon */}
                        <span className="capitalize">
                          {
                            appliances.find((app) => app.value === amenity)
                              ?.label
                          }
                        </span>
                      </div>
                    ))}
                </div>
              </div>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>
    );
  };
  return <div>{renderSection3()}</div>;
}
