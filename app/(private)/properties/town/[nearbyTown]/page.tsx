// app/properties/town/[nearbyTown]/page.tsx
import Link from "next/link";
import { notFound } from "next/navigation";
import prisma from "@/lib/prisma";
import PropertyCard from "@/components/properties/new/PropertyCard";
import { PropertyData } from "@/lib/types";
import { Metadata } from "next";

type Props = {
  params: { nearbyTown: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const town = decodeURIComponent(params.nearbyTown);
  return {
    title: `Properties in ${town.toUpperCase()} | African Real Estate`,
    description: `Discover properties for sale in ${town}. Find your dream home or investment opportunity in this vibrant African city.`,
    openGraph: {
      title: `Properties in ${town} | African Real Estate`,
      description: `Discover properties for sale in ${town}. Find your dream home or investment opportunity in this vibrant African city.`,
      url: `/properties/town/${encodeURIComponent(town)}`,
      siteName: "African Real Estate",
      locale: "en_US",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `Properties in ${town} | African Real Estate`,
      description: `Discover properties for sale in ${town}. Find your dream home or investment opportunity in this vibrant African city.`,
    },
    alternates: {
      canonical: `/properties/town/${encodeURIComponent(town)}`,
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

  return (
    <div className={`w-[95%] lg:max-w-7xl mx-auto py-[100px] lg:py-[160px]`}>
      <h1 className="text-3xl font-bold mb-8">
        Properties near <span className="text-rose-500 capitalize">{town}</span>
      </h1>
      <section className="mx-auto mb-8 gap-8 grid w-full grid-cols-[repeat(auto-fill,minmax(335px,1fr))] justify-center">
        {properties.map((property) => (
          <PropertyCard key={property.id} data={property as PropertyData} />
        ))}
      </section>
    </div>
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
