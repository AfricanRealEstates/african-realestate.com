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
    <section className="h-[407px]">
      <div className="w-full flex flex-col sm:rounded-2xl border-b sm:border-t sm:border-l sm:border-r border-neutral-200 sm:space-y-4 pb-1 px-0 sm:p-4 xl:p-4 !space-y-4">
        <h2 className="text-2xl font-semibold mb-2">
          Surrounding Features/Amenities
        </h2>
        <h3 className="text-xl font-medium mt-4 mb-6">Within 2KM Radius</h3>
        <div className="w-14 border-b border-neutral-200 mb-4"></div>
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 text-sm text-neutral-700 mt-8">
          {property.surroundingFeatures.slice(0, 9).map((feature: any) => (
            <div key={feature} className="flex items-center space-x-3 mt-3.5">
              {featureIcons[feature]}
              <span className="capitalize">{feature}</span>
            </div>
          ))}
        </div>
        <div className="w-14 border-b border-neutral-200 mt-3"></div>
        <div className="">
          <ButtonSecondary onClick={openModal} className="mb-4">
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
