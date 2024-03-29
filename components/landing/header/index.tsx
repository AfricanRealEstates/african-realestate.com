"use client";

import { useCurrentUser } from "@/hooks/use-current-user";
import { UserButton } from "@clerk/nextjs";
import { User } from "@prisma/client";
import { Button, Dropdown } from "antd";
import { ArrowRight, HomeIcon, Menu, X } from "lucide-react";
import { signOut } from "next-auth/react";
import { Nunito_Sans } from "next/font/google";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

const nunitoSans = Nunito_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-nunitosans",
});

const navLinks = [
  {
    label: "Let",
    href: "/properties",
  },
  {
    label: "Buy",
    href: "/properties",
  },
  {
    label: "Resources",
    href: "/resources",
  },
];

const agentMenu = [
  { name: "Home", path: "/" },
  { name: "Properties", path: "/agent/properties" },
  { name: "Account", path: "/agent/account" },
  { name: "Subscriptions", path: "/agent/subscriptions" },
  { name: "Queries", path: "/agent/queries" },
];
const adminMenu = [
  { name: "Home", path: "/" },
  { name: "Properties", path: "/admin/properties" },
  { name: "Agents", path: "/admin/agents" },
];

export default function Header() {
  const [currentUser = null, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [menuToShow = agentMenu, setMenuToShow] = useState<any>(agentMenu);
  const [mobileView, setMobileView] = useState(false);
  const [stickyMenu, setStickyMenu] = useState(false);
  const toggleMobileView = () => {
    setMobileView(!mobileView);
  };

  const handleSignOut = async () => {
    await signOut({ callbackUrl: "/" });
  };

  const user = useCurrentUser();
  const pathname = usePathname();
  const router = useRouter();

  // sticky Menu
  const handleStickyMenu = () => {
    if (window.scrollY >= 80 && !mobileView) {
      setStickyMenu(true);
    } else {
      setStickyMenu(false);
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handleStickyMenu);
  }, []);

  return (
    <>
      <header
        className={`${
          nunitoSans.className
        } fixed transition-all duration-300 py-5 left-0 top-0 z-50 w-full bg-transparent backdrop-blur-sm ${
          stickyMenu
            ? "bg-white !py-3 shadow transition duration-100 text-gray-600"
            : "text-white"
        }`}
      >
        <div className="top-0 w-full z-50 will-change-auto duration-200 bg-transparent translate-y-0 transition-colors">
          <div className="max-w-7xl mx-auto px-4">
            <div className="w-full flex items-center justify-between">
              <div className="flex items-center flex-shrink-0">
                <Link
                  href="/"
                  className={`flex flex-shrink-0 items-center gap-2 `}
                >
                  <span className="bg-[#eb6753] text-white py-1 px-2 rounded-lg">
                    <HomeIcon />
                  </span>
                  <span
                    className={`${
                      stickyMenu ? "text-gray-700" : "text-white"
                    } text-xl  tracking-tight font-semibold`}
                  >
                    African Real Estate.
                  </span>
                </Link>
              </div>
              <ul className="hidden lg:flex ml-14 gap-8">
                {navLinks.map((navLink) => {
                  const { href, label } = navLink;
                  return (
                    <li key={label}>
                      <Link href={href}>{label}</Link>
                    </li>
                  );
                })}
              </ul>
              <div className="hidden font-semibold lg:flex  gap-6 items-center">
                {user ? (
                  <div className=" py-1 px-5 flex items-center">
                    <Dropdown
                      menu={{
                        items: [
                          ...menuToShow.map((item: any) => ({
                            label: item.name,
                            onClick: () => {
                              router.push(item.path);
                            },
                          })),
                          {
                            label: "Sign Out",
                            onClick: handleSignOut,
                          },
                        ],
                      }}
                    >
                      <Image
                        src={user.image || "/assets/placeholder.jpg"}
                        height={15}
                        width={50}
                        alt={user.name || "Avatar"}
                        className="w-[38px] h-[38px] rounded-full object-cover border-[1px] border-gray-600"
                      />
                    </Dropdown>
                  </div>
                ) : (
                  <Link
                    href="/login"
                    className={` ${
                      !stickyMenu ? "text-white hover:text-gray-200" : ""
                    } `}
                  >
                    Sign in
                  </Link>
                )}

                <button
                  onClick={() =>
                    router.push("/agent/properties/create-property")
                  }
                  className="group/follow flex items-center gap-2 rounded-md bg-indigo-600 px-6 py-3 font-semibold text-white shadow-lg transition-all hover:-translate-y-0.5 active:translate-y-0 active:bg-indigo-700 active:shadow-inner"
                >
                  Sell fast
                  <ArrowRight className="transition-transform group-hover/follow:-rotate-45 group-active/follow:rotate-0" />
                </button>
              </div>
              <div className="lg:hidden md:flex flex-col justify-end">
                <button
                  onClick={toggleMobileView}
                  type="button"
                  aria-label="Menu button"
                  className="hover:cursor-pointer bg-transparent border-[1px] border-neutral-200 p-2 rounded-sm border-solid flex items-center"
                >
                  {mobileView ? <X className="" /> : <Menu className="" />}
                </button>
              </div>
            </div>
            {mobileView && (
              <section
                // ref={ref}
                className="shadow-[0_35px_60px_-15px_rgba(0,0,0,0.3)] transition-transform ease-in-out fixed right-0 z-20 gap-y-6 mt-0 bg-white w-full p-8 text-base flex flex-col  lg:hidden"
              >
                <nav className="flex flex-col space-y-4 shadow-[0_1px_0_#f7f7f7] pb-4">
                  {navLinks.map((link) => {
                    const { href, label } = link;
                    return (
                      <Link
                        href={href}
                        key={href}
                        className="text-[#4a4a4a] no-underline text-base"
                      >
                        {label}
                      </Link>
                    );
                  })}
                </nav>
                <div className="border-t flex justify-between gap-6 border-gray-100 flex-1 py-8 ">
                  <section className="flex flex-col gap-4">
                    <p className="text-sm text-gray-500">Need Customer Care</p>
                    <p className="font-semibold text-sm text-black">
                      +254 732945534
                    </p>
                  </section>
                  <section className="flex flex-col gap-4">
                    <p className="text-sm text-gray-500">Need Live Support?</p>
                    <p className="font-semibold text-sm text-black">
                      Africanrealestate0@gmail.com
                    </p>
                  </section>
                </div>
                <div className="flex items-center gap-4 justify-between">
                  {user ? (
                    <>
                      <div className="flex items-center justify-between">
                        <Dropdown
                          menu={{
                            items: [
                              ...menuToShow.map((item: any) => ({
                                label: item.name,
                                onClick: () => {
                                  router.push(item.path);
                                },
                              })),
                              {
                                label: "Sign Out",
                                onClick: handleSignOut,
                              },
                            ],
                          }}
                        >
                          <Image
                            src={user.image || "/assets/placeholder.jpg"}
                            height={15}
                            width={50}
                            alt={user.name || "Avatar"}
                            className="w-[38px] h-[38px] rounded-full object-cover border-[1px] border-gray-600"
                          />
                        </Dropdown>
                      </div>
                    </>
                  ) : (
                    <Link
                      href="/sign-in"
                      className="border-black inline-block flex-1 py-2 px-3 border rounded-md text-base no-underline text-black"
                    >
                      Sign in
                    </Link>
                  )}
                  <button
                    onClick={() =>
                      router.push("/agent/properties/create-property")
                    }
                    className="flex items-center gap-2 rounded-md bg-indigo-600 px-6 py-3 font-semibold text-white shadow-lg transition-all hover:-translate-y-0.5 active:translate-y-0 active:bg-indigo-700 active:shadow-inner"
                  >
                    Sell fast
                    <ArrowRight className="transition-transform" />
                  </button>
                </div>
              </section>
            )}
          </div>
        </div>
      </header>
    </>
  );
}
