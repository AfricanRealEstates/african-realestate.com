"use client";
import Link from "next/link";
import { SVGProps, useEffect, useState } from "react";

import { Plus_Jakarta_Sans } from "next/font/google";
import { ExternalLink, LogOut, Settings, User } from "lucide-react";
import { useSession, signOut } from "next-auth/react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const jakarta = Plus_Jakarta_Sans({
  weight: "400",
  subsets: ["latin"],
});

const links = [
  {
    href: "/properties",
    label: "Properties",
    icon: "",
  },
  {
    href: "/pricing",
    label: "Pricing",
    icon: "",
  },
  {
    href: "/posts",
    label: "Blog",
    icon: "",
  },
];

export default function BlogNav() {
  const [stickyMenu, setStickyMenu] = useState(false);

  const { data: session } = useSession();

  useEffect(() => {
    const handleStickyMenu = () => {
      setStickyMenu(window.scrollY >= 40);
    };

    window.addEventListener("scroll", handleStickyMenu);
    return () => {
      window.removeEventListener("scroll", handleStickyMenu);
    };
  }, []);

  return (
    <>
      {/* <div className="md:flex items-center">
        <p className="text-sm font-medium text-gray-900 md:my-0">
          <span className="bg-blue-100 text-ken-primary text-xs font-semibold mr-2 px-2.5 py-0.5 rounded hidden md:inline">
            New
          </span>
          We have posted new properties in addition to over 10,000+ that we
          have!
          <Link
            href="/properties"
            className="inline-flex items-center ml-2 text-sm font-medium text-ken-primary md:ml-2 hover:underline group"
          >
            Check them out{" "}
            <svg
              className="size-3 ml-1.5 text-blue-600 dark:text-blue-500  transition-transform duration-300  group-hover:translate-x-[2px]"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 14 10"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M1 5h12m0 0L9 1m4 4L9 9"
              ></path>
            </svg>
          </Link>
        </p>
      </div> */}
      <nav
        className={`${
          jakarta.className
        } fixed top-0 left-0 w-full z-50 transition-all duration-200 ${
          stickyMenu
            ? "bg-background backdrop-blur-sm shadow-sm border-b border-gray-100"
            : "border-b border-neutral-50"
        }`}
      >
        <div className="w-full px-2 sm:px-5 lg:px-20 h-16 flex items-center">
          <div className="flex-grow items-center space-x-4 justify-between hidden md:flex">
            <div className="flex items-center">
              <Link href="/" className="flex items-center gap-2 no-underline">
                <img
                  src="/assets/logo.png"
                  width={40}
                  height={40}
                  alt="ARE"
                  className="object-cover"
                />
                <span className="lg:text-xl font-semibold">
                  African Real Estate.
                </span>
              </Link>
              <div className="hidden md:flex items-center gap-2 ml-6">
                {links.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="justify-center whitespace-nowrap text-sm font-medium focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none h-8 rounded-md px-2 py-2 flex items-center gap-1 hover:text-muted-foreground hover:bg-transparent transition-colors"
                  >
                    {link.label}
                    {link.icon}
                  </Link>
                ))}
                <Link
                  href={"/https://www.youtube.com/@AfricanRealEstate"}
                  target="_blank"
                  rel="noopener norefferer"
                  className="justify-center whitespace-nowrap text-sm font-medium focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none h-8 rounded-md px-2 py-2 flex items-center gap-1 hover:text-muted-foreground hover:bg-transparent transition-colors"
                >
                  Youtube
                  <ExternalLink className="h-3 w-3" />
                </Link>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1 mr-4">
                <Link
                  href={
                    "https://web.facebook.com/AfricanRealEstateMungaiKihara"
                  }
                  target="_blank"
                  rel="noopener norefferer"
                  className="justify-center whitespace-nowrap text-sm font-medium focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none h-8 rounded-md px-2 py-2 flex items-center gap-1 hover:text-muted-foreground hover:bg-transparent transition-colors"
                >
                  <Facebook />
                </Link>
                <Link
                  href={"https://www.tiktok.com/@africanrealestate"}
                  target="_blank"
                  rel="noopener norefferer"
                  className="justify-center whitespace-nowrap text-sm font-medium focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none h-8 rounded-md px-2 py-2 flex items-center gap-1 hover:text-muted-foreground hover:bg-transparent transition-colors"
                >
                  <TikTok />
                </Link>
                <Link
                  href={"https://www.instagram.com/africanrealestate_/"}
                  target="_blank"
                  rel="noopener norefferer"
                >
                  <Instagram />
                </Link>
              </div>
              <div className="shrink-0">
                {session ? (
                  <DropdownMenu>
                    <DropdownMenuTrigger className="flex items-center gap-2 p-2 rounded-md hover:bg-accent">
                      <Avatar className="w-8 h-8">
                        <AvatarImage
                          src={session.user?.image || ""}
                          alt={session.user?.name || ""}
                        />
                        <AvatarFallback>
                          {session.user?.name?.[0] || session.user?.email?.[0]}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-sm font-medium">
                        {session.user?.name || session.user?.email}
                      </span>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48">
                      <DropdownMenuItem>
                        <User className="mr-2 h-4 w-4" />
                        <Link href="/dashboard/profile" className="w-full">
                          Profile
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Settings className="mr-2 h-4 w-4" />
                        <Link href="/dashboard/blogs" className="w-full">
                          Blogs
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Settings className="mr-2 h-4 w-4" />
                        <Link href="/dashboard/settings" className="w-full">
                          Settings
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => signOut()}>
                        <LogOut className="mr-2 h-4 w-4" />
                        <span>Sign out</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                ) : (
                  <div className="flex gap-2">
                    <Link
                      href="/login"
                      className="inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none border border-input bg-muted shadow-sm hover:bg-accent hover:border-accent hover:text-accent-foreground h-8 rounded-md px-2 py-2"
                    >
                      Login
                    </Link>
                    <Link
                      href="/register"
                      className="inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none bg-primary text-primary-foreground hover:bg-primary/90 h-8 rounded-md px-2 py-2"
                    >
                      Sign up
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
}

export const TikTok = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    preserveAspectRatio="xMidYMid"
    viewBox="0 0 256 290"
    width="1em"
    height="1em"
    {...props}
  >
    <path
      fill="#FF004F"
      d="M189.72022 104.42148c18.67797 13.3448 41.55932 21.19661 66.27233 21.19661V78.08728c-4.67694.001-9.34196-.48645-13.91764-1.4554v37.41351c-24.71102 0-47.5894-7.85181-66.27232-21.19563v96.99656c0 48.5226-39.35537 87.85513-87.8998 87.85513-18.11308 0-34.94847-5.47314-48.93361-14.85978 15.96175 16.3122 38.22162 26.4315 62.84826 26.4315 48.54742 0 87.90477-39.33253 87.90477-87.85712v-96.99457h-.00199Zm17.16896-47.95275c-9.54548-10.4231-15.81283-23.89299-17.16896-38.78453v-6.11347h-13.18894c3.31982 18.92715 14.64335 35.09738 30.3579 44.898ZM69.67355 225.60685c-5.33316-6.9891-8.21517-15.53882-8.20226-24.3298 0-22.19236 18.0009-40.18631 40.20915-40.18631 4.13885-.001 8.2529.6324 12.19716 1.88328v-48.59308c-4.60943-.6314-9.26154-.89945-13.91167-.80117v37.82253c-3.94726-1.25089-8.06328-1.88626-12.20313-1.88229-22.20825 0-40.20815 17.99196-40.20815 40.1873 0 15.6937 8.99747 29.28075 22.1189 35.89954Z"
    />
    <path d="M175.80259 92.84876c18.68293 13.34382 41.5613 21.19563 66.27232 21.19563V76.63088c-13.79353-2.93661-26.0046-10.14114-35.18573-20.16215-15.71554-9.80162-27.03808-25.97185-30.3579-44.898H141.8876v189.84333c-.07843 22.1318-18.04855 40.05229-40.20915 40.05229-13.05889 0-24.66039-6.22169-32.00788-15.8595-13.12044-6.61879-22.1179-20.20683-22.1179-35.89854 0-22.19336 17.9999-40.1873 40.20815-40.1873 4.255 0 8.35614.66217 12.20312 1.88229v-37.82254c-47.69165.98483-86.0473 39.93316-86.0473 87.83429 0 23.91184 9.55144 45.58896 25.05353 61.4276 13.98514 9.38565 30.82053 14.85978 48.9336 14.85978 48.54544 0 87.89981-39.33452 87.89981-87.85612V92.84876h-.00099Z" />
    <path
      fill="#00F2EA"
      d="M242.07491 76.63088V66.51456c-12.4384.01886-24.6326-3.46278-35.18573-10.04683 9.34196 10.22255 21.64336 17.27121 35.18573 20.16315Zm-65.54363-65.06015a67.7881 67.7881 0 0 1-.72869-5.45726V0h-47.83362v189.84531c-.07644 22.12883-18.04557 40.04931-40.20815 40.04931-6.50661 0-12.64987-1.54375-18.09025-4.28677 7.34749 9.63681 18.949 15.8575 32.00788 15.8575 22.15862 0 40.13171-17.9185 40.20915-40.0503V11.57073h34.64368ZM99.96593 113.58077V102.8112c-3.9969-.54602-8.02655-.82003-12.06116-.81805C39.35537 101.99315 0 141.32669 0 189.84531c0 30.41846 15.46735 57.22621 38.97116 72.99536-15.5021-15.83765-25.05353-37.51576-25.05353-61.42661 0-47.90014 38.35466-86.84847 86.0483-87.8333Z"
    />
  </svg>
);

export const Facebook = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 36 36"
    fill="url(#a)"
    height="1em"
    width="1em"
    {...props}
  >
    <defs>
      <linearGradient x1="50%" x2="50%" y1="97.078%" y2="0%" id="a">
        <stop offset="0%" stopColor="#0062E0" />
        <stop offset="100%" stopColor="#19AFFF" />
      </linearGradient>
    </defs>
    <path d="M15 35.8C6.5 34.3 0 26.9 0 18 0 8.1 8.1 0 18 0s18 8.1 18 18c0 8.9-6.5 16.3-15 17.8l-1-.8h-4l-1 .8z" />
    <path
      fill="#FFF"
      d="m25 23 .8-5H21v-3.5c0-1.4.5-2.5 2.7-2.5H26V7.4c-1.3-.2-2.7-.4-4-.4-4.1 0-7 2.5-7 7v4h-4.5v5H15v12.7c1 .2 2 .3 3 .3s2-.1 3-.3V23h4z"
    />
  </svg>
);

export const YouTube = (props: SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 256 180"
    width="1em"
    height="1em"
    xmlns="http://www.w3.org/2000/svg"
    preserveAspectRatio="xMidYMid"
    {...props}
  >
    <path
      d="M250.346 28.075A32.18 32.18 0 0 0 227.69 5.418C207.824 0 127.87 0 127.87 0S47.912.164 28.046 5.582A32.18 32.18 0 0 0 5.39 28.24c-6.009 35.298-8.34 89.084.165 122.97a32.18 32.18 0 0 0 22.656 22.657c19.866 5.418 99.822 5.418 99.822 5.418s79.955 0 99.82-5.418a32.18 32.18 0 0 0 22.657-22.657c6.338-35.348 8.291-89.1-.164-123.134Z"
      fill="red"
    />
    <path fill="#FFF" d="m102.421 128.06 66.328-38.418-66.328-38.418z" />
  </svg>
);

export const Instagram = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="1em"
    height="1em"
    preserveAspectRatio="xMidYMid"
    viewBox="0 0 256 256"
    {...props}
  >
    <path
      fill="#0A0A08"
      d="M128 23.064c34.177 0 38.225.13 51.722.745 12.48.57 19.258 2.655 23.769 4.408 5.974 2.322 10.238 5.096 14.717 9.575 4.48 4.479 7.253 8.743 9.575 14.717 1.753 4.511 3.838 11.289 4.408 23.768.615 13.498.745 17.546.745 51.723 0 34.178-.13 38.226-.745 51.723-.57 12.48-2.655 19.257-4.408 23.768-2.322 5.974-5.096 10.239-9.575 14.718-4.479 4.479-8.743 7.253-14.717 9.574-4.511 1.753-11.289 3.839-23.769 4.408-13.495.616-17.543.746-51.722.746-34.18 0-38.228-.13-51.723-.746-12.48-.57-19.257-2.655-23.768-4.408-5.974-2.321-10.239-5.095-14.718-9.574-4.479-4.48-7.253-8.744-9.574-14.718-1.753-4.51-3.839-11.288-4.408-23.768-.616-13.497-.746-17.545-.746-51.723 0-34.177.13-38.225.746-51.722.57-12.48 2.655-19.258 4.408-23.769 2.321-5.974 5.095-10.238 9.574-14.717 4.48-4.48 8.744-7.253 14.718-9.575 4.51-1.753 11.288-3.838 23.768-4.408 13.497-.615 17.545-.745 51.723-.745M128 0C93.237 0 88.878.147 75.226.77c-13.625.622-22.93 2.786-31.071 5.95-8.418 3.271-15.556 7.648-22.672 14.764C14.367 28.6 9.991 35.738 6.72 44.155 3.555 52.297 1.392 61.602.77 75.226.147 88.878 0 93.237 0 128c0 34.763.147 39.122.77 52.774.622 13.625 2.785 22.93 5.95 31.071 3.27 8.417 7.647 15.556 14.763 22.672 7.116 7.116 14.254 11.492 22.672 14.763 8.142 3.165 17.446 5.328 31.07 5.95 13.653.623 18.012.77 52.775.77s39.122-.147 52.774-.77c13.624-.622 22.929-2.785 31.07-5.95 8.418-3.27 15.556-7.647 22.672-14.763 7.116-7.116 11.493-14.254 14.764-22.672 3.164-8.142 5.328-17.446 5.95-31.07.623-13.653.77-18.012.77-52.775s-.147-39.122-.77-52.774c-.622-13.624-2.786-22.929-5.95-31.07-3.271-8.418-7.648-15.556-14.764-22.672C227.4 14.368 220.262 9.99 211.845 6.72c-8.142-3.164-17.447-5.328-31.071-5.95C167.122.147 162.763 0 128 0Zm0 62.27C91.698 62.27 62.27 91.7 62.27 128c0 36.302 29.428 65.73 65.73 65.73 36.301 0 65.73-29.428 65.73-65.73 0-36.301-29.429-65.73-65.73-65.73Zm0 108.397c-23.564 0-42.667-19.103-42.667-42.667S104.436 85.333 128 85.333s42.667 19.103 42.667 42.667-19.103 42.667-42.667 42.667Zm83.686-110.994c0 8.484-6.876 15.36-15.36 15.36-8.483 0-15.36-6.876-15.36-15.36 0-8.483 6.877-15.36 15.36-15.36 8.484 0 15.36 6.877 15.36 15.36Z"
    />
  </svg>
);
