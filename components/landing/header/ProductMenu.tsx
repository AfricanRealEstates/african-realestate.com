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
const products = [
  {
    name: "Properties",
    description: "Explore all property listings.",
    href: "/properties",
    icon: <BarChart2 className="size-3" />,
  },
  {
    name: "Agent Move",
    description: "Speak directly to expert agents.",
    href: "/contact",
    icon: <NotebookText className="size-3" />,
  },
  {
    name: "Valuations",
    description: "Get exact valuations of property for better decision.",
    href: "#",
    icon: <HandCoins className="size-3" />,
  },
  {
    name: "Guides",
    description: "Learn about real estate",
    href: "/guides",
    icon: <Blocks className="size-3" />,
  },
  {
    name: "Property Management",
    description: "Explore investment opportunities.",
    href: "/property-management",
    icon: <Workflow className="size-3" />,
  },
];
const callsToAction = [
  { name: "Watch demo", href: "#", icon: PlayCircleIcon },
  { name: "Contact sales", href: "/contact", icon: PhoneIcon },
];
export default function ProductMenu() {
  return (
    <section className="border rounded-sm shadow-md bg-white absolute top-full text-gray-500">
      <div className="flex cursor-pointer p-3">
        <div className="flex flex-col items-start space-y-3 mb-4">
          {products.map((product) => {
            const { icon, name, description, href } = product;
            return (
              <Link
                href={href}
                key={name}
                className="group flex gap-3 border-b border-neutral-50"
              >
                <div className="bg-neutral-50 p-2 rounded-full shadow-sm h-fit">
                  {icon}
                </div>
                <div className=" space-y-2 p-2">
                  <p className="font-medium text-neutral-500 hover:text-neutral-700 transition-colors">
                    {name}
                  </p>
                  <p className="text-xs w-64 text-gray-400">{description}</p>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
