import Link from "next/link";
import { notFound } from "next/navigation";
import prisma from "@/lib/prisma";
import PropertyCard from "@/components/properties/new/PropertyCard";
import { PropertyData } from "@/lib/types";
import { Metadata } from "next";
import { baseUrl } from "@/app/sitemap";

type Props = {
  params: { nearbyTown: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const town = decodeURIComponent(params.nearbyTown);
  const title = `Properties in ${town} | African Real Estate`;
  const description = `Discover properties for sale in ${town}. Find your dream home or investment opportunity in this vibrant African city.`;
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

async function getPropertiesByNearbyTown(nearbyTown: string) {
  const properties = await prisma.property.findMany({
    where: { nearbyTown },
    orderBy: { createdAt: "desc" },
    take: 20,
  });

  if (properties.length === 0) {
    notFound();
  }

  return properties;
}

export default async function NearbyTownPropertiesPage({
  params,
}: {
  params: { nearbyTown: string };
}) {
  const town = decodeURIComponent(params.nearbyTown);
  const properties = await getPropertiesByNearbyTown(town);

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
          availability: property.status === "sale" ? "sale" : "let",
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
      <div className={`w-[95%] lg:max-w-7xl mx-auto py-[100px] lg:py-[160px]`}>
        <h1 className="text-3xl font-bold mb-8">
          Properties near{" "}
          <span className="text-rose-500 capitalize">{town}</span>
        </h1>
        <p className="mb-8 inline-flex items-center justify-center rounded px-[15px] text-sm leading-none h-[35px] bg-green-50 text-green-500 focus:shadow-[0_0_0_2px] focus:shadow-green-600 outline-none cursor-default">
          Explore our selection of{" "}
          <span className="font-semibold text-green-600 mx-1">
            {properties.length}
          </span>{" "}
          properties available in{" "}
          <span className="font-semibold text-green-600 mx-1">{town}</span>{" "}
          right now.
        </p>
        <section className="mx-auto mb-8 gap-8 grid w-full grid-cols-[repeat(auto-fill,minmax(335px,1fr))] justify-center">
          {properties.map((property) => (
            <PropertyCard key={property.id} data={property as PropertyData} />
          ))}
        </section>
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
