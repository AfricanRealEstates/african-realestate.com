"use client";
import { Button } from "@/components/utils/Button";
import { ArrowRight } from "lucide-react";
import { Raleway } from "next/font/google";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React from "react";
const raleway = Raleway({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-nunitosans",
});

export default function CTA() {
  const router = useRouter();
  return (
    <div className={`bg-neutral-50 ${raleway.className}`}>
      <section className="mx-auto w-[95%] max-w-7xl px-5 py-16 md:px-10 md:py-24">
        <div className="flex w-full flex-col items-center bg-[#f2f2f7] px-6 py-16 text-center md:py-24 rounded-2xl">
          <h2 className="text-[#4e4e4e] mb-6 flex-col text-3xl font-semibold md:mb-10 md:text-5xl lg:mb-12 max-w-[800px]">
            Need to sell your property fast?
          </h2>
          <article className="mx-auto">
            <div className="mb-6 flex flex-col flex-no-wrap gap-3 md:mb-10 md:flex-row lg:mb-12">
              {sellingPoints.map((point) => {
                const { image, title } = point;
                return (
                  <div
                    key={title}
                    className="ml-2 mr-2 flex flex-row items-center md:mx-4"
                  >
                    <Image
                      height={30}
                      width={30}
                      alt="Check"
                      src={image}
                      className="mr-2 inline-block"
                    />
                    <p className="text-gray-600">{title}</p>
                  </div>
                );
              })}
            </div>
          </article>
          <Button href="/agent/properties/create-property" color="blue">
            Sell fast
          </Button>
          {/* <button
            onClick={() => router.push("/agent/properties/create-property")}
            className="flex items-center gap-2 rounded-md bg-indigo-600 px-6 py-3 font-semibold text-white shadow-lg transition-all hover:-translate-y-0.5 active:translate-y-0 active:bg-indigo-700 active:shadow-inner"
          >
            Sell fast
            <ArrowRight className="transition-transform" />
          </button> */}
          {/* <Link
            href="/agent/properties/create-property"
            className="mb-4 no-underline flex flex-row items-center px-8 py-4 font-semibold group transition-colors duration-150 ease-in-out bg-[rgb(24,26,32,1)] text-[#bebdbd] hover:text-white [box-shadow:rgb(171,_196,245)-8px_8px] hover:[box-shadow:rgb(171,_196,_245)_0px_0px]"
          >
            <p className="mr-6 font-bold">Sell fast</p>
            <svg
              fill="currentColor"
              className="h-4 w-4 flex-none transition-all duration-150 ease-in-out group-hover:translate-x-0.5"
              viewBox="0 0 20 21"
              xmlns="http://www.w3.org/2000/svg"
            >
              <title>Arrow Right</title>
              <polygon points="16.172 9 10.101 2.929 11.515 1.515 20 10 19.293 10.707 11.515 18.485 10.101 17.071 16.172 11 0 11 0 9"></polygon>
            </svg>
          </Link> */}
          <p className="mt-6 text-gray-600">No credit card required.</p>
        </div>
      </section>
    </div>
  );
}

const sellingPoints = [
  {
    image: "/assets/icons/check.svg",
    title: "Get Started for Free",
  },
  {
    image: "/assets/icons/check.svg",
    title: "Reach more Potential clients",
  },
  {
    image: "/assets/icons/check.svg",
    title: "East to Use Platform",
  },
];
