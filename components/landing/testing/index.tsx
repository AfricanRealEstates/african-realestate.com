"use client";
import { IBM_Plex_Mono } from "next/font/google";
import Image from "next/image";
import React from "react";
import SearchBar from "../hero/search";

const ibmPlex = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["700"],
  display: "swap",
  variable: "--font-ibmplex",
});

export default function Testing() {
  return (
    <div>
      <section className="relative py-10 bg-gray-900 sm:py-16 lg:py-32">
        <div className="absolute inset-0">
          <Image
            priority
            fill
            className="object-cover w-full h-full"
            // src="https://cdn.rareblocks.xyz/collection/celebration/images/signin/2/man-eating-noodles.jpg"
            src="/assets/house-1.jpg"
            alt=""
          />
        </div>

        {/* <div className="absolute inset-0 bg-black/90 -z-10"></div> */}
        <div className="absolute inset-0 hidden bg-gradient-to-r md:block from-black/80 to-transparent"></div>

        <div className="absolute inset-0 block bg-black/60 md:hidden"></div>

        <article className=" w-full mb-12  border-white/[0.01] lg:border-x lg:py-9 lg:border-y z-30 md:py-0">
          <div className="flex items-center justify-center flex-col mx-auto max-w-7xl w-full px-4 lg:px-6 border-white/[0.03] lg:border-x">
            <div className="flex items-center flex-col my-10 mt-16 lg:mt-10 space-y-6 z-10">
              <p className="text-sm tracking-wide font-semibold uppercase text-white hidden md:block">
                The best way to
              </p>
              <h2
                className={` ${ibmPlex.className} text-center text-2xl sm:text-5xl lg:text-6xl tracking-tight text-white`}
              >
                Find your Dream Home
              </h2>
              <p className="font-medium text-white hidden md:block">
                We&apos;ve more than 75,000 properties listed for you.
              </p>
            </div>
            <div className="max-w-3xl flex items-center justify-center w-full">
              <SearchBar />
            </div>
          </div>
        </article>
      </section>
    </div>
  );
}
