import { auth } from "@/auth";
import Filters from "@/components/globals/filters";
import PageTitle from "@/components/globals/page-title";
import PropertiesTable from "@/components/properties/properties-table";
import { getSEOTags } from "@/lib/seo";
import React from "react";

export const metadata = getSEOTags({
  title: "Admin - Properties | African Real Estate",
  canonicalUrlRelative: "/admin/properties",
});

export default async function Properties({
  searchParams,
}: {
  searchParams: any;
}) {
  const session = await auth();
  const user = session?.user;

  if (session?.user.role !== "ADMIN") {
    return (
      <section className="py-24">
        <div className="container">
          <h2>You are not authorized to view this page</h2>
        </div>
      </section>
    );
  }
  return (
    <div className="w-[95%] lg:max-w-7xl mx-auto py-[90px] lg:py-[120px]">
      <PageTitle title="Admin / Properties" />
      <Filters searchParams={searchParams} />
      <PropertiesTable searchParams={searchParams} fromAdmin={true} />
    </div>
  );
}
