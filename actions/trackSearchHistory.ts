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
};

export async function trackSearchHistory(
  query: string,
  filters: Record<string, string>,
  resultCount?: number,
  previewImages?: string[]
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

    // Create new search entry
    const newEntry: SearchHistoryEntry = {
      id: searchId,
      query,
      filters,
      timestamp: new Date().toISOString(),
      resultCount,
      previewImages: previewImages?.filter(Boolean).slice(0, 3), // Filter out null/undefined images
    };

    // If it exists, update it; otherwise add it
    if (existingIndex !== -1) {
      // Preserve existing images if no new images are provided
      if (!previewImages || previewImages.length === 0) {
        newEntry.previewImages = searchHistory[existingIndex].previewImages;
      }
      searchHistory[existingIndex] = newEntry;
    } else {
      // Add to the beginning of the array
      searchHistory.unshift(newEntry);
    }

    // Keep only the 10 most recent searches
    const updatedHistory = searchHistory.slice(0, 10);

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
