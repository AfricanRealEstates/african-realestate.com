import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  CalendarDays,
  Eye,
  Share2,
  BookOpen,
  TrendingUp,
} from "lucide-react";
import { getPersonalizedBlogPosts } from "@/actions/getPersonalizedBlogPosts";
import { getCurrentUser } from "@/lib/session";

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
    <section
      className={`py-12 leading-relaxed border-t border-gray-50 bg-gradient-to-br from-white to-blue-50`}
    >
      <div className="w-[95%] max-w-7xl m-auto px-4 text-gray-600">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-100 rounded-lg">
              <BookOpen className="h-6 w-6 text-red-600" />
            </div>
            <div>
              <p className={`text-xs text-red-500 uppercase `}>
                {user ? "Personalized For You" : "Property Insights"}
              </p>
              <h2 className={`text-2xl font-bold text-gray-600 `}>
                {user ? "Recommended Insights" : "Property Tips & Advice"}
              </h2>
            </div>
          </div>
          <Link
            href="/blog"
            className="inline-flex items-center text-red-500 hover:text-red-600 group text-sm lg:text-base font-semibold"
          >
            View all articles
            <ArrowRight className="size-4 ml-1.5 transition-transform duration-300 group-hover:translate-x-[2px]" />
          </Link>
        </div>

        {user && (
          <div className="bg-white/60 backdrop-blur-sm border border-blue-200 rounded-lg p-4 mb-8 max-w-3xl">
            <p className="text-sm text-gray-700 flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-blue-500" />
              <span>
                Articles tailored to your interests based on your browsing
                history and property preferences.
              </span>
            </p>
          </div>
        )}

        <div className="grid gap-12 md:gap-6 md:grid-cols-3 lg:gap-8">
          {formattedPosts.map((post) => (
            <Link
              href={`/blog/${post.metadata.category}/${post.slug}`}
              key={post.slug}
              className="group space-y-2 flex flex-col bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300"
            >
              <div className="relative aspect-[3/2] overflow-hidden">
                <Image
                  fill
                  alt={post.metadata.title}
                  src={post.metadata.cover || "/placeholder.svg"}
                  className="object-cover object-center transition-all duration-500 group-hover:scale-105"
                />
                <div className="absolute top-3 left-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1">
                  {post.metadata.category.charAt(0).toUpperCase() +
                    post.metadata.category.slice(1)}
                </div>
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent h-20"></div>
              </div>
              <div className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <CalendarDays className="text-red-400 size-4" />
                    <span className="text-sm text-gray-700">
                      {formatBlogDate(post.metadata.publishedAt)}
                    </span>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-1">
                      <Eye className="text-red-400 size-4" />
                      <span className="text-sm text-gray-700">
                        {Intl.NumberFormat("en-US", {
                          notation: "compact",
                        }).format(post.views)}
                      </span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Share2 className="text-red-400 size-4" />
                      <span className="text-sm text-gray-700">
                        {Intl.NumberFormat("en-US", {
                          notation: "compact",
                        }).format(post.shares)}
                      </span>
                    </div>
                  </div>
                </div>
                <h2 className="font-bold group-hover:text-red-500 transition-colors duration-200 text-lg text-gray-800 line-clamp-2 min-h-[48px] leading-tight">
                  {post.metadata.title}
                </h2>

                <p className="text-gray-600 text-base line-clamp-2 min-h-[48px] mt-2">
                  {post.metadata.summary ||
                    "Learn more about this topic by reading the full article. Click to explore detailed insights and expert opinions."}
                </p>

                <div className="mt-4 flex items-center justify-between">
                  <div className="flex items-center space-x-2 text-red-500 group-hover:text-red-600 transition-colors duration-200">
                    <span className="font-semibold">Read more</span>
                    <ArrowRight className="size-4" />
                  </div>
                  {/* <button
                    className="p-2 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
                    onClick={(e) => {
                      e.preventDefault();
                      // Add bookmark functionality here
                    }}
                  >
                    <Bookmark className="size-4" />
                  </button> */}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
