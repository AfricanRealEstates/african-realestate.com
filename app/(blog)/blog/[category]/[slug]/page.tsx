import PopularBlogs from "@/app/(blog)/PopularBlogs";
import RecommendedTopics from "@/app/(blog)/RecommendedTopics";
import ReportViews from "@/app/(blog)/ReportViews";
import { baseUrl } from "@/app/sitemap";
import { CustomMDX } from "@/components/blog/mdx";
import { getBlogPosts, formatDate, BlogPost } from "@/lib/blog";
import { notFound } from "next/navigation";
import React from "react";
import { Redis } from "@upstash/redis";
import { ReportView } from "./view";
import { Eye } from "lucide-react";
import { getCurrentUser } from "@/lib/session";
import prisma from "@/lib/prisma";
import { Metadata } from "next";
import BlogShare from "./SocialShare";
import LikeButton from "./LikeButton";
import { User } from "@prisma/client";

export const dynamic = "force-dynamic";

const redis = Redis.fromEnv();
export const revalidate = 0;

export async function generateStaticParams() {
  const posts = await getBlogPosts();

  return posts.map((post) => ({
    category: post.metadata.category,
    slug: post.slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: { category: string; slug: string };
}): Promise<Metadata> {
  const posts = await getBlogPosts();
  const post = posts.find((post) => post.slug === params.slug);
  if (!post) {
    return {};
  }

  const {
    title,
    publishedAt: publishedTime,
    summary: description,
    image,
    author,
    category,
  } = post.metadata;

  const ogImage = image
    ? `${baseUrl}${image}`
    : `${baseUrl}/og?title=${encodeURIComponent(title)}`;

  const url = `${baseUrl}/blog/${category}/${post.slug}`;

  return {
    title,
    description,
    authors: [{ name: author }],
    openGraph: {
      title,
      description,
      type: "article",
      publishedTime,
      url,
      images: [{ url: ogImage, alt: title }],
      siteName: "African Real Estate Blog",
      locale: "en_US",
      authors: [author],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
      creator: "@AfricanRealEstate",
    },
    alternates: {
      canonical: url,
    },
  };
}

export default async function Page({
  params,
}: {
  params: { category: string; slug: string };
}) {
  const posts = await getBlogPosts();
  const post = posts.find((post) => post.slug === params.slug);

  if (!post) {
    notFound();
  }

  const relatedCategoryPosts = posts.filter(
    (p) => p.metadata.category === params.category && p.slug !== params.slug
  );

  const user = await getCurrentUser();

  const url = `${baseUrl}/blog/${post.metadata.category}/${post.slug}`;

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
              : `${baseUrl}/og?title=${encodeURIComponent(
                  post.metadata.title
                )}`,
            url: url,
            author: {
              "@type": "Person",
              name: post.metadata.author,
            },
            publisher: {
              "@type": "Organization",
              name: "African Real Estate",
              logo: {
                "@type": "ImageObject",
                url: `${baseUrl}/logo.png`,
              },
            },
            mainEntityOfPage: {
              "@type": "WebPage",
              "@id": url,
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

            <div className="flex justify-between gap-2 items-center mt-2 mb-4 text-sm md:w-max">
              <p className="">
                Author:{" "}
                <span className="font-bold">{post.metadata.author}</span>
              </p>
              <div className="border-r border-ken-primary/10" />
              <p className="text-sm text-neutral-600">
                Published on:{" "}
                <span className="font-bold">
                  {formatDate(post.metadata.publishedAt, true)}
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
              <div className="flex items-center justify-between mt-8">
                <ReportView slug={post.slug} />
                <div className="flex items-center gap-4 justify-between w-full">
                  <span className="flex items-center gap-1 text-sm text-gray-500">
                    <Eye className="w-4 h-4" />
                    {Intl.NumberFormat("en-US", { notation: "compact" }).format(
                      post.views
                    )}
                  </span>
                  <LikeButton
                    slug={post.slug}
                    initialLikes={post.likes}
                    user={user as User}
                  />
                  <BlogShare
                    url={url}
                    title={post.metadata.title}
                    summary={post.metadata.summary}
                  />
                </div>
              </div>
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
