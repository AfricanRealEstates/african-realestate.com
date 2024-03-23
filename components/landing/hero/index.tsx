import { Play, Search, SlidersHorizontal } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Inter, IBM_Plex_Mono, Nunito_Sans } from "next/font/google";
import React from "react";

const nunitoSans = Nunito_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-nunitosans",
});

const ibmPlex = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["700"],
  display: "swap",
  variable: "--font-ibmplex",
});

export default function Hero() {
  // md:max-h-[70dvh]
  return (
    <section
      className={`${nunitoSans.className} relative mb-10 md:mb-0 sm:pb-2 pt-14 md:pb-8  z-10 md:grid md:place-items-center md:min-h-[420px] lg:min-h-[480px] h-full mx-auto overflow-hidden bg-cover`}
    >
      <picture className="absolute inset-0 flex min-h-full object-center aspect-[3/4] [@media(min-width:481px)]:aspect-video -z-20 content-visibility:visible">
        <Image
          className="w-full h-full object-cover"
          src="/assets/house.jpg"
          alt="Nairobi"
          width={720}
          height={720}
        />
      </picture>
      <div className="absolute inset-0 bg-black/60 -z-10"></div>
      <article className="w-full mb-12 mt-24 border-white/[0.01] lg:border-x md:mt-28 lg:my-28 lg:py-2 lg:border-y  z-30 py-12 md:py-0">
        <div className="flex items-center justify-center flex-col mx-auto max-w-7xl w-full px-4 lg:px-6 border-white/[0.03] lg:border-x">
          <div className="flex items-center flex-col space-y-8">
            <p className="text-sm tracking-wide font-semibold uppercase text-white">
              The best way to
            </p>
            <h2
              className={` ${ibmPlex.className} text-center text-2xl sm:text-5xl lg:text-6xl tracking-tight text-white`}
            >
              Find your Dream Home
            </h2>
            <p className=" text-white">
              We&apos;ve more than 75,000 properties listed for you.
            </p>
          </div>
          <div className="max-w-3xl mt-12 flex items-center justify-center w-full">
            <form className="bg-white rounded-xl p-5 relative w-full flex flex-col lg:flex-row gap-4 lg:items-center lg:justify-between">
              <input
                type="search"
                placeholder=" Enter an address, neighborhood, city, or ZIP code for Buy"
                className="placeholder:text-[#666] flex-1 ring-[1px] border-0 focus:outline-[#f7f7f7] outline-none ring-[#f6f6f6] py-4 px-5 md:py-3 md:px-6 inline-flex items-center justify-center gap-x-4 w-full"
              />
              <span className="lg:ml-auto px-6 flex gap-4 items-center text-[#4a4a4a]">
                <SlidersHorizontal className="h-4 w-4" />
                Advanced Search
              </span>
              <div
                className="p-4 flex lg:items-center rounded-full bg-[#eb6753]
              "
              >
                <Search className="text-white" />
              </div>
            </form>
          </div>
          {/* <div className="max-w-3xl mt-8 space-y-6 text-lg leading-[1.4] text-gray-200">
            <p>
              <span className="text-gray-50 font-semibold">
                African Real Estate&trade;{" "}
              </span>
              is Africa&apos;s Leading Real Estate company offering the best and
              efficient real estate solutions{" "}
            </p>
            <p>
              Welcome to{" "}
              <span className="text-gray-50 font-semibold">
                African Real Estate
              </span>
            </p>
          </div> */}
        </div>
      </article>
      {/* <article className="mb-12 mt-64 border-white/[0.13] md:mt-28 lg:my-28 lg:border-y lg:py-2 z-30">
        <div className="mx-auto max-w-7xl w-full px-4 md:px-6">
          <h2 className=" max-w-3xl text-3xl font-extrabold tracking-tight text-white lg:col-span-2 lg:text-[64px] md:text-[40px] leading-[1.1] lg:leading-[1.125]">
            Get a Home or an Investment Opportunity
          </h2>
          <div className="mt-8 max-w-lg space-y-6 text-lg leading-[1.4] text-gray-200 md:max-w-xl lg:text-xl">
            <p>
              African Real Estate&trade; is Africa&apos;s Leading Real Estate
              company offering the best and efficient real estate solutions
            </p>
            <p>Welcome to African Real Estate</p>
          </div>
        </div>
      </article> */}
      {/* <article className="w-full place-self-end mt-0 sm:mt-0 mb-20 md:mb-0 md:-translate-y-6">
        <div className="mx-auto max-w-7xl w-full px-4 md:px-6 flex flex-col sm:flex-row gap-y-8 gap-x-6">
          <div className="flex basis-1/2 flex-col md:flex-row items-center gap-x-4 gap-y-4">
            <Link
              href="/agency"
              className="inline-block bg-white self-center overflow-hidden max-w-full px-5 py-2 ring-inset rounded-full text-base font-semibold tracking-tight transition-all duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline md:px-6 md:py-3 md:text-lg w-full md:w-auto text-center whitespace-nowrap border-2 border-white/0 hover:border-white hover:bg-white/0 hover:text-white active:bg-[rgba(161,161,170,1)] active:text-black"
            >
              Start Free Trial
            </Link>
            <div>
              <p className="text-white text-base font-semibold md:w-52 text-center sm:text-left">
                Start for free, get 3 months for free.
              </p>
            </div>
          </div>
          <div className="flex md:basis-1/2 justify-end">
            <Link
              href="/agency"
              className="py-2 px-5 md:py-3 md:px-6 inline-flex items-center justify-center gap-x-4 w-full md:w-auto border border-white/40 rounded-full bg-[rgba(255,255,255,0.15)] text-white text-lg text-center hover:bg-white hover:text-black transition-colors ease-linear duration-200"
            >
              <Play />
              Become an Agent
            </Link>
          </div>
        </div>
      </article> */}
    </section>
  );
}
