import { getBlogPosts } from "@/lib/blog";
import { formatBlogDate } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import React from "react";

export default function LatestPosts() {
  let latestPosts = getBlogPosts();
  return (
    <>
      {/* <div className="flex items-center justify-between py-4">
        <span className="px-1 w-full bg-neutral-50 text-ken-primary font-medium border border-gray-200">
          {latestPosts.length} posts in total
        </span>
      </div> */}

      <section className="space-y-4 grid grid-cols-1 px-4 lg:px-0">
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
          .map((post) => (
            <Link
              href={`/blog/${post.metadata.category}/${post.slug}`}
              key={post.slug}
              className="group relative -mx-4 sm:-mx-8 p-6 sm:p-8  rounded-xl bg-white border border-gray-100 hover:border-gray-100 shadow-2xl shadow-transparent hover:shadow-gray-600/10 sm:gap-8 sm:flex transition duration-300 hover:z-10"
            >
              <div className="sm:w-[60%] rounded-3xl overflow-hidden transition-all duration-500 group-hover:rounded-xl">
                <Image
                  width={800}
                  height={667}
                  alt={post.metadata.title}
                  src={post.metadata.cover}
                  className="h-56 sm:h-full w-full object-cover object-top transition duration-500 group-hover:scale-105"
                />
              </div>
              <div className="sm:p-2 sm:pl-0 sm:w-4/6">
                <span className="mt-4 mb-2 inline-block text-[14px] font-medium text-gray-400 sm:mt-0">
                  {" "}
                  Published {formatBlogDate(post.metadata.publishedAt)}
                </span>
                <h3 className="text-2xl font-semibold text-gray-800">
                  {post.metadata.title}
                </h3>
                <p className="my-6 text-gray-600 line-clamp-3">
                  {post.metadata.summary}
                </p>

                <div className="flex gap-4">
                  <Link
                    href={`/blog/${post.metadata.category}`}
                    className="bg-blue-100 text-blue-800 text-sm font-medium mr-2 px-2.5 py-0.5 rounded hover:bg-blue-200 mb-2 capitalize"
                  >
                    {post.metadata.category}
                  </Link>
                </div>
              </div>
            </Link>
          ))}
      </section>
    </>
  );
}
