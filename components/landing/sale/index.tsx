import { Raleway } from "next/font/google";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const raleway = Raleway({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-nunitosans",
});

const sales = [
  {
    image: "/assets/house-3.svg",
    title: "Explore modern property that could be your next home sweet home",
    cta: "Check all Rentals",
  },
  {
    image: "/assets/house-1.svg",
    title:
      "Highlight your property&apos;s best features and attract potential buyers.",
    cta: "Buy property",
  },
  {
    image: "/assets/house-2.svg",
    title:
      "Browse through our curated selection of rental properties to find your ideal living space.",
    cta: "Find a Property",
  },
];

export default function Sale() {
  return (
    <div className={`${raleway.className}`}>
      <section className="mx-auto w-[95%] max-w-7xl px-5 py-16 md:px-10 md:py-24">
        <div className="mb-8 text-center md:mb-12">
          <h3 className="text-center text-3xl font-bold md:text-5xl mt-4 text-[#181a20]">
            Why African Real Estate?
          </h3>
          <p className="mt-4 text-[#636262] sm:text-sm md:text-base">
            We offer the following real estate services
          </p>
        </div>
        <div className="mb-12 grid grid-cols-1 gap-5 sm:grid-cols-2 md:mb-16 md:grid-cols-3 md:gap-4">
          {sales.map((sale) => {
            const { cta, title, image } = sale;
            return (
              <div
                key={title}
                className="flex flex-col gap-8 border border-solid border-gray-100 p-2 rounded-xl"
              >
                <Image
                  src={image}
                  alt={cta}
                  width={100}
                  height={100}
                  className="bg-neutral-50 w-full"
                />
                <div className="flex w-full flex-col items-start gap-5 p-0">
                  <p className="text-[#636262]">{title}</p>
                  <div className="h-px w-full bg-gray-50"></div>
                  <div className="flex w-full justify-center">
                    <Link
                      href="/properties"
                      className="mb-4 no-underline flex flex-row items-center px-8 py-4 font-semibold group transition-colors duration-150 ease-in-out bg-[rgb(24,26,32,1)] text-[#bebdbd] hover:text-white"
                    >
                      <p className="mr-6 font-bold text-[#bebdbd]">{cta}</p>
                      <svg
                        fill="currentColor"
                        className="h-4 w-4 flex-none transition-all duration-150 ease-in-out group-hover:translate-x-0.5"
                        viewBox="0 0 20 21"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <title>Arrow Right</title>
                        <polygon points="16.172 9 10.101 2.929 11.515 1.515 20 10 19.293 10.707 11.515 18.485 10.101 17.071 16.172 11 0 11 0 9"></polygon>
                      </svg>
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}

// "use client";
// import React from "react";
// import { Plus_Jakarta_Sans, IBM_Plex_Mono, Raleway } from "next/font/google";
// import { ArrowUpRight, Home } from "lucide-react";
// import { Button } from "antd";
// import Image from "next/image";
// import { useRouter } from "next/navigation";
// const plusJakartaSans = Raleway({
//   subsets: ["latin"],
//   display: "swap",
//   variable: "--font-nunitosans",
// });

// const ibmPlex = IBM_Plex_Mono({
//   subsets: ["latin"],
//   weight: ["700"],
//   display: "swap",
//   variable: "--font-ibmplex",
// });

// export default function Sale() {
//   const router = useRouter();
//   return (
//     <section className={`${plusJakartaSans.className} lg:p-[90px]`}>
//       <div className="w-[95%] lg:max-w-7xl mx-auto">
//         <article className="flex flex-col">
//           <section className="flex flex-col items-center justify-center gap-5">
//             <h2 className="mt-4 text-2xl text-center font-semibold sm:text-3xl xl:text-[40px] relative">
//               See How{" "}
//               <span className={` text-[#eb6753]`}>African Real Estate</span> Can
//               Help
//             </h2>
//             <p className="text-[13px] text-center md:text-[17px] text-[#4e4e4e]">
//               We offer the following real estate services
//             </p>
//           </section>

//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-6 mt-16">
//             <section className="shadow-[0px_2px_3px_-1px_rgba(0,0,0,0.1),0px_1px_0px_0px_rgba(25,28,33,0.02),0px_0px_0px_1px_rgba(25,28,33,0.08)] bg-white rounded-xl mb-7 pt-[30px] px-5 pb-[35px] flex flex-col gap-4 hover:cursor-pointer transition-all duration-150 ease-in hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)]">
//               <div className="flex items-center justify-center flex-1">
//                 <Image
//                   src="/assets/house-3.svg"
//                   alt="Find Rental"
//                   width={100}
//                   height={100}
//                   className="object-cover text-[#666]"
//                 />
//               </div>
//               <div className="flex-1 space-y-4">
//                 <h3>Buy a property</h3>
//                 <p className="text-[#4e4e4e] tracking-wide text-base">
//                   Explore this stunning property that could be your next home
//                   sweet home.
//                 </p>
//               </div>
//               <Button
//                 className="text-base flex items-center justify-center gap-4"
//                 onClick={() => router.push("/properties")}
//               >
//                 Find property <ArrowUpRight />
//               </Button>
//             </section>

//             <section className="shadow-[rgba(17,_17,_26,_0.1)_0px_0px_16px] bg-white rounded-xl mb-7 pt-[30px] px-5 pb-[35px] flex flex-col gap-4 hover:cursor-pointer transition-all duration-150 ease-in hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)]">
//               <div className="flex items-center justify-center">
//                 <Image
//                   src="/assets/house-1.svg"
//                   alt="Create Listing"
//                   width={100}
//                   height={100}
//                   className="object-cover text-[#666]"
//                 />
//               </div>
//               <div className="flex-1 space-y-4">
//                 <h3>Showcase Your Property</h3>
//                 <p className="text-[#4e4e4e] tracking-wide text-base">
//                   Highlight your property&apos;s best features and attract
//                   potential buyers.
//                 </p>
//               </div>
//               <Button
//                 className="text-base flex items-center justify-center gap-4"
//                 onClick={() => router.push("/agent/properties/create-property")}
//               >
//                 Create a Listing <ArrowUpRight />
//               </Button>
//             </section>

//             <section className="shadow-[0px_2px_3px_-1px_rgba(0,0,0,0.1),0px_1px_0px_0px_rgba(25,28,33,0.02),0px_0px_0px_1px_rgba(25,28,33,0.08)] bg-white rounded-xl mb-7 pt-[30px] px-5 pb-[35px] flex flex-col gap-4 hover:cursor-pointer transition-all duration-150 ease-in hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)]">
//               <div className="flex items-center justify-center">
//                 <Image
//                   src="/assets/house-2.svg"
//                   alt="Find Rental"
//                   width={100}
//                   height={100}
//                   className="object-cover text-[#666] mt-3"
//                 />
//               </div>
//               <div className="flex-1 space-y-4">
//                 <h3>Discover Your Perfect Rental</h3>
//                 <p className="text-[#4e4e4e] tracking-wide text-base">
//                   Browse through our curated selection of rental properties to
//                   find your ideal living space.
//                 </p>
//               </div>
//               <Button
//                 className="text-base flex items-center justify-center gap-4"
//                 onClick={() => router.push("/properties")}
//               >
//                 Find a rental <ArrowUpRight />
//               </Button>
//             </section>
//           </div>
//         </article>
//       </div>
//     </section>
//   );
// }
