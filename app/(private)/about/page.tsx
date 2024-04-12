import { getSEOTags } from "@/lib/seo";
import { Raleway } from "next/font/google";
import Image from "next/image";
import React from "react";

export const metadata = getSEOTags({
  title: "About | African Real Estate",
  canonicalUrlRelative: "/about",
});

const raleway = Raleway({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-nunitosans",
});

export default function About() {
  return (
    <div className={`${raleway.className} `}>
      <section className="mx-auto w-[95%] max-w-7xl px-5 py-24 md:px-10 md:py-24 lg:py-32">
        <h2 className="mb-8 text-3xl font-bold md:text-5xl lg:mb-11 text-[#181a20]">
          Meet African Real Estate
        </h2>
        <p className="mb-8 max-w-lg text-sm lg:text-[18px] leading-relaxed lg:mb-16 text-[#808080]">
          Africa&apos;s most opulent real estate catalogue, property reviews and
          trusted source of property search. We feature thousands of new
          properties monthly, 24 hours before they are advertised anywhere else.
        </p>
        <article className="grid gap-10 lg:grid-cols-2 lg:gap-12">
          <img
            src="/assets/mission.jpg"
            alt="Mission"
            className="inline-block h-full w-full rounded-2xl object-cover"
          />
          <div className="flex flex-col gap-5 rounded-2xl border border-solid border-[#bebdbd] p-10 sm:p-20">
            <h2 className="text-3xl font-bold md:text-5xl">Our Mission</h2>
            <p className="text-sm text-[#808080] lg:text-[18px] leading-relaxed">
              Our mission is to provide a platform that allows home seekers in
              the African continent to find their Our mission is to provide an
              accessible platform for the best deals in Africa&apos;s luxury
              properties.
              <br />
              <br />
              By showcasing unique properties that are not available on other
              platforms, we aim to make it easier for investors to find their
              dream home. Whether you&apos;re looking for a beachfront mansion
              or a secluded mountain retreat, our goal is to connect you with
              your next big purchase.
            </p>
          </div>
        </article>
      </section>
    </div>
  );
}
