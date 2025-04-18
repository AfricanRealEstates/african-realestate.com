"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export function usePropertyInteractions() {
  const router = useRouter();
  const [recentlyViewed, setRecentlyViewed] = useState<string[]>([]);

  // Load recently viewed properties from localStorage on component mount
  useEffect(() => {
    const storedProperties = localStorage.getItem("recentlyViewedProperties");
    if (storedProperties) {
      setRecentlyViewed(JSON.parse(storedProperties));
    }
  }, []);

  // Function to add a property to recently viewed
  const addToRecentlyViewed = (propertyId: string) => {
    setRecentlyViewed((prev) => {
      // Remove the property if it already exists to avoid duplicates
      const filtered = prev.filter((id) => id !== propertyId);

      // Add the property to the beginning of the array
      const updated = [propertyId, ...filtered].slice(0, 10); // Keep only the 10 most recent

      // Save to localStorage
      localStorage.setItem("recentlyViewedProperties", JSON.stringify(updated));

      return updated;
    });
  };

  // Function to navigate to a property and track the view
  const viewProperty = (propertyDetails: string, propertyId: string) => {
    addToRecentlyViewed(propertyId);
    router.push(`/properties/${propertyDetails}/${propertyId}`);
  };

  return {
    recentlyViewed,
    addToRecentlyViewed,
    viewProperty,
  };
}
