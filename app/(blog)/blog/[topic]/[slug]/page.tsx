import PopularBlogs from "@/app/(blog)/PopularBlogs";
import RecommendedTopics from "@/app/(blog)/RecommendedTopics";
import { baseUrl } from "@/app/sitemap";
import { notFound } from "next/navigation";
import { Redis } from "@upstash/redis";
import { prisma } from "@/lib/prisma";
import type { Metadata } from "next";
import { format } from "date-fns";
import LikeButton from "./LikeButton";
import ShareButton from "./ShareButton";
import { incrementViewCount } from "@/actions/blog";
import { auth } from "@/auth";
import Link from "next/link";

export const dynamic = "force-dynamic";

const redis = Redis.fromEnv();
export const revalidate = 0;

export async function generateStaticParams() {
  const posts = await prisma.post.findMany({
    where: { published: true },
    select: { slug: true, topics: true },
  });

  return posts.flatMap((post) =>
    post.topics.map((topic) => ({
      topic,
      slug: post.slug,
    }))
  );
}

export async function generateMetadata({
  params,
}: {
  params: { topic: string; slug: string };
}): Promise<Metadata> {
  const post = await prisma.post.findUnique({
    where: { slug: params.slug },
    include: { author: true },
  });

  if (!post) {
    return {};
  }

  const {
    title,
    createdAt: publishedTime,
    content,
    coverPhoto,
    author,
    topics,
    metaDescription,
  } = post;

  // Create a clean description without HTML tags
  const plainTextContent = content.replace(/<[^>]*>/g, "");
  const description =
    metaDescription ||
    plainTextContent.substring(0, 200) +
      (plainTextContent.length > 200 ? "..." : "");

  const ogImage = coverPhoto
    ? `${baseUrl}${coverPhoto}`
    : `${baseUrl}/og?title=${encodeURIComponent(title)}`;

  const url = `${baseUrl}/blog/${params.topic}/${post.slug}`;

  return {
    title,
    description,
    authors: [{ name: author.name! }],
    keywords: topics,
    openGraph: {
      title,
      description,
      type: "article",
      publishedTime: publishedTime.toISOString(),
      url,
      images: [
        {
          url: ogImage,
          alt: title,
          width: 1200,
          height: 630,
        },
      ],
      siteName: "African Real Estate Blog",
      locale: "en_US",
      authors: [author.name!],
      tags: topics,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
      creator: "@AfricanRealEstate",
      site: "@AfricanRealEstate",
    },
    alternates: {
      canonical: url,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
  };
}

export default async function Page({
  params,
}: {
  params: { topic: string; slug: string };
}) {
  const post = await prisma.post.findUnique({
    where: { slug: params.slug, published: true },
    include: { author: true, likes: true },
  });

  if (!post) {
    notFound();
  }

  const relatedTopicPosts = await prisma.post.findMany({
    where: {
      published: true,
      topics: { has: params.topic },
      NOT: { id: post.id },
    },
    take: 3,
  });

  const url = `${baseUrl}/blog/${params.topic}/${post.slug}`;

  const session = await auth();

  // Increment view count
  await incrementViewCount(post.id);

  const isLiked = session
    ? post.likes.some((like: any) => like.id === session.user.id)
    : false;

  // Create a clean description without HTML tags
  const plainTextContent = post.content.replace(/<[^>]*>/g, "");
  const description =
    plainTextContent.substring(0, 200) +
    (plainTextContent.length > 200 ? "..." : "");

  return (
    <>
      <script
        type="application/ld+json"
        suppressContentEditableWarning
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BlogPosting",
            headline: post.title,
            datePublished: post.createdAt.toISOString(),
            dateModified: post.updatedAt.toISOString(),
            description: post.metaDescription || description,
            image: post.coverPhoto
              ? `${baseUrl}${post.coverPhoto}`
              : `${baseUrl}/og?title=${encodeURIComponent(post.title)}`,
            url: url,
            author: {
              "@type": "Person",
              name: post.author.name,
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
            keywords: post.topics.join(", "),
            articleSection: params.topic,
            wordCount: plainTextContent.split(/\s+/).length,
          }),
        }}
      />

      {/* <ReportViews topic={params.topic} title={post.title} slug={post.slug} /> */}

      <div className="">
        <div className="xl:container m-aut0 text-gray-600 md:px-12 xl:px-16">
          <div className="lg:p-10 px-4 rounded-[4rem] space-y-6 md:flex flex-col md:gap-6 justify-center md:space-y-0 lg:items-center border-b border-gray-50">
            <h1 className="font-semibold text-xl md:text-2xl lg:text-4xl tracking-tighter">
              {post.title
                .split(" ") // Split into words
                .map((word) => word.charAt(0).toUpperCase() + word.slice(1)) // Capitalize each word
                .join(" ")}{" "}
              {/* Join words back together */}
            </h1>

            <div className="flex justify-between flex-col lg:flex-row gap-2 lg:items-center mt-2 mb-4 text-sm md:w-max">
              <p className="">
                Author:{" "}
                <Link
                  href={`/blog/author/${post.authorId}`}
                  className="sm:text-sm font-bold hover:underline cappitalize"
                >
                  {post.author.name}
                </Link>
              </p>
              <div className="border-r border-ken-primary/10" />
              <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                <p className="text-sm text-neutral-600">
                  Published on:{" "}
                  <span className="font-bold">
                    {format(post.createdAt, "MMMM dd, yyyy")}
                  </span>
                </p>

                {/* Show update date if the post has been modified */}
                {post.updatedAt &&
                  post.updatedAt.getTime() >
                    post.createdAt.getTime() + 60000 && (
                    <>
                      <div className="hidden sm:block border-r border-ken-primary/10 h-4" />
                      <p className="text-sm text-neutral-600">
                        Updated on:{" "}
                        <span className="font-bold">
                          {format(post.updatedAt, "MMMM dd, yyyy")}
                        </span>
                      </p>
                    </>
                  )}
              </div>
            </div>
          </div>

          <section className="flex justify-between gap-4 px-4 mx-auto container mt-8">
            <div className="hidden mb-6 xl:block lg:w-60">
              <PopularBlogs />
            </div>

            <article
              className="prose w-full max-w-2xl mx-auto"
              itemScope
              itemType="https://schema.org/BlogPosting"
            >
              {/* Hidden metadata for structured data */}
              <meta itemProp="headline" content={post.title} />
              <meta itemProp="author" content={post.author.name!} />
              <meta
                itemProp="datePublished"
                content={post.createdAt.toISOString()}
              />
              <meta
                itemProp="dateModified"
                content={post.updatedAt.toISOString()}
              />

              {/* Cover Photo */}
              {post.coverPhoto && (
                <img
                  src={post.coverPhoto || "/placeholder.svg"}
                  alt={post.title}
                  className="w-full h-[300px] lg:h-[400px] object-cover rounded-lg mx-auto border p-1 mb-6"
                  itemProp="image"
                />
              )}

              <div
                className="prose max-w-none mb-8 mt-4"
                itemProp="articleBody"
                dangerouslySetInnerHTML={{
                  __html: post.content.replace(
                    /<img /g,
                    '<img class="w-full max-w-full h-[300px] lg:h-[500px] object-cover rounded-lg mx-auto border p-1" '
                  ),
                }}
              />

              <div className="flex items-center space-x-4 mb-4">
                <LikeButton
                  postId={post.id}
                  initialLikeCount={post.likes.length}
                  initialIsLiked={isLiked}
                />
                <ShareButton
                  postId={post.id}
                  initialShareCount={post.shareCount}
                  title={post.title}
                  description={
                    post.metaDescription ||
                    description.substring(0, 150) + "..."
                  }
                  coverPhoto={post.coverPhoto || null}
                />
                <span>{post.viewCount} views</span>
              </div>
            </article>

            <aside className="hidden lg:block lg:w-60">
              <RecommendedTopics />
            </aside>
          </section>
        </div>
      </div>
    </>
  );
}
