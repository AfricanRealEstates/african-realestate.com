"use client";
import { Search, SlidersHorizontal } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React from "react";
export default function SearchBar() {
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const { replace } = useRouter();

  const handleSearch = (query: string) => {
    console.log("Searches", query);

    const params = new URLSearchParams(searchParams);

    if (query) {
      params.set("query", query);
    } else {
      params.delete("query");
    }

    replace(`${pathname}?${params.toString()}`);
  };
  return (
    <form className="bg-white rounded-xl p-5 relative w-full flex flex-col lg:flex-row gap-4 lg:items-center lg:justify-between">
      <input
        type="search"
        placeholder=" Enter an address, neighborhood, city, or ZIP code for Buy"
        className="placeholder:text-[#666] flex-1 ring-[1px] border-0 focus:outline-[#f7f7f7] outline-none ring-[#f6f6f6] py-4 px-5 md:py-3 md:px-6 inline-flex items-center justify-center gap-x-4 w-full"
        onChange={(e) => {
          handleSearch(e.target.value);
        }}
      />
      <span className="lg:ml-auto px-6 flex gap-4 items-center text-[#4a4a4a]">
        <SlidersHorizontal className="h-4 w-4" />
        Advanced Search
      </span>
      <div className="p-4 flex lg:items-center gap-x-4 rounded-full bg-[#276ef1]">
        {/* bg-[#eb6753] */}
        <Search className="text-white" />
        <span className="lg:hidden ml-4 text-white font-semibold">
          Search Property
        </span>
      </div>
    </form>
  );
}
