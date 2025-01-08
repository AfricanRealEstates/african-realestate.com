import { getSEOTags } from "@/lib/seo";
import React from "react";

export const metadata = getSEOTags({
  title: "careers & Jobs | African Real Estate",
  canonicalUrlRelative: "/jobs",
});

export default function Jobs() {
  return (
    <div
      className={`w-full px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto py-[90px] lg:py-[120px]`}
    >
      <h1>Jobs and Updates</h1>
    </div>
  );
}
