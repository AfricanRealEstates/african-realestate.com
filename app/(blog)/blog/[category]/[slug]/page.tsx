import BlogShare from "@/app/(blog)/BlogShare";
import PopularBlogs from "@/app/(blog)/PopularBlogs";
import RecommendedTopics from "@/app/(blog)/RecommendedTopics";
import ReportViews from "@/app/(blog)/ReportViews";
import { baseUrl } from "@/app/sitemap";
import { CustomMDX } from "@/components/blog/mdx";
import { getBlogPosts } from "@/lib/blog";
import { formatBlogDate } from "@/lib/utils";
import Link from "next/link";
import { notFound } from "next/navigation";
import React from "react";

export const dynamic = "force-dynamic";

export async function generateStaticParams() {
  let posts = getBlogPosts();

  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export function generateMetadata({
  params,
}: {
  params: { category: string; slug: string };
}) {
  let post = getBlogPosts().find((post) => post.slug === params.slug);
  if (!post) {
    return;
  }

  let {
    title,
    publishedAt: publishedTime,
    summary: description,
    image,
  } = post.metadata;

  let ogImage = image
    ? image
    : `${baseUrl}/og?title=${encodeURIComponent(title)}`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "article",
      publishedTime,
      url: `${baseUrl}/blog/${post?.metadata.category}/${post?.slug}}`,
      images: [{ url: ogImage }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
  };
}

export default function Page({
  params,
}: {
  params: { category: string; slug: string };
}) {
  let post = getBlogPosts().find((post) => post.slug === params.slug);

  if (!post) {
    notFound();
  }

  let relatedCategoryPosts = getBlogPosts().filter(
    (post) =>
      post.metadata.category === params.category && post.slug !== params.slug
  );

  const url = `https://modernsite1.vercel.app` || `http:localhost:3000`;

  return (
    <>
      <script
        type="application/ld+json"
        suppressContentEditableWarning
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BlogPosting",
            headline: post.metadata.title,
            datePublished: post.metadata.publishedAt,
            dateModified: post.metadata.publishedAt,
            description: post.metadata.summary,
            image: post.metadata.image
              ? `${baseUrl}${post.metadata.image}`
              : `/og?title=${encodeURIComponent(post.metadata.title)}`,
            url: `${baseUrl}/blog/${post.metadata.category}/${post.slug}`,
            author: {
              "@type": "Person",
              name: "African Real Estate",
            },
          }),
        }}
      />

      <ReportViews
        category={post.metadata.category}
        title={post.metadata.title}
        slug={post.slug}
      />

      <div className="py-16">
        <div className="xl:container m-auto px-6 text-gray-600 md:px-12 xl:px-16">
          <div className="lg:p-10 rounded-[4rem] space-y-6 md:flex flex-col md:gap-6 justify-center md:space-y-0 lg:items-center border-b border-gray-50">
            <h1 className="font-semibold text-2xl lg:text-4xl tracking-tighter mt-4">
              {post.metadata.title}
            </h1>

            <div className="flex justify-between gap-2 items-center mt-2 mb-4 text-sm  md:w-max">
              <p className="">
                Author:{" "}
                <span className="font-bold">{post.metadata.author}</span>
              </p>
              <div className="border-r border-ken-primary/10" />
              <p className="text-sm text-neutral-600">
                Published on:{" "}
                <span className="font-bold">
                  {formatBlogDate(post.metadata.publishedAt)}
                </span>
              </p>
            </div>
          </div>

          <section className="flex justify-between gap-4 px-4 mx-auto container mt-8">
            <div className="hidden mb-6 xl:block lg:w-60">
              <PopularBlogs />
            </div>

            <article className="prose w-full max-w-2xl mx-auto">
              <CustomMDX source={post.content} />
              <BlogShare
                url={`${url}/blog/${post.metadata.category}/${post.slug}`}
                title={`Read ${post.metadata.title}`}
              />
            </article>

            <aside className="hidden lg:block lg:w-60">
              <RecommendedTopics relatedCategoryPosts={relatedCategoryPosts} />
            </aside>
          </section>
        </div>
      </div>
    </>
  );
}
