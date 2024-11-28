import { getSEOTags } from "@/lib/seo";
import React from "react";

export const metadata = getSEOTags({
  title: "Partners | African Real Estate",
  canonicalUrlRelative: "/partners",
});

export default function Partners() {
  return (
    <div
      className={`w-full px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto py-[90px] lg:py-[120px]`}
    >
      <h1>Our Partners</h1>
    </div>
  );
}
