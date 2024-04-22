import { Button } from "@/components/utils/Button";
import { TextField } from "@/components/utils/Fields";
import { ArrowRight, HomeIcon, Mail } from "lucide-react";
import { Raleway } from "next/font/google";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const raleway = Raleway({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-nunitosans",
});
// const footerLinks = [
//   {
//     title: "Solution",
//     links: [
//       { text: "Marketing", href: "#" },
//       { text: "Analytics", href: "#" },
//       { text: "Commerce", href: "#" },
//       { text: "Insights", href: "#" },
//     ],
//   },
//   {
//     title: "Support",
//     links: [
//       { text: "Pricing", href: "#" },
//       { text: "Documentation", href: "#" },
//       { text: "Guides", href: "#" },
//       { text: "API Status", href: "#" },
//     ],
//   },
//   {
//     title: "Docs",
//     links: [
//       { text: "Pricing", href: "#" },
//       { text: "API Guide", href: "#" },
//       { text: "API Status", href: "#" },
//       { text: "Dev Guide", href: "#" },
//     ],
//   },
//   {
//     title: "Company",
//     links: [
//       { text: "About", href: "#" },
//       { text: "Blog", href: "#" },
//       { text: "Jobs", href: "#" },
//       { text: "Press", href: "#" },
//       { text: "Partners", href: "#" },
//     ],
//   },
// ];

export default function Footer() {
  return (
    <footer className={`${raleway.className} bg-gray-900 block`}>
      <div className="mx-auto w-full max-w-7xl px-5 py-16 md:px-10 md:py-24 lg:py-32">
        <div className="grid grid-cols-[auto] justify-between gap-6 max-[991px]:grid-flow-col max-[991px]:[grid-template:'.'_auto_'.'_auto_/_0.75fr_0.75fr_0.75fr] max-[767px]:gap-y-8 max-[479px]:auto-cols-auto max-[479px]:grid-flow-dense sm:grid-cols-2 sm:gap-4 md:grid-cols-[max-content_auto_auto_auto_auto] lg:gap-10">
          <div className="flex max-w-[360px] grid-cols-1 flex-col items-start justify-start gap-8 max-[991px]:[grid-area:span_1/span_4/span_1/span_4] max-[767px]:flex-col max-[767px]:[grid-area:span_1/span_2/span_1/span_2] lg:mr-10">
            <div className="flex flex-col items-start gap-6">
              <Link
                href="/"
                className={`flex flex-shrink-0 items-center gap-2 text-white no-underline`}
              >
                <span className="bg-[#eb6753] text-white py-1 px-2 rounded-lg">
                  <HomeIcon />
                </span>
                <span className={`text-xl tracking-tight font-bold`}>
                  African Real Estate.
                </span>
              </Link>
              <p className="text-[#bebdbd]">
                Africa&apos;s most opulent real estate catalogue.
              </p>
            </div>
            <div className="mt-12 grid w-full max-w-[208px] grid-flow-col grid-cols-4 gap-3 max-[991px]:mb-8">
              <Link
                href="https://www.youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                className="mx-auto flex max-w-[24px] flex-col items-center justify-center "
              >
                <Image
                  src="/assets/icons/facebook.svg"
                  alt="facebook"
                  height={30}
                  width={30}
                />
              </Link>
              <Link
                href="https://www.youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                className="mx-auto flex max-w-[24px] flex-col items-center justify-center "
              >
                <Image
                  src="/assets/icons/youtube.svg"
                  alt="facebook"
                  height={30}
                  width={30}
                />
              </Link>
              <Link
                href="https://www.youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                className="mx-auto flex max-w-[24px] flex-col items-center justify-center "
              >
                <Image
                  src="/assets/icons/instagram.svg"
                  alt="facebook"
                  height={30}
                  width={30}
                />
              </Link>
              <Link
                href="https://www.youtube.com"
                target="_blank"
                className="mx-auto flex max-w-[24px] flex-col items-center justify-center "
                rel="noopener noreferrer"
              >
                <Image
                  src="/assets/icons/tiktok.svg"
                  alt="facebook"
                  height={30}
                  width={30}
                  className=""
                />
              </Link>
            </div>
          </div>

          <div className="flex flex-col items-start font-semibold">
            <div className="mb-4">
              <p className="font-bold uppercase text-white">Solutions</p>
            </div>
            <Link
              href="sale"
              className="py-2 text-sm font-normal text-[#bebdbd] transition hover:text-white no-underline"
            >
              For Sale
            </Link>
            <Link
              href="let"
              className="py-2 text-sm font-normal text-[#bebdbd] transition hover:text-white no-underline"
            >
              For Let
            </Link>
            <Link
              href="/property-management"
              className="py-2 text-sm font-normal text-[#bebdbd] transition hover:text-white no-underline"
            >
              Property Management
            </Link>
            <Link
              href="/agencies"
              className="py-2 text-sm font-normal text-[#bebdbd] transition hover:text-white no-underline"
            >
              Agency
            </Link>
          </div>

          <div className="flex flex-col items-start font-semibold">
            <div className="mb-4">
              <p className="font-bold uppercase text-white">Products</p>
            </div>
            <Link
              href="/properties"
              className="py-2 text-sm font-normal text-[#bebdbd] transition hover:text-white no-underline"
            >
              Properties
            </Link>
            <Link
              href="/contact"
              className="py-2 text-sm font-normal text-[#bebdbd] transition hover:text-white no-underline"
            >
              Agent Move
            </Link>
            <Link
              href="/blog"
              className="py-2 text-sm font-normal text-[#bebdbd] transition hover:text-white no-underline"
            >
              Guides
            </Link>
            <Link
              href="/contact"
              className="py-2 text-sm font-normal text-[#bebdbd] transition hover:text-white no-underline"
            >
              Valuations
            </Link>
          </div>
          <div className="flex flex-col items-start font-semibold">
            <div className="mb-4">
              <p className="font-bold uppercase text-white">Support</p>
            </div>
            <Link
              href="/contact"
              className="py-2 text-sm font-normal text-[#bebdbd] transition hover:text-white no-underline"
            >
              Contact
            </Link>
            <Link
              href="/contact"
              className="py-2 text-sm font-normal text-[#bebdbd] transition hover:text-white no-underline"
            >
              Pricing
            </Link>
            <Link
              href="/contact"
              className="py-2 text-sm font-normal text-[#bebdbd] transition hover:text-white no-underline"
            >
              Query
            </Link>
            <Link
              href="/faqs"
              className="py-2 text-sm font-normal text-[#bebdbd] transition hover:text-white no-underline"
            >
              FAQs
            </Link>
          </div>
          <div className="flex flex-col items-start font-semibold">
            <div className="mb-4">
              <p className="font-bold uppercase text-white">Company</p>
            </div>
            <Link
              href="/about"
              className="py-2 text-sm font-normal text-[#bebdbd] transition hover:text-white no-underline"
            >
              About
            </Link>
            <Link
              href="/blog"
              className="py-2 text-sm font-normal text-[#bebdbd] transition hover:text-white no-underline"
            >
              Blog
            </Link>
            <Link
              href="/careers"
              className="py-2 text-sm font-normal text-[#bebdbd] transition hover:text-white no-underline"
            >
              Careers
            </Link>
            <Link
              href="/partners"
              className="py-2 text-sm font-normal text-[#bebdbd] transition hover:text-white no-underline"
            >
              Partners
            </Link>
          </div>
        </div>
        <div className="mb-14 mt-16 w-full [border-bottom:0.7px_solid_rgb(255,_255,_255,__0.3)]"></div>
        <div className="flex justify-between max-[991px]:flex-col max-[991px]:gap-8 text-white">
          <div className="flex flex-col items-start gap-2">
            <h5 className="text-xl font-bold">Join our newsletter</h5>
            <p className="text-[#bebdbd] sm:text-sm ">
              Keep up to date with everything African Real Estate updates & news
            </p>
          </div>
          <div className="mb-4 w-full max-w-[400px]">
            <form action="" className="flex w-full justify-center md:w-auto">
              <TextField
                type="email"
                aria-label="Email address"
                placeholder="Email address"
                autoComplete="email"
                required
                className="w-60 min-w-0 shrink"
              />
              <Button type="submit" color="blue" className="ml-4 flex-none">
                <span className="hidden lg:inline">Join our newsletter</span>
                <span className="lg:hidden">Join newsletter</span>
              </Button>
            </form>
            {/* <form action="#" method="POST" className="">
              <div className="flex flex-col items-center sm:flex-row sm:justify-center">
                <div className="flex-1 w-full min-w-0 sm:px-0">
                  <div className="relative text-gray-400 focus-within:text-gray-600">
                    <label htmlFor="email" className="sr-only"></label>
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <svg
                        className="w-5 h-5"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="1.5"
                          d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"
                        />
                      </svg>
                    </div>
                    <input
                      type="email"
                      name="email"
                      id="email"
                      placeholder="Enter email address"
                      className="block w-full py-4 pl-10 pr-4 text-base text-black placeholder-gray-500 transition-all duration-200 border-gray-200 rounded-md sm:rounded-r-none caret-blue-600 focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                      required
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="inline-flex items-center justify-center flex-shrink-0 w-full lg:w-auto px-4 py-4 mt-4 font-semibold text-white transition-all duration-200 bg-blue-600 border border-transparent rounded-md sm:mt-0 sm:rounded-l-none sm:w-auto hover:bg-blue-700 focus:bg-blue-700"
                >
                  Get instant access
                </button>
              </div>
            </form> */}
          </div>
        </div>
        <div className="mb-14 mt-16 w-full [border-bottom:0.7px_solid_rgb(255,_255,_255,__0.3)]"></div>
        <div className="flex flex-row items-start justify-between max-[767px]:flex-col max-[479px]:flex-col-reverse md:items-center text-white">
          <div className="max-[991px]:flex-none">
            <p className="max-[479px]:text-sm text-sm text-[#bebdbd]">
              &copy; Copyright {new Date().getFullYear()}. All rights reserved.
            </p>
          </div>

          <div className="max-[991px]:flex-none hidden lg:flex">
            <p className="max-[479px]:text-sm text-[#bebdbd] font-bold text-sm">
              African Real Estate Inc.
            </p>
          </div>

          <div className="max-[991px]: text-center font-semibold max-[991px]:py-1.5">
            <a
              href="#"
              className="text-sm inline-block py-2 pl-5 font-normal no-underline text-[#bebdbd] transition hover:text-white max-[479px]:px-2.5 lg:pl-12"
            >
              Terms of Service
            </a>
            <a
              href="#"
              className="text-sm inline-block py-2 pl-5 font-normal no-underline text-[#bebdbd] transition hover:text-white max-[479px]:px-2.5 lg:pl-12"
            >
              License
            </a>
            <a
              href="#"
              className="text-sm inline-block py-2 pl-5 font-normal no-underline text-[#bebdbd] transition hover:text-white max-[479px]:px-2.5 lg:pl-12"
            >
              Privacy Policy
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
