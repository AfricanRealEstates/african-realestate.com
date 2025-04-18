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
          // Set a cookie with the property IDs
          document.cookie = `recentlyViewedProperties=${storedProperties}; path=/; max-age=86400`;
        }
      } catch (error) {
        console.error("Error syncing localStorage to cookies:", error);
      }
    };

    // Sync on component mount
    syncLocalStorageToCookies();
  }, []);

  // This component doesn't render anything
  return null;
}
