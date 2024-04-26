import { Raleway } from "next/font/google";
import Link from "next/link";
import React from "react";
import prisma from "@/lib/prisma";
import dayjs from "dayjs";
import { getSEOTags } from "@/lib/seo";
import { loadArticles } from "@/lib/mdx";
import { formatDate } from "@/lib/formatter";
const raleway = Raleway({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-nunitosans",
});

export const metadata = getSEOTags({
  title: "Blog | African Real Estate",
  canonicalUrlRelative: "/blog",
});
export default async function Blog() {
  // const posts = await prisma.post.findMany({
  //   orderBy: { createdAt: "desc" },
  // });
  let posts = await loadArticles();
  return (
    <div className={`text-[#181a20] ${raleway.className}`}>
      <section className="mx-auto w-[95%] max-w-7xl px-5 py-32 md:px-10 md:py-36 lg:py-40">
        <h2 className="text-center text-3xl font-bold md:text-5xl lg:text-left">
          Latest and updated news
        </h2>
        <p className="mb-8 mt-4 text-center text-sm text-[#636363] sm:text-base md:mb-12 lg:mb-16 lg:text-left">
          Stay up-to-date with the latest updates about our company, new
          products, and offers.
        </p>
        <div className="grid justify-items-stretch md:mb-12 md:grid-cols-3 md:gap-4 lg:mb-16 lg:gap-6">
          {posts.map((post) => {
            const firstPost = posts[0];
            const { title, href, date, coverImage, tags, author } = firstPost;
            return (
              <Link
                key={href}
                href={`${href}`}
                className="relative flex h-[500px] flex-col gap-4 rounded-md px-4 py-8 [grid-area:1/1/2/2] md:p-0 md:[grid-area:1/1/2/4]"
              >
                <div className="absolute bottom-12 left-8 z-20 w-56 max-w-[464px] flex-col items-start rounded-md bg-white p-6 sm:w-full md:bottom-[10px] md:left-[10px]">
                  <div className="flex flex-col lg:items-center md:flex-row gap-x-1">
                    {tags.map((tag) => {
                      return (
                        <div
                          key={tag}
                          className="mb-4 rounded-md px-1 py-0.5 bg-[#f2f2f7] max-w-fit"
                        >
                          <p className="uppercase font-medium text-xs text-[#6574f8]">
                            {tag}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                  <time className="text-xs mb-4" dateTime={date}>
                    {formatDate(date)}
                  </time>
                  <p className="mb-4 mt-2 text-xl font-bold md:text-2xl text-[#181a20] hover:text-[#6574f8] transition-colors ease-linear">
                    {title}
                  </p>
                  <div className="flex flex-col text-sm text-[#636262] lg:flex-row">
                    <p className="font-medium">{author.name}</p>
                    <p className="mx-2 hidden lg:block">-</p>
                    <p>{author.role}</p>
                  </div>
                </div>
                <img
                  src={"/assets/blog.svg"}
                  className="inline-block h-full w-full object-cover rounded-lg"
                />
              </Link>
            );
          })}

          {posts.slice(1).map((blog) => {
            const { title, href, date, coverImage, tags, author } = blog;
            return (
              <Link
                key={href}
                href={`${href}`}
                className="flex flex-col gap-4 rounded-md px-4 py-8 mt-8 md:p-2 no-underline border border-solid border-neutral-50"
              >
                <img
                  src={"/assets/blog.svg"}
                  className="h-60 inline-block w-full object-cover rounded-md"
                />
                <div className="h-full flex flex-col items-start py-4">
                  <div className="flex items-center gap-2">
                    {tags.map((tag) => {
                      return (
                        <div
                          key={tag}
                          className="mb-4 rounded-md bg-[#f2f7f7] px-2 py-1.5"
                        >
                          <p className="text-xs font-medium capitalize text-[#6574f8]">
                            {tag}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                  <p className="flex-1 mb-4 text-xl font-bold md:text-2xl text-[#181a20] hover:text-[#6574f8] transition-colors ease-linear">
                    {title}
                  </p>
                  <div className="flex flex-col max-w-lg lg:flex-row items-start">
                    <img
                      src={"/assets/blog.svg"}
                      alt=""
                      className="mr-4 inline-block h-10 w-10 rounded-full object-cover"
                    />
                    <div className="flex flex-col items-start">
                      <h6 className="text-sm text-[#181a20]">{author.name}</h6>
                      <div className="flex flex-col gap-y-2 items-start text-sm text-[#636262]">
                        <p>{author.role}</p>
                        <time className="text-xs" dateTime={date}>
                          {formatDate(date)}
                        </time>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {posts.length === 0 && (
          <p className="m-auto text-center">No posts found.</p>
        )}
      </section>
    </div>
  );
}
