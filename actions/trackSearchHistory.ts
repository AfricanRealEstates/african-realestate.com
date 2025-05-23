"use server";

import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session";

export type SearchHistoryEntry = {
  id: string;
  query: string;
  filters: Record<string, string>;
  timestamp: string;
  resultCount?: number;
  previewImages?: string[];
  isSuccessful?: boolean; // Track if search was successful
  lastViewed?: string; // Track when search was last viewed
  viewCount?: number; // Track how many times this search was used
};

export async function trackSearchHistory(
  query: string,
  filters: Record<string, string>,
  resultCount?: number,
  previewImages?: string[],
  isSuccessful = false // Default to false
): Promise<void> {
  try {
    // Get existing search history from cookies
    const searchHistoryCookie = cookies().get("searchHistory");
    const searchHistory: SearchHistoryEntry[] = searchHistoryCookie
      ? JSON.parse(searchHistoryCookie.value)
      : [];

    // Create a unique ID for this search based on query and filters
    const searchId = createSearchId(query, filters);

    // Check if this search already exists
    const existingIndex = searchHistory.findIndex(
      (entry) => entry.id === searchId
    );
    const now = new Date().toISOString();

    // Create new search entry
    const newEntry: SearchHistoryEntry = {
      id: searchId,
      query,
      filters,
      timestamp: now,
      resultCount,
      previewImages: previewImages?.filter(Boolean).slice(0, 3), // Filter out null/undefined images
      isSuccessful: isSuccessful,
      lastViewed: now,
      viewCount: 1,
    };

    // If it exists, update it; otherwise add it
    if (existingIndex !== -1) {
      // Preserve existing images if no new images are provided
      if (!previewImages || previewImages.length === 0) {
        newEntry.previewImages = searchHistory[existingIndex].previewImages;
      }

      // Update success status if this attempt was successful
      newEntry.isSuccessful =
        isSuccessful || searchHistory[existingIndex].isSuccessful;

      // Increment view count
      newEntry.viewCount = (searchHistory[existingIndex].viewCount || 0) + 1;

      // Update the entry
      searchHistory[existingIndex] = newEntry;
    } else {
      // Add to the beginning of the array
      searchHistory.unshift(newEntry);
    }

    // Sort by successful searches first, then by last viewed date
    const sortedHistory = searchHistory.sort((a, b) => {
      // First prioritize successful searches
      if (
        (a.isSuccessful && b.isSuccessful) ||
        (!a.isSuccessful && !b.isSuccessful)
      ) {
        // If both are successful or both are unsuccessful, sort by last viewed
        return (
          new Date(b.lastViewed || b.timestamp).getTime() -
          new Date(a.lastViewed || a.timestamp).getTime()
        );
      }
      return a.isSuccessful ? -1 : 1;
    });

    // Keep only the 10 most recent searches
    const updatedHistory = sortedHistory.slice(0, 10);

    // Set the cookie with the updated history
    cookies().set("searchHistory", JSON.stringify(updatedHistory), {
      maxAge: 30 * 24 * 60 * 60, // 30 days
      path: "/",
    });

    // Also store in database if user is logged in
    const currentUser = await getCurrentUser();
    if (currentUser) {
      await prisma.searchHistory.upsert({
        where: {
          userId_searchId: {
            userId: currentUser.id!,
            searchId,
          },
        },
        update: {
          query,
          filters: filters as any,
          resultCount: resultCount || 0,
          previewImages: previewImages?.filter(Boolean) || [],
          updatedAt: new Date(),
          // Add these fields to the database model if they don't exist
          // You may need to update your Prisma schema
        },
        create: {
          userId: currentUser.id!,
          searchId,
          query,
          filters: filters as any,
          resultCount: resultCount || 0,
          previewImages: previewImages?.filter(Boolean) || [],
        },
      });
    }
  } catch (error) {
    console.error("Error tracking search history:", error);
  }
}

// Mark a search as successful (completed)
export async function markSearchAsSuccessful(searchId: string): Promise<void> {
  try {
    // Update in cookies
    const searchHistoryCookie = cookies().get("searchHistory");
    if (searchHistoryCookie) {
      const searchHistory: SearchHistoryEntry[] = JSON.parse(
        searchHistoryCookie.value
      );
      const updatedHistory = searchHistory.map((entry) => {
        if (entry.id === searchId) {
          return {
            ...entry,
            isSuccessful: true,
            lastViewed: new Date().toISOString(),
            viewCount: (entry.viewCount || 0) + 1,
          };
        }
        return entry;
      });

      cookies().set("searchHistory", JSON.stringify(updatedHistory), {
        maxAge: 30 * 24 * 60 * 60, // 30 days
        path: "/",
      });
    }

    // Update in database if user is logged in
    const currentUser = await getCurrentUser();
    if (currentUser) {
      // You would need to add these fields to your Prisma schema
      // This is pseudocode assuming you've updated the schema
      /*
      await prisma.searchHistory.update({
        where: {
          userId_searchId: {
            userId: currentUser.id!,
            searchId,
          },
        },
        data: {
          isSuccessful: true,
          lastViewed: new Date(),
          viewCount: { increment: 1 }
        }
      })
      */
    }
  } catch (error) {
    console.error("Error marking search as successful:", error);
  }
}

export async function getSearchHistory(): Promise<SearchHistoryEntry[]> {
  try {
    const currentUser = await getCurrentUser();

    // If user is logged in, get from database
    if (currentUser) {
      const dbHistory = await prisma.searchHistory.findMany({
        where: {
          userId: currentUser.id,
        },
        orderBy: {
          updatedAt: "desc",
        },
        take: 10,
      });

      return dbHistory.map((entry) => ({
        id: entry.searchId,
        query: entry.query,
        filters: entry.filters as Record<string, string>,
        timestamp: entry.updatedAt.toISOString(),
        resultCount: entry.resultCount,
        previewImages: entry.previewImages as string[],
        // Add these fields if they exist in your schema
        isSuccessful: true, // Assume database entries were successful
        lastViewed: entry.updatedAt.toISOString(),
        viewCount: 1, // Default if not in schema
      }));
    }

    // Otherwise get from cookies
    const searchHistoryCookie = cookies().get("searchHistory");
    return searchHistoryCookie ? JSON.parse(searchHistoryCookie.value) : [];
  } catch (error) {
    console.error("Error getting search history:", error);
    return [];
  }
}

export async function clearSearchHistory(): Promise<void> {
  const currentUser = await getCurrentUser();

  // Clear from cookies
  cookies().set("searchHistory", "[]", { path: "/" });

  // Clear from database if user is logged in
  if (currentUser) {
    await prisma.searchHistory.deleteMany({
      where: {
        userId: currentUser.id,
      },
    });
  }
}

export async function removeSearchEntry(id: string): Promise<void> {
  try {
    const currentUser = await getCurrentUser();

    // Remove from database if user is logged in
    if (currentUser) {
      await prisma.searchHistory.deleteMany({
        where: {
          userId: currentUser.id,
          searchId: id,
        },
      });
    }

    // Remove from cookies
    const searchHistoryCookie = cookies().get("searchHistory");
    if (!searchHistoryCookie) return;

    const searchHistory: SearchHistoryEntry[] = JSON.parse(
      searchHistoryCookie.value
    );
    const updatedHistory = searchHistory.filter((entry) => entry.id !== id);

    cookies().set("searchHistory", JSON.stringify(updatedHistory), {
      maxAge: 30 * 24 * 60 * 60,
      path: "/",
    });
  } catch (error) {
    console.error("Error removing search entry:", error);
  }
}

// Helper function to create a unique ID for a search
function createSearchId(
  query: string,
  filters: Record<string, string>
): string {
  const filterString = Object.entries(filters)
    .sort(([keyA], [keyB]) => keyA.localeCompare(keyB))
    .map(([key, value]) => `${key}:${value}`)
    .join("|");

  return `${query || ""}|${filterString}`;
}
