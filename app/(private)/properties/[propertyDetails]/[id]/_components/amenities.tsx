"use client";

import React, { useState } from "react";
import { ButtonSecondary } from "@/components/globals/button-secondary";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  AirVentIcon,
  Building,
  Cat,
  Dumbbell,
  Fence,
  Flower,
  GlassWater,
  Heater,
  Martini,
  ParkingCircle,
  Sofa,
  Thermometer,
  Trash,
  Tv,
  Wifi,
} from "lucide-react";
import { FaSwimmingPool } from "react-icons/fa";
import { appliances } from "@/constants";
import { Button } from "@/components/ui/button";

interface AmenitiesProps {
  amenities: string[];
}

export default function Amenities({ amenities }: AmenitiesProps) {
  const [isOpenModalAmenities, setIsOpenModalAmenities] = useState(false);

  const amenityIcons: { [key: string]: JSX.Element } = {
    parking: <ParkingCircle className="size-4 text-blue-600" />,
    flower: <Flower className="size-4 text-blue-600" />,
    swimming: <FaSwimmingPool className="size-4 text-blue-600" />,
    internet: <Wifi className="size-4 text-blue-600" />,
    heating: <Heater className="size-4 text-blue-600" />,
    dstv: <Tv className="size-4 text-blue-600" />,
    air: <AirVentIcon className="size-4 text-blue-600" />,
    furnished: <Sofa className="size-4 text-blue-600" />,
    pet: <Cat className="size-4 text-blue-600" />,
    energy: <Thermometer className="size-4 text-blue-600" />,
    gates: <Fence className="size-4 text-blue-600" />,
    servant: <Building className="size-4 text-blue-600" />,
    borehole: <GlassWater className="size-4 text-blue-600" />,
    gym: <Dumbbell className="size-4 text-blue-600" />,
    club: <Martini className="size-4 text-blue-600" />,
    waste: <Trash className="size-4 text-blue-600" />,
  };

  const filteredAmenities = amenities.filter((amenity) =>
    appliances.find((app) => app.value === amenity)
  );

  return (
    <div className="w-full flex flex-col sm:rounded-2xl space-y-6 sm:space-y-8 pb-1 leading-relaxed">
      <div className="grid grid-cols-2 sm:grid-cols-2 xl:grid-cols-3 gap-6 text-sm text-neutral-700 mt-4">
        {filteredAmenities.slice(0, 6).map((amenity) => (
          <div key={amenity} className="flex items-center space-x-3">
            {amenityIcons[amenity]}
            <span className="capitalize">
              {appliances.find((app) => app.value === amenity)?.label}
            </span>
          </div>
        ))}
      </div>

      <div className="w-14 border-b border-neutral-200"></div>
      <div>
        <Dialog
          open={isOpenModalAmenities}
          onOpenChange={setIsOpenModalAmenities}
        >
          <DialogTrigger asChild>
            <Button variant="outline" className="mb-0 rounded-full">
              View all
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px] md:max-w-[700px] lg:max-w-[900px]">
            <DialogHeader>
              <DialogTitle>Amenities</DialogTitle>
            </DialogHeader>
            <ScrollArea className="h-[60vh] mt-4 pr-4">
              <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredAmenities.map((amenity) => (
                  <div
                    key={amenity}
                    className="flex items-center py-2.5 sm:py-4 space-x-5"
                  >
                    {amenityIcons[amenity]}
                    <span className="capitalize">
                      {appliances.find((app) => app.value === amenity)?.label}
                    </span>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}

// "use client";

// import Link from "next/link";
// import { Route } from "@/types/types";
// import ButtonClose from "@/components/globals/button-close";
// import {
//   Dialog,
//   DialogBackdrop,
//   Transition,
//   TransitionChild,
// } from "@headlessui/react";
// import React, { Fragment, ButtonHTMLAttributes, FC, useState } from "react";
// import { usePathname, useRouter } from "next/navigation";
// import {
//   AirVentIcon,
//   Building,
//   Cat,
//   Dumbbell,
//   Fence,
//   Flower,
//   GlassWater,
//   Heater,
//   Martini,
//   ParkingCircle,
//   Sofa,
//   Thermometer,
//   Trash,
//   Tv,
//   Wifi,
// } from "lucide-react";
// import { appliances } from "@/constants";
// import { FaSwimmingPool } from "react-icons/fa";
// import { ButtonSecondary } from "@/components/globals/button-secondary";

// interface AmenitiesProps {
//   amenities: string[];
// }

// export default function Amenities({ amenities }: AmenitiesProps) {
//   const [isOpenModalAmenities, setIsOpenModalAmenities] = useState(false);
//   const thisPathname = usePathname();
//   const router = useRouter();

//   function closeModalAmenities() {
//     setIsOpenModalAmenities(false);
//   }

//   function openModalAmenities() {
//     setIsOpenModalAmenities(true);
//   }

//   const amenityIcons: { [key: string]: JSX.Element } = {
//     parking: <ParkingCircle className="size-4 text-blue-600" />,
//     flower: <Flower className="size-4 text-blue-600" />,
//     swimming: <FaSwimmingPool className="size-4 text-blue-600" />,
//     internet: <Wifi className="size-4 text-blue-600" />,
//     heating: <Heater className="size-4 text-blue-600" />,
//     dstv: <Tv className="size-4 text-blue-600" />,
//     air: <AirVentIcon className="size-4 text-blue-600" />,
//     furnished: <Sofa className="size-4 text-blue-600" />,
//     pet: <Cat className="size-4 text-blue-600" />,
//     energy: <Thermometer className="size-4 text-blue-600" />,
//     gates: <Fence className="size-4 text-blue-600" />,
//     servant: <Building className="size-4 text-blue-600" />,
//     borehole: <GlassWater className="size-4 text-blue-600" />,
//     gym: <Dumbbell className="size-4 text-blue-600" />,
//     club: <Martini className="size-4 text-blue-600" />,
//     waste: <Trash className="size-4 text-blue-600" />,
//   };

//   const renderSection3 = () => {
//     return (
//       <div className="w-full flex flex-col sm:rounded-2xl space-y-6 sm:space-y-8 pb-1 leading-relaxed">
//         <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 text-sm text-neutral-700 mt-4">
//           {amenities
//             .filter((amenity) =>
//               appliances.find((app) => app.value === amenity)
//             ) // Filter out amenities that don't have corresponding icons
//             .slice(0, 6)
//             .map((amenity) => (
//               <div key={amenity} className="flex items-center space-x-3">
//                 {amenityIcons[amenity]} {/* Render the corresponding icon */}
//                 <span className="capitalize">
//                   {appliances.find((app) => app.value === amenity)?.label}
//                 </span>
//               </div>
//             ))}
//         </div>

//         {/* ----- */}
//         <div className="w-14 border-b border-neutral-200"></div>
//         <div>
//           <ButtonSecondary onClick={openModalAmenities} className="mb-5">
//             View all
//           </ButtonSecondary>
//         </div>
//         {renderModalAmenities()}
//       </div>
//     );
//   };

//   const renderModalAmenities = () => {
//     return (
//       <Transition appear show={isOpenModalAmenities} as={Fragment}>
//         <Dialog
//           as="div"
//           className="fixed inset-0 z-50 overflow-y-auto"
//           onClose={closeModalAmenities}
//         >
//           <div className="min-h-screen px-4 text-center">
//             <Transition.Child
//               as="div"
//               enter="ease-out duration-300"
//               enterFrom="opacity-0"
//               enterTo="opacity-100"
//               leave="ease-in duration-200"
//               leaveFrom="opacity-100"
//               leaveTo="opacity-0"
//             >
//               <DialogBackdrop className="fixed inset-0 bg-black/30" />

//               <div className="fixed inset-0 flex w-screen items-center justify-center p-4" />
//             </Transition.Child>
//             <span
//               className="inline-block h-screen align-middle"
//               aria-hidden="true"
//             >
//               &#8203;
//             </span>
//             <Transition.Child
//               as={Fragment}
//               enter="ease-out duration-300"
//               enterFrom="opacity-0 scale-95"
//               enterTo="opacity-100 scale-100"
//               leave="ease-in duration-200"
//               leaveFrom="opacity-100 scale-100"
//               leaveTo="opacity-0 scale-95"
//             >
//               <div className="inline-block w-full max-w-4xl p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl">
//                 <div className="relative flex-shrink-0 text-center">
//                   <h3
//                     className="text-lg font-medium leading-6 text-gray-900"
//                     id="headlessui-dialog-title-70"
//                   >
//                     Amenities
//                   </h3>
//                   <span className="absolute left-2 top-2">
//                     <ButtonClose onClick={closeModalAmenities} />
//                   </span>
//                 </div>

//                 <div className="px-8 overflow-auto text-neutral-700">
//                   <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
//                     {amenities
//                       .filter((amenity) =>
//                         appliances.find((app) => app.value === amenity)
//                       ) // Filter out amenities that don't have corresponding icons
//                       .map((amenity) => (
//                         <div
//                           key={amenity}
//                           className="flex items-center py-2.5 sm:py-4 lg:py-5 space-x-5 lg:space-x-8"
//                         >
//                           {amenityIcons[amenity]}{" "}
//                           {/* Render the corresponding icon */}
//                           <span className="capitalize">
//                             {
//                               appliances.find((app) => app.value === amenity)
//                                 ?.label
//                             }
//                           </span>
//                         </div>
//                       ))}
//                   </div>
//                 </div>
//               </div>
//             </Transition.Child>
//           </div>
//         </Dialog>
//       </Transition>
//     );
//   };
//   return <div>{renderSection3()}</div>;
// }
