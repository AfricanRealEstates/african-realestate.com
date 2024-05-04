"use client";
import { Raleway } from "next/font/google";
import { useSearchParams } from "next/navigation";
import React from "react";
const raleway = Raleway({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-nunitosans",
});

export default function SearchPage() {
  const search = useSearchParams();
  const searchQuery = search ? search.get("q") : null;
  const encodedSearchQuery = encodeURI(searchQuery || "");

  console.log("Search Params:", encodedSearchQuery);
  return (
    <div
      className={`${raleway.className} w-[95%] lg:max-w-7xl mx-auto py-[90px] lg:py-[120px]`}
    >
      Search Results:
    </div>
  );
}
