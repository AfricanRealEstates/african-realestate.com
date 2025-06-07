import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import type { Metadata } from "next";
import { baseUrl } from "@/app/sitemap";
import { Suspense } from "react";
import SortingOptions from "@/app/search/SortingOptions";
import Pagination from "@/components/globals/Pagination";
import { PropertySkeleton } from "@/components/globals/PropertySkeleton";
import PropertyCardEnhanced from "@/components/landing/featured-properties/property-card-enhanced";

type Props = {
  params: { nearbyTown: string };
  searchParams: { [key: string]: string | string[] | undefined };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const town = decodeURIComponent(params.nearbyTown);
  const title = `Properties in ${town} | African Real Estate`;
  const description = `Discover properties for sale and rent in ${town}. Find your dream home or investment opportunity in this vibrant African city.`;
  const url = `${baseUrl}/properties/town/${encodeURIComponent(town)}`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url,
      siteName: "African Real Estate",
      locale: "en_US",
      type: "website",
      images: [
        {
          url: `${baseUrl}/assets/nakasero.webp`,
          width: 1200,
          height: 630,
          alt: `Properties in ${town}`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [`${baseUrl}/assets/nakasero.webp`],
    },
    alternates: {
      canonical: url,
    },
  };
}

async function getPropertiesByNearbyTown(
  nearbyTown: string,
  sort: string,
  order: string,
  status: string,
  page: number,
  pageSize: number
) {
  const orderBy: { [key: string]: "asc" | "desc" } = {
    [sort]: order as "asc" | "desc",
  };
  const whereClause: any = { nearbyTown };
  if (status) {
    whereClause.status = status;
  }

  const [properties, totalCount] = await Promise.all([
    prisma.property.findMany({
      where: whereClause,
      orderBy,
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    prisma.property.count({ where: whereClause }),
  ]);

  return {
    properties,
    totalCount,
    totalPages: Math.ceil(totalCount / pageSize),
  };
}

async function getAllPropertiesByNearbyTown(nearbyTown: string) {
  return await prisma.property.findMany({
    where: { nearbyTown },
    orderBy: { createdAt: "desc" },
    take: 3,
  });
}

export default async function NearbyTownPropertiesPage({
  params,
  searchParams,
}: Props) {
  const town = decodeURIComponent(params.nearbyTown);
  const sort = (searchParams.sort as string) || "createdAt";
  const order = (searchParams.order as string) || "desc";
  const status = (searchParams.status as string) || "";
  const page = Number.parseInt(searchParams.page as string) || 1;
  const pageSize = 12;

  const { properties, totalCount, totalPages } =
    await getPropertiesByNearbyTown(town, sort, order, status, page, pageSize);
  const allProperties =
    properties.length === 0 ? await getAllPropertiesByNearbyTown(town) : [];

  if (properties.length === 0 && allProperties.length === 0) {
    notFound();
  }

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: properties.map((property, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": "RealEstateListing",
        name: property.title,
        description: property.description,
        image: property.coverPhotos[0],
        url: `${baseUrl}/properties/${property.propertyDetails}/${property.id}`,
        offers: {
          "@type": "Offer",
          price: property.price,
          priceCurrency: property.currency,
          availability: property.status === "sale" ? "For Sale" : "To Let",
        },
        address: {
          "@type": "PostalAddress",
          addressLocality: property.locality,
          addressRegion: property.county,
          addressCountry: "Kenya",
        },
      },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <div
        className={`w-[95%] lg:max-w-7xl mx-auto py-[100px] lg:py-[160px] px-4 sm:px-6 lg:px-8 `}
      >
        <article className="flex flex-col lg:flex-row lg:items-end lg:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-4">
              Properties in{" "}
              <span className="text-rose-500 capitalize">{town}</span>
            </h1>
            <p className="mb-4 md:mb-0 inline-flex items-center justify-center rounded px-[15px] text-sm leading-none h-[35px] bg-green-50 text-green-500 focus:shadow-[0_0_0_2px] focus:shadow-green-600 outline-none cursor-default">
              <span className="hidden lg:flex">Explore our selection of </span>
              <span className="font-semibold text-green-600 mx-1">
                {totalCount || allProperties.length}
              </span>{" "}
              properties available in{" "}
              <span className="font-semibold text-green-600 mx-1">{town}</span>{" "}
              right now.
            </p>
          </div>
          <div className="mt-4 md:mt-0">
            <Suspense fallback={<div>Loading sorting options...</div>}>
              <SortingOptions
                currentSort={sort}
                currentOrder={order}
                currentStatus={status}
                isActive={properties.length > 0}
                showStatusFilter={true}
              />
            </Suspense>
          </div>
        </article>
        {properties.length === 0 ? (
          <div className="space-y-8">
            <div className="text-center py-12">
              <h2 className="text-2xl font-semibold mb-4 text-red-600">
                No properties matched your current filters
              </h2>
              <p className="text-lg mb-4">
                Here are some other properties in{" "}
                <span className="bg-green-50 text-green-500">{town}</span>
              </p>
            </div>

            <div className="">
              <Link
                href={`/properties/town/${encodeURIComponent(town)}`}
                className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded transition-colors"
              >
                View all properties in {town}
              </Link>
            </div>
            <section className="mx-auto mb-8 gap-8 grid w-full grid-cols-[repeat(auto-fill,minmax(335px,1fr))] justify-center">
              {/* <Suspense fallback={<PropertySkeletonGrid />}></Suspense> */}
              {allProperties.map((property, index) => (
                <PropertyCardEnhanced
                  key={property.id}
                  property={property}
                  index={index}
                />
              ))}
            </section>
          </div>
        ) : (
          <>
            <section className="mx-auto mb-8 gap-8 grid w-full grid-cols-[repeat(auto-fill,minmax(335px,1fr))] justify-center">
              {/* <Suspense fallback={<PropertySkeletonGrid />}></Suspense> */}
              {properties.map((property, index) => (
                <PropertyCardEnhanced
                  key={property.id}
                  property={property}
                  index={index}
                />
              ))}
            </section>
            <Pagination currentPage={page} totalPages={totalPages} />
          </>
        )}
      </div>
    </>
  );
}

export async function generateStaticParams() {
  const towns = await prisma.property.findMany({
    select: { nearbyTown: true },
    distinct: ["nearbyTown"],
  });

  return towns.map((town) => ({
    nearbyTown: town.nearbyTown,
  }));
}

// Grid of property skeletons for loading state
function PropertySkeletonGrid() {
  return (
    <section className="mx-auto mb-8 gap-8 grid w-full grid-cols-[repeat(auto-fill,minmax(335px,1fr))] justify-center">
      {Array.from({ length: 9 }).map((_, index) => (
        <PropertySkeleton key={index} />
      ))}
    </section>
  );
}
