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
import { Tab, TabGroup, TabList, TabPanel, TabPanels } from "@headlessui/react";

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
    <section className="bg-neutral-50 px-5 py-16 md:px-10 md:py-16 lg:py-16">
      <div className="mx-auto w-[95%] max-w-7xl">
        <h4
          className={`${lexend.className} text-gray-600 mt-4 tracking-tight text-3xl sm:text-4xl font-semibold capitalize text-center`}
        >
          Our recent customer reviews
        </h4>

        <article className="mt-10">
          <TabGroup>
            <TabList className="justify-between items-center rounded-lg w-full grid grid-cols-1 lg:grid-cols-3 gap-4 bg-white">
              <Tab
                as="div"
                className={({ selected }) =>
                  `col-span-1 flex items-center gap-3 ${
                    selected ? "bg-white" : ""
                  }`
                }
              >
                <img
                  src="/assets/google-review.png"
                  alt="Google Review"
                  className="h-24"
                />
                <p className="text-3xl font-bold text-gray-600">4.9/5</p>
              </Tab>
              <Tab
                as="div"
                className={({ selected }) =>
                  `col-span-1 flex items-center gap-5 ${
                    selected ? "bg-white" : ""
                  }`
                }
              >
                <img
                  src="/assets/trustpilot.png"
                  alt="TrustPilot"
                  className="h-[56px]"
                />
                <p className="text-3xl font-bold text-gray-600">4.8/5</p>
              </Tab>
              <Tab
                as="div"
                className={({ selected }) =>
                  `col-span-1 flex items-center gap-5 ${
                    selected ? "bg-white" : ""
                  }`
                }
              >
                <img
                  src="/assets/reviews-io.png"
                  alt="Reviews.io"
                  className="h-[56px]"
                />
                <p className="text-3xl font-bold text-gray-600">5.0/5</p>
              </Tab>
            </TabList>

            <Tab.Panels className="mt-2">
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
          </TabGroup>
        </article>
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
                          src={reviewImages[reviewType]}
                          alt={`${reviewType} Review`}
                          className="h-[54px] border border-neutral-50"
                        />
                        <div className="flex space-x-1 items-center">
                          <BadgeCheck className="size-5 text-emerald-600" />
                          <p className="text-base/6 font-medium text-emerald-600">
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
  );
};

export default Reviews;

// import React from "react";
// import { Lexend } from "next/font/google";

// import { Card } from "@/components/ui/card";
// import {
//   Carousel,
//   CarouselContent,
//   CarouselItem,
//   CarouselNext,
//   CarouselPrevious,
// } from "@/components/ui/carousel";
// import { BadgeCheck } from "lucide-react";

// const lexend = Lexend({
//   subsets: ["latin"],
// });

// const reviews = [
//   {
//     name: "Mungai Kihara",
//     username: "@mtollah",
//     body: "I recently used African Real Estate to advertise my property, and I couldn't be happier with the results. I highly recommend African Real Estate to anyone looking to sell or rent their property quickly!",
//     img: "/assets/realtor-1.jpeg",
//   },
//   {
//     name: "Jacenta Kang'ethe",
//     username: "@ill_tw",
//     body: "Buying my first home was a daunting experience, but African Real Estate made it seamless and enjoyable. Thanks to African Real Estate, I found my dream home in no time!",
//     img: "/assets/placeholder.jpg",
//   },
//   {
//     name: "John Mark",
//     username: "@john",
//     body: "As a small business owner, finding the perfect office space was crucial for our growth. African Real Estate had a fantastic selection of office spaces that fit our budget and needs perfectly. Highly recommended for any business looking for new office space!",
//     img: "https://avatar.vercel.sh/john",
//   },

//   {
//     name: "Jane M. Lochilia",
//     username: "@jane",
//     body: "I listed my apartment for rent on African Real Estate, and the response was overwhelming. The platform's reach is impressive, and the quality of the leads was top-notch. Within a week, I had a tenant who matched my criteria perfectly. Thanks",
//     img: "https://avatar.vercel.sh/jane",
//   },
//   {
//     name: "Alphonse Chakwera",
//     username: "@jenny",
//     body: "My wife and I were relocating to Nairobi and needed to find a house quickly. African Real Estate came to our rescue with its extensive and detailed listings. We were able to filter properties based on our specific needs and even schedule viewings online.",
//     img: "/assets/house.jpg",
//   },
//   {
//     name: "Amina S.",
//     username: "@amina_es",
//     body: "As an expat moving to Nairobi, I was initially overwhelmed by the apartment search. African Real Estate made it incredibly easy to find the perfect place. The site offered a comprehensive list of properties with detailed descriptions and high-quality photos. Thank you!",
//     img: "/assets/house-1.jpg",
//   },
// ];

// export default function Reviews() {
//   return (
//     <section className="bg-neutral-50 px-5 py-16 md:px-10 md:py-16 lg:py-16">
//       <div className="mx-auto w-[95%] max-w-7xl">
//         <h4
//           className={`${lexend.className} text-gray-600 mt-4 tracking-tight text-3xl sm:text-4xl font-semibold capitalize text-center`}
//         >
//           Our recent customer reviews
//         </h4>

//         <article className="mt-10">
//           <div className="w-full mx-auto">
//             <ul className="flex justify-between items-center rounded-lg">
//               <div className="w-full grid grid-cols-1 lg:grid-cols-3 gap-4 bg-white">
//                 <div className="col-span-1 flex items-center gap-3">
//                   <img
//                     src="/assets/google-review.png"
//                     alt=""
//                     className="h-24"
//                   />
//                   <p className="text-3xl font-bold text-gray-600">4.9/5</p>
//                 </div>
//                 <div className="col-span-1 flex items-center gap-5">
//                   <img
//                     src="/assets/trustpilot.png"
//                     alt="TrustPilot"
//                     className="h-[56px]"
//                   />
//                   <p className="text-3xl font-bold text-gray-600">4.8/5</p>
//                 </div>
//                 <div className="col-span-1 flex items-center gap-5">
//                   <img
//                     src="/assets/reviews-io.png"
//                     alt="TrustPilot"
//                     className="h-[56px]"
//                   />

//                   <p className="text-3xl font-bold text-gray-600">5.0/5</p>
//                 </div>
//               </div>
//             </ul>
//           </div>
//           <div className="bg-[#f7f7f7] p-2 mt-4">
//             <Carousel className="mt-5 max-w-3xl mx-auto px-4 lg:px-8 relative">
//               <CarouselContent>
//                 {reviews.map((review) => {
//                   const { img, name, body, username } = review;
//                   return (
//                     <CarouselItem key={name} className="rounded-md">
//                       <div className="p-4">
//                         <Card className="grid grid-cols-4 gap-4 p-4 rounded-md bg-white">
//                           <div className="col-span-1 flex flex-col space-y-2">
//                             <img
//                               src={img}
//                               alt=""
//                               className="rounded-md w-full h-3/4"
//                             />
//                             <p className="capitalize">{name}</p>
//                           </div>
//                           <div className="col-span-3 flex flex-col gap-4">
//                             <div className="flex justify-between items-center">
//                               <img
//                                 src="/assets/google-review.png"
//                                 alt=""
//                                 className="h-[54px] border border-neutral-50"
//                               />
//                               <div className="flex space-x-1 items-center">
//                                 {/* <img src="/assets/verified-check.svg" alt="" />
//                                  */}
//                                 <BadgeCheck className="size-5 text-emerald-600" />
//                                 <p className="text-base/6 font-medium text-emerald-600">
//                                   Verified order
//                                 </p>
//                               </div>
//                             </div>
//                             <p className="text-sm leading-relaxed tracking-wide">
//                               &ldquo;{body}&rdquo;
//                             </p>
//                           </div>
//                         </Card>
//                       </div>
//                     </CarouselItem>
//                   );
//                 })}
//               </CarouselContent>
//               <CarouselPrevious className="absolute left-0" />
//               <CarouselNext className="absolute right-0" />
//             </Carousel>
//           </div>
//         </article>
//       </div>
//     </section>
//   );
// }
