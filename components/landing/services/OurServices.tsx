import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { Josefin_Sans } from "next/font/google";
const josefin = Josefin_Sans({
  subsets: ["latin"],
  weight: ["600"],
});

const services = [
  {
    image: "/assets/for-sale.svg",
    title: "buy a new home",
    description:
      "Discover your dream home effortlessly. Explore diverse properties and expert guidance for a seamless buying experience.",
  },
  {
    image: "/assets/real-estate-rental.svg",
    title: "rent a home",
    description:
      "Discover your perfect rental effortlessly. Explore a diverse variety of listings tailored precisely to suit your unique lifestyle needs.",
  },
  {
    image: "/assets/agent-seller.svg",
    title: "sell a new home",
    description:
      "Sell confidently with expert guidance and effective strategies, showcasing your property's best features for a successful sale.",
  },
];
export default function OurServices() {
  return (
    <section className="mx-auto w-[95%] max-w-7xl px-5 py-12 md:px-10 border-b border-[#e4e4e4]">
      <article className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h2
            className={`text-[14px] text-blue-500 font-semibold mb-4 uppercase ${josefin.className}`}
          >
            Our Services
          </h2>
          <h4
            className={`${josefin.className} text-[#636262] mt-4 text-3xl font-semibold`}
          >
            What we do?
          </h4>
        </div>
        <Link
          href="/guides"
          className={`${josefin.className} text-[#636262] hover:text-blue-500 group-hover:underline underline-offset-8 group font-semibold relative flex items-center gap-x-2`}
        >
          <span className=" group-hover:underline group-hover:underline-offset-4"></span>
          View All Services
          <ArrowRight className="size-4 ml-1 transition-transform duration-300 group-hover:translate-x-1" />
        </Link>
      </article>
      <article className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {services.map((service) => {
          const { image, title, description } = service;
          return (
            <article
              key={title}
              className="group hover:cursor-pointer mt-6 lg:mt-11 flex flex-col gap-5 transition-all ease-in-out p-2 border rounded-md border-neutral-200 hover:border-neutral-100 hover:shadow-2xl hover:shadow-gray-600/10"
            >
              <div className="">
                <Image
                  src={image}
                  alt={title}
                  height={100}
                  width={100}
                  className="object-cover group-hover:skew-y-6 transition-transform ease-linear"
                />
              </div>
              <div className="content">
                <h5
                  className={`capitalize font-bold text-lg lg:text-xl text-[#636262] ${josefin.className}`}
                >
                  {title}
                </h5>
                <p className="mt-3 text-[#5c6368] leading-relaxed text-sm">
                  {description}
                </p>
              </div>
              <div className="flex items-center justify-between">
                <span
                  className={`${josefin.className} group-hover:text-blue-500 text-[#5c6368] font-semibold group-hover:underline underline-offset-8 transition-all ease-in-out`}
                >
                  Learn more
                </span>

                <Link
                  href="/guides"
                  aria-label="got to guides"
                  className="relative ml-auto flex h-12 w-12 items-center justify-center before:absolute before:inset-0 before:rounded-full before:border before:border-gray-200/40 before:bg-gray-100 before:transition-transform before:duration-300 active:duration-75 active:before:scale-95 group-hover:before:scale-110 dark:before:border-gray-700 dark:before:bg-gray-800"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    className="relative text-gray-500 h-4 w-4 transition duration-300 group-hover:-rotate-45 group-hover:text-blue-600"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
                    ></path>
                  </svg>
                </Link>
              </div>
              {/* <Link
                href="/services"
                className="mt-4 inline-flex items-center gap-2 group "
              >
                <span
                  className={`${josefin.className} group-hover:text-blue-500 text-[#5c6368] font-semibold group-hover:underline underline-offset-8 transition-all ease-in-out`}
                >
                  Learn more
                </span>
                <span>
                  <ArrowRight className="group-hover:text-blue-500 size-4 transition-transform duration-300 group-hover:translate-x-1" />
                </span>
              </Link> */}
            </article>
          );
        })}
      </article>
    </section>
  );
}
