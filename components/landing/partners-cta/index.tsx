import { Button } from "@/components/utils/Button";
import { Josefin_Sans } from "next/font/google";
import Link from "next/link";
import React from "react";

const josefin = Josefin_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-josefin",
});

export default function PartnersCTA() {
  return (
    <section className="max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24 mx-auto ">
      <div className="flex gap-y-16 flex-col lg:flex-row justify-between items-center rounded-2xl bg-[#f7f7f7]">
        <div className="py-16 pl-12 pr-20 ">
          <div className="my-7 space-y-6">
            <h5
              className={`text-blue-500 font-semibold uppercase text-[14px] tracking-widest ${josefin.className}`}
            >
              Become partners
            </h5>
            <h4
              className={`mt-2 capitalize text-2xl lg:text-3xl font-semibold text-gray-600 ${josefin.className}`}
            >
              List your properties on African Real Estate, Join us now!
            </h4>
            <Button
              color="blue"
              href={`/agent/properties/create-property`}
              className={`${josefin.className} mt-5 font-bold uppercase py-3 px-4 flex items-center justify-center`}
            >
              Become a hosting
            </Button>
          </div>
        </div>
        <div className="flex-shrink-0">
          <img
            src={`/assets/host.png`}
            className="max-w-full h-auto scale-1 align-middle -mt-32"
            alt="Host"
          />
        </div>
      </div>
    </section>
  );
}
