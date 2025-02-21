"use client";

import type React from "react";
import { Input } from "@/components/ui/input";
import { SearchIcon } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

export default function SearchField() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const [searchTerm, setSearchTerm] = useState(
    searchParams.get("q")?.toString() || ""
  );

  // Debounced search function
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      const params = new URLSearchParams(searchParams);

      if (searchTerm.trim()) {
        params.set("q", searchTerm.trim());
      } else {
        params.delete("q");
      }

      // Only update URL if we're on the search page
      if (pathname === "/blog/search") {
        router.replace(`/blog/search?${params.toString()}`);
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm, router, searchParams, pathname]);

  const handleSearch = useCallback((value: string) => {
    setSearchTerm(value);
  }, []);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!searchTerm.trim()) return;

    const params = new URLSearchParams();
    params.set("q", searchTerm.trim());
    router.push(`/blog/search?${params.toString()}`);
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="relative">
        <Input
          name="search"
          id="search"
          type="text"
          value={searchTerm}
          placeholder="Search posts..."
          onChange={(e) => handleSearch(e.target.value)}
          className="pe-10 border border-stone-300 placeholder:text-stone-400"
          aria-label="Search posts"
        />
        <SearchIcon className="absolute right-3 top-1/2 size-5 -translate-y-1/2 transform text-muted-foreground" />
      </div>
    </form>
  );
}
