import { formatDate } from "@/lib/formatter";
import { loadArticles } from "@/lib/mdx";
import Image from "next/image";
import Link from "next/link";
import React from "react";

export default async function LatestNews() {
  let posts = await loadArticles();
  return (
    <section className="max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14 mx-auto">
      <div className="max-w-2xl mb-10">
        <h2 className="text-2xl font-bold md:text-4xl md:leading-tight">
          Latest News
        </h2>
        <p className="mt-2 text-gray-600 ">
          Helpful African Real Estate Guides
        </p>
      </div>
      <div className="grid lg:grid-cols-2 gap-6">
        {posts.slice(0, 3).map((post) => {
          const { title, href, date, coverImage, tags, description, author } =
            post;
          return (
            <Link
              key={href}
              href={href}
              className="group relative block rounded-xl"
            >
              <div className="flex-shrink-0 relative rounded-xl overflow-hidden w-full h-[350px] before:absolute before:inset-x-0 before:z-[1] before:size-full before:bg-gradient-to-t before:from-gray-900/70">
                <img
                  className="size-full absolute top-0 start-0 object-cover"
                  src="/assets/banner-blog.jpg"
                />
              </div>

              <div className="absolute top-0 inset-x-0 z-10">
                <div className="p-4 flex flex-col h-full sm:p-6">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <Image
                        src={`/assets/banner-blog.jpg`}
                        width={50}
                        height={50}
                        alt="Avatar"
                        className="size-[46px] border-2 border-white rounded-full"
                      />
                    </div>
                    <div className="ms-2.5 sm:ms-4">
                      <h4 className="font-semibold text-white">
                        {author.name}
                      </h4>
                      <time className="text-xs text-white/80" dateTime={date}>
                        {formatDate(date)}
                      </time>
                    </div>
                  </div>
                </div>
              </div>

              <div className="absolute bottom-0 inset-x-0 z-10">
                <div className="flex flex-col h-full p-4 sm:p-6">
                  <h3 className="text-lg sm:text-3xl font-semibold text-white group-hover:text-white/80">
                    {title}
                  </h3>
                  <p className="mt-2 text-white/80 whitespace-nowrap overflow-hidden text-ellipsis">
                    {description}
                  </p>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
