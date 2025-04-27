import Image from "next/image";
import Link from "next/link";
import { Josefin_Sans } from "next/font/google";
import { ArrowRight, CalendarDays, Eye, Share2 } from "lucide-react";
import { getPersonalizedBlogPosts } from "@/actions/getPersonalizedBlogPosts";
import { getCurrentUser } from "@/lib/session";

const josefin = Josefin_Sans({
  subsets: ["latin"],
  weight: ["600"],
});

export function formatBlogDate(date: Date) {
  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(new Date(date));
}

export default async function PropertyAdvice() {
  const user = await getCurrentUser();
  const posts = await getPersonalizedBlogPosts(3);

  // Format posts for display
  const formattedPosts = posts.map((post) => ({
    slug: post.slug,
    views: post.viewCount,
    shares: post.shareCount,
    metadata: {
      title: post.title,
      publishedAt: post.createdAt,
      category: post.topics[0] || "uncategorized",
      cover: post.coverPhoto || "/placeholder.svg",
      summary: post.metaDescription,
    },
  }));

  return (
    <section className={`py-6 leading-relaxed`}>
      <div className="w-[95%] max-w-7xl m-auto px-6 text-gray-600 md:px-12 xl:px-6">
        <div className="flex items-center justify-between mb-8">
          <p
            className={`text-sm lg:text-xl text-gray-900 ${josefin.className}`}
          >
            {user ? "Recommended Insights For You" : "Property Insights & Tips"}
          </p>
          <Link
            href="/blog"
            className="inline-flex items-center text-ken-primary hover:underline group text-sm lg:text-base"
          >
            View all
            <ArrowRight className="size-4 ml-1.5 transition-transform duration-300 group-hover:translate-x-[2px]" />
          </Link>
        </div>

        <div className="grid gap-12 md:gap-6 md:grid-cols-3 lg:gap-12">
          {formattedPosts.map((post) => (
            <Link
              href={`/blog/${post.metadata.category}/${post.slug}`}
              key={post.slug}
              className="group space-y-2 flex flex-col"
            >
              <div className="relative aspect-[3/2] overflow-hidden rounded-lg">
                <Image
                  fill
                  alt={post.metadata.title}
                  src={post.metadata.cover || "/placeholder.svg"}
                  className="object-cover object-center transition-all duration-500 group-hover:scale-105"
                />
              </div>
              <div className="py-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <CalendarDays className="text-red-400 size-4" />
                    <span className="text-sm text-gray-700">
                      {formatBlogDate(post.metadata.publishedAt)}
                    </span>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      <Eye className="text-red-400 size-4" />
                      <span className="text-sm text-gray-700">
                        {Intl.NumberFormat("en-US", {
                          notation: "compact",
                        }).format(post.views)}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Share2 className="text-red-400 size-4" />
                      <span className="text-sm text-gray-700">
                        {Intl.NumberFormat("en-US", {
                          notation: "compact",
                        }).format(post.shares)}
                      </span>
                    </div>
                  </div>
                </div>
                <h2 className="mt-6 font-bold group-hover:text-red-400 transition-colors duration-200 text-lg text-gray-700 line-clamp-2 min-h-[48px] leading-tight">
                  {post.metadata.title}
                </h2>

                <p className="text-gray-500 text-base line-clamp-2 min-h-[48px]">
                  {post.metadata.summary ||
                    "Learn more about this topic by reading the full article. Click to explore detailed insights and expert opinions."}
                </p>

                <div className="mt-4 flex items-center space-x-2 text-red-400 group-hover:text-red-500 transition-colors duration-200">
                  <span className="font-semibold">Read more</span>
                  <ArrowRight className="size-4" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
