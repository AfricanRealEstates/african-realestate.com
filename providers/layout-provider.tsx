"use client";

import UserButton from "@/components/auth/user-button";
import Loader from "@/components/globals/loader";
import Footer from "@/components/landing/footer";
import Header from "@/components/landing/header";
import { Container } from "@/components/globals/container";

import { useCurrentUser } from "@/hooks/use-current-user";
import { User } from "@prisma/client";
import { Button, Dropdown } from "antd";
import { Button as StyledButton } from "@/components/utils/Button";
import { ArrowRight, HomeIcon, Menu, X } from "lucide-react";
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

  const user = useCurrentUser();

  const isHomePage = pathname === "/";

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
  const isPublicRoute = ["sign-in", "sign-up", "/"].includes(
    pathname.split("/")[1]
  );
  const isAdminRoute = pathname.split("/")[1] === "admin";

  // const ref = useClickOutside(() => setMobileView(false));

  const getHeader = () => {
    if (isPublicRoute && !currentUser) return null;

    // sticky py-3 left-0 top-0 z-50 w-full backdrop-blur-lg border-b border-neutral-700/80

    return (
      <div className="">
        {/* <header className="sticky transition-all duration-300 py-3 left-0 top-0 z-50 w-full backdrop-blur-lg border-b border-neutral-700/80"> */}
        {/* <header
          className={`sticky transition-all duration-300 py-3 left-0 top-0 z-50 w-full backdrop-blur-lg border-b border-neutral-700/80 ${
            stickyMenu
              ? "bg-white !py-4 shadow transition duration-100 dark:bg-black"
              : ""
          }`}
        >
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center flex-shrink-0">
                <Link
                  href="/"
                  className={`flex flex-shrink-0 items-center gap-2 text-black`}
                >
                  <span className="bg-[#eb6753] text-white py-1 px-2 rounded-lg">
                    <HomeIcon />
                  </span>
                  <span className={`text-xl tracking-tight font-semibold`}>
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
              <div className="hidden lg:flex justify-center gap-12 items-center">
                <Link href="/login">Sign in</Link>
                <button
                  onClick={() =>
                    router.push("/agent/properties/create-property")
                  }
                  className="group/follow flex items-center gap-2 rounded-md bg-indigo-600 px-6 py-2 font-semibold text-white shadow-lg transition-all hover:-translate-y-0.5 active:translate-y-0 active:bg-indigo-700 active:shadow-inner"
                >
                  Sell fast
                  <ArrowRight className="transition-transform group-hover/follow:-rotate-45 group-active/follow:rotate-0" />
                </button>
              </div>
            </div>
          </div>
        </header> */}
        <Header />
        {/* <header
          className={` ${nunitoSans.className}  py-3 left-0 top-0 z-50 w-full ${
            stickyMenu
              ? "shadow-nav fixed z-[999] border-b border-white/10 bg-white backdrop-blur-lg transition "
              : "absolute bg-transparent"
          }`}
        >
          <div className="top-0 left-0 w-full z-50 will-change-auto duration-200 bg-transparent backdrop-blur-2xl translate-y-0 transition-colors">
            <div className="max-w-7xl px-4 mx-auto text-sm">
              <div className="flex justify-between md:grid md:grid-cols-3  w-full">
                <Link
                  href="/"
                  className={`flex flex-shrink-0 items-center gap-2 text-black ${
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
                <ul className="hidden lg:flex gap-5 ml-auto">
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
                        } font-semibold text-black text-[17px] flex items-center gap-5`}
                      >
                        {label}
                      </Link>
                    );
                  })}
                </ul>

                <div className="hidden w-full font-semibold lg:flex  gap-6 items-center">
                  {user ? (
                    <div className=" py-1 px-5 flex items-center">
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
                            Welcome, {user?.name}
                          </span>
                        </Button>
                      </Dropdown>
                    </div>
                  ) : (
                    <Link
                      href="/login"
                      className={` ${
                        isHomePage && !stickyMenu
                          ? "text-white hover:text-gray-200"
                          : ""
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
                  <div className="border-t flex justify-between gap-6 border-gray-100 flex-1 py-8 shadow-[0_1px_0_#f7f7f7]">
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
                  <div className="flex items-center gap-4 justify-between">
                    {user ? (
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
                            <Button>
                              <span className="hover:text-black text-[17px]">
                                Welcome, {user?.name}
                              </span>
                            </Button>
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
        </header> */}
      </div>
    );
  };
  const getContent = () => {
    if (isPublicRoute) return children;
    if (loading) return <Loader />;
    if (isAdminRoute && user?.role !== "ADMIN")
      return (
        <>
          <Container className="relative isolate flex h-screen flex-col items-center justify-center py-20 text-center sm:py-32">
            <p className="text-sm font-semibold text-cyan-900">401</p>
            <h1 className="mt-2 text-3xl font-medium tracking-tight text-cyan-500">
              Unauthorized Page Access
            </h1>
            <p className="mt-2 text-lg text-gray-600">
              Sorry, you&apos;re not authorized to access this page.
            </p>
            <StyledButton
              href="/"
              variant={`solid`}
              color="cyan"
              className="mt-8"
            >
              Go back home
            </StyledButton>
          </Container>
        </>
        // <div className="mx-auto w-[95%] max-w-7xl px-5 py-24 md:px-10 md:py-24 lg:py-32">
        //   <h2 className="mb-8 text-3xl font-bold md:text-5xl lg:mb-11 text-[#181a20]">
        //     You are not authorized to view this page
        //   </h2>
        // </div>
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

      if (!user) throw new Error("User not found");
      if (user.role === "ADMIN") {
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
    <>
      {pathname.includes("/dashboard") ? ( // Check if the path includes /dashboard
        <>
          {children} {/* Render children directly without header and footer */}
        </>
      ) : (
        <>
          {getHeader()} {/* Render header */}
          {getContent()} {/* Render content */}
          {getFooter()} {/* Render footer */}
        </>
      )}
    </>
  );
}
