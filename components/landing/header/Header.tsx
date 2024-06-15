"use client";
import { Fragment, useEffect, useState } from "react";
import {
  Dialog,
  DialogPanel,
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
  Popover,
  PopoverButton,
  PopoverGroup,
  PopoverPanel,
  Transition,
} from "@headlessui/react";
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
    description: "Your customers’ data will be safe and secure",
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

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [stickyMenu, setStickyMenu] = useState(false);
  const [showProductMenu, setShowProductMenu] = useState(false);
  const [showCompanyMenu, setShowCompanyMenu] = useState(false);
  const [showAvatarMenu, setShowAvatarMenu] = useState(false);

  const session = useSession();
  const user = session.data?.user;

  const pathname = usePathname();
  const isHomePage = pathname === "/";

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
  }, []);
  return (
    <header
      className={`fixed transition-all duration-300 py-5 left-0 top-0 z-30 w-full bg-transparent backdrop-blur-sm ${
        stickyMenu
          ? "bg-white !py-3 shadow-sm transition duration-100 text-gray-600"
          : isHomePage
          ? "text-white hover:text-gray-100"
          : "text-gray-600 border-b border-neutral-100"
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
              <span className="bg-[#eb6753] text-white py-1 px-2 rounded-lg">
                <HomeIcon />
              </span>
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
            <button
              className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
              onClick={() => setMobileMenuOpen(true)}
            >
              <span className="sr-only">Open main menu</span>
              <Bars3Icon
                className={`size-7 ${
                  stickyMenu || !isHomePage ? "text-gray-700" : "text-white"
                }`}
                aria-hidden="true"
              />
            </button>
          </div>

          <div className="hidden lg:flex lg:flex-1 lg:gap-x-16 lg:justify-end mr-2 relative">
            <div
              className="py-3 flex items-center gap-1 font-medium group"
              onMouseEnter={() => setShowProductMenu(true)}
              onMouseLeave={() => setShowProductMenu(false)}
            >
              Product{" "}
              <ChevronUp className="size-4 font-medium group-hover:rotate-180 transition-transform duration-300 group-hover:translate-y-1 hover:underline underline-offset-4" />{" "}
              {showProductMenu && <ProductMenu />}
            </div>

            <Link
              href="/let"
              className="flex items-center gap-x-1 font-medium leading-6 transition-transform hover:underline underline-offset-4"
            >
              Let
            </Link>
            <Link
              href="/buy"
              className="flex items-center gap-x-1 font-medium leading-6 transition-transform hover:underline underline-offset-4"
            >
              Buy
            </Link>

            <div
              className="py-3 flex items-center gap-1 font-medium group"
              onMouseEnter={() => setShowCompanyMenu(true)}
              onMouseLeave={() => setShowCompanyMenu(false)}
            >
              Company{" "}
              <ChevronUp className="size-4 font-medium group-hover:rotate-180 transition-transform duration-300 group-hover:translate-y-1 hover:underline underline-offset-4" />
              {showCompanyMenu && <CompanyMenu />}
            </div>
          </div>
          {/* <PopoverGroup className="hidden lg:flex lg:gap-x-16">
            <Popover className="relative">
              <PopoverButton className="group flex items-center gap-x-1 text-sm font-semibold leading-6">
                Product
                <ChevronDownIcon
                  className="size-5 flex-none transition-transform duration-300 group-hover:rotate-180"
                  aria-hidden="true"
                />
              </PopoverButton>
              <Transition
                enter="transition ease-out duration-200"
                enterFrom="opacity-0 translate-y-1"
                enterTo="opacity-100 translate-y-0"
                leave="transition ease-in duration-150"
                leaveFrom="opacity-100 translate-y-0"
                leaveTo="opacity-0 translate-y-1"
              >
                <PopoverPanel className="absolute -left-8 top-full z-10 mt-3 w-screen max-w-md overflow-hidden rounded-3xl bg-white shadow-lg ring-1 ring-gray-900/5">
                  <div className="p-4">
                    {products.map((product) => {
                      const { name, href, description, icon } = product;
                      return (
                        <div
                          key={name}
                          className="group relative flex gap-x-6 rounded-lg p-4 leading-6 hover:bg-gray-50"
                        >
                          <div className="mt-1 flex size-11 flex-none items-center justify-center rounded-lg bg-gray-50 group-hover:bg-white">
                            <product.icon
                              className="size-6 text-gray-600 group-hover:text-indigo-600"
                              aria-hidden="true"
                            />
                          </div>
                          <div className="flex-auto">
                            <Link
                              href={href}
                              className="block text-sm font-semibold text-gray-400"
                            >
                              {name}
                              <span className="absolute inset-0" />
                            </Link>
                            <p className="mt-1 text-gray-600">{description}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  <div className="grid grid-cols-2 divide-x divide-gray-900/5 bg-gray-50">
                    {callsToAction.map((action) => {
                      return (
                        <Link
                          key={action.name}
                          href={action.href}
                          className="flex items-center justify-center gap-x-2.5 p-3 text-sm font-semibold leading-6 text-gray-900 hover:bg-gray-100"
                        >
                          <action.icon
                            className="size-5 flex-none text-gray-400"
                            aria-hidden="true"
                          />
                          {action.name}
                        </Link>
                      );
                    })}
                  </div>
                </PopoverPanel>
              </Transition>
            </Popover>
            <Link
              href="/let"
              className="flex items-center gap-x-1 text-sm font-semibold leading-6"
            >
              Let
            </Link>
            <Link
              href="/buy"
              className="flex items-center gap-x-1 text-sm font-semibold leading-6"
            >
              Buy
            </Link>

            <Popover className="relative">
              <PopoverButton className="group flex items-center gap-x-1 text-sm font-semibold leading-6">
                Company
                <ChevronDownIcon
                  aria-hidden="true"
                  className="size-5 flex-none transition-transform duration-300 group-hover:translate-y-0.5"
                />
              </PopoverButton>
              <Transition
                enter="transition ease-out duration-200"
                enterFrom="opacity-0 translate-y-1"
                enterTo="opacity-100 translate-y-0"
                leave="transition ease-in duration-150"
                leaveFrom="opacity-100 translate-y-0"
                leaveTo="opacity-0 translate-y-1"
              >
                <PopoverPanel className="absolute -left-8 top-full z-10 mt-3 w-96 rounded-3xl bg-white p-4 shadow-lg ring-1 ring-gray-900/5">
                  {company.map((item) => {
                    return (
                      <div
                        className="relative rounded-lg p-4 hover:bg-gray-50"
                        key={item.name}
                      >
                        <Link
                          href={item.href}
                          className="block font-semibold leading-6 text-gray-400"
                        >
                          {item.name}
                          <span className="absolute inset-0" />
                        </Link>
                        <p className="mt-1 text-sm leading-6 text-gray-600">
                          {item.description}
                        </p>
                      </div>
                    );
                  })}
                </PopoverPanel>
              </Transition>
            </Popover>
          </PopoverGroup> */}
          <div className="hidden lg:flex lg:flex-1 lg:justify-end">
            {user ? (
              <div className="flex gap-x-6">
                <Link
                  href="/dashboard"
                  className="flex items-center gap-x-1 text-sm font-semibold leading-6"
                >
                  Dashboard
                </Link>
                <div
                  className="relative py-3 flex items-center gap-1 font-medium group"
                  onMouseEnter={() => setShowAvatarMenu(true)}
                  onMouseLeave={() => setShowAvatarMenu(false)}
                >
                  <Image
                    src={user?.image ?? "/assets/placeholder.jpg"} // default avatar
                    height={40}
                    width={40}
                    alt={user?.name ?? "User Avatar"} // default avatar
                    className="rounded-full border h-8 w-8"
                  />
                  {showAvatarMenu && <AvatarMenu />}
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-x-8">
                <Link href="/login" className="text-sm font-semibold leading-6">
                  <span className="group inline-flex items-center">
                    Log in{" "}
                    <ChevronRightIcon className="ml-1 size-3 transition-transform duration-300 group-hover:translate-x-1" />
                  </span>
                </Link>
                <Button type="submit" color="blue">
                  Add listing
                </Button>
              </div>
            )}
          </div>
        </nav>

        <Dialog
          className="lg:hidden"
          open={mobileMenuOpen}
          onClose={setMobileMenuOpen}
        >
          <div className="fixed inset-0 z-50" />
          <DialogPanel className="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-white px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10 transition-transform duration-300">
            <div className="flex items-center justify-between">
              <Link href="/" className="flex flex-shrink-0 items-center gap-2">
                {/* <span className="bg-[#eb6753] text-white py-1 px-2 rounded-lg">
                  <HomeIcon />
                </span> */}
                <span
                  className={`${
                    stickyMenu || !isHomePage
                      ? "text-gray-700"
                      : "text-gray-700"
                  } text-base tracking-tight font-semibold`}
                >
                  African Real Estate.
                </span>
              </Link>
              <button
                className="-m-2.5 rounded-md p-2.5 text-gray-700"
                onClick={() => setMobileMenuOpen(false)}
                type="button"
              >
                <span className="sr-only">Close menu</span>
                <XMarkIcon className="size-6" aria-hidden="true" />
              </button>
            </div>
            <div className="mt-6 flow-root">
              <div className="-my-6 divide-y divide-gray-500/10">
                <div className="space-y-2 py-6">
                  <Disclosure as="div" className="-mx-3">
                    {({ open }) => (
                      <>
                        <DisclosureButton className="flex w-full items-center justify-between rounded-lg py-2 pl-3 pr-3.5 text-base font-semibold leading-7 text-gray-700 hover:bg-gray-50">
                          Product
                          <ChevronDownIcon
                            className={clsx(
                              open ? "rotate-180" : "",
                              "size-5 flex-none"
                            )}
                            aria-hidden="true"
                          />
                        </DisclosureButton>
                        <DisclosurePanel className="mt-2 space-y-2">
                          {[...products, ...callsToAction].map((item) => {
                            return (
                              <DisclosureButton
                                key={item.name}
                                as="a"
                                href={item.href}
                                className="block rounded-lg py-2 pl-6 pr-3 text-sm font-semibold leading-7 text-gray-400 hover:bg-gray-50"
                              >
                                {item.name}
                              </DisclosureButton>
                            );
                          })}
                        </DisclosurePanel>
                      </>
                    )}
                  </Disclosure>

                  <Link
                    href="/let"
                    className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-400 hover:bg-gray-50"
                  >
                    Let
                  </Link>
                  <Link
                    href="/buy"
                    className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-400 hover:bg-gray-50"
                  >
                    Buy
                  </Link>

                  <Disclosure as="div" className={`-mx-3`}>
                    {({ open }) => (
                      <>
                        <DisclosureButton className="flex w-full items-center justify-between rounded-lg py-2 pl-3 pr-3.5 text-base font-semibold leading-7 text-gray-700 hover:bg-gray-50">
                          Company
                          <ChevronDownIcon
                            className={clsx(
                              open ? "rotate-180" : "",
                              "size-5 flex-none"
                            )}
                            aria-hidden="true"
                          />
                        </DisclosureButton>
                        <DisclosurePanel className="mt-2 space-y-2">
                          {company.map((item) => (
                            <DisclosureButton
                              key={item.name}
                              as="a"
                              href={item.href}
                              className="block rounded-lg py-2 pl-6 pr-3 text-sm font-semibold leading-7 text-gray-400 hover:bg-gray-50"
                            >
                              {item.name}
                            </DisclosureButton>
                          ))}
                        </DisclosurePanel>
                      </>
                    )}
                  </Disclosure>
                </div>
                <div className="py-6">
                  {user ? (
                    <div className="flex gap-x-10 items-center w-full">
                      <Link
                        href="/dashboard"
                        className="flex items-center gap-x-10 text-sm font-semibold leading-6"
                      >
                        Welcome, {user.name}
                      </Link>
                      <Popover className="relative">
                        <PopoverButton className="group flex items-center gap-x-1 text-sm font-semibold leading-6">
                          <Image
                            src={user.image || `/assets/placeholder.jpg`}
                            width={50}
                            height={50}
                            alt=""
                            className="rounded-full"
                          />
                        </PopoverButton>
                        <Transition
                          enter="transition ease-out duration-200"
                          enterFrom="opacity-0 translate-y-1"
                          enterTo="opacity-100 translate-y-0"
                          leave="transition ease-in duration-150"
                          leaveFrom="opacity-100 translate-y-0"
                          leaveTo="opacity-0 translate-y-1"
                        >
                          <PopoverPanel className="max-w-64 absolute -left-8 top-full z-10 mt-3 w-96 rounded-xl text-gray-600 bg-white p-4 shadow-lg ring-1 ring-gray-900/5">
                            <div className=" relative rounded-lg p-2 hover:bg-gray-50">
                              <p className="group cursor-pointer rounded-lg px-3.5 py-0.5 focus:outline-none sm:px-3 sm:py-0.5 flex items-center gap-x-3">
                                <User className="size-3" />
                                {user.name}
                              </p>
                            </div>
                            <p className="relative rounded-lg p-2 hover:bg-gray-50">
                              <Link
                                href={`/dashboard`}
                                className="group cursor-pointer rounded-lg px-3.5 py-0.5 focus:outline-none sm:px-3 sm:py-0.5 flex items-center gap-x-3"
                              >
                                <LayoutGrid className="size-3" />
                                Dashboard
                              </Link>
                            </p>
                            <div className="relative rounded-lg p-2 hover:bg-gray-50">
                              <button
                                onClick={handleSignOut}
                                className="group cursor-pointer rounded-lg px-3.5 py-0.5 focus:outline-none sm:px-3 sm:py-0.5 flex items-center gap-x-3"
                              >
                                <LogOutIcon className="size-3" />
                                Sign out
                                {/* <span className="absolute inset-0" /> */}
                              </button>
                            </div>
                          </PopoverPanel>
                        </Transition>
                      </Popover>
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
          </DialogPanel>
        </Dialog>
      </div>
    </header>
  );
}
