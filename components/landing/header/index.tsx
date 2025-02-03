"use client";
import { Button } from "@/components/utils/Button";
import { User } from "@prisma/client";
import { Dropdown } from "antd";
import { ArrowRight, Menu, X } from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import { Nunito_Sans } from "next/font/google";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Resources from "./resources";

const nunitoSans = Nunito_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-nunitosans",
});

const navLinks = [
  {
    label: "Let",
    href: "/let",
  },
  {
    label: "Buy",
    href: "/buy",
  },

  {
    label: "Resources",
    href: "#", // This can be set to a real route if necessary
    component: Resources, // Add the Resources component here
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

const supportMenu = [
  { name: "Home", path: "/" },
  { name: "Properties", path: "/agent/properties" },
];

export default function Header() {
  const [currentUser = null, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [menuToShow = agentMenu, setMenuToShow] = useState<any>(agentMenu);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const timeoutRef = useRef<number | null>(null);
  const [mobileView, setMobileView] = useState(false);
  const [stickyMenu, setStickyMenu] = useState(false);
  const [newLinks, setNewLinks] = useState(navLinks);
  const toggleMobileView = () => {
    setMobileView(!mobileView);
  };

  const handleSignOut = async () => {
    await signOut({ callbackUrl: "/" });
  };

  const session = useSession();
  const user = session.data?.user;

  const pathname = usePathname();
  const router = useRouter();

  // Add "Dashboard" link if user is authenticated
  useEffect(() => {
    if (user && !navLinks.some((link) => link.label === "Dashboard")) {
      setNewLinks((prevLinks) => [
        ...prevLinks,
        {
          label: "Dashboard",
          href: "/dashboard",
        },
      ]);
    }
  }, [user]);

  // Determine if the current page is the home page
  const isHomePage = pathname === "/";

  // sticky Menu
  const handleStickyMenu = () => {
    if (window.scrollY >= 80 && !mobileView) {
      setStickyMenu(true);
    } else {
      setStickyMenu(false);
    }
  };

  // Update menuToShow based on user's role
  useEffect(() => {
    if (user?.role === "ADMIN") {
      setMenuToShow(adminMenu);
    } else if (user?.role === "AGENT") {
      setMenuToShow(agentMenu);
    } else {
      // Default to agent menu if role is not specified or unrecognized
      setMenuToShow(supportMenu);
    }
  }, [user]);

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
            : isHomePage
            ? "text-white hover:text-gray-100"
            : "text-gray-600 border-b border-neutral-100"
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
                  <Image
                    src="/assets/logo.png"
                    width={40}
                    height={40}
                    alt="ARE"
                    className="object-cover"
                  />
                  {/* <span className="bg-[#eb6753] text-white py-1 px-2 rounded-lg">
                    <HomeIcon />
                  </span> */}
                  <span
                    className={`${
                      stickyMenu || !isHomePage ? "text-gray-700" : "text-white"
                    } text-xl tracking-tight font-semibold`}
                  >
                    African Real Estate.
                  </span>
                </Link>
              </div>
              <ul className="hidden lg:flex lg:items-center lg:space-x-10">
                {navLinks.map((navLink, index) => {
                  const { href, label } = navLink;
                  return (
                    <>
                      <Link
                        key={label}
                        href={href}
                        className="relative -mx-3 -my-2 rounded-lg px-3 py-2 text-base transition-colors delay-0 hover:delay-0"
                        onMouseEnter={() => {
                          if (timeoutRef.current) {
                            window.clearTimeout(timeoutRef.current);
                          }
                          setHoveredIndex(index);
                        }}
                        onMouseLeave={() => {
                          timeoutRef.current = window.setTimeout(() => {
                            setHoveredIndex(null);
                          }, 200);
                        }}
                      >
                        <AnimatePresence>
                          {hoveredIndex === index && (
                            <motion.span
                              className="absolute inset-0 rounded-lg bg-black/10"
                              layoutId="hoverBackground"
                              initial={{ opacity: 0 }}
                              animate={{
                                opacity: 1,
                                transition: { duration: 0.15 },
                              }}
                              exit={{
                                opacity: 0,
                                transition: { duration: 0.15 },
                              }}
                            />
                          )}
                        </AnimatePresence>
                        <span className="relative z-10">{label}</span>
                      </Link>

                      {/* {label === "Resources" && hoveredIndex === index && (
                        <div className="">
                          <Resources />
                        </div>
                      )} */}
                    </>
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
                        className="w-[38px] h-[38px] rounded-full p-0.5 object-cover border-[1px] border-gray-400"
                      />
                    </Dropdown>
                  </div>
                ) : (
                  <Button variant="solid" color="white" href="/login">
                    Log in
                  </Button>
                )}

                <Button color="blue" href={`/agent/properties/create-property`}>
                  Sell fast
                </Button>
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
              <section className="shadow-[0_35px_60px_-15px_rgba(0,0,0,0.3)] transition-transform ease-in-out fixed right-0 z-20 gap-y-6 mt-0 bg-white w-full p-8 text-base flex flex-col  lg:hidden">
                <nav className="flex flex-col space-y-4 pb-4">
                  {/* {navLinks.map((link) => {
                    const { href, label } = link;
                    return (
                      <Link
                        href={href}
                        key={label}
                        className="text-[#4a4a4a] no-underline text-base"
                      >
                        {label}
                      </Link>
                    );
                  })} */}

                  {navLinks.map((link) => {
                    const { label, href } = link;
                    return (
                      <Link
                        key={label}
                        href={href}
                        className="text-neutral-600"
                      >
                        {label}
                      </Link>
                    );
                  })}
                </nav>
                <div className="border-t flex flex-col lg:flex-row justify-between gap-x-6 gap-y-4 border-gray-100 flex-1 py-8 ">
                  <section className="flex flex-col gap-4">
                    <p className="text-sm text-neutral-500">
                      Need Customer Care
                    </p>
                    <p className="font-medium text-sm text-indigo-500">
                      +254 732945534
                    </p>
                  </section>
                  <section className="flex flex-col gap-4">
                    <p className="text-sm text-neutral-500">
                      Need Live Support?
                    </p>
                    <p className="font-medium text-sm text-indigo-500">
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
                      href="/login"
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
