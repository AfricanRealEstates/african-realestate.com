"use client";
import { cn } from "@/lib/utils";
import {
  Badge,
  Bell,
  ClipboardMinus,
  Handshake,
  HomeIcon,
  LayoutDashboard,
  LayoutPanelLeft,
  LineChart,
  LogOut,
  MessageSquareMore,
  Percent,
  Power,
  Settings,
  ShoppingCart,
  Speaker,
  Users,
} from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import React, { Dispatch, Fragment, SetStateAction, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/20/solid";
import UserButton from "../auth/user-button";
import { Button } from "../utils/Button";
import ClientUserButton from "./client-user-button";

const navigation = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
    current: true,
  },
  {
    name: "Requested Quotes",
    href: "/dashboard/requested-quotes",
    icon: Handshake,
    current: false,
  },
  { name: "Staff", href: "/dashboard/staff", icon: Users, current: false },
  {
    name: "Analytics",
    href: "/dashboard/analytics",
    icon: LineChart,
    current: false,
  },
  {
    name: "Announcements",
    href: "/dashboard/annoucements",
    icon: Bell,
    current: false,
  },
];

const sales = [
  {
    name: "Properties",
    href: "/dashboard/properties",
    icon: LayoutPanelLeft,
    current: false,
  },
  {
    name: "Orders",
    href: "/dashboard/orders",
    icon: ShoppingCart,
    current: false,
  },
  { name: "Staff", href: "/dashboard/staff", icon: Users, current: false },
  {
    name: "Coupons",
    href: "/dashboard/coupons",
    icon: Percent,
    current: false,
  },
  {
    name: "Deliverables",
    href: "/dashboard/deliverables",
    icon: Badge,
    current: false,
  },
];

const platformFeatures = [
  {
    name: "Settings",
    href: "/dashboard/settings",
    icon: Settings,
    current: false,
  },
  {
    name: "Support",
    href: "/dashboard/support",
    icon: MessageSquareMore,
    current: false,
  },
  {
    name: "Reports",
    href: "/dashboard/reports",
    icon: ClipboardMinus,
    current: false,
  },
];
interface SidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: Dispatch<SetStateAction<boolean>>;
}
export default function Sidebar({ sidebarOpen, setSidebarOpen }: SidebarProps) {
  const session = useSession();
  const user = session.data?.user;
  return (
    <>
      <Transition.Root show={sidebarOpen} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-50 xl:hidden"
          onClose={setSidebarOpen}
        >
          <Transition.Child
            as={Fragment}
            enter="transition-opacity ease-linear duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition-opacity ease-linear duration-300"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-gray-900/10" />
          </Transition.Child>

          <div className="fixed inset-0 flex">
            <Transition.Child
              as={Fragment}
              enter="transition ease-in-out duration-300 transform"
              enterFrom="-translate-x-full"
              enterTo="translate-x-0"
              leave="transition ease-in-out duration-300 transform"
              leaveFrom="translate-x-0"
              leaveTo="-translate-x-full"
            >
              <Dialog.Panel className="relative mr-16 flex w-full max-w-xs flex-1">
                <Transition.Child
                  as={Fragment}
                  enter="ease-in-out duration-300"
                  enterFrom="opacity-0"
                  enterTo="opacity-100"
                  leave="ease-in-out duration-300"
                  leaveFrom="opacity-100"
                  leaveTo="opacity-0"
                >
                  <div className="absolute left-full top-0 flex w-16 justify-center pt-5">
                    <button
                      type="button"
                      className="-m-2.5 p-2.5"
                      onClick={() => setSidebarOpen(false)}
                    >
                      <span className="sr-only">Close sidebar</span>
                      <XMarkIcon
                        className="h-6 w-6 text-white"
                        aria-hidden="true"
                      />
                    </button>
                  </div>
                </Transition.Child>
                {/* Sidebar component, swap this element with another sidebar if you like */}
                <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-gray-900 px-6 ring-1 ring-white/10">
                  <div className="flex h-16 shrink-0 items-center">
                    <Link
                      href="/"
                      className={`flex items-center justify-center gap-2 no-underline`}
                    >
                      <span className="bg-[#eb6753] text-white py-1 px-2 rounded-lg">
                        <HomeIcon />
                      </span>
                    </Link>
                  </div>
                  <nav className="flex flex-1 flex-col">
                    <ul role="list" className="flex flex-1 flex-col gap-y-7">
                      <li>
                        <div className="text-xs font-semibold leading-6 text-gray-400 my-4 uppercase">
                          Main Menu
                        </div>
                        <ul role="list" className="-mx-2 space-y-1">
                          {navigation.map((nav) => {
                            return (
                              <li key={nav.name}>
                                <Link
                                  href={nav.href}
                                  className={cn(
                                    nav.current
                                      ? "bg-gray-800 text-white"
                                      : "text-gray-400 hover:text-white hover:bg-gray-800",
                                    "group flex items-center gap-x-3 rounded-md p-2 text-sm leading-6"
                                  )}
                                >
                                  <nav.icon
                                    className="size-4 shrink-0"
                                    aria-hidden="true"
                                  />
                                  {nav.name}
                                </Link>
                              </li>
                            );
                          })}
                        </ul>
                      </li>
                      <li>
                        <div className="text-xs font-semibold leading-6 text-gray-400 uppercase">
                          Sales and Fullfillments
                        </div>
                        <ul className="-mx-2 mt-2 space-y-1">
                          {sales.map((sale) => {
                            return (
                              <li key={sale.name}>
                                <Link
                                  href={sale.href}
                                  className={cn(
                                    sale.current
                                      ? "bg-gray-800 text-white"
                                      : "text-gray-400 hover:text-white hover:bg-gray-800",
                                    "group flex items-center gap-x-3 rounded-md p-2 text-sm leading-6"
                                  )}
                                >
                                  <sale.icon
                                    className="size-4 shrink-0"
                                    aria-hidden="true"
                                  />
                                  {sale.name}
                                </Link>
                              </li>
                            );
                          })}
                        </ul>
                      </li>
                      <li>
                        <div className="text-xs font-semibold leading-6 text-gray-400 uppercase">
                          Platform Features
                        </div>
                        <ul className="-mx-2 mt-2 space-y-1">
                          {platformFeatures.map((feature) => {
                            return (
                              <li key={feature.name}>
                                <Link
                                  href={feature.href}
                                  className={cn(
                                    feature.current
                                      ? "bg-gray-800 text-white"
                                      : "text-gray-400 hover:text-white hover:bg-gray-800",
                                    "group flex items-center gap-x-3 rounded-md p-2 text-sm leading-6"
                                  )}
                                >
                                  <feature.icon
                                    className="size-4 shrink-0"
                                    aria-hidden="true"
                                  />
                                  {feature.name}
                                </Link>
                              </li>
                            );
                          })}
                        </ul>
                      </li>
                      <li className="-mx-6 mt-auto">
                        <Link
                          href="/dashboard/settings"
                          className="flex items-center gap-x-2 px-6 py-3 text-sm font-semibold leading-6 text-white hover:bg-gray-800"
                        >
                          <Image
                            height={50}
                            width={50}
                            className="h-8 w-8 rounded-full bg-gray-800"
                            src={user?.image || "/assets/placeholder.jpg"}
                            alt={user?.name || "Profile"}
                          />
                          <span className="sr-only">Your profile</span>
                          <span aria-hidden="true">{user?.name}</span>
                        </Link>
                      </li>
                    </ul>
                  </nav>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition.Root>
      <aside className="hidden xl:fixed xl:inset-y-0 xl:z-50 xl:flex xl:w-72 xl:flex-col">
        <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-gray-950 px-6 ring-white/5">
          <div className="flex h-16 shrink-0">
            <Link
              href="/"
              className={`flex items-center justify-center gap-2 no-underline`}
            >
              <span className="bg-[#eb6753] text-white py-1 px-2 rounded-lg">
                <HomeIcon />
              </span>
            </Link>
          </div>

          <nav className="flex flex-1 flex-col">
            <ul role="list" className="flex flex-1 flex-col gap-y-7">
              <li>
                <div className="text-xs font-semibold leading-6 text-gray-400 my-4 uppercase">
                  Main Menu
                </div>
                <ul role="list" className="-mx-2 space-y-1">
                  {navigation.map((nav) => {
                    return (
                      <li key={nav.name}>
                        <Link
                          href={nav.href}
                          className={cn(
                            nav.current
                              ? "bg-gray-800 text-white"
                              : "text-gray-400 hover:text-white hover:bg-gray-800",
                            "group flex items-center gap-x-3 rounded-md p-2 text-sm leading-6"
                          )}
                        >
                          <nav.icon
                            className="size-4 shrink-0"
                            aria-hidden="true"
                          />
                          {nav.name}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </li>
              <li>
                <div className="text-xs font-semibold leading-6 text-gray-400 uppercase">
                  Sales and Fullfillments
                </div>
                <ul className="-mx-2 mt-2 space-y-1">
                  {sales.map((sale) => {
                    return (
                      <li key={sale.name}>
                        <Link
                          href={sale.href}
                          className={cn(
                            sale.current
                              ? "bg-gray-800 text-white"
                              : "text-gray-400 hover:text-white hover:bg-gray-800",
                            "group flex items-center gap-x-3 rounded-md p-2 text-sm leading-6"
                          )}
                        >
                          <sale.icon
                            className="size-4 shrink-0"
                            aria-hidden="true"
                          />
                          {sale.name}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </li>
              <li>
                <div className="text-xs font-semibold leading-6 text-gray-400 uppercase">
                  Platform Features
                </div>
                <ul className="-mx-2 mt-2 space-y-1">
                  {platformFeatures.map((feature) => {
                    return (
                      <li key={feature.name}>
                        <Link
                          href={feature.href}
                          className={cn(
                            feature.current
                              ? "bg-gray-800 text-white"
                              : "text-gray-400 hover:text-white hover:bg-gray-800",
                            "group flex items-center gap-x-3 rounded-md p-2 text-sm leading-6"
                          )}
                        >
                          <feature.icon
                            className="size-4 shrink-0"
                            aria-hidden="true"
                          />
                          {feature.name}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </li>
              <li className="-mx-6 mt-auto mb-5 flex items-center">
                <Link
                  href="/dashboard/settings"
                  className="flex items-center gap-x-4 px-6 py-3 text-sm font-semibold leading-6 text-white hover:bg-gray-800"
                >
                  <Image
                    height={50}
                    width={50}
                    className="h-8 w-8 rounded-full bg-gray-800"
                    src={user?.image || "/assets/placeholder.jpg"}
                    alt={user?.name || "Profile"}
                  />
                  <span className="sr-only">Your profile</span>
                  <span aria-hidden="true">{user?.name}</span>
                </Link>
                {user && (
                  <Button
                    onClick={() => signOut()}
                    color="white"
                    className="h-fit rounded-full"
                  >
                    <Power />
                  </Button>
                )}
              </li>
            </ul>
          </nav>
        </div>
      </aside>
    </>
  );
}
