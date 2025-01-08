"use client";
import { Search, SlidersHorizontal } from "lucide-react";
import React from "react";
export default function SearchForm() {
  const handleSearch = (query: string) => {
    console.log("searching for", query);
  };
  return (
    <form className="bg-white rounded-xl p-5 relative w-full flex flex-col lg:flex-row gap-4 lg:items-center lg:justify-between">
      <input
        onChange={(e) => {
          handleSearch(e.target.value);
        }}
        // type="search"
        placeholder="Enter an address, neighborhood, city, or ZIP code for Buy"
        className="placeholder:text-[#666] text-sm flex-1 ring-[1px] border-0 focus:outline-[#f7f7f7] outline-none ring-[#f6f6f6] py-4 px-3 md:py-3 md:px-4 inline-flex items-center justify-center gap-x-4 w-full"
      />
      {/* <span className="lg:ml-auto px-6 flex gap-4 items-center text-[#4a4a4a]">
        <SlidersHorizontal className="h-4 w-4" />
        Advanced Search
      </span>
      <div
        className="p-4 flex lg:items-center rounded-full bg-[#eb6753]
              "
      >
        <Search className="text-white" />
      </div> */}
    </form>
  );
}
