import { getRecentSearches } from "@/actions/getRecentReaches";
import RecentSearchesClient from "./RecentSearchesClient";

export default async function RecentSearches() {
  const searches = await getRecentSearches();

  if (!searches.length) {
    return null;
  }

  return <RecentSearchesClient initialSearches={searches} />;
}
