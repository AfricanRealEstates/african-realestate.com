import { Raleway } from "next/font/google";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const raleway = Raleway({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-nunitosans",
});
export default function HowItWorks() {
  return (
    <div className={`${raleway.className}`}>
      <section className="mx-auto w-[95%] max-w-7xl px-5 py-16 md:px-10 md:py-24 lg:py-32">
        <p className="text-center text-xl font-bold uppercase text-[#4e4e4e]">
          3 easy steps
        </p>
        <h2 className="text-center text-3xl font-bold md:text-5xl mt-4 text-[#181a20]">
          How it works
        </h2>
        <p className="mx-auto mb-8 mt-4 max-w-lg text-center text-sm text-[#636262] sm:text-base md:mb-12 lg:mb-16">
          Use our simple platform to create, manage and sell your properties.
          One stop solution for your real estate needs.
        </p>

        <article className="grid items-center gap-8 lg:grid-cols-2 lg:gap-12">
          <div className="flex h-full flex-col [grid-area:2/1/3/2] lg:[grid-area:1/2/2/3]">
            {works.map((work, index) => {
              const { step, title, description } = work;
              return (
                <Link
                  key={step}
                  href="#"
                  className={`no-underline mb-8 flex max-w-lg justify-center gap-4 rounded-xl px-6 py-5 text-[#222222] ${
                    index === 0 ? "border border-solid border-[#cdcdcd]" : ""
                  }`}
                >
                  <div className="flex h-10 w-10 flex-none items-center justify-center rounded-full bg-[#f2f2f7]">
                    <p className="text-sm font-bold sm:text-base">{step}</p>
                  </div>
                  <div className="ml-4 flex flex-col gap-2">
                    <h4 className="text-xl font-bold">{title}</h4>
                    <p className="text-sm text-[#636262]">{description}</p>
                  </div>
                </Link>
              );
            })}
          </div>

          <Image
            height={450}
            width={450}
            src="/assets/works.jpg"
            className="rounded-xl block h-full w-full overflow-hidden [grid-area:1/1/2/2] lg:[grid-area:1/1/2/2]"
            alt="How it Works"
          />
        </article>
      </section>
    </div>
  );
}

const works = [
  {
    step: 1,
    title: "Create an Account",
    description: "Register an account with us to explore more opportunities",
  },
  {
    step: 2,
    title: "Place a Listing",
    description:
      "Use create property form to have a listing you want to sell or for let",
  },
  {
    step: 3,
    title: "Investment Opportunities",
    description:
      "You can explore over 1000 properties listed in our catalogue for investment",
  },
];
