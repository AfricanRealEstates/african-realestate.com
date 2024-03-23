import { Raleway } from "next/font/google";
import React from "react";
const raleway = Raleway({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-nunitosans",
});
export default function Facts() {
  return (
    <div className={`${raleway.className} bg-[#181a20]`}>
      <section className="px-5 py-12 md:px-10 md:py-16 lg:py-24 w-[95%] max-w-7xl mx-auto">
        <h2 className="text-center text-white text-3xl font-bold md:text-5xl mb-12">
          Backed up by real data
        </h2>
        <div className="mx-auto flex w-full flex-col rounded-[16px] bg-[#ffffff0a] py-8 text-white">
          <div className="grid h-full w-full grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-4 md:gap-0">
            <div className="flex flex-col items-center justify-center lg:border-r lg:border-solid lg:border-r-[#c3c0c04d]">
              <h4 className="mb-4 text-4xl font-bold md:text-5xl">200+</h4>
              <p className="text-lg text-[#bebdbd]">Agents</p>
            </div>
            <div className="flex flex-col items-center justify-center lg:border-r lg:border-solid lg:border-r-[#c3c0c04d] ">
              <h4 className="mb-4 text-2xl font-bold md:text-5xl">7000+</h4>
              <p className="text-lg text-[#bebdbd]">Properties</p>
            </div>
            <div className="flex flex-col items-center justify-center lg:border-r lg:border-solid lg:border-r-[#c3c0c04d] ">
              <h4 className="mb-4 text-2xl font-bold md:text-5xl">1200+</h4>
              <p className="text-lg text-[#bebdbd]">Satisfied Customers</p>
            </div>
            <div className="flex flex-col items-center justify-center">
              <h4 className="mb-4 text-2xl font-bold md:text-5xl">4.9</h4>
              <p className="text-lg text-[#bebdbd]">Rating</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
