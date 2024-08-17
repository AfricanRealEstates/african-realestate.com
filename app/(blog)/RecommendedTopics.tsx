import Link from "next/link";
import { POSTS } from "./constants";
import Image from "next/image";

export interface BlogPostMetadata {
  title: string;
  publishedAt: string;
  category: string;
  cover?: string;
  summary: string;
  author: string;
}

export interface BlogPost {
  slug: string;
  metadata: BlogPostMetadata;
  content: string;
}

export interface RecommendedTopicsProps {
  relatedCategoryPosts?: any;
}

export default function RecommendedTopics({
  relatedCategoryPosts,
}: RecommendedTopicsProps) {
  return (
    <section className="sticky top-36">
      <h3 id="sidebar-label" className="sr-only">
        Recommended Topics
      </h3>
      <div className="p-6 mb-6 font-medium text-gray-500 bg-white border border-gray-100 rounded-lg">
        <h4 className="mb-4 font-bold text-gray-800 uppercase leading-relaxed">
          Recommended topics
        </h4>
        <div className="flex flex-wrap">
          {POSTS.map((post) => (
            <Link
              href={post.href}
              key={post.href}
              className="bg-blue-100 text-blue-800 text-sm font-medium mr-2 px-2.5 py-0.5 rounded hover:bg-blue-200 mb-2"
            >
              {post.title}
            </Link>
          ))}
        </div>
      </div>
      <div className="space-y-4">
        {" "}
        {/* Increase spacing between items */}
        {relatedCategoryPosts && relatedCategoryPosts.length > 0 && (
          <section className="space-y-4">
            {relatedCategoryPosts.slice(0, 3).map((post: any) => (
              <Link
                key={post.slug}
                href={`/blog/${post.metadata.category}/${post.slug}`}
                className="flex group flex-col p-4 bg-white border border-gray-200 rounded-lg hover:border-ken-primary/10  hover:shadow-2xl hover:shadow-gray-600/10"
              >
                <Image
                  height={150}
                  width={300}
                  src={post.metadata.cover}
                  alt={post.metadata.title}
                  className="rounded-lg flex-1 max-h-[200px] h-full"
                />
                <h5 className="line-clamp-2 text-base font-medium text-blue-400 hover:text-blue-500 transition group-hover:text-gray-700">
                  {post.metadata.title}
                </h5>
                <p className="flex items justify-between group-hover:text-ken-primary mt-2 flex-1">
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
            ))}
          </section>
        )}
      </div>
    </section>
  );
}
