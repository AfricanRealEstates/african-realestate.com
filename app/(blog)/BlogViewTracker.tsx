"use client";

import { useEffect } from "react";

interface BlogViewTrackerProps {
  postId: string;
  slug: string;
  topic: string;
}

export default function BlogViewTracker({
  postId,
  slug,
  topic,
}: BlogViewTrackerProps) {
  useEffect(() => {
    // Function to add a blog to recently viewed in localStorage
    const addToRecentlyViewedBlogs = () => {
      try {
        // Get existing recently viewed blogs
        const storedBlogs = localStorage.getItem("recentlyViewedBlogs");
        const recentlyViewed = storedBlogs ? JSON.parse(storedBlogs) : [];

        // Create blog entry with metadata
        const blogEntry = {
          id: postId,
          slug,
          topic,
          viewedAt: new Date().toISOString(),
        };

        // Remove the blog if it already exists to avoid duplicates
        const filtered = recentlyViewed.filter(
          (blog: any) => blog.id !== postId
        );

        // Add the blog to the beginning of the array
        const updated = [blogEntry, ...filtered].slice(0, 10); // Keep only the 10 most recent

        // Save to localStorage
        localStorage.setItem("recentlyViewedBlogs", JSON.stringify(updated));
      } catch (error) {
        console.error("Error updating recently viewed blogs:", error);
      }
    };

    // Add the current blog to recently viewed
    addToRecentlyViewedBlogs();
  }, [postId, slug, topic]);

  // This component doesn't render anything
  return null;
}
