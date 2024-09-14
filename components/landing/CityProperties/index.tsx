import React from "react";
import CitySlider from "./CitySlider";

export default function CityProperties() {
  return (
    <div className={`border-b border-neutral-100  mb-4 text-[#4e4e4e]`}>
      <div className="mx-auto w-[95%] max-w-7xl px-2 py-16 md:px-2 md:py-12 lg:py-16">
        <div className="flex flex-col items-center justify-center gap-2">
          <p
            className={`text-[12px] uppercase text-blue-600 font-semibold leading-relaxed`}
          >
            Explore the Hottest Properties near You
          </p>
          <h2
            className={`text-center tracking-tight text-3xl font-bold sm:text-4xl my-1`}
          >
            Our Most Popular Towns
          </h2>
        </div>

        <div className="mt-10 md:mt-16">
          <CitySlider />
        </div>
      </div>
    </div>
  );
}
