import { getBlogPosts } from "@/lib/blog";
import React from "react";
import CardCategory from "../../CardCategory";
import Link from "next/link";
import { Redis } from "@upstash/redis";
import { notFound } from "next/navigation";
import { Metadata } from "next";

const redis = Redis.fromEnv();
export const revalidate = 0;

export async function generateStaticParams() {
  let posts = await getBlogPosts();

  return posts.map((post) => ({
    category: post.metadata.category,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: { category: string };
}): Promise<Metadata> {
  let { category } = params;
  const capitalizedCategory =
    category.charAt(0).toUpperCase() + category.slice(1);

  let posts;
  try {
    posts = await getBlogPosts();
  } catch (error) {
    console.error("Error fetching blog posts:", error);
    return {
      title: "Category Not Found",
      description: "The requested blog category could not be found.",
    };
  }

  const categoryPosts = posts.filter(
    (post) => post.metadata.category === category
  );
  const postCount = categoryPosts.length;

  return {
    title: `${capitalizedCategory} Category Articles`,
    description: `Explore ${postCount} articles about ${capitalizedCategory} in African real estate. Get expert insights, market trends, and investment opportunities.`,
    keywords: [
      `${category} real estate`,
      "African property",
      "real estate investment",
      `${category} property trends`,
      "African real estate market",
    ],
    openGraph: {
      title: `${capitalizedCategory} Articles | African Real Estate`,
      description: `Discover ${postCount} articles on ${capitalizedCategory} in African real estate. Expert analysis and insights for property investors and enthusiasts.`,
      url: `https://www.african-realestate.com/blog/${category}`,
      type: "website",
      images: [
        {
          url: `https://www.african-realestate.com/blog-categories/${category}.jpg`,
          width: 1200,
          height: 630,
          alt: `${capitalizedCategory} Real Estate Category`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${capitalizedCategory} Articles | African Real Estate`,
      description: `Explore ${postCount} articles on ${capitalizedCategory} in African real estate. Stay informed about market trends and investment opportunities.`,
      images: [
        `https://www.african-realestate.com/blog-categories/${category}-twitter.jpg`,
      ],
    },
    alternates: {
      canonical: `https://www.african-realestate.com/blog/${category}`,
    },
  };
}

export default async function Page({
  params,
}: {
  params: { category: string };
}) {
  let allPosts;
  try {
    allPosts = await getBlogPosts();
  } catch (error) {
    console.error("Error fetching blog posts:", error);
    notFound();
  }

  let posts = allPosts.filter(
    (post) => post.metadata.category === params.category
  );

  let views: Record<string, number> = {};

  if (posts.length > 0) {
    try {
      const viewCounts = await redis.mget<number[]>(
        ...posts.map((p) => ["pageviews", "posts", p.slug].join(":"))
      );
      views = viewCounts.reduce((acc, v, i) => {
        acc[posts[i].slug] = v ?? 0;
        return acc;
      }, {} as Record<string, number>);
    } catch (error) {
      console.error("Error fetching view counts:", error);
      // If we can't fetch view counts, we'll just use an empty object
    }
  }

  if (!posts.length) {
    return (
      <section className="py-12">
        <div className="xl:container max-w-5xl m-auto px-6 text-gray-600 md:px-12 xl:px-16">
          <div className="lg:bg-gray-50 dark:lg:bg-darker lg:p-16 rounded-[4rem] space-y-6 md:flex flex-col md:gap-6 justify-center md:space-y-0 lg:items-center">
            <h1 className="text-3xl text-gray-900 md:text-4xl">
              No articles found on{" "}
              <span className="text-ken-primary capitalize">
                {params.category}{" "}
              </span>
              category
            </h1>
            <p className="my-8 text-gray-600">
              Try searching for a different category or explore some of our
              other blogs about real estate.
            </p>

            <Link
              href={`/blog`}
              className="relative flex h-12 w-full items-center justify-center px-8 before:absolute before:inset-0 before:rounded-full before:bg-sky-100 before:bg-gradient-to-b before:transition before:duration-300 hover:before:scale-105 active:duration-75 active:before:scale-95 sm:w-max"
            >
              <span className="relative text-base font-semibold text-sky-600 dark:text-white">
                More articles here
              </span>
            </Link>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-12">
      <div className="xl:container m-auto px-6 text-gray-600 md:px-12 xl:px-6">
        <div className="mb-12 space-y-2 text-center">
          <h2 className="text-3xl font-bold text-gray-800 md:text-4xl capitalize">
            {posts[0].metadata.category}
          </h2>
          <p className="lg:mx-auto lg:w-6/12 text-gray-600">
            Explore related topics, news and information on{" "}
            <span className="capitalize">{posts[0].metadata.category}</span>
          </p>
        </div>
        <section className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {posts
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
              >
                <CardCategory
                  title={post.metadata.title}
                  summary={post.metadata.summary}
                  date={post.metadata.publishedAt}
                  cover={post.metadata.cover}
                />
              </Link>
            ))}
        </section>
      </div>
    </section>
  );
}
