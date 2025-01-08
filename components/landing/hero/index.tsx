import Image from "next/image";
import { IBM_Plex_Mono, Raleway } from "next/font/google";
import React from "react";
import SearchBar from "./search";

const nunitoSans = Raleway({
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
  // md:max-h-[70dvh] relative mb-10 md:mb-0 sm:pb-2 md:pb-8 z-10 md:max-h-[70dvh] md:grid md:place-items-center md:min-h-[420px] lg:min-h-[480px] h-full mx-auto overflow-hidden bg-cover
  return (
    <section
      className={`${nunitoSans.className} relative mb-10 md:mb-0 sm:pb-2 md:pb-8 z-10 md:max-h-[70dvh] md:grid md:place-items-center md:min-h-[420px] lg:min-h-[480px] h-full mx-auto overflow-hidden bg-cover`}
    >
      <picture className="absolute inset-0 -z-20 flex object-cover aspect-[3/4] min-h-full [@media(min-width:481px)]:aspect-video content-visibility:visible">
        <Image
          className="w-full h-full object-cover"
          src="/assets/house.jpg"
          alt="Nairobi"
          width={720}
          height={720}
        />
      </picture>
      <div className="absolute inset-0 bg-black/60 -z-10"></div>

      <article className="w-full mb-12 mt-32 border-white/[0.01] lg:border-x md:mt-28 lg:my-28 lg:py-2 lg:border-y z-30 py-12 md:py-0">
        <div className="flex items-center justify-center flex-col mx-auto max-w-7xl w-full px-4 lg:px-6 border-white/[0.03] lg:border-x">
          <div className="flex flex-col items-center space-y-8 mt-24">
            <p className="text-sm tracking-wide font-semibold uppercase text-white">
              The best way to
            </p>
            <h2
              className={`${ibmPlex.className} text-center text-2xl sm:text-5xl lg:text-6xl tracking-tight text-white`}
            >
              Find your Dream Home
            </h2>
            <p className="text-white text-center">
              We&apos;ve more than 7,000 properties listed for you.
            </p>
          </div>
          <div className="w-full max-w-3xl mt-12">
            <SearchBar />
          </div>
        </div>
      </article>
    </section>
  );
}
