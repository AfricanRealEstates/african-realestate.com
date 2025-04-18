"use server";

import { cookies } from "next/headers";

export type RecentSearch = {
  id: string;
  location: string;
  type: string; // "sale" or "let"
  images: string[];
  timestamp: string;
};

export async function getRecentSearches(): Promise<RecentSearch[]> {
  try {
    // Get searches from cookies
    const searchesCookie = cookies().get("recentSearches");

    if (!searchesCookie) {
      return [];
    }

    // Parse the cookie value
    const searches = JSON.parse(searchesCookie.value) as RecentSearch[];

    // Sort by timestamp (most recent first)
    return searches.sort(
      (a, b) =>
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
  } catch (error) {
    console.error("Error fetching recent searches:", error);
    return [];
  }
}
