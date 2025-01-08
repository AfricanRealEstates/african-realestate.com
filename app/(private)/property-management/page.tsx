import { getSEOTags } from "@/lib/seo";
import React from "react";

export const metadata = getSEOTags({
  title: "Property Management | African Real Estate",
  canonicalUrlRelative: "/property-management",
});

export default function PropertyManagement() {
  return (
    <div
      className={`w-full px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto py-[90px] lg:py-[120px]`}
    >
      <h1>Property Management</h1>
    </div>
  );
}
