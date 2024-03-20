import { Raleway } from "next/font/google";
import Link from "next/link";
import React from "react";
const raleway = Raleway({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-nunitosans",
});
export default function Blog() {
  return (
    <div className={`text-[#181a20] ${raleway.className}`}>
      <section className="mx-auto w-[95%] max-w-7xl px-5 py-24 md:px-10 md:py-24 lg:py-32">
        <h2 className="text-center text-3xl font-bold md:text-5xl lg:text-left">
          Latest and updated news
        </h2>
        <p className="mb-8 mt-4 text-center text-sm text-[#636363] sm:text-base md:mb-12 lg:mb-16 lg:text-left">
          Get the latest updates about our company, new products, and offers.
        </p>
        <div className="grid justify-items-stretch md:mb-12 md:grid-cols-3 md:gap-4 lg:mb-16 lg:gap-6">
          <Link
            href="#"
            className="relative flex h-[500px] flex-col gap-4 rounded-md px-4 py-8 [grid-area:1/1/2/2] md:p-0 md:[grid-area:1/1/2/4]"
          >
            <div className="absolute bottom-12 left-8 z-20 w-56 max-w-[464px] flex-col items-start rounded-md bg-white p-6 sm:w-full md:bottom-[10px] md:left-[10px]">
              <div className="mb-4 rounded-md px-2 py-1.5 bg-[#f2f2f7] max-w-fit">
                <p className="uppercase text-sm font-semibold text-[#6574f8]">
                  investing
                </p>
              </div>
              <p className="mb-4  text-xl font-bold md:text-2xl text-[#181a20]">
                How to invest in Real Estate in 2024
              </p>
              <div className="flex flex-col text-sm text-[#636262] lg:flex-row">
                <p>Ken Mwangi</p>
                <p className="mx-2 hidden lg:block">-</p>
                <p>4 mins read</p>
              </div>
            </div>
            <img
              src="/assets/blog.svg"
              className="inline-block h-full w-full object-cover"
            />
          </Link>

          {blogs.map((blog) => {
            const { title, tag, readingTime, author, src } = blog;
            return (
              <Link
                key={title}
                href="#"
                className="flex flex-col gap-4 rounded-md px-4 py-8 mt-8 md:p-2 no-underline border border-solid border-neutral-50"
              >
                <img
                  src={src}
                  className="h-60 inline-block w-full object-cover rounded-md"
                />
                <div className="h-full flex flex-col items-start py-4">
                  <div className="mb-4 rounded-md bg-[#f2f7f7] px-2 py-1.5">
                    <p className="text-sm font-semibold text-[#6574f8]">
                      {tag}
                    </p>
                  </div>
                  <p className="flex-1 mb-4 text-xl font-bold md:text-2xl text-[#181a20]">
                    {title}
                  </p>
                  <div className="flex flex-col max-w-lg lg:flex-row items-start">
                    <img
                      src={src}
                      alt=""
                      className="mr-4 inline-block h-10 w-10 rounded-full object-cover"
                    />
                    <div className="flex flex-col items-start">
                      <h6 className="text-base font-bold text-[#181a20]">
                        {author}
                      </h6>
                      <div className="flex flex-col gap-y-4 items-start text-sm text-[#636262] lg:flex-row">
                        <p>Mar 20, 2024</p>
                        <p className="ml-2 mr-2 hidden lg:block">-</p>
                        <p>{readingTime}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </section>
    </div>
  );
}

const blogs = [
  {
    title: "How to manage your property in Africa",
    tag: "Property Management",
    src: "/assets/blog.svg",
    author: "Mungai Kihara",
    readingTime: "6 mins read",
  },
  {
    title: "How African Real is Best",
    tag: "Investing",
    src: "/assets/blog.svg",
    author: "Gatheru Wilson",
    readingTime: "6 mins read",
  },
  {
    title: "Get Best Offers",
    tag: "Offers",
    src: "/assets/blog.svg",
    author: "John Doe",
    readingTime: "6 mins read",
  },
];
