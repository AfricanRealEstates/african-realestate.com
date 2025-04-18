"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export function useBlogInteractions() {
  const router = useRouter();
  const [recentlyViewedBlogs, setRecentlyViewedBlogs] = useState<any[]>([]);
  const [topicPreferences, setTopicPreferences] = useState<
    Record<string, number>
  >({});

  // Load recently viewed blogs from localStorage on component mount
  useEffect(() => {
    try {
      const storedBlogs = localStorage.getItem("recentlyViewedBlogs");
      if (storedBlogs) {
        const blogs = JSON.parse(storedBlogs);
        setRecentlyViewedBlogs(blogs);

        // Calculate topic preferences
        const topics: Record<string, number> = {};
        blogs.forEach((blog: any) => {
          if (blog.topic) {
            topics[blog.topic] = (topics[blog.topic] || 0) + 1;
          }
        });
        setTopicPreferences(topics);
      }
    } catch (error) {
      console.error("Error loading blog interactions:", error);
    }
  }, []);

  // Function to navigate to a blog and track the view
  const viewBlog = (topic: string, slug: string) => {
    router.push(`/blog/${topic}/${slug}`);
  };

  return {
    recentlyViewedBlogs,
    topicPreferences,
    viewBlog,
  };
}
