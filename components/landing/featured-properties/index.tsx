import { Suspense } from "react";
import { Lexend } from "next/font/google";
import { Button } from "@/components/utils/Button";
import PropertyCard from "@/components/properties/new/PropertyCard";
import { prisma } from "@/lib/prisma";

const lexend = Lexend({
  subsets: ["latin"],
  weight: ["600"],
});

async function getProperties() {
  try {
    const properties = await prisma.property.findMany({
      where: {
        isActive: true, // Filter for active properties only
      },
      include: {
        orders: {
          select: {
            tierName: true,
          },
        },
      },
      orderBy: {
        updatedAt: "desc",
      },
      take: 6, // Limit to 6 properties for featured section
    });
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
            property.orders.length > 0 ? property.orders[0].tierName : undefined
          } // Assuming you want the first tierName from the orders
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

          <Suspense fallback={<div>Loading properties...</div>}>
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
