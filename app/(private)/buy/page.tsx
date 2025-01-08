import { Suspense } from "react";
import { Raleway } from "next/font/google";
import { getSEOTags } from "@/lib/seo";
import Loader from "@/components/globals/loader";
import { PropertyData } from "@/lib/types";
import SortingOptions from "@/app/search/SortingOptions";
import PropertyFilter from "@/components/properties/PropertyFilter";
import dynamic from "next/dynamic";
import { getProperties } from "./getProperties";
import InfiniteScrollLoader from "./InfiniteScrollLoader";

const raleway = Raleway({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-nunitosans",
});

export const metadata = getSEOTags({
  title: "Buy Properties | African Real Estate",
  canonicalUrlRelative: "/buy",
});

const InfinitePropertyList = dynamic(() => import("./InfinitePropertyList"), {
  loading: () => <InfiniteScrollLoader />,
});

export default async function BuyPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const sort = (searchParams.sort as string) || "createdAt";
  const order = (searchParams.order as string) || "desc";
  const status = "sale";

  const initialProperties = await getProperties(searchParams, status, 1, 12); // Load first 12 properties

  const isFiltered = Object.keys(searchParams).some((key) =>
    [
      "propertyType",
      "propertyDetails",
      "county",
      "locality",
      "minPrice",
      "maxPrice",
    ].includes(key)
  );

  return (
    <div
      className={`${raleway.className} w-[95%] lg:max-w-7xl mx-auto py-[90px] lg:py-[120px]`}
    >
      <h1 className="text-3xl font-semibold mb-8">Properties for Sale</h1>
      <article className="flex flex-col md:flex-row md:items-center justify-between w-full mb-8">
        <div className="mb-4 md:mb-0">
          <PropertyFilter pageType="buy" />
        </div>

        <SortingOptions
          currentSort={sort}
          currentOrder={order}
          currentStatus={status}
          isActive={isFiltered || initialProperties.length > 0}
        />
      </article>
      <Suspense fallback={<InfiniteScrollLoader />}>
        <InfinitePropertyList
          initialProperties={initialProperties}
          searchParams={searchParams}
          status={status}
        />
      </Suspense>
    </div>
  );
}
