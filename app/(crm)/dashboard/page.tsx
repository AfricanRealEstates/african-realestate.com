import { getSEOTags } from "@/lib/seo";
import React from "react";

export const metadata = getSEOTags({
  title: "Dashboard | African Real Estate",
  canonicalUrlRelative: "/",
});

export default function Dashboard() {
  return <div>Dashboard</div>;
}
