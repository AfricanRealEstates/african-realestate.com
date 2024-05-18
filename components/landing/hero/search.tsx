"use client";
import { School, Search, SlidersHorizontal } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useDebouncedCallback } from "use-debounce";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import axios from "axios";
import debounce from "lodash.debounce";
import { Property } from "@prisma/client";
import { useOnClickOutside } from "@/hooks/use-click-outside";
export default function SearchBar() {
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();
  const pathname = usePathname();
  const commandRef = useRef<HTMLDivElement>(null);

  useOnClickOutside(commandRef, () => {
    setSearchQuery("");
  });

  const request = debounce(async () => {
    refetch();
  }, 300);

  const debounceRequest = useCallback(() => {
    request();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const {
    data: queryResults,
    refetch,
    isFetched,
    isFetching,
  } = useQuery({
    queryFn: async () => {
      if (!searchQuery) return [];

      const { data } = await axios.get(`/api/search?q=${searchQuery}`);
      return data as Property[];
    },
    queryKey: ["search-query"],
    enabled: false,
  });

  useEffect(() => {
    setSearchQuery("");
  }, [pathname]);

  // const handleSearch = (e: React.FormEvent) => {
  //   e.preventDefault();

  //   if (typeof searchQuery !== "string") {
  //     return;
  //   }

  //   const encodedSearchQuery = encodeURI(searchQuery);
  //   router.push(`/search?q=${encodedSearchQuery}`);

  //   console.log("current query", encodedSearchQuery);
  // };

  return (
    <>
      <Command className="relative rounded-lg border max-w-lg z-20 overflow-visible">
        <CommandInput
          isLoading={isFetching}
          value={searchQuery}
          onValueChange={(text) => {
            setSearchQuery(text);
            debounceRequest();
          }}
          className="outline-none border-none focus:border-none focus:outline-none ring-0"
          placeholder="Search properties"
        />

        {searchQuery.length > 0 ? (
          <CommandList className="absolute bg-white top-full inset-x-0 shadow rounded-b-md">
            {isFetched && <CommandEmpty>No results found</CommandEmpty>}
            {(queryResults?.length ?? 0) > 0 ? (
              <>
                {queryResults && queryResults?.length > 0 && (
                  <CommandGroup heading="Properties">
                    {queryResults.map((query) => (
                      <CommandItem
                        onSelect={(e) => {
                          router.push(`/properties/${query.id}`);
                          router.refresh();
                        }}
                        key={query.id}
                        value={query.title}
                      >
                        <School className="mr-2 size-4" />
                        <a href={`/properties/${query.id}`}>{query.title}</a>
                      </CommandItem>
                    ))}
                  </CommandGroup>
                )}
              </>
            ) : null}
          </CommandList>
        ) : null}
      </Command>
    </>
    // <form
    //   onSubmit={handleSearch}
    //   className="bg-white rounded-xl p-5 relative w-full flex flex-col lg:flex-row gap-4 lg:items-center lg:justify-between"
    // >
    //   <input
    //     type="search"
    //     value={searchQuery || ""}
    //     onChange={(text) => {
    //       setInput("")
    //     }}
    //     // onChange={(event) => setSearchQuery(event.target.value)}
    //     placeholder=" Enter an address, neighborhood, city, or ZIP code for Buy"
    //     className="placeholder:text-[#666] flex-1 ring-[1px] border-0 focus:outline-[#f7f7f7] outline-none ring-[#f6f6f6] py-4 px-5 md:py-3 md:px-6 inline-flex items-center justify-center gap-x-4 w-full"
    //   />
    //   <span className="lg:ml-auto px-6 flex gap-4 items-center text-[#4a4a4a]">
    //     <SlidersHorizontal className="h-4 w-4" />
    //     Advanced Search
    //   </span>
    //   <button className="p-4 flex lg:items-center gap-x-4 rounded-full bg-[#276ef1]">
    //     {/* bg-[#eb6753] */}
    //     <Search className="text-white" />
    //     <span className="lg:hidden ml-4 text-white font-semibold">
    //       Search Property
    //     </span>
    //   </button>
    // </form>
  );
}
