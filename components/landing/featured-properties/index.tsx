import { Suspense } from "react";
import { Lexend } from "next/font/google";
import { Button } from "@/components/utils/Button";
import PropertyCard from "@/components/properties/new/PropertyCard";
import { prisma } from "@/lib/prisma";
import { PropertySkeletonGrid } from "./PropertySkeletonGrid";

const lexend = Lexend({
  subsets: ["latin"],
  weight: ["600"],
});

async function getProperties() {
  try {
    const platinumProperties = await prisma.property.findMany({
      where: {
        isActive: true,
        orders: {
          some: {
            tierName: "Platinum", // Only Platinum properties
          },
        },
      },
      include: {
        orders: {
          select: {
            tierName: true,
          },
        },
      },
      orderBy: {
        updatedAt: "desc", // Sort by most recently updated
      },
      take: 3, // Limit to the first 3 Platinum properties
    });

    const diamondProperties = await prisma.property.findMany({
      where: {
        isActive: true,
        orders: {
          some: {
            tierName: "Diamond", // Only Diamond properties
          },
        },
      },
      include: {
        orders: {
          select: {
            tierName: true,
          },
        },
      },
      orderBy: {
        updatedAt: "desc", // Sort by most recently updated
      },
      take: 2, // Limit to the first 2 Diamond properties
    });

    const bronzeProperties = await prisma.property.findMany({
      where: {
        isActive: true,
        orders: {
          some: {
            tierName: "Bronze", // Only Bronze properties
          },
        },
      },
      include: {
        orders: {
          select: {
            tierName: true,
          },
        },
      },
      orderBy: {
        updatedAt: "desc", // Sort by most recently updated
      },
      take: 1, // Limit to the first Bronze property
    });

    // Combine the properties from each tier
    let properties: any = [
      ...platinumProperties,
      ...diamondProperties,
      ...bronzeProperties,
    ];

    // If less than 6 properties, fill the remaining spots with placeholders
    const placeholderProperties = await prisma.property.findMany({
      where: {
        isActive: true,
      },
      orderBy: {
        updatedAt: "desc", // Get other featured properties
      },
      take: 6 - properties.length, // Only take the remaining required properties
    });

    // Add the placeholder properties
    properties = [...properties, ...placeholderProperties];

    console.log("Properties fetched:", properties);
    return properties;
  } catch (error) {
    console.error("Error fetching properties:", error);
    return [];
  }
}

function PropertyList({ properties }: any) {
  if (properties.length === 0) {
    return (
      <div className="flex flex-col items-center gap-1 text-center">
        <h3 className="text-2xl font-bold tracking-tight">
          There are no featured listings at the moment
        </h3>
      </div>
    );
  }

  return (
    <article className="mx-auto mb-8 gap-8 grid w-full max-w-screen-xl grid-cols-[repeat(auto-fill,_minmax(335px,1fr))] justify-center">
      {properties.map((property: any) => (
        <PropertyCard
          key={property.id}
          data={property}
          tierName={
            property.orders && property.orders.length > 0
              ? property.orders[0].tierName
              : undefined
          }
        />
      ))}
    </article>
  );
}

export default async function FeaturedProperties() {
  const properties = await getProperties();

  return (
    <div className={`border-b border-neutral-100 mb-4 text-[#4e4e4e]`}>
      <div className="mx-auto w-[95%] max-w-7xl px-2 py-16 md:px-2 md:py-12 lg:py-16">
        <section className="flex items-center justify-start gap-8 flex-col w-full">
          <div className="flex flex-col items-center justify-center gap-2">
            <p
              className={`text-[12px] uppercase text-blue-600 font-semibold leading-relaxed ${lexend.className}`}
            >
              Explore our featured properties
            </p>
            <h2
              className={`${lexend.className} text-center tracking-tight text-3xl font-bold sm:text-4xl my-1`}
            >
              Recommended For You
            </h2>
          </div>

          <Suspense fallback={<PropertySkeletonGrid count={6} />}>
            <PropertyList properties={properties} />
          </Suspense>

          <Button color="blue" href={`/properties`}>
            View all Properties
          </Button>
        </section>
      </div>
    </div>
  );
}
