"use client";

import { useEffect } from "react";

interface ViewTrackerProps {
  propertyId: string;
}

export default function ViewTracker({ propertyId }: ViewTrackerProps) {
  useEffect(() => {
    // Function to add a property to recently viewed in localStorage
    const addToRecentlyViewed = (id: string) => {
      try {
        // Get existing recently viewed properties
        const storedProperties = localStorage.getItem(
          "recentlyViewedProperties"
        );
        const recentlyViewed = storedProperties
          ? JSON.parse(storedProperties)
          : [];

        // Remove the property if it already exists to avoid duplicates
        const filtered = recentlyViewed.filter(
          (propId: string) => propId !== id
        );

        // Add the property to the beginning of the array
        const updated = [id, ...filtered].slice(0, 10); // Keep only the 10 most recent

        // Save to localStorage
        localStorage.setItem(
          "recentlyViewedProperties",
          JSON.stringify(updated)
        );

        // Also update the cookie for server-side access
        document.cookie = `recentlyViewedProperties=${JSON.stringify(updated)}; path=/; max-age=86400`;
      } catch (error) {
        console.error("Error updating recently viewed properties:", error);
      }
    };

    // Add the current property to recently viewed
    addToRecentlyViewed(propertyId);
  }, [propertyId]);

  // This component doesn't render anything
  return null;
}
