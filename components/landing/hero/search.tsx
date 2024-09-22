"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { debounce } from "lodash";

async function searchProperties(query: string) {
  const response = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
  if (!response.ok) throw new Error("Failed to fetch");
  return response.json();
}

export default function SearchBar() {
  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState<{ count: number } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const debouncedSearch = useCallback(
    debounce(async (query: string) => {
      if (query.trim()) {
        setIsLoading(true);
        try {
          const data = await searchProperties(query);
          setResults(data);
        } catch (error) {
          console.error("Search error:", error);
          setResults(null);
        } finally {
          setIsLoading(false);
        }
      } else {
        setResults(null);
      }
    }, 300),
    []
  );

  useEffect(() => {
    debouncedSearch(searchTerm);
    return () => debouncedSearch.cancel();
  }, [searchTerm, debouncedSearch]);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      setIsSubmitting(true);
      try {
        await router.push(`/search?q=${encodeURIComponent(searchTerm)}`);
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  return (
    <form
      onSubmit={handleSearch}
      className="flex w-full max-w-sm items-center space-x-2 relative"
    >
      <Input
        type="text"
        placeholder="Search properties..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="bg-white"
        aria-label="Search properties"
      />
      <Button
        type="submit"
        disabled={isSubmitting}
        className="min-w-[80px] bg-blue-400 text-white hover:bg-blue-500 transition-all"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            <span className="sr-only">Searching...</span>
          </>
        ) : (
          "Search"
        )}
      </Button>
      {isLoading && (
        <div
          className="absolute top-full left-0 right-0 bg-white p-2 shadow-md rounded-b-md"
          aria-live="polite"
        >
          Loading...
        </div>
      )}
      {results && !isLoading && (
        <div
          className="absolute top-full left-0 right-0 bg-white p-2 shadow-md rounded-b-md"
          aria-live="polite"
        >
          {results.count} properties match
        </div>
      )}
    </form>
  );
}
