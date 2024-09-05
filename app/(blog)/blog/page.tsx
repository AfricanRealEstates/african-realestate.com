import { Metadata } from "next";
import React from "react";
import LatestPosts from "../LatestPosts";
import { getBlogPosts } from "@/lib/blog";
import { Raleway } from "next/font/google";
import { POSTS } from "../constants";
import Link from "next/link";
import { fetcher, fetchUrl } from "@/lib/utils";
import useSWR from "swr";
import PopularBlogs from "../PopularBlogs";
import RecommendedTopics from "../RecommendedTopics";
import { Redis } from "@upstash/redis";

const redis = Redis.fromEnv();
export const revalidate = 0;

const raleway = Raleway({
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Blog",
};

export default async function Blog() {
  let allPosts = getBlogPosts();
  const views = (
    await redis.mget<number[]>(
      ...allPosts.map((p) => ["pageviews", "posts", p.slug].join(":"))
    )
  ).reduce((acc, v, i) => {
    acc[allPosts[i].slug] = v ?? 0;
    return acc;
  }, {} as Record<string, number>);

  if (views.length < 1) {
    return null;
  }
  return (
    <main className={`pt-6 pb-8 bg-white lg:pb-16 ${raleway.className}`}>
      <div className="mb-12 space-y-4 text-center container m-auto px-6 text-gray-600 md:px-12 xl:px-6">
        <h2 className="text-3xl font-bold text-gray-800 md:text-4xl">
          Real Estate News
        </h2>
        <p className="text-gray-600 lg:mx-auto lg:w-6/12">
          Discover more topics about real estate news, property guides and
          investing opportunities.
        </p>
      </div>
      <section className="flex justify-between px-4 mx-auto container">
        <div className="hidden mb-6 xl:block lg:w-60">
          <PopularBlogs />
        </div>
        <div className="w-full max-w-[800px] mx-auto">
          <LatestPosts views={views} />
        </div>
        <aside className="hidden lg:block lg:w-60">
          <RecommendedTopics />
        </aside>
      </section>
    </main>
  );
}
