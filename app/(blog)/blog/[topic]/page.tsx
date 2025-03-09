import CardCategory from "../../CardCategory";
import Link from "next/link";
import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";

// const redis = Redis.fromEnv();
export const revalidate = 0;

export async function generateStaticParams() {
  const topics = await prisma.post.findMany({
    where: { published: true },
    select: { topics: true },
    distinct: ["topics"],
  });

  return topics.flatMap((post) => post.topics.map((topic) => ({ topic })));
}

export async function generateMetadata({
  params,
}: {
  params: { topic: string };
}): Promise<Metadata> {
  const { topic } = params;
  const capitalizedTopic = topic.charAt(0).toUpperCase() + topic.slice(1);

  const postCount = await prisma.post.count({
    where: {
      published: true,
      topics: { has: topic },
    },
  });

  return {
    title: `${capitalizedTopic} Topic Articles`,
    description: `Explore ${postCount} articles about ${capitalizedTopic} in African real estate. Get expert insights, market trends, and investment opportunities.`,
    keywords: [
      `${topic} real estate`,
      "African property",
      "real estate investment",
      `${topic} property trends`,
      "African real estate market",
    ],
    openGraph: {
      title: `${capitalizedTopic} Articles | African Real Estate`,
      description: `Discover ${postCount} articles on ${capitalizedTopic} in African real estate. Expert analysis and insights for property investors and enthusiasts.`,
      url: `https://www.african-realestate.com/blog/${topic}`,
      type: "website",
      images: [
        {
          url: `https://www.african-realestate.com/blog-topics/${topic}.jpg`,
          width: 1200,
          height: 630,
          alt: `${capitalizedTopic} Real Estate Topic`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${capitalizedTopic} Articles | African Real Estate`,
      description: `Explore ${postCount} articles on ${capitalizedTopic} in African real estate. Stay informed about market trends and investment opportunities.`,
      images: [
        `https://www.african-realestate.com/blog-topics/${topic}-twitter.jpg`,
      ],
    },
    alternates: {
      canonical: `https://www.african-realestate.com/blog/${topic}`,
    },
  };
}

export default async function Page({ params }: { params: { topic: string } }) {
  const posts = await prisma.post.findMany({
    where: {
      published: true,
      topics: { has: params.topic },
    },
    select: {
      slug: true,
      title: true,
      content: true,
      topics: true,
      coverPhoto: true,
      metaDescription: true,
      createdAt: true,
      viewCount: true,
      likes: true,
      author: {
        select: { name: true },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  // let views: Record<string, number> = {};

  // if (posts.length > 0) {
  //   try {
  //     const viewCounts = await redis.mget<number[]>(
  //       ...posts.map((p) => ["pageviews", "posts", p.slug].join(":"))
  //     );
  //     views = viewCounts.reduce(
  //       (acc, v, i) => {
  //         acc[posts[i].slug] = v ?? 0;
  //         return acc;
  //       },
  //       {} as Record<string, number>
  //     );
  //   } catch (error) {
  //     console.error("Error fetching view counts:", error);
  //     // If we can't fetch view counts, we'll just use an empty object
  //   }
  // }

  if (!posts.length) {
    return (
      <section className="py-12">
        <div className="xl:container max-w-5xl m-auto px-6 text-gray-600 md:px-12 xl:px-16">
          <div className="lg:bg-gray-50 dark:lg:bg-darker lg:p-16 rounded-[4rem] space-y-6 md:flex flex-col md:gap-6 justify-center md:space-y-0 lg:items-center">
            <h1 className="text-3xl text-gray-900 md:text-4xl">
              No articles found on{" "}
              <span className="text-ken-primary capitalize">
                {params.topic}{" "}
              </span>
              topic
            </h1>
            <p className="my-8 text-gray-600">
              Try searching for a different topic or explore some of our other
              blogs about real estate.
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
      <div className="xl:container m-auto px-6 text-gray-600 md:px-12 xl:px-16">
        <div className="mb-12 space-y-2 text-center">
          <h2 className="text-3xl font-bold text-gray-800 md:text-4xl capitalize">
            {params.topic}
          </h2>
          <p className="lg:mx-auto lg:w-6/12 text-gray-600">
            Explore related topics, news and information on{" "}
            <span className="capitalize">{params.topic}</span>
          </p>
        </div>
        <section className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <Link href={`/blog/${params.topic}/${post.slug}`} key={post.slug}>
              <CardCategory
                title={post.title}
                summary={
                  post.metaDescription ||
                  "Learn more about this topic by reading the full article. Click to explore detailed insights and expert opinions."
                } // Creating a summary from content
                date={post.createdAt}
                cover={post.coverPhoto || "/placeholder.svg"}
                viewCount={post.viewCount}
                // likes={post.likes}
              />
            </Link>
          ))}
        </section>
      </div>
    </section>
  );
}
