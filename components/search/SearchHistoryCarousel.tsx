import { getSearchHistory } from "@/actions/trackSearchHistory";
import SearchHistoryCarouselClient from "./SearchHistoryCarouselClient";

export default async function SearchHistoryCarousel() {
  const searchHistory = await getSearchHistory();

  if (!searchHistory.length) {
    return null;
  }

  return <SearchHistoryCarouselClient initialHistory={searchHistory} />;
}
