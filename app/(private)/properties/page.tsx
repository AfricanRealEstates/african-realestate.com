import { Suspense } from "react";
import type { Metadata } from "next";
import { Raleway } from "next/font/google";
import PropertyFilter from "@/components/properties/PropertyFilter";
import SortingOptions from "@/app/search/SortingOptions";
import { getProperties } from "@/lib/getProperties";
import PropertyCard from "@/components/properties/new/PropertyCard";
import type { PropertyData } from "@/lib/types";
import { baseUrl } from "@/app/sitemap";
import Pagination from "@/components/globals/Pagination";

const raleway = Raleway({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-nunitosans",
});

export async function generateMetadata(): Promise<Metadata> {
  const title = "Properties | African Real Estate";
  const description =
    "Explore our wide range of properties across Africa. Find your dream home or next investment opportunity.";
  const canonicalUrlRelative = "/properties";

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "website",
      url: `${baseUrl}${canonicalUrlRelative}`,
      images: [
        {
          url: `${baseUrl}/assets/properties-og.jpg`,
          width: 1200,
          height: 630,
          alt: "African Real Estate Properties",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [`${baseUrl}/assets/properties-og.jpg`],
    },
    alternates: {
      canonical: `${baseUrl}${canonicalUrlRelative}`,
    },
  };
}

export default async function Properties({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const sort = (searchParams.sort as string) || "createdAt";
  const order = (searchParams.order as string) || "desc";
  const status = (searchParams.status as string) || "sale";
  const page = Number.parseInt(searchParams.page as string) || 1;
  const pageSize = 12;

  const validStatus = status === "let" ? "let" : "sale";

  const { properties, totalCount, totalPages } = await getProperties(
    searchParams,
    validStatus,
    page,
    pageSize
  );

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
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "RealEstateAgent",
            name: "African Real Estate",
            description:
              "Explore our wide range of properties across Africa. Find your dream home or next investment opportunity.",
            url: `${baseUrl}/properties`,
            logo: `${baseUrl}/assets/logo.png`,
            sameAs: [
              "https://web.facebook.com/AfricanRealEstateMungaiKihara",
              "https://www.tiktok.com/@africanrealestate",
              "https://www.instagram.com/africanrealestate_/",
            ],
            address: {
              "@type": "PostalAddress",
              streetAddress: "Moi Avenue",
              addressLocality: "Nairobi",
              addressRegion: "Nairobi",
              postalCode: "00100",
              addressCountry: "KE",
            },
            geo: {
              "@type": "GeoCoordinates",
              latitude: "-1.2921",
              longitude: "36.8219",
            },
            openingHoursSpecification: [
              {
                "@type": "OpeningHoursSpecification",
                dayOfWeek: [
                  "Monday",
                  "Tuesday",
                  "Wednesday",
                  "Thursday",
                  "Friday",
                ],
                opens: "07:00",
                closes: "20:00",
              },
            ],
          }),
        }}
      />
      <div
        className={`${raleway.className} w-[95%] lg:max-w-7xl mx-auto py-[90px] lg:py-[120px]`}
      >
        <h1 className="text-3xl font-bold mb-8">Explore Our Properties</h1>
        <article className="flex items-center justify-between w-full">
          <div className="mb-8">
            <PropertyFilter pageType="properties" />
          </div>
          <SortingOptions
            currentSort={sort}
            currentOrder={order}
            currentStatus={validStatus}
            isActive={isFiltered || properties.length > 0}
          />
        </article>
        <Suspense fallback={<div>Loading...</div>}>
          {properties.length === 0 ? (
            <div className="flex h-full items-center justify-center mt-8">
              No properties matched your search query. Please try again with a
              different term.
            </div>
          ) : (
            <>
              <section className="mx-auto mb-8 gap-8 grid w-full grid-cols-[repeat(auto-fill,minmax(335px,1fr))] justify-center">
                {properties.map((property) => (
                  <PropertyCard
                    key={property.id}
                    data={property as PropertyData}
                  />
                ))}
              </section>
              <Pagination currentPage={page} totalPages={totalPages} />
            </>
          )}
        </Suspense>
      </div>
    </>
  );
}
