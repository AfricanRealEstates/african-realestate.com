import Filters from "@/components/globals/filters";
import PageTitle from "@/components/globals/page-title";
import PropertiesTable from "@/components/properties/properties-table";
import React from "react";

export default function Properties({ searchParams }: { searchParams: any }) {
  return (
    <div className="w-[95%] lg:max-w-7xl mx-auto py-[90px] lg:py-[120px]">
      <PageTitle title="Admin / Properties" />
      <Filters searchParams={searchParams} />
      <PropertiesTable searchParams={searchParams} fromAdmin={true} />
    </div>
  );
}
