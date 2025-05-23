"use client";

import { useEffect } from "react";

export default function RecentlyViewedPropertiesScript() {
  useEffect(() => {
    // Function to sync localStorage to cookies
    const syncLocalStorageToCookies = () => {
      try {
        const storedProperties = localStorage.getItem(
          "recentlyViewedProperties"
        );
        if (storedProperties) {
          // Set a cookie with the property IDs (extended to 7 days)
          document.cookie = `recentlyViewedProperties=${storedProperties}; path=/; max-age=604800`;
        }
      } catch (error) {
        console.error("Error syncing localStorage to cookies:", error);
      }
    };

    // Sync on component mount
    syncLocalStorageToCookies();

    // Also sync when localStorage changes
    const handleStorageChange = () => {
      syncLocalStorageToCookies();
    };

    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  // This component doesn't render anything
  return null;
}
