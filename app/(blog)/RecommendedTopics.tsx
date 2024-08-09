import Link from "next/link";
import { POSTS } from "./constants";

export default function RecommendedTopics() {
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
    </section>
  );
}
