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
    name: "Jill",
    username: "@jill",
    body: "I don't know what to say. I'm speechless. This is amazing.",
    img: "/assets/placeholder.jpg",
  },
  {
    name: "John",
    username: "@john",
    body: "I'm at a loss for words. This is amazing. I love it.",
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
      <article className="relative flex h-full w-full flex-col items-center justify-center overflow-hidden py-20">
        <Marquee pauseOnHover className="[--duration:20s]">
          {firstRow.map((review) => {
            return <ReviewCard key={review.username} {...review} />;
          })}
        </Marquee>
        <Marquee reverse pauseOnHover className="[--duratio:20s]">
          {secondRow.map((review) => {
            return <ReviewCard key={review.username} {...review} />;
          })}
        </Marquee>
        <div className="pointer-events-none absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-white/20"></div>
        <div className="pointer-events-none absolute inset-y-0 right-0 w-1/3 bg-gradient-to-l from-white/20"></div>
      </article>
    </section>
  );
}

//
