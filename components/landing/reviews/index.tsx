import { cn } from "@/lib/utils";
import Image from "next/image";
import React from "react";
import Marquee from "./Marquee";
import { Josefin_Sans } from "next/font/google";

import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { BadgeCheck, Check } from "lucide-react";

const josefin = Josefin_Sans({
  subsets: ["latin"],
  weight: ["600"],
});

const reviews = [
  {
    name: "Mungai Kihara",
    username: "@mtollah",
    body: "I recently used African Real Estate to advertise my property, and I couldn't be happier with the results. I highly recommend African Real Estate to anyone looking to sell or rent their property quickly!",
    img: "/assets/realtor-1.jpeg",
  },
  {
    name: "Jacenta Kang'ethe",
    username: "@ill_tw",
    body: "Buying my first home was a daunting experience, but African Real Estate made it seamless and enjoyable. Thanks to African Real Estate, I found my dream home in no time!",
    img: "/assets/placeholder.jpg",
  },
  {
    name: "John Mark",
    username: "@john",
    body: "As a small business owner, finding the perfect office space was crucial for our growth. African Real Estate had a fantastic selection of office spaces that fit our budget and needs perfectly. Highly recommended for any business looking for new office space!",
    img: "https://avatar.vercel.sh/john",
  },

  {
    name: "Jane M. Lochilia",
    username: "@jane",
    body: "I listed my apartment for rent on African Real Estate, and the response was overwhelming. The platform's reach is impressive, and the quality of the leads was top-notch. Within a week, I had a tenant who matched my criteria perfectly. Thanks",
    img: "https://avatar.vercel.sh/jane",
  },
  {
    name: "Alphonse Chakwera",
    username: "@jenny",
    body: "My wife and I were relocating to Nairobi and needed to find a house quickly. African Real Estate came to our rescue with its extensive and detailed listings. We were able to filter properties based on our specific needs and even schedule viewings online.",
    img: "/assets/house.jpg",
  },
  {
    name: "Amina S.",
    username: "@amina_es",
    body: "As an expat moving to Nairobi, I was initially overwhelmed by the apartment search. African Real Estate made it incredibly easy to find the perfect place. The site offered a comprehensive list of properties with detailed descriptions and high-quality photos. Thank you!",
    img: "/assets/house-1.jpg",
  },
];

const firstRow = reviews.slice(0, reviews.length / 2);
const secondRow = reviews.slice(reviews.length / 2);

interface ReviewCardProps {
  img: string;
  name: string;
  username: string;
  body: string;
}

const ReviewCard = ({ img, name, username, body }: ReviewCardProps) => {
  return (
    <figure
      className={cn(
        "relative w-64 cursor-pointer overflow-hidden rounded-xl border p-4",
        // light styles
        "border-gray-950/[.1] bg-gray-950/[.01] hover:bg-gray-950/[.05]"
      )}
    >
      <div className="flex flex-row items-center gap-2">
        <Image width={32} height={32} alt="" src={img} />
        <div className="flex flex-col">
          <figcaption className="text-sm font-medium">{name}</figcaption>
          <p className="text-xs font-medium">{username}</p>
        </div>
      </div>
      <blockquote className="mt-2 text-sm">{body}</blockquote>
    </figure>
  );
};

export default function Reviews() {
  return (
    <section className="bg-neutral-50 px-5 py-16 md:px-10 md:py-16 lg:py-16">
      <div className="mx-auto w-[95%] max-w-7xl">
        <h4 className={` text-[#636262] mt-4 text-3xl font-semibold`}>
          Check out our most recent customer reviews
        </h4>

        <article className="mt-10">
          <div className="w-full mx-auto">
            <ul className="flex justify-between items-center">
              <div className="w-full grid grid-cols-1 lg:grid-cols-3 gap-4">
                <div className="col-span-1 flex items-center gap-3">
                  <img
                    src="/assets/google-review.png"
                    alt=""
                    className="h-24"
                  />
                  <p className="text-3xl font-bold text-gray-600">4.8/5</p>
                </div>
                <div className="col-span-1 flex items-center gap-5">
                  <img
                    src="/assets/trustpilot.png"
                    alt="TrustPilot"
                    className="h-[56px]"
                  />
                  <p className="text-3xl font-bold text-gray-600">4.6/5</p>
                </div>
                <div className="col-span-1 flex items-center gap-5">
                  <img
                    src="/assets/reviews-io.png"
                    alt="TrustPilot"
                    className="h-[56px]"
                  />
                  {/* <span className="font-bold text-2xl">Reviews.io</span> */}
                  <p className="text-3xl font-bold text-gray-600">4.8/5</p>
                </div>
              </div>
            </ul>
          </div>
          <div className="bg-[#f7f7f7] p-2 mt-4">
            <Carousel className="mt-5 max-w-3xl mx-auto px-4 lg:px-8 relative">
              <CarouselContent>
                {reviews.map((review) => {
                  const { img, name, body, username } = review;
                  return (
                    <CarouselItem key={name} className="rounded-md">
                      <div className="p-4">
                        <Card className="grid grid-cols-4 gap-4 p-4 rounded-md bg-white">
                          <div className="col-span-1 flex flex-col space-y-2">
                            <img
                              src={img}
                              alt=""
                              className="rounded-md w-full h-3/4"
                            />
                            <p className="capitalize">{name}</p>
                          </div>
                          <div className="col-span-3 flex flex-col gap-4">
                            <div className="flex justify-between items-center">
                              <img
                                src="/assets/google-review.png"
                                alt=""
                                className="h-[54px] border border-neutral-50"
                              />
                              <div className="flex space-x-1 items-center">
                                {/* <img src="/assets/verified-check.svg" alt="" />
                                 */}
                                <BadgeCheck className="size-5 text-[#00cf8a]" />
                                <p className="text-base/6 font-medium text-[#00cf8a]">
                                  Verified order
                                </p>
                              </div>
                            </div>
                            <p className="text-sm leading-relaxed tracking-wide">
                              &ldquo;{body}&rdquo;
                            </p>
                          </div>
                        </Card>
                      </div>
                    </CarouselItem>
                  );
                })}
              </CarouselContent>
              <CarouselPrevious className="absolute left-0" />
              <CarouselNext className="absolute right-0" />
            </Carousel>
          </div>
        </article>
      </div>
      {/* <div className="mx-auto w-[95%] max-w-7xl">
        <h2
          className={`text-[14px] text-blue-500 font-semibold mb-4 uppercase ${josefin.className}`}
        >
          TOP PROPERTIES
        </h2>
        <h4
          className={`${josefin.className} text-[#636262] mt-4 text-3xl font-semibold`}
        >
          What&apos;s People Say&apos;s
        </h4>
      </div>
      <article className="relative flex h-full w-full max-w-7xl mx-auto flex-col items-center justify-center overflow-hidden py-16">
        <Marquee pauseOnHover className="[--duration:20s]">
          {firstRow.map((review) => {
            return <ReviewCard key={review.username} {...review} />;
          })}
          <ReviewCard2 />
          <ReviewCard3 />
        </Marquee>
        <div className="pointer-events-none absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-white/20"></div>
        <div className="pointer-events-none absolute inset-y-0 right-0 w-1/3 bg-gradient-to-l from-white/20"></div>
      </article> */}
    </section>
  );
}

//
function ReviewCard2() {
  return (
    <div className="flex flex-col items-center justify-center rounded-md p-4 min-w-[300px] border border-neutral-200 hover:bg-neutral-100/80 transition-colors duration-100 group">
      <img
        src="/assets/trustpilot.svg"
        alt="Trust Pilot"
        className="mb-4 h-10 select-none"
      />
      <div className="mb-3 flex flex-col space-y-1 items-center justify-center">
        <p className="truncate font-medium text-balance text-center select-all">
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full font-medium bg-neutral-100 border border-neutral-200 text-neutral-600 hover:underline hover:bg-neutral-200 transition-colors duration-100">
            Rating: 4.8/5
          </span>
        </p>
      </div>
    </div>
  );
}

function ReviewCard3() {
  return (
    <div className="flex flex-col items-center justify-center rounded-md p-4 min-w-[240px] border border-neutral-200 hover:bg-neutral-100/80 transition-colors duration-100 group">
      <div className="flex items-center">
        <img
          src="/assets/reviews-io.svg"
          alt="Reviews.io"
          className="mb-4 h-10 select-none"
        />
        <p className="mb-3 text-2xl truncate font-bold text-balance text-center select-all">
          Reviews.io
        </p>
      </div>
      <div className="flex flex-col space-y-1 items-center justify-center">
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full font-medium bg-neutral-100 border border-neutral-200 text-neutral-600 hover:underline hover:bg-neutral-200 transition-colors duration-100">
          Rating: 4.7/5
        </span>
      </div>
    </div>
  );
}
