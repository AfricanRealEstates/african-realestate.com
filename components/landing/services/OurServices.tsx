import { ArrowRight } from "lucide-react";
import { Josefin_Sans } from "next/font/google";
import Link from "next/link";
import React from "react";
const josefin = Josefin_Sans({
  subsets: ["latin"],
  weight: ["600"],
});

export default function OurServices() {
  return (
    <section className="mx-auto w-[95%] max-w-7xl px-5 py-16 md:px-10 md:py-16 lg:py-16">
      <article className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h2
            className={`text-[14px] text-blue-500 font-semibold mb-4 uppercase ${josefin.className}`}
          >
            Our Services
          </h2>
          <h4 className={`${josefin.className} mt-4 text-3xl font-semibold`}>
            What we do?
          </h4>
        </div>
        <Link
          href="/services"
          className={`${josefin.className} hover:text-blue-500 underline underline-offset-8 group font-semibold relative flex items-center gap-x-2`}
        >
          <span className=" group-hover:underline group-hover:underline-offset-4"></span>
          View All Services
          <ArrowRight className="size-4 ml-1 transition-transform duration-300 group-hover:translate-x-1" />
        </Link>
      </article>
      <article></article>
      <article></article>
    </section>
  );
}
