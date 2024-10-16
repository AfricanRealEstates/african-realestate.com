"use client";

import React from "react";
import { Lexend } from "next/font/google";
import { Card } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { BadgeCheck } from "lucide-react";
import { Tab } from "@headlessui/react";
import Image from "next/image";

const lexend = Lexend({
  subsets: ["latin"],
});

interface Review {
  name: string;
  username: string;
  body: string;
  img: string;
}

const reviews: { google: Review[]; trustpilot: Review[]; reviewsIO: Review[] } =
  {
    google: [
      {
        name: "Mungai Kihara",
        username: "@mtollah",
        body: "I recently used African Real Estate to advertise my property, and I couldn't be happier with the results. I highly recommend African Real Estate to anyone looking to sell or rent their property quickly!",
        img: "/assets/realtor-1.jpeg",
      },
      {
        name: "Nancy Nyam. O",
        username: "@nancy_o",
        body: "African Real Estate provided exceptional service and helped me find the perfect home for my family. The process was smooth and stress-free.",
        img: "/assets/placeholder.jpg",
      },
      {
        name: "Samuel McOure",
        username: "@sam_nd",
        body: "Selling my commercial property was a breeze with African Real Estate. They handled everything professionally and got me a great deal.",
        img: "/assets/placeholder.jpg",
      },
      {
        name: "Alice W. Linkana",
        username: "@alice_w",
        body: "African Real Estate's team is knowledgeable and dedicated. They helped me find an ideal office space for my startup. Highly recommended!",
        img: "/assets/placeholder.jpg",
      },
      {
        name: "Michael Kariuki",
        username: "@mike_k",
        body: "The customer service at African Real Estate is top-notch. They went above and beyond to ensure I found the perfect rental property.",
        img: "/assets/placeholder.jpg",
      },
    ],
    trustpilot: [
      {
        name: "Jacenta Kang'ethe",
        username: "@ill_tw",
        body: "Buying my first home was a daunting experience, but African Real Estate made it seamless and enjoyable. Thanks to African Real Estate, I found my dream home in no time!",
        img: "/assets/placeholder.jpg",
      },
      {
        name: "Peter M. Yagga",
        username: "@peter_m",
        body: "I was impressed by the professionalism and efficiency of African Real Estate. They helped me secure a fantastic office space for my growing business.",
        img: "/assets/placeholder.jpg",
      },
      {
        name: "Estavio K. M.",
        username: "@lucy_k",
        body: "The team at African Real Estate is fantastic! They helped me navigate the home buying process with ease and found me a great deal.",
        img: "/assets/placeholder.jpg",
      },
      {
        name: "David Kasaine",
        username: "@david_nj",
        body: "Renting out my apartment was quick and hassle-free thanks to African Real Estate. Their platform is easy to use and highly effective.",
        img: "/assets/placeholder.jpg",
      },
      {
        name: "Grace Wambui",
        username: "@grace_w",
        body: "African Real Estate is the best! They found us the perfect office space in no time. Their team is friendly and highly professional.",
        img: "/assets/placeholder.jpg",
      },
    ],
    reviewsIO: [
      {
        name: "John Mark",
        username: "@john",
        body: "As a small business owner, finding the perfect office space was crucial for our growth. African Real Estate had a fantastic selection of office spaces that fit our budget and needs perfectly. Highly recommended for any business looking for new office space!",
        img: "https://avatar.vercel.sh/john",
      },
      {
        name: "Mutua F. Muinde",
        username: "@faith_m",
        body: "I relocated to Nairobi and needed a new home quickly. African Real Estate's listings were detailed and accurate, making my search easy and stress-free.",
        img: "https://avatar.vercel.sh/faith",
      },
      {
        name: "George Mwangi",
        username: "@george_m",
        body: "African Real Estate provided excellent service when I was looking to rent out my commercial property. Their team is knowledgeable and very helpful.",
        img: "https://avatar.vercel.sh/george",
      },
      {
        name: "Hannah Oduor",
        username: "@hannah_o",
        body: "Thanks to African Real Estate, I found the perfect apartment to rent. Their platform is user-friendly and their customer support is outstanding.",
        img: "https://avatar.vercel.sh/hannah",
      },
      {
        name: "Alex Charamire Sungu",
        username: "@alex_k",
        body: "African Real Estate made finding an office space for our new branch a breeze. Their listings are extensive and their team is very supportive.",
        img: "https://avatar.vercel.sh/alex",
      },
    ],
  };

const Reviews: React.FC = () => {
  return (
    <section className="bg-neutral-50 px-4 py-12 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
      <div className="mx-auto max-w-7xl">
        <h4
          className={`${lexend.className} text-gray-600 mt-4 tracking-tight text-2xl sm:text-3xl lg:text-4xl font-semibold capitalize text-center`}
        >
          Our recent customer reviews
        </h4>

        <div className="mt-10">
          <Tab.Group>
            <Tab.List className="flex flex-col sm:flex-row justify-between items-center rounded-lg w-full gap-4 bg-white p-2">
              <Tab
                className={({ selected }) =>
                  `w-full sm:w-auto flex items-center justify-center gap-3 p-2 rounded-md transition-colors ${
                    selected
                      ? "bg-blue-100 text-blue-700"
                      : "text-gray-500 hover:bg-gray-100"
                  }`
                }
              >
                <Image
                  src="/assets/google-review.png"
                  alt="Google Review"
                  width={96}
                  height={96}
                  className="h-16 w-auto"
                />
                <p className="text-xl font-bold">4.9/5</p>
              </Tab>
              <Tab
                className={({ selected }) =>
                  `w-full sm:w-auto flex items-center justify-center gap-3 p-2 rounded-md transition-colors ${
                    selected
                      ? "bg-blue-100 text-blue-700"
                      : "text-gray-500 hover:bg-gray-100"
                  }`
                }
              >
                <Image
                  src="/assets/trustpilot.png"
                  alt="TrustPilot"
                  width={112}
                  height={56}
                  className="h-14 w-auto"
                />
                <p className="text-xl font-bold">4.8/5</p>
              </Tab>
              <Tab
                className={({ selected }) =>
                  `w-full sm:w-auto flex items-center justify-center gap-3 p-2 rounded-md transition-colors ${
                    selected
                      ? "bg-blue-100 text-blue-700"
                      : "text-gray-500 hover:bg-gray-100"
                  }`
                }
              >
                <Image
                  src="/assets/reviews-io.png"
                  alt="Reviews.io"
                  width={112}
                  height={56}
                  className="h-14 w-auto"
                />
                <p className="text-xl font-bold">5.0/5</p>
              </Tab>
            </Tab.List>

            <Tab.Panels className="mt-4">
              <Tab.Panel>
                <ReviewCarousel reviews={reviews.google} reviewType="google" />
              </Tab.Panel>
              <Tab.Panel>
                <ReviewCarousel
                  reviews={reviews.trustpilot}
                  reviewType="trustpilot"
                />
              </Tab.Panel>
              <Tab.Panel>
                <ReviewCarousel
                  reviews={reviews.reviewsIO}
                  reviewType="reviewsIO"
                />
              </Tab.Panel>
            </Tab.Panels>
          </Tab.Group>
        </div>
      </div>
    </section>
  );
};

interface ReviewCarouselProps {
  reviews: Review[];
  reviewType: "google" | "trustpilot" | "reviewsIO";
}

const ReviewCarousel: React.FC<ReviewCarouselProps> = ({
  reviews,
  reviewType,
}) => {
  const reviewImages = {
    google: "/assets/google-review.png",
    trustpilot: "/assets/trustpilot.png",
    reviewsIO: "/assets/reviews-io.png",
  };

  return (
    <div className="bg-[#f7f7f7] p-2 mt-4 rounded-lg">
      <Carousel className="w-full max-w-3xl mx-auto">
        <CarouselContent>
          {reviews.map((review, index) => (
            <CarouselItem key={index}>
              <div className="p-2">
                <Card className="flex flex-col h-full p-6 rounded-md bg-white shadow-md">
                  <div className="flex items-center space-x-4 mb-4">
                    <Image
                      src={review.img}
                      alt={review.name}
                      width={64}
                      height={64}
                      className="rounded-full"
                    />
                    <div>
                      <p className="font-semibold text-lg">{review.name}</p>
                      <p className="text-sm text-gray-500">{review.username}</p>
                    </div>
                  </div>
                  <div className="flex-grow">
                    <p className="text-base leading-relaxed tracking-wide mb-6">
                      &ldquo;{review.body}&rdquo;
                    </p>
                  </div>
                  <div className="flex justify-between items-center mt-4">
                    <Image
                      src={reviewImages[reviewType]}
                      alt={`${reviewType} Review`}
                      width={100}
                      height={50}
                      className="h-10 w-auto"
                    />
                    <div className="flex items-center space-x-1">
                      <BadgeCheck className="w-5 h-5 text-emerald-600" />
                      <p className="text-sm font-medium text-emerald-600">
                        Verified
                      </p>
                    </div>
                  </div>
                </Card>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <div className="flex justify-center mt-4 gap-2">
          <CarouselPrevious />
          <CarouselNext />
        </div>
      </Carousel>
    </div>
  );
};

export default Reviews;
