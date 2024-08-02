"use client";
import React, { useState } from "react";
import Logo from "../globals/logo";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Button, buttonVariants } from "../ui/button";
import { Sheet, SheetContent, SheetTrigger } from "../ui/sheet";
import { Menu, Power } from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import UserAccountNav from "./user-account-nav";
import UserButton from "./UserButton";
const navLinks = [
  { label: "Dashboard", href: "/dashboard" },
  { label: "Transactions", href: "/dashboard/transactions" },
  { label: "Billing", href: "/dashboard/billing" },
  { label: "Account", href: "/dashboard/account" },
];

export default function DashboardNavbar() {
  return (
    <>
      <DesktopNavbar />
      <MobileNavbar />
    </>
  );
}

function MobileNavbar() {
  const [isOpen, setIsOpen] = useState(false);
  const session = useSession();
  const user = session.data?.user;
  return (
    <aside className="block border-separate bg-neutral-50 md:hidden">
      <nav className="container flex items-center justify-between px-8">
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button
              variant={"ghost"}
              size={"icon"}
              className="hover:bg-neutral-100 rounded-full"
            >
              <Menu className="hover:text-indigo-500" />
            </Button>
          </SheetTrigger>
          <SheetContent className="w-[320px] sm:w-[540px]" side="left">
            <Logo />
            <nav className="flex flex-col gap-1 pt-4">
              {navLinks.map((navLink) => {
                const { label, href } = navLink;
                return (
                  <NavbarItem
                    key={href}
                    label={label}
                    link={href}
                    clickCallback={() => setIsOpen((prev) => !prev)}
                  />
                );
              })}
            </nav>
          </SheetContent>
        </Sheet>
        <div className="hidden md:flex items-center gap-x-4 h-[90px] min-h-[80px]">
          <Logo />
        </div>
        <div className="flex items-center gap-2">
          {user && <UserAccountNav user={user} />}
        </div>
      </nav>
    </aside>
  );
}

function DesktopNavbar() {
  const session = useSession();
  const user = session.data?.user;
  return (
    <header className="hidden border-separate border-b border-neutral-50 bg-background md:flex">
      <nav className="max-w-7xl mx-auto w-full flex items-center justify-between px-8">
        <div className="flex h-[80px] min-h-[60px] items-center gap-x-4">
          <Logo />
          <div className="flex h-full gap-x-4">
            {navLinks.map((navLink) => {
              const { label, href } = navLink;
              return <NavbarItem key={label} link={href} label={label} />;
            })}
          </div>
        </div>
        <div className="flex items-center gap-x-4">
          {/* {user && <UserAccountNav user={user} />} */}
          {user && <UserButton />}
        </div>
      </nav>
    </header>
  );
}

function NavbarItem({
  link,
  label,
  clickCallback,
}: {
  link: string;
  label: string;
  clickCallback?: () => void;
}) {
  const pathname = usePathname();
  const isActive = pathname === link;
  return (
    <div className="relative flex items-center gap-x-4">
      <Link
        href={link}
        className={cn(
          buttonVariants({ variant: "ghost" }),
          "w-full justify-start text-muted-foreground hover:text-indigo-500 hover:bg-neutral-50",
          isActive && "text-indigo-500 bg-neutral-50"
        )}
        onClick={() => {
          if (clickCallback) clickCallback();
        }}
      >
        {label}
      </Link>
      {isActive && (
        <div className="absolute -bottom-[2px] left-1/2 hidden h-[2px] w-[80%] -translate-x-1/2 rounded-xl bg-indigo-400 md:flex"></div>
      )}
    </div>
  );
}
