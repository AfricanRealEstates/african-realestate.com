"use client";
import Loader from "@/components/globals/loader";
import Footer from "@/components/landing/footer";
// import Header from "@/components/landing/header";
import { Container } from "@/components/globals/container";

import { User } from "@prisma/client";
import { Button as StyledButton } from "@/components/utils/Button";
import { usePathname, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import Header from "@/components/landing/header/Header";
import { useSession } from "next-auth/react";

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

  const session = useSession();
  const user = session.data?.user;

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
        <Header />
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
      {pathname.includes("/dashboard") ||
      pathname.includes("/register") ||
      pathname.includes("/login") ||
      pathname.includes("/verify-token") ||
      pathname.includes("/blog") ||
      pathname.includes("/posts") ? (
        <>{children}</>
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
