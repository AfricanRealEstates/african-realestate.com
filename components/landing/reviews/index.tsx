import { cn } from "@/lib/utils";
import Image from "next/image";
import React from "react";
import Marquee from "./Marquee";
import { Josefin_Sans } from "next/font/google";
const josefin = Josefin_Sans({
  subsets: ["latin"],
  weight: ["600"],
});

const reviews = [
  {
    name: "Mungai Kihara",
    username: "@mtollah",
    body: "I've never seen anything like this before. It's amazing. I love it.",
    img: "/assets/realtor-1.jpeg",
  },
  {
    name: "Irungu",
    username: "@ill_tw",
    body: "I am lucky to have interacted to the officials of the site and I love it.",
    img: "/assets/placeholder.jpg",
  },
  {
    name: "John",
    username: "@john",
    body: "Very friendly house hunting platform. I recommend them",
    img: "https://avatar.vercel.sh/john",
  },

  {
    name: "Jane",
    username: "@jane",
    body: "I'm at a loss for words. This is amazing. I love it.",
    img: "https://avatar.vercel.sh/jane",
  },
  {
    name: "Jenny",
    username: "@jenny",
    body: "I'm at a loss for words. This is amazing. I love it.",
    img: "/assets/house.jpg",
  },
  {
    name: "James",
    username: "@james",
    body: "I'm at a loss for words. This is amazing. I love it.",
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
    <section className=" px-5 py-16 md:px-10 md:py-16 lg:py-16">
      <div className="mx-auto w-[95%] max-w-7xl">
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
        {/* <Marquee reverse pauseOnHover className="[--duratio:20s]">
          {secondRow.map((review) => {
            return <ReviewCard key={review.username} {...review} />;
          })}
        </Marquee> */}
        <div className="pointer-events-none absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-white/20"></div>
        <div className="pointer-events-none absolute inset-y-0 right-0 w-1/3 bg-gradient-to-l from-white/20"></div>
      </article>
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
