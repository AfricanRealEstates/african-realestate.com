"use client";

import { Fragment, useEffect, useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  ArrowPathIcon,
  ArrowRightStartOnRectangleIcon,
  Bars3Icon,
  ChartPieIcon,
  ChevronDownIcon,
  ChevronRightIcon,
  ChevronUpIcon,
  CursorArrowRaysIcon,
  FingerPrintIcon,
  SquaresPlusIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import {
  LightBulbIcon,
  PhoneIcon,
  PlayCircleIcon,
  ShieldCheckIcon,
  UserCircleIcon,
} from "@heroicons/react/20/solid";

import {
  ArrowDown,
  ChevronUp,
  Cloud,
  CreditCard,
  Github,
  Keyboard,
  LayoutDashboard,
  LayoutGrid,
  LayoutPanelLeft,
  LifeBuoy,
  LogOut,
  LogOutIcon,
  Mail,
  MessageSquare,
  Plus,
  PlusCircle,
  Settings,
  User,
  UserPlus,
  Users,
  Heart,
  Package,
} from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { HomeIcon } from "lucide-react";
import clsx from "clsx";
import { signOut, useSession } from "next-auth/react";
import Image from "next/image";
import ProductMenu from "./ProductMenu";
import CompanyMenu from "./CompanyMenu";
import { Button } from "@/components/utils/Button";
import AvatarMenu from "./AvatarMenu";

import { Inter, Nunito_Sans } from "next/font/google";
import Modal from "@/components/modals/Modal";
import AuthContent from "@/components/auth/AuthContent";
const nunito = Nunito_Sans({
  subsets: ["latin"],
  weight: ["600"],
});

const products = [
  {
    name: "Analytics",
    description: "Get a better understanding of your traffic",
    href: "#",
    icon: ChartPieIcon,
  },
  {
    name: "Engagement",
    description: "Speak directly to your customers",
    href: "#",
    icon: CursorArrowRaysIcon,
  },
  {
    name: "Security",
    description: "Your customers' data will be safe and secure",
    href: "#",
    icon: FingerPrintIcon,
  },
  {
    name: "Integrations",
    description: "Connect with third-party tools",
    href: "#",
    icon: SquaresPlusIcon,
  },
  {
    name: "Automations",
    description: "Build strategic funnels that will convert",
    href: "#",
    icon: ArrowPathIcon,
  },
];
const callsToAction = [
  { name: "Watch demo", href: "#", icon: PlayCircleIcon },
  { name: "Contact sales", href: "/contact", icon: PhoneIcon },
];

const company = [
  {
    name: "About us",
    href: "/about",
    description:
      "Learn more about our company values and mission to empower others",
  },
  {
    name: "Careers",
    href: "/careers",
    description:
      "Looking for you next career opportunity? See all of our open positions",
  },
  {
    name: "Support",
    href: "/contact",
    description:
      "Get in touch with our dedicated support team or reach out on our community forums",
  },
  {
    name: "Blog",
    href: "/blog",
    description:
      "Read our latest announcements and get perspectives from our team",
  },
];

export default function Component() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [stickyMenu, setStickyMenu] = useState(false);
  const [showProductMenu, setShowProductMenu] = useState(false);
  const [showCompanyMenu, setShowCompanyMenu] = useState(false);
  const [showAvatarMenu, setShowAvatarMenu] = useState(false);
  const [authModalVisible, setAuthModalVisible] = useState(false);

  const session = useSession();
  const user = session.data?.user;

  const pathname = usePathname();
  const isHomePage = pathname === "/";

  const handleButtonClick = () => {
    setAuthModalVisible(true);
  };

  const handleSignOut = async () => {
    await signOut({ callbackUrl: "/" });
  };

  const handleStickyMenu = () => {
    if (window.scrollY >= 80) {
      setStickyMenu(true);
    } else {
      setStickyMenu(false);
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handleStickyMenu);

    return () => {
      window.removeEventListener("scroll", handleStickyMenu);
    };
  }, []);

  return (
    <header
      className={`fixed transition-all duration-300 py-5 left-0 top-0 z-30 w-full bg-transparent backdrop-blur-sm ${
        stickyMenu
          ? "bg-white !py-3 shadow-sm transition duration-100 text-gray-600"
          : isHomePage
          ? "text-white hover:text-gray-100"
          : "text-gray-600"
      }`}
    >
      <div className="top-0 w-full z-30 will-change-auto duration-200 bg-transparent translate-y-0 transition-colors">
        <nav
          aria-label="Global"
          className="mx-auto flex max-w-7xl items-center justify-between py-2 px-4 lg:px-8"
        >
          <div className="flex lg:flex-1">
            <Link
              href="/"
              className="-m-1.5 p-1.5 flex flex-shrink-0 items-center gap-2"
            >
              <img
                alt="Logo"
                src="/assets/logo.png"
                height={40}
                width={40}
                className="object-cover"
              />
              <span
                className={`${
                  stickyMenu || !isHomePage ? "text-gray-700" : "text-white"
                } text-lg tracking-tight font-semibold hidden lg:block`}
              >
                African Real Estate.
              </span>
            </Link>
          </div>
          <div className="flex lg:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <button className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700">
                  <span className="sr-only">Open main menu</span>
                  <Bars3Icon
                    className={`size-7 ${
                      stickyMenu || !isHomePage ? "text-gray-700" : "text-white"
                    }`}
                    aria-hidden="true"
                  />
                </button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                <SheetHeader>
                  <SheetTitle>African Real Estate</SheetTitle>
                </SheetHeader>
                <ScrollArea className="h-[calc(100vh-8rem)] pb-10">
                  <div className="mt-6 flow-root">
                    <div className="-my-6">
                      <div className="space-y-2 py-6">
                        {/* <Accordion
                          type="single"
                          collapsible
                          className="border-b-0"
                        >
                          <AccordionItem value="products">
                            <AccordionTrigger>Products</AccordionTrigger>
                            <AccordionContent>
                              {[...products, ...callsToAction].map((item) => (
                                <Link
                                  key={item.name}
                                  href={item.href}
                                  className="block rounded-lg py-2 pl-6 pr-3 text-sm font-semibold leading-7 text-gray-400 hover:bg-gray-50"
                                >
                                  {item.name}
                                </Link>
                              ))}
                            </AccordionContent>
                          </AccordionItem>
                        </Accordion> */}

                        <Link
                          href="/buy"
                          className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-400 hover:bg-gray-50"
                        >
                          Buy
                        </Link>

                        <Link
                          href="/let"
                          className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-400 hover:bg-gray-50"
                        >
                          Let
                        </Link>

                        <Accordion
                          type="single"
                          collapsible
                          className="border-b-0"
                        >
                          <AccordionItem value="company">
                            <AccordionTrigger>Company</AccordionTrigger>
                            <AccordionContent>
                              {company.map((item) => (
                                <Link
                                  key={item.name}
                                  href={item.href}
                                  className="block rounded-lg py-2 pl-6 pr-3 text-sm font-semibold leading-7 text-gray-400 hover:bg-gray-50"
                                >
                                  {item.name}
                                </Link>
                              ))}
                            </AccordionContent>
                          </AccordionItem>
                        </Accordion>
                      </div>
                      <div className="py-6">
                        {user ? (
                          <div className="flex flex-col gap-y-4 items-start w-full">
                            <Link
                              href="/dashboard"
                              className="flex items-center gap-x-2 text-sm font-semibold leading-6"
                            >
                              <User className="h-5 w-5" />
                              Welcome, {user.name}
                            </Link>
                            <Link
                              href="/dashboard"
                              className="flex items-center gap-x-2 text-sm font-semibold leading-6"
                            >
                              <LayoutGrid className="h-5 w-5" />
                              Dashboard
                            </Link>
                            <button
                              onClick={handleSignOut}
                              className="flex items-center gap-x-2 text-sm font-semibold leading-6"
                            >
                              <LogOutIcon className="h-5 w-5" />
                              Sign out
                            </button>
                          </div>
                        ) : (
                          <Link
                            href="/login"
                            className="w-full -mx-3 block rounded-lg px-3 py-2.5 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                          >
                            <span className="group inline-flex items-center">
                              Log in{" "}
                              <ChevronRightIcon className="ml-1 size-3 transition-transform duration-300 group-hover:translate-x-1" />
                            </span>
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>
                </ScrollArea>
              </SheetContent>
            </Sheet>
          </div>

          <div className="hidden lg:flex lg:flex-1 lg:gap-x-16 lg:justify-end mr-2 relative">
            <Link
              href="/buy"
              className="flex items-center gap-x-1 font-medium leading-6 transition-transform hover:underline underline-offset-4"
            >
              Buy
            </Link>
            <Link
              href="/let"
              className="flex items-center gap-x-1 font-medium leading-6 transition-transform hover:underline underline-offset-4"
            >
              Let
            </Link>
            <div
              className="py-3 flex items-center gap-1 font-medium group"
              onMouseEnter={() => setShowProductMenu(true)}
              onMouseLeave={() => setShowProductMenu(false)}
            >
              Resources{" "}
              <ChevronUp className="size-4 font-medium group-hover:rotate-180 transition-transform duration-300 group-hover:translate-y-1 hover:underline underline-offset-4" />{" "}
              {showProductMenu && <ProductMenu />}
            </div>
          </div>

          <div className="hidden lg:flex lg:flex-1 lg:justify-end">
            {user ? (
              <div className="flex gap-x-9 items-center">
                <div
                  className="relative py-3 flex items-center gap-1 font-medium group"
                  onMouseEnter={() => setShowAvatarMenu(true)}
                  onMouseLeave={() => setShowAvatarMenu(false)}
                >
                  <Image
                    src={user?.image ?? "/assets/placeholder.jpg"}
                    height={40}
                    width={40}
                    alt={user?.name ?? "User Avatar"}
                    className="rounded-full border h-8 w-8"
                  />
                  {showAvatarMenu && <AvatarMenu />}
                </div>
                <Button
                  type="submit"
                  color="blue"
                  href={`/agent/properties/create-property`}
                  className="h-fit"
                >
                  Sell fast
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-x-8">
                <button
                  onClick={handleButtonClick}
                  className="text-sm font-semibold leading-6"
                >
                  <span className="group inline-flex items-center">
                    Log in{" "}
                    <ChevronRightIcon className="ml-1 size-3 transition-transform duration-300 group-hover:translate-x-1" />
                  </span>
                </button>
                <Button type="submit" color="blue" onClick={handleButtonClick}>
                  Sell fast
                </Button>
              </div>
            )}
          </div>

          <Modal visible={authModalVisible} setVisible={setAuthModalVisible}>
            <AuthContent />
          </Modal>
        </nav>
      </div>
    </header>
  );
}
