import { getRecentSearches } from "@/actions/getRecentReaches";
import RecentSearchesCompactClient from "./RecentSearchesCompactClient";

export default async function RecentSearchesCompact() {
  const searches = await getRecentSearches();

  if (!searches.length) {
    return null;
  }

  return <RecentSearchesCompactClient initialSearches={searches} />;
}
