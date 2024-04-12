import Login from "@/app/(auth)/login/page";
import Filter from "@/components/globals/filters";
import Loader from "@/components/globals/loader";
import PageTitle from "@/components/globals/page-title";
import LinkButton from "@/components/properties/link-button";
import PropertiesTable from "@/components/properties/properties-table";
import { authOptions } from "@/lib/auth-options";
import { getSEOTags } from "@/lib/seo";
import { getServerSession } from "next-auth";
import React, { Suspense } from "react";

export const metadata = getSEOTags({
  title: "Agent - Properties | African Real Estate",
  canonicalUrlRelative: "/agent/properties",
});

export default async function Properties({
  searchParams,
}: {
  searchParams: any;
}) {
  const key = JSON.stringify(searchParams);
  return (
    <div className="w-[95%] lg:max-w-7xl mx-auto py-[90px] lg:py-[120px]">
      <section className="my-5 flex justify-between items-center">
        <PageTitle title="Properties" />
        <LinkButton
          title="Create Property"
          path="/agent/properties/create-property"
        />
      </section>
      <Filter searchParams={searchParams} />
      <Suspense fallback={<Loader />}>
        <PropertiesTable searchParams={searchParams} />
      </Suspense>
    </div>
  );
}
