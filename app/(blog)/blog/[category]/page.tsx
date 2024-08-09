import { getBlogPosts } from "@/lib/blog";
import React from "react";
import CardCategory from "../../CardCategory";
import Link from "next/link";
import { notFound } from "next/navigation";

export async function generateStaticParams() {
  let posts = getBlogPosts();

  return posts.map((post) => ({
    category: post.metadata.category,
  }));
}

export function generateMetadata({ params }: { params: { category: string } }) {
  let { category } = params;

  return {
    title: category.toLocaleUpperCase(),
    description: `All articles reagarding ${category}`,
  };
}

export default function Page({ params }: { params: { category: string } }) {
  let posts = getBlogPosts().filter(
    (post) => post.metadata.category === params.category
  );

  const notfoundCategory = params.category as String;

  if (!posts.length) {
    return (
      <section className="py-12">
        <div className="xl:container max-w-5xl m-auto px-6 text-gray-600 md:px-12 xl:px-16">
          <div className="lg:bg-gray-50 dark:lg:bg-darker lg:p-16 rounded-[4rem] space-y-6 md:flex flex-col md:gap-6 justify-center md:space-y-0 lg:items-center">
            <h2 className="text-3xl  text-gray-900 md:text-4xl">
              No articles found on{" "}
              <span className="text-ken-primary capitalize">
                {params.category}{" "}
              </span>
              category
            </h2>
            <p className="my-8 text-gray-600">
              Try searching for a different category or explore some of other
              blogs with have about real estate.
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
