import { getBlogPosts } from "@/lib/blog";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { Josefin_Sans } from "next/font/google";
import { formatBlogDate } from "@/lib/utils";
import { ArrowRight, CalendarDays, Eye } from "lucide-react";

const josefin = Josefin_Sans({
  subsets: ["latin"],
  weight: ["600"],
});

export default async function PropertyAdvice() {
  let latestPosts = await getBlogPosts();
  return (
    <section className={`py-12 leading-relaxed`}>
      <div className=" w-[95%] max-w-7xl m-auto px-6 text-gray-600 md:px-12 xl:px-6">
        <p className={`text-xl text-gray-900 md:mb-4 ${josefin.className}`}>
          Property Insights & Tips
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
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
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
                  className="h-60 w-full rounded-lg object-cover object-top transition-all duration-500 group-hover:rounded-xl"
                />
                <div className="py-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <CalendarDays className="text-rose-400" />
                      <span className="text-sm text-gray-700">
                        {formatBlogDate(post.metadata.publishedAt)}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Eye className="text-rose-400" />
                      <span className="text-sm text-gray-700">
                        {Intl.NumberFormat("en-US", {
                          notation: "compact",
                        }).format(post.views)}
                      </span>
                    </div>
                  </div>
                  <h1 className="mt-6 font-bold hover:underline cursor-pointer mb-2 text-lg text-gray-700 line-clamp-2">
                    {post.metadata.title}
                  </h1>
                  <p className="text-gray-500 text-base line-clamp-2">
                    {post.metadata.summary}
                  </p>
                  <div className="mt-4 flex items-center space-x-2 hover:text-rose-400 cursor-pointer">
                    <span className="font-semibold">Read more</span>
                    <ArrowRight className="size-4" />
                  </div>
                </div>
              </Link>
            ))}
        </div>
      </div>
    </section>
  );
}
