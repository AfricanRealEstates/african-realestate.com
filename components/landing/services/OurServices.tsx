import { ArrowRight } from "lucide-react";
import { Josefin_Sans } from "next/font/google";
import Image from "next/image";
import Link from "next/link";
import React from "react";
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
    <section className="mx-auto w-[95%] max-w-7xl px-5 py-16 md:px-10 md:py-16 lg:py-16 border-b border-[#e4e4e4]">
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
          href="/services"
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
              className="group hover:cursor-pointer mt-6 lg:mt-11 flex flex-col gap-5 transition-all ease-in-out p-2 border border-neutral-50 hover:border-neutral-100"
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
              <Link
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
              </Link>
            </article>
          );
        })}
      </article>
    </section>
  );
}
