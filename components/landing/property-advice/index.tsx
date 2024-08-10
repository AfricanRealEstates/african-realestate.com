import { getBlogPosts } from "@/lib/blog";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { Josefin_Sans } from "next/font/google";
import { formatBlogDate } from "@/lib/utils";
const josefin = Josefin_Sans({
  subsets: ["latin"],
  weight: ["600"],
});

export default function PropertyAdvice() {
  let latestPosts = getBlogPosts();
  return (
    <section className={`py-12 leading-relaxed`}>
      <div className=" w-[95%] max-w-7xl m-auto px-6 text-gray-600 md:px-12 xl:px-6">
        <p className={`text-xl text-gray-900 md:mb-4 ${josefin.className}`}>
          Property guides
          <Link
            href="/blog"
            className="inline-flex font-light items-center ml-2 text-ken-primary md:ml-2 hover:underline group"
          >
            View all
            <svg
              className="size-3 ml-1.5 text-blue-600 dark:text-blue-500  transition-transform duration-300  group-hover:translate-x-[2px]"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 14 10"
            >
              <path
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M1 5h12m0 0L9 1m4 4L9 9"
              ></path>
            </svg>
          </Link>
        </p>
        <div className="grid gap-12 md:gap-6 md:grid-cols-3 lg:gap-12">
          {latestPosts
            .sort((a, b) => {
              if (
                new Date(a.metadata.publishedAt) >
                new Date(b.metadata.publishedAt)
              ) {
                return -1;
              }
              return 1;
            })
            .slice(0, 3)
            .map((post) => (
              <Link
                href={`/blog/${post.metadata.category}/${post.slug}`}
                key={post.slug}
                className="group space-y-2 flex flex-col"
              >
                <Image
                  height={667}
                  width={1000}
                  alt={post.metadata.title}
                  src={post.metadata.cover}
                  className="h-60 w-full rounded-3xl object-cover object-top transition-all duration-500 group-hover:rounded-xl"
                />
                <h3
                  className={`text-xl font-semibold text-gray-800 line-clamp-2 tracking-wide group-hover:text-ken-primary transition-all ${josefin.className}`}
                >
                  {post.metadata.title}
                </h3>
                <div className="flex gap-1 items-center">
                  <span className="w-max block text-sm font-light text-gray-500 sm:mt-0">
                    Published {formatBlogDate(post.metadata.publishedAt)}
                  </span>
                </div>
                <p className="text-gray-600 text-[15px]/6 line-clamp-2">
                  {post.metadata.summary}
                </p>
              </Link>
            ))}
        </div>
      </div>
    </section>
  );
}
