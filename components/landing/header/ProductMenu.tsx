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
import { PhoneIcon, PlayCircleIcon } from "@heroicons/react/20/solid";
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
const company = [
  {
    name: "About us",
    href: "/about",
    description: "Our Company Vision, Values and Mission.",
  },
  {
    name: "Careers",
    href: "/careers",
    description: "Explore all of our Open Positions.",
  },
  {
    name: "Partners",
    href: "/agencies",
    description: "Get in touch with our dedicated Support Team.",
  },
  {
    name: "Blog",
    href: "/blog",
    description: "Read our latest announcements, guides and insights",
  },
];
const callsToAction = [
  { name: "Watch demo", href: "#", icon: PlayCircleIcon },
  { name: "Contact sales", href: "/contact", icon: PhoneIcon },
];
export default function ProductMenu() {
  return (
    <section className="transition-[opacity,margin] duration-100 md:duration-150 absolute top-full bg-white md:shadow-2xl rounded-lg">
      <div className="flex w-full min-w-[500px]">
        <div className="flex-1">
          <div className="flex flex-col w-fit py-6 px-3">
            <div className="space-y-4">
              <span className="mb-4 text-sm font-bold uppercase text-blue-600">
                Solutions
              </span>

              {products.map((product) => {
                const { name, href, description, icon } = product;
                return (
                  <Link
                    key={name}
                    href={href}
                    className="flex items-center gap-x-4 text-gray-600 hover:text-blue-500"
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
        <div className="flex-1 bg-neutral-50">
          <div className="flex flex-col w-fit py-6 px-4">
            <div className="space-y-4">
              <span className="mb-4 text-sm font-extrabold uppercase text-blue-600">
                Company
              </span>

              {company.map((product) => {
                const { name, href, description } = product;
                return (
                  <Link
                    key={name}
                    href={href}
                    className="flex items-center gap-x-4 text-gray-600 hover:text-blue-500"
                  >
                    <div className="grow w-fit ">
                      <p>{name}</p>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
