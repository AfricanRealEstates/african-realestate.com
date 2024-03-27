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
    <footer className={`${raleway.className} bg-[#181a20] block`}>
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
              href="#"
              className="py-2 text-sm font-normal text-[#bebdbd] transition hover:text-white no-underline"
            >
              For Sale
            </Link>
            <Link
              href="#"
              className="py-2 text-sm font-normal text-[#bebdbd] transition hover:text-white no-underline"
            >
              For Let
            </Link>
            <Link
              href="#"
              className="py-2 text-sm font-normal text-[#bebdbd] transition hover:text-white no-underline"
            >
              Property Management
            </Link>
            <Link
              href="#"
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
              href="#"
              className="py-2 text-sm font-normal text-[#bebdbd] transition hover:text-white no-underline"
            >
              Agent Move
            </Link>
            <Link
              href="#"
              className="py-2 text-sm font-normal text-[#bebdbd] transition hover:text-white no-underline"
            >
              Guides
            </Link>
            <Link
              href="#"
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
              href="#"
              className="py-2 text-sm font-normal text-[#bebdbd] transition hover:text-white no-underline"
            >
              Contact
            </Link>
            <Link
              href="#"
              className="py-2 text-sm font-normal text-[#bebdbd] transition hover:text-white no-underline"
            >
              Pricing
            </Link>
            <Link
              href="#"
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
            <p className="text-[#bebdbd] sm:text-sm">
              Keep up to date with everything African Real Estate updates & news
            </p>
          </div>
          <div className="mb-4 w-full max-w-[400px]">
            <form className="group bg-neutral-50 flex w-96 items-center justify-between rounded border border-neutral-400 p-2">
              <label htmlFor="email" className="mr-2 relative block w-full">
                <input
                  type="email"
                  name="email"
                  id="email"
                  placeholder="email address"
                  className="peer w-full rounded border text-gray-600 border-neutral-300 p-2 text-sm focus:border-indigo-500 focus:outline-none ring-1 ring-neutral-500/0 ring-offset-0 transition-shadow focus:ring-indigo-500 focus:ring-offset-2"
                />
                <span className="absolute left-1 top-0 -translate-y-1/2 scale-100 bg-white text-indigo-600 px-0.5 text-xs font-medium transition-transform peer-focus:scale-0">
                  Email
                </span>
              </label>
              <button className="flex items-center gap-2 rounded-md bg-indigo-600 px-4 py-2 text-white shadow-lg transition-all hover:-translate-y-0.5 active:translate-y-0 active:bg-indigo-700 active:shadow-inner">
                Subscribe
                <ArrowRight className="transition-transform" />
              </button>
            </form>
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
