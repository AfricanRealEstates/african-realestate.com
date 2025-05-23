import { getSearchHistory } from "@/actions/trackSearchHistory";
import { getUserLocation } from "@/lib/user-location";
import SearchHistoryCarouselClient from "./SearchHistoryCarouselClient";

export default async function SearchHistoryCarousel() {
  // Get search history
  const searchHistory = await getSearchHistory();

  // Get user location for enhancing search context
  const location = await getUserLocation();

  // If no search history, return null
  if (!searchHistory.length) {
    return null;
  }

  // Prioritize successful searches first
  const prioritizedHistory = [...searchHistory].sort((a, b) => {
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

  // Enhance search history with location context if missing
  const enhancedHistory = prioritizedHistory.map((entry) => {
    // If the entry doesn't have location filters but we have user location, add it as context
    if (
      !entry.filters.location &&
      !entry.filters.county &&
      !entry.filters.locality &&
      (location.county || location.city)
    ) {
      return {
        ...entry,
        locationContext: location.county || location.city || undefined,
      };
    }
    return entry;
  });

  return <SearchHistoryCarouselClient initialHistory={enhancedHistory} />;
}
