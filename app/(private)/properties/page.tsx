import Filter from "@/components/globals/filters";
import Loader from "@/components/globals/loader";
import AllProperties from "@/components/properties/all-properties";
import { Raleway } from "next/font/google";
import React, { Suspense } from "react";

const raleway = Raleway({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-nunitosans",
});

export default function Properties({ searchParams }: { searchParams: string }) {
  const key = JSON.stringify(searchParams);

  return (
    <div
      className={`${raleway.className} w-[95%] lg:max-w-7xl mx-auto py-[90px] lg:py-[120px]`}
    >
      <Filter searchParams={searchParams} />
      <Suspense fallback={<Loader />} key={key}>
        {searchParams.length === 0 ? (
          <div className="flex h-full items-center justify-center">
            No properties matched your search query. Please try again with a
            different term.
          </div>
        ) : (
          <AllProperties searchParams={searchParams} />
        )}
      </Suspense>
    </div>
  );
}
