import PopularBlogs from "@/app/(blog)/PopularBlogs";
import RecommendedTopics from "@/app/(blog)/RecommendedTopics";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import type { Metadata } from "next";
import { format } from "date-fns";
import LikeButton from "./LikeButton";
import ShareButton from "./ShareButton";
import { incrementViewCount } from "@/actions/blog";
import { auth } from "@/auth";
import Link from "next/link";
import BlogViewTracker from "@/app/(blog)/BlogViewTracker";

export const dynamic = "force-dynamic";

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

  // Ensure absolute URL for coverPhoto
  const ogImage = coverPhoto
    ? coverPhoto.startsWith("http")
      ? coverPhoto
      : `https://www.african-realestate.com${coverPhoto}`
    : `https://www.african-realestate.com/og?title=${encodeURIComponent(title)}`;

  const url = `https://www.african-realestate.com/blog/${params.topic}/${post.slug}`;

  // Determine image type for proper content type
  const imageType = coverPhoto?.endsWith(".png")
    ? "image/png"
    : coverPhoto?.endsWith(".gif")
      ? "image/gif"
      : "image/jpeg";

  return {
    title,
    description,
    authors: [
      {
        name: author.name!,
        url: `https://www.african-realestate.com/blog/author/${post.authorId}`,
      },
    ],
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
          type: imageType,
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
    other: {
      "article:published_time": publishedTime.toISOString(),
      "article:author": author.name!,
      "article:publisher": "African Real Estate",
      "og:article:tag": topics.join(","),
      "og:site_name": "African Real Estate",
      "og:locale": "en_US",
      "og:image:width": "1200",
      "og:image:height": "630",
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

  // Fetch related posts based on topics
  const relatedPosts = await prisma.post.findMany({
    where: {
      published: true,
      topics: { hasSome: post.topics },
      NOT: { id: post.id },
    },
    include: {
      author: {
        select: {
          name: true,
          image: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
    take: 3,
  });

  const url = `https://www.african-realestate.com/blog/${params.topic}/${post.slug}`;

  const session = await auth();

  // Get total number of published blogs
  const totalPublishedBlogs = await prisma.post.count({
    where: { published: true },
  });

  // Get position of current blog (by creation date)
  const blogPosition = await prisma.post.count({
    where: {
      published: true,
      createdAt: { lte: post.createdAt },
    },
  });

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
            name: post.title,
            datePublished: post.createdAt.toISOString(),
            dateModified:
              post.updatedAt.getTime() > post.createdAt.getTime() + 60000
                ? post.updatedAt.toISOString()
                : post.createdAt.toISOString(),
            description: post.metaDescription || description,
            image: post.coverPhoto
              ? post.coverPhoto.startsWith("http")
                ? post.coverPhoto
                : `https://www.african-realestate.com${post.coverPhoto}`
              : `https://www.african-realestate.com/og?title=${encodeURIComponent(post.title)}`,
            url: url,
            author: {
              "@type": "Person",
              name: post.author.name,
              url: `https://www.african-realestate.com/blog/author/${post.authorId}`,
            },
            publisher: {
              "@type": "Organization",
              name: "African Real Estate",
              logo: {
                "@type": "ImageObject",
                url: `https://www.african-realestate.com/logo.png`,
                width: 600,
                height: 60,
              },
            },
            mainEntityOfPage: {
              "@type": "WebPage",
              "@id": url,
            },
            keywords: post.topics.join(", "),
            articleSection: params.topic,
            wordCount: plainTextContent.split(/\s+/).length,
            inLanguage: "en-US",
            potentialAction: {
              "@type": "ReadAction",
              target: [url],
            },
            isAccessibleForFree: "True",
            discussionUrl: url + "#comments",
          }),
        }}
      />

      {post.topics.map((topic) => (
        <meta
          key={`article:tag:${topic}`}
          property="article:tag"
          content={topic}
        />
      ))}

      <BlogViewTracker
        postId={post.id}
        slug={params.slug}
        topic={params.topic}
      />

      {/* <ReportViews topic={params.topic} title={post.title} slug={post.slug} /> */}

      <div className="">
        <div className="xl:container m-aut0 text-gray-600 md:px-12 xl:px-16">
          <div className="lg:p-10 px-4 rounded-[4rem] space-y-6 md:flex flex-col md:gap-6 justify-center md:space-y-0 lg:items-center border-b border-gray-50">
            <h1 className="font-semibold text-xl md:text-2xl lg:text-4xl tracking-tighter mt-9">
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
                {/* {post.updatedAt &&
post.updatedAt.getTime() > post.createdAt.getTime() + 60000 ? (
<p className="text-sm text-neutral-600">
Updated on:{" "}
<span className="font-bold">
{format(post.updatedAt, "MMMM dd, yyyy")}
</span>
</p>
) : (
)} */}
                <p className="text-sm text-neutral-600">
                  Published on:{" "}
                  <span className="font-bold">
                    {format(post.createdAt, "MMMM dd, yyyy")}
                  </span>
                </p>
              </div>
            </div>
          </div>

          <section className="flex flex-col lg:flex-row justify-between gap-4 px-4 mx-auto container mt-8">
            <div className="hidden mb-6 xl:block lg:w-60">
              <PopularBlogs />
            </div>

            <article
              className="prose w-full max-w-2xl mx-auto order-1"
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
                content={
                  post.updatedAt.getTime() > post.createdAt.getTime() + 60000
                    ? post.updatedAt.toISOString()
                    : post.createdAt.toISOString()
                }
              />

              {/* Cover Photo */}
              {post.coverPhoto && (
                <img
                  src={post.coverPhoto || "/placeholder.svg"}
                  alt={`Cover image for article: ${post.title}`}
                  className="w-full h-[300px] lg:h-[400px] object-cover rounded-lg mx-auto border p-1 mb-6"
                  itemProp="image"
                  loading="eager"
                  decoding="async"
                  width="1200"
                  height="630"
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
              <div className="flex items-center justify-between">
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
                <span className="ml-4 px-2 py-1 rounded-md text-sm font-medium">
                  {blogPosition.toString().padStart(4, "0")}

                  {/* /{totalPublishedBlogs.toString().padStart(4, "0")} */}
                </span>
              </div>
            </article>

            {/* Mobile Topics and Related Posts - Only visible on mobile/tablet */}
            <div className="lg:hidden w-full mt-8 mb-12 order-2">
              <div className="mb-8">
                <h3 className="text-xl font-bold mb-4">Topics</h3>
                <div className="flex flex-wrap gap-2">
                  {post.topics.map((topic) => (
                    <Link
                      key={topic}
                      href={`/blog/${topic}`}
                      className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-full text-sm font-medium transition-colors"
                    >
                      {topic.charAt(0).toUpperCase() + topic.slice(1)}
                    </Link>
                  ))}
                </div>
              </div>

              {relatedPosts.length > 0 && (
                <div>
                  <h3 className="text-xl font-bold mb-4">Related Articles</h3>
                  <div className="grid grid-cols-1 gap-4">
                    {relatedPosts.slice(0, 3).map((relatedPost) => (
                      <Link
                        key={relatedPost.id}
                        href={`/blog/${relatedPost.topics[0]}/${relatedPost.slug}`}
                        className="group flex items-start gap-3 border-b pb-4"
                      >
                        <div className="w-24 h-24 flex-shrink-0 overflow-hidden rounded-md">
                          <img
                            src={relatedPost.coverPhoto || "/placeholder.svg"}
                            alt={relatedPost.title}
                            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                          />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium line-clamp-2 group-hover:text-blue-600 transition-colors">
                            {relatedPost.title}
                          </h4>
                          <div className="mt-1 flex items-center text-xs text-gray-500">
                            <span>{relatedPost.author.name}</span>
                            <span className="mx-1.5">•</span>
                            <span>
                              {format(
                                new Date(relatedPost.createdAt),
                                "MMM d, yyyy"
                              )}
                            </span>
                          </div>
                          <span className="inline-block mt-1.5 bg-gray-100 text-gray-800 text-xs px-2 py-0.5 rounded-full">
                            {relatedPost.topics[0].charAt(0).toUpperCase() +
                              relatedPost.topics[0].slice(1)}
                          </span>
                        </div>
                      </Link>
                    ))}
                  </div>

                  <Link
                    href="/blog"
                    className="mt-4 inline-block text-blue-600 hover:text-blue-800 font-medium text-sm"
                  >
                    View all articles →
                  </Link>
                </div>
              )}

              {/* Mobile Popular Blogs Section */}
              <div className="mt-8">
                <h3 className="text-xl font-bold mb-4">Popular Articles</h3>
                <div className="lg:hidden">
                  <PopularBlogs />
                </div>
              </div>
            </div>

            <aside className="hidden lg:block lg:w-60 sticky top-36 order-3">
              <RecommendedTopics />

              {/* Related Posts Section */}
              {relatedPosts.length > 0 && (
                <section className="">
                  <div className="">
                    <h2 className="text-2xl font-bold mb-6 text-gray-800">
                      Related Articles
                    </h2>
                    <div className="grid grid-cols-1 gap-6">
                      {relatedPosts.slice(0, 5).map((relatedPost) => (
                        <Link
                          key={relatedPost.id}
                          href={`/blog/${relatedPost.topics[0]}/${relatedPost.slug}`}
                          className="group"
                        >
                          <div className="border rounded-lg overflow-hidden transition-all duration-300 hover:shadow-md h-full flex flex-col">
                            <div className="relative h-48 overflow-hidden">
                              <img
                                src={
                                  relatedPost.coverPhoto || "/placeholder.svg"
                                }
                                alt={relatedPost.title}
                                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                              />
                              <div className="absolute top-2 left-2">
                                <span className="bg-white/90 text-gray-800 text-xs px-2 py-1 rounded-full">
                                  {relatedPost.topics[0]
                                    .charAt(0)
                                    .toUpperCase() +
                                    relatedPost.topics[0].slice(1)}
                                </span>
                              </div>
                            </div>
                            <div className="p-4 flex-1 flex flex-col">
                              <h3 className="font-semibold text-lg mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
                                {relatedPost.title}
                              </h3>
                              <div className="mt-auto flex items-center justify-between text-sm text-gray-500">
                                <div className="flex items-center">
                                  {/* {relatedPost.author.image ? (
                              <img
                                src={
                                  relatedPost.author.image ||
                                  "/assets/placeholder.jpg"
                                }
                                alt={relatedPost.author.name || "Author"}
                                className="w-6 h-6 rounded-full mr-2"
                              />
                            ) : (
                            )} */}
                                  <div className="w-6 h-6 rounded-full bg-gray-200 mr-2"></div>
                                  <span>{relatedPost.author.name}</span>
                                </div>
                                <span>
                                  {format(
                                    new Date(relatedPost.createdAt),
                                    "MMM d, yyyy"
                                  )}
                                </span>
                              </div>
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                </section>
              )}
            </aside>
          </section>
        </div>
      </div>
    </>
  );
}
