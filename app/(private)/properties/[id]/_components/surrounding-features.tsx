"use client";
import React, { useState, Fragment } from "react";
import { Dialog, DialogBackdrop, Transition } from "@headlessui/react";
import {
  FaBuyNLarge,
  FaChurch,
  FaGolfBall,
  FaMosque,
  FaPlaceOfWorship,
} from "react-icons/fa";
import {
  Banknote,
  Hospital,
  LandPlot,
  BusFront,
  School2,
  ShoppingBag,
  Siren,
} from "lucide-react";
import { ButtonSecondary } from "@/components/globals/button-secondary";
import ButtonClose from "@/components/globals/button-close";
import { formatDate } from "date-fns";
import { formatRelativeDate } from "@/lib/utils";

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

export default function SurroundingFeatures({ property }: any) {
  const [isOpen, setIsOpen] = useState(false);

  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);

  return (
    <section className={`h-[407px] leading-relaxed`}>
      <div className="w-full flex flex-col sm:rounded-2xl border-b sm:border-t sm:border-l sm:border-r border-neutral-200 sm:space-y-2 pb-1 px-0 sm:p-4 xl:p-4">
        <div className="my-0.5 gap-2 flex flex-col">
          <span className="text-blue-800 bg-blue-100 w-fit px-2 py-0.5 text-sm rounded-full leading-relaxed">
            Date Added:
          </span>{" "}
          <p className="bg-neutral-100 text-gray-600 font-medium w-fit px-2 py-1 rounded-full text-sm my-2">
            {formatRelativeDate(property.createdAt)}
          </p>
        </div>

        <div className="w-14 border-b border-neutral-100 my-3"></div>
        <div className="space-y-6">
          <h2 className="text-[22px] font-semibold mb-4">
            Amenities Within 2KM Radius
          </h2>
          {/* <div className="w-14 border-b border-neutral-200 my-4 block"></div> */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-[25px] mt-1 mb-4 text-sm text-neutral-700">
            {property.surroundingFeatures.slice(0, 6).map((feature: any) => (
              <div key={feature} className="flex items-center gap-x-3">
                {featureIcons[feature]}
                <span className="capitalize">{feature}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="">
          <div className="w-14 border-b border-neutral-200 mb-2 mt-6 block"></div>
          <ButtonSecondary onClick={openModal} className="mb-5 mt-4">
            View all
          </ButtonSecondary>
        </div>
      </div>

      <Transition appear show={isOpen} as={Fragment}>
        <Dialog
          as="div"
          className="fixed inset-0 z-50 overflow-y-auto"
          onClose={closeModal}
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
              <DialogBackdrop className="fixed inset-0 bg-black/30" />
            </Transition.Child>
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
              <div className="relative inline-block w-full max-w-4xl p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl">
                <Dialog.Title className="text-xl font-semibold mt-8">
                  All Surrounding Features/Amenities
                </Dialog.Title>
                <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 text-sm text-neutral-700 mt-4">
                  {property.surroundingFeatures.map((feature: any) => (
                    <div key={feature} className="flex items-center space-x-3">
                      {featureIcons[feature]}
                      <span className="capitalize">{feature}</span>
                    </div>
                  ))}
                </div>
                <span className="absolute left-3 top-3">
                  <ButtonClose onClick={closeModal} />
                </span>
              </div>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>
    </section>
  );
}
