"use client";
import { getCurrentUser } from "@/actions/users";
import Loader from "@/components/globals/loader";
import Footer from "@/components/landing/footer";

import { useClickOutside } from "@/hooks/use-click-outside";
import { UserButton } from "@clerk/nextjs";
import { User } from "@prisma/client";
import { Button, Dropdown } from "antd";
import { HomeIcon, Menu, X } from "lucide-react";
import { Raleway } from "next/font/google";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

const nunitoSans = Raleway({
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

interface Props {
  children: React.ReactNode;
}
export default function LayoutProvider({ children }: Props) {
  const [currentUser = null, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [menuToShow = agentMenu, setMenuToShow] = useState<any>(agentMenu);
  const [mobileView, setMobileView] = useState(false);
  const [stickyMenu, setStickyMenu] = useState(false);
  const toggleMobileView = () => {
    setMobileView(!mobileView);
  };
  const pathname = usePathname();
  const router = useRouter();

  const isHomePage = pathname === "/";

  // sticky Menu
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
  const isPublicRoute = ["sign-in", "sign-up", "/"].includes(
    pathname.split("/")[1]
  );
  const isAdminRoute = pathname.split("/")[1] === "admin";

  // const ref = useClickOutside(() => setMobileView(false));

  const getHeader = () => {
    if (isPublicRoute && !currentUser) return null;

    return (
      <>
        <header
          // className={`sticky top-0 z-50 w-full py-3 backdrop-blur-lg border-b border-neutral-700/80 ${nunitoSans.className}`}
          className={`z-50 w-full top-0 fixed py-3 backdrop-blur-2xl border-b border-gray-700 ${
            nunitoSans.className
          } ${
            stickyMenu
              ? "bg-white text-black shadow-sm transition duration-100"
              : "border-b border-neutral-700/80"
          }`}
        >
          <div className="top-0 w-full z-50 will-change-auto duration-200 bg-transparent backdrop-blur-2xl translate-y-0 transition-colors">
            <div className="max-w-7xl px-4 mx-auto text-sm">
              <div className="flex justify-between items-center">
                <Link
                  href="/"
                  className={`flex flex-shrink-0 items-center gap-2 text-black no-underline ${
                    stickyMenu ? "text-black" : ""
                  }`}
                >
                  <span className="bg-[#eb6753] text-white py-1 px-2 rounded-lg">
                    <HomeIcon />
                  </span>
                  <span
                    className={`text-xl tracking-tight font-semibold ${
                      isHomePage && !stickyMenu ? "text-white" : ""
                    }`}
                  >
                    African Real Estate.
                  </span>
                </Link>
                <ul className="hidden lg:flex ml-12 space-x-12">
                  {navLinks.map((link) => {
                    const { label, href } = link;
                    return (
                      <Link
                        key={href}
                        href={href}
                        className={`${
                          isHomePage && !stickyMenu
                            ? "text-white hover:text-gray-200"
                            : ""
                        } no-underline text-black text-[17px]`}
                      >
                        {label}
                      </Link>
                    );
                  })}
                </ul>

                <div className="hidden font-semibold lg:flex justify-center space-x-12 items-center">
                  {currentUser ? (
                    <div className=" py-1 px-5 flex items-center space-x-2">
                      <Dropdown
                        menu={{
                          items: menuToShow.map((item: any) => ({
                            label: item.name,
                            onClick: () => {
                              router.push(item.path);
                            },
                          })),
                        }}
                      >
                        <Button type="link" className="text-sm capitalize">
                          <span
                            className={`${
                              isHomePage && !stickyMenu
                                ? "text-white hover:text-gray-200"
                                : ""
                            } text-[17px] text-gray-600`}
                          >
                            Welcome, {currentUser?.username}
                          </span>
                        </Button>
                      </Dropdown>
                      <UserButton afterSignOutUrl="/sign-in" />
                    </div>
                  ) : (
                    <Link
                      href="/sign-in"
                      className={`${
                        isHomePage && !stickyMenu
                          ? "text-white hover:text-gray-200"
                          : ""
                      } py-2 px-3 border rounded-md text-base no-underline`}
                    >
                      Sign in
                    </Link>
                  )}

                  <Link
                    href="/agent/properties/create-property"
                    className="opacity-90 hover:opacity-100 transition duration-200 text-base no-underline text-white bg-gradient-to-r from-[#eb6753] to-orange-300 py-2 px-3 rounded-md"
                  >
                    Place an ad
                  </Link>
                </div>
                <div className="lg:hidden md:flex flex-col justify-end">
                  <button
                    onClick={toggleMobileView}
                    type="button"
                    aria-label="Menu button"
                    className="hover:cursor-pointer bg-transparent border-[1px] border-neutral-200 p-1 rounded-sm border-solid flex items-center"
                  >
                    {mobileView ? (
                      <X className="text-gray-200" />
                    ) : (
                      <Menu className="text-gray-200" />
                    )}
                  </button>
                </div>
              </div>
              {mobileView && (
                <section
                  // ref={ref}
                  className="shadow-xl transition-transform ease-in-out fixed right-0 z-20 gap-y-6 mt-0 bg-white w-full p-8 text-base flex flex-col  lg:hidden"
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
                  <div className="border-t flex justify-between gap-6 border-gray-50 flex-1 py-8 shadow-[0_1px_0_#f7f7f7]">
                    <section className="flex flex-col gap-4">
                      <p className="text-sm text-gray-500">
                        Need Customer Care
                      </p>
                      <p className="font-semibold text-sm text-black">
                        +254 732945534
                      </p>
                    </section>
                    <section className="flex flex-col gap-4">
                      <p className="text-sm text-gray-500">
                        Need Live Support?
                      </p>
                      <p className="font-semibold text-sm text-black">
                        Africanrealestate0@gmail.com
                      </p>
                    </section>
                  </div>
                  <div className="flex gap-4 justify-between">
                    {currentUser ? (
                      <>
                        <div className="flex items-center justify-between">
                          <Dropdown
                            menu={{
                              items: menuToShow.map((item: any) => ({
                                label: item.name,
                                onClick: () => {
                                  router.push(item.path);
                                },
                              })),
                            }}
                          >
                            <Button
                              type="link"
                              className="text-sm hover:text-[#eb6753] capitalize text-[#bebdbd]"
                            >
                              <span className="hover:text-black text-[17px]">
                                Welcome, {currentUser?.username}
                              </span>
                            </Button>
                          </Dropdown>
                          <UserButton afterSignOutUrl="/sign-in" />
                        </div>
                        {/* <p className="flex-1 text-gray-600 font-semibold capitalize">
                          Welcome,
                          <span className="text-black ">
                            {currentUser?.username}
                          </span>
                        </p> */}
                      </>
                    ) : (
                      <Link
                        href="/sign-in"
                        className="border-black inline-block flex-1 py-2 px-3 border rounded-md text-base no-underline text-black"
                      >
                        Sign in
                      </Link>
                    )}
                    <Link
                      href="/agent/properties/create-property"
                      className="flex-1 text-center text-base no-underline text-white bg-gradient-to-r from-[#eb6753] to-orange-300 py-2 px-3 rounded-md"
                    >
                      Place an ad
                    </Link>
                  </div>
                </section>
              )}
            </div>
          </div>
        </header>

        {/* <div className="bg-[rgba(0,0,0,0.02)] p-4 flex justify-between">
          <Link
            href="/"
            className="text-xl text-[#272323] font-bold no-underline"
          >
            African Real Estate
          </Link>
          <div className="bg-white py-1 px-5 flex items-center space-x-4">
            <Dropdown
              menu={{
                items: menuToShow.map((item: any) => ({
                  label: item.name,
                  onClick: () => {
                    router.push(item.path);
                  },
                })),
              }}
            >
              <Button
                type="link"
                className="capitalize text-[17px] text-[rgba(0,0,0,0.45)]"
              >
                {currentUser?.username}
              </Button>
            </Dropdown>
            <UserButton afterSignOutUrl="/sign-in" />
          </div>
        </div> */}
      </>
    );
  };
  const getContent = () => {
    if (isPublicRoute) return children;
    if (loading) return <Loader />;
    if (isAdminRoute && !currentUser?.isAdmin)
      return (
        <div className="py-20 lg:px-20 px-5 text-center text-gray-600">
          You are not authrorized to view this page
        </div>
      );
    return <section className="">{children}</section>;
  };

  const getFooter = () => {
    return (
      <section>
        <Footer />
      </section>
    );
  };

  const currenUser = async () => {
    try {
      setLoading(true);
      const res: any = await getCurrentUser();

      if (res.error) throw new Error(res.error.message);
      setCurrentUser(res.data);
      if (res.data.isAdmin) {
        setMenuToShow(adminMenu);
      }
    } catch (error: any) {
      console.log(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isPublicRoute) currenUser();
  }, [isPublicRoute]);

  return (
    <div>
      {getHeader()}
      {getContent()}
      {getFooter()}
    </div>
  );
}
