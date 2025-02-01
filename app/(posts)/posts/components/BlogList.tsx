"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { TopicFilter } from "./TopicFilter";

interface Post {
  id: string;
  title: string;
  content: string;
  slug: string;
  createdAt: Date;
  author: {
    name: string | null;
  };
  topics: string[];
}

interface BlogListProps {
  initialPosts: Post[];
  topics: string[];
}

export function BlogList({ initialPosts, topics }: BlogListProps) {
  const [filteredPosts, setFilteredPosts] = useState(initialPosts);

  const handleTopicChange = (topic: string) => {
    if (topic === "All") {
      setFilteredPosts(initialPosts);
    } else {
      setFilteredPosts(
        initialPosts.filter((post) => post.topics.includes(topic))
      );
    }
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen w-full pt-1">
      <aside className="w-full md:w-64">
        <div className="md:sticky md:top-20">
          <TopicFilter topics={topics} onTopicChange={handleTopicChange} />
        </div>
      </aside>
      <main className="flex flex-col items-center gap-8 flex-1 px-4 md:px-8">
        {filteredPosts.map((post) => (
          <div key={post.id} className="w-full">
            <h2 className="text-2xl font-bold mb-2">{post.title}</h2>
            <p className="text-muted-foreground mb-2">
              By {post.author.name} |{" "}
              {new Date(post.createdAt).toLocaleDateString()}
            </p>
            <p className="mb-4">{post.content.substring(0, 200)}...</p>
            <Button variant="outline" asChild>
              <a href={`/blog/${post.slug}`}>Read More</a>
            </Button>
          </div>
        ))}
      </main>
    </div>
  );
}
