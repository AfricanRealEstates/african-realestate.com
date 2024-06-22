import React from "react";
// import {
//   ArrowPathIcon,
//   ArrowRightStartOnRectangleIcon,
//   Bars3Icon,
//   ChartPieIcon,
//   ChevronRightIcon,
//   CursorArrowRaysIcon,
//   FingerPrintIcon,
//   SquaresPlusIcon,
//   XMarkIcon,
// } from "@heroicons/react/24/outline";
import {
  ChevronDownIcon,
  LightBulbIcon,
  PhoneIcon,
  PlayCircleIcon,
  ShieldCheckIcon,
  UserCircleIcon,
} from "@heroicons/react/20/solid";
import {
  BarChart2,
  Blocks,
  HandCoins,
  NotebookText,
  Workflow,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
const products = [
  {
    name: "Properties",
    description: "Explore all property listings.",
    href: "/properties",
    icon: <BarChart2 className="flex-shrink-0 size-4" />,
  },
  {
    name: "Agent Move",
    description: "Speak directly to expert agents.",
    href: "/contact",
    icon: <NotebookText className="flex-shrink-0 size-4" />,
  },
  {
    name: "Valuations",
    description: "Get exact valuations of property for better decision.",
    href: "#",
    icon: <HandCoins className="flex-shrink-0 size-4" />,
  },
  {
    name: "Guides",
    description: "Learn about real estate",
    href: "/guides",
    icon: <Blocks className="flex-shrink-0 size-4" />,
  },
  {
    name: "Property Management",
    description: "Explore investment opportunities.",
    href: "/property-management",
    icon: <Workflow className="flex-shrink-0 size-4" />,
  },
];
const callsToAction = [
  { name: "Watch demo", href: "#", icon: PlayCircleIcon },
  { name: "Contact sales", href: "/contact", icon: PhoneIcon },
];
export default function ProductMenu() {
  return (
    <section className="transition-[opacity,margin] duration-100 md:duration-150 absolute top-full bg-white md:shadow-2xl rounded-lg">
      <div className="grid grid-cols-1 md:grid-cols-10">
        <div className="md:col-span-5">
          <div className="flex flex-col w-fit py-6 px-3">
            <div className="space-y-4">
              <span className="mb-2 text-sm font-bold uppercase text-gray-800">
                Solutions
              </span>

              {products.map((product) => {
                const { name, href, description, icon } = product;
                return (
                  <Link
                    key={name}
                    href={href}
                    className="text-sm flex items-center gap-x-4 text-gray-600 hover:text-blue-500"
                  >
                    {icon}
                    <div className="grow w-fit ">
                      <p>{name}</p>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
        <div className="col-span-full md:col-span-5">
          <div className="flex flex-col bg-gray-50 p-3 h-full">
            <span className="text-sm mt-4 font-bold uppercase text-gray-800 w-fit">
              Featured Properties
            </span>

            <Link href="/properties" className="mt-4 group">
              <div className="aspect-w-16 aspect-h-9">
                <img
                  src={`/assets/house.jpg`}
                  className="w-full object-cover rounded-lg"
                  alt="House"
                />
              </div>
              <div className="mt-2">
                <p className="text-gray-600 text-xs mt-4">
                  Explore new and exquisite African Real Estate properties
                </p>
                <p className="mt-3 inline-flex items-center gap-x-1 text-sm font-medium text-blue-600 decoration-2 underline-offset-4 hover:underline">
                  Explore
                  <svg
                    className="flex-shrink-0 size-4 transition-transform duration-300 group-hover:translate-x-1"
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  >
                    <path d="m9 18 6-6-6-6" />
                  </svg>
                </p>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </section>
    // <section className="border rounded-sm shadow-md bg-white absolute top-full text-gray-500">
    //   <div className="flex cursor-pointer p-3">
    //     <div className="flex flex-col items-start space-y-3 mb-4">
    //       {products.map((product) => {
    //         const { icon, name, description, href } = product;
    //         return (
    //           <Link
    //             href={href}
    //             key={name}
    //             className="group flex gap-3 border-b border-neutral-50"
    //           >
    //             <div className="bg-neutral-50 p-2 rounded-full shadow-sm h-fit">
    //               {icon}
    //             </div>
    //             <div className=" space-y-2 p-2">
    //               <p className="font-medium text-neutral-500 hover:text-neutral-700 transition-colors">
    //                 {name}
    //               </p>
    //               <p className="text-xs w-64 text-gray-400">{description}</p>
    //             </div>
    //           </Link>
    //         );
    //       })}
    //     </div>
    //   </div>
    // </section>
  );
}
