"use client";
import { fetcher, fetchUrl } from "@/lib/utils";
import { Raleway } from "next/font/google";
import Link from "next/link";
import useSWR from "swr";

const raleway = Raleway({
  subsets: ["latin"],
  display: "swap",
});

export default function PopularBlogs() {
  const { data, error, isLoading } = useSWR(fetchUrl, fetcher);
  if (error) return <div>Failed to load</div>;
  if (isLoading) return <div>Loading...</div>;

  return (
    <aside className={`${raleway.className} sticky top-36`}>
      <article className="p-6 mb-6 font-medium text-gray-500 bg-white border border-gray-200">
        <h2 className="mb-2 font-bold text-gray-900 uppercase leading-relaxed">
          Popular Posts
        </h2>
        <p className="text-sm text-gray-400">
          Most popular posts, articles and guides about real estate
        </p>
      </article>
      <article className="p-6 mb-6 font-medium text-gray-500 bg-white border border-gray-200">
        <h4 className="mb-4 font-semibold text-gray-900 uppercase">
          Most viewed articles
        </h4>
        <div className="space-y-1">
          {data?.slice(0, 5).map(
            (
              post: {
                category: string;
                slug: string;
                title: string;
                summary: string;
              },
              index
            ) => (
              <div
                key={post.title}
                className="rounded border border-gray-50 group relative bg-white transition hover:z-[1] hover:border-ken-primary/10 hover:shadow-2xl hover:shadow-gray-600/10 p-2"
              >
                <Link
                  href={`/blog/${post.category}/${post.slug}`}
                  className="relative space-y-2"
                >
                  <h5 className="text-2xl font-bold text-ken-primary group-hover:text-ken-primary/80 transition md:text-4xl">
                    {index + 1}.
                  </h5>
                  <div className="space-y-1">
                    <h5 className="line-clamp-3 text-base font-medium text-gray-600 transition group-hover:text-gray-700">
                      {post.title}
                    </h5>
                    <p>{post.summary}</p>
                  </div>
                  <p className="flex items justify-between group-hover:text-ken-primary">
                    <span className="text-sm">Read more</span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="size-5 -translate-x-4 text-2xl opacity-0 transition duration-300 group-hover:translate-x-0 group-hover:opacity-100"
                    >
                      <path
                        fillRule="evenodd"
                        d="M12.97 3.97a.75.75 0 011.06 0l7.5 7.5a.75.75 0 010 1.06l-7.5 7.5a.75.75 0 11-1.06-1.06l6.22-6.22H3a.75.75 0 010-1.5h16.19l-6.22-6.22a.75.75 0 010-1.06z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </p>
                </Link>
              </div>
            )
          )}
        </div>
      </article>
    </aside>
  );
}
