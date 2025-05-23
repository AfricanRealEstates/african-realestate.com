"use client";

import type React from "react";
import { Lexend } from "next/font/google";
import { Card } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { BadgeCheck, Star, Users } from "lucide-react";
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
        body: "Buying my first home was a daunting experience, but African Real Estate made it seamless and enjoyable. Thanks to African Real Estate.",
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
        body: "As a small business owner, finding the perfect office space was crucial for our growth. African Real Estate had a fantastic selection of office spaces that fit perfectly.",
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
    <section className="bg-white px-4 py-12 sm:py-16 lg:py-20">
      <div className="mx-auto max-w-7xl px-4">
        {/* Header Section */}
        <div className="mb-12 flex gap-4">
          <div className="inline-flex items-center justify-center mb-4">
            <div className="p-3 bg-blue-100 rounded-full">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
          </div>
          <div>
            <h4
              className={`${lexend.className} mt-2 tracking-tight text-2xl font-bold text-gray-700 capitalize`}
            >
              Our recent customer reviews
            </h4>
            <p className="mt-2 text-sm text-gray-600 max-w-2xl">
              See what our satisfied customers have to say about their
              experience with African Real Estate
            </p>
          </div>
        </div>

        <div className="mt-10 overflow-x-auto">
          <Tab.Group>
            <Tab.List className="flex flex-col sm:flex-row justify-between items-center rounded-xl w-full mx-auto gap-4 bg-white p-3 border border-gray-100">
              <Tab
                className={({ selected }) =>
                  `w-full sm:w-auto flex items-center justify-center gap-3 p-4 rounded-lg transition-all duration-200 ${
                    selected
                      ? "bg-blue-50 text-blue-700 shadow-sm ring-2 ring-blue-200"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-800"
                  }`
                }
              >
                <Image
                  src="/assets/google-review.png"
                  alt="Google Review"
                  width={96}
                  height={96}
                  className="h-12 w-auto"
                />
                <div className="text-center">
                  <div className="flex items-center justify-center mb-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className="h-4 w-4 text-yellow-400 fill-yellow-400"
                      />
                    ))}
                  </div>
                  <p className="text-xl font-bold">4.9/5</p>
                  <p className="text-xs text-gray-500">Google Reviews</p>
                </div>
              </Tab>
              <Tab
                className={({ selected }) =>
                  `w-full sm:w-auto flex items-center justify-center gap-3 p-4 rounded-lg transition-all duration-200 ${
                    selected
                      ? "bg-blue-50 text-blue-700 shadow-sm ring-2 ring-blue-200"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-800"
                  }`
                }
              >
                <Image
                  src="/assets/trustpilot.png"
                  alt="TrustPilot"
                  width={112}
                  height={56}
                  className="h-10 w-auto"
                />
                <div className="text-center">
                  <div className="flex items-center justify-center mb-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className="h-4 w-4 text-green-500 fill-green-500"
                      />
                    ))}
                  </div>
                  <p className="text-xl font-bold">4.8/5</p>
                  <p className="text-xs text-gray-500">Trustpilot</p>
                </div>
              </Tab>
              <Tab
                className={({ selected }) =>
                  `w-full sm:w-auto flex items-center justify-center gap-3 p-4 rounded-lg transition-all duration-200 ${
                    selected
                      ? "bg-blue-50 text-blue-700 shadow-sm ring-2 ring-blue-200"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-800"
                  }`
                }
              >
                <Image
                  src="/assets/reviews-io.png"
                  alt="Reviews.io"
                  width={112}
                  height={56}
                  className="h-10 w-auto"
                />
                <div className="text-center">
                  <div className="flex items-center justify-center mb-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className="h-4 w-4 text-blue-500 fill-blue-500"
                      />
                    ))}
                  </div>
                  <p className="text-xl font-bold">5.0/5</p>
                  <p className="text-xs text-gray-500">Reviews.io</p>
                </div>
              </Tab>
            </Tab.List>

            <Tab.Panels className="mt-8 bg-gray-50">
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

  const starColors = {
    google: "text-yellow-400 fill-yellow-400",
    trustpilot: "text-green-500 fill-green-500",
    reviewsIO: "text-blue-500 fill-blue-500",
  };

  const badgeColors = {
    google: "text-blue-600",
    trustpilot: "text-green-600",
    reviewsIO: "text-blue-600",
  };

  return (
    <div className="bg-white/50 backdrop-blur-sm p-4 mt-6 rounded-xl border border-white/20">
      <Carousel className="w-full max-w-7xl mx-auto">
        <CarouselContent className="-ml-2 md:-ml-4">
          {reviews.map((review, index) => (
            <CarouselItem
              key={index}
              className="pl-2 md:pl-4 md:basis-1/2 lg:basis-1/3"
            >
              <div className="p-1">
                <Card className="flex flex-col h-full p-6 rounded-xl bg-white shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100">
                  {/* User Info */}
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="relative">
                      <Image
                        src={
                          review.img || "/placeholder.svg?height=64&width=64"
                        }
                        alt={review.name}
                        width={64}
                        height={64}
                        className="rounded-full object-cover h-12 w-12"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-lg text-gray-900 truncate">
                        {review.name}
                      </p>
                      <p className="text-sm text-gray-500 truncate">
                        {review.username}
                      </p>
                    </div>
                  </div>

                  {/* Rating */}
                  <div className="flex items-center mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${starColors[reviewType]}`}
                      />
                    ))}
                  </div>

                  {/* Review Text */}
                  <div className="flex-grow mb-6">
                    <p className="text-base leading-relaxed tracking-wide text-gray-700">
                      &ldquo;{review.body}&rdquo;
                    </p>
                  </div>

                  {/* Footer */}
                  <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                    <Image
                      src={
                        reviewImages[reviewType] ||
                        "/placeholder.svg?height=40&width=80"
                      }
                      alt={`${reviewType} Review`}
                      width={80}
                      height={40}
                      className="h-8 w-auto opacity-80"
                    />
                    <div className="flex items-center space-x-1">
                      <BadgeCheck
                        className={`w-4 h-4 ${badgeColors[reviewType]}`}
                      />
                      <p
                        className={`text-xs font-medium ${badgeColors[reviewType]}`}
                      >
                        Verified
                      </p>
                    </div>
                  </div>
                </Card>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <div className="flex justify-center mt-6 gap-4">
          <CarouselPrevious className="relative inset-0 translate-y-0 bg-white/80 backdrop-blur-sm border border-gray-200 hover:bg-white shadow-sm" />
          <CarouselNext className="relative inset-0 translate-y-0 bg-white/80 backdrop-blur-sm border border-gray-200 hover:bg-white shadow-sm" />
        </div>
      </Carousel>
    </div>
  );
};

export default Reviews;
