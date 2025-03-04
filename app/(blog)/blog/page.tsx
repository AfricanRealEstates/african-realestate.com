import type { Metadata } from "next";
import LatestPosts from "../LatestPosts";
import { getBlogPosts } from "@/lib/blog";
import { Raleway } from "next/font/google";
import PopularBlogs from "../PopularBlogs";
import RecommendedTopics from "../RecommendedTopics";
import { Redis } from "@upstash/redis";
import { baseUrl } from "@/app/sitemap";

const redis = Redis.fromEnv();
export const revalidate = 0;

const raleway = Raleway({
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Blog | African Real Estate",
  description:
    "Discover the latest real estate news, property guides, and investment opportunities in Africa. Expert insights on property market trends and real estate investing.",
  keywords:
    "real estate blog, property news, real estate investing, African real estate, property guides",
  openGraph: {
    title: "Real Estate Blog | African Real Estate",
    description:
      "Discover the latest real estate news, property guides, and investment opportunities in Africa.",
    type: "website",
    url: `${baseUrl}/blog`,
    images: [
      {
        url: `${baseUrl}/og-blog.jpg`,
        width: 1200,
        height: 630,
        alt: "African Real Estate Blog",
      },
    ],
    siteName: "African Real Estate",
  },
  twitter: {
    card: "summary_large_image",
    title: "Real Estate Blog | African Real Estate",
    description:
      "Discover the latest real estate news, property guides, and investment opportunities in Africa.",
    images: [`${baseUrl}/og-blog.jpg`],
    creator: "@AfricanRealEstate",
  },
  alternates: {
    canonical: `${baseUrl}/blog`,
  },
};
export default async function Blog({
  searchParams,
}: {
  searchParams?: { page?: string };
}) {
  const allPosts = await getBlogPosts();
  const views = (
    await redis.mget<number[]>(
      ...allPosts.map((p) => ["pageviews", "posts", p.slug].join(":"))
    )
  ).reduce(
    (acc, v, i) => {
      acc[allPosts[i].slug] = v ?? 0;
      return acc;
    },
    {} as Record<string, number>
  );

  if (Object.keys(views).length < 1) {
    return null;
  }

  return (
    <main className={`pt-6 pb-8 bg-white lg:pb-16 ${raleway.className}`}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Blog",
            name: "African Real Estate Blog",
            description:
              "Discover the latest real estate news, property guides, and investment opportunities in Africa.",
            url: `${baseUrl}/blog`,
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
              "@id": `${baseUrl}/blog`,
            },
          }),
        }}
      />

      <div className="mb-12 space-y-4 text-center container m-auto px-6 text-gray-600 md:px-12 xl:px-6">
        <h1 className="text-3xl font-bold text-gray-800 md:text-4xl">
          Real Estate News & Insights
        </h1>
        <p className="text-gray-600 lg:mx-auto lg:w-6/12">
          Stay informed with the latest real estate news, expert property
          guides, and exclusive investment opportunities across Africa.
        </p>
      </div>

      <section
        className="flex justify-between px-4 mx-auto container"
        aria-label="Blog content"
      >
        <div className="hidden mb-6 xl:block lg:w-60">
          <PopularBlogs />
        </div>
        <div className="w-full max-w-[800px] mx-auto">
          <LatestPosts searchParams={searchParams} />
        </div>
        <aside className="hidden lg:block lg:w-60">
          <RecommendedTopics />
        </aside>
      </section>
    </main>
  );
}
