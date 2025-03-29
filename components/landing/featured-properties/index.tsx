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
    // Keep track of selected property IDs to avoid duplicates
    const selectedIds = new Set<string>();
    const allFeaturedProperties: any[] = [];

    // Define our tier allocation targets
    const tierAllocation = {
      Platinum: 3,
      Diamond: 2,
      Bronze: 1,
    };

    // Total properties we want to display
    const totalPropertiesToShow = 6;

    // 1. First pass: Get properties for each tier according to our ideal allocation
    for (const [tierName, targetCount] of Object.entries(tierAllocation)) {
      const tierProperties = await prisma.property.findMany({
        where: {
          isActive: true,
          id: {
            notIn: Array.from(selectedIds),
          },
          orders: {
            some: {
              tierName: tierName,
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
          updatedAt: "desc",
        },
        take: targetCount,
      });

      // Add properties from this tier to our selection
      tierProperties.forEach((property) => {
        selectedIds.add(property.id);
        allFeaturedProperties.push({
          ...property,
          displayTier: tierName,
        });
      });

      console.log(
        `Found ${tierProperties.length}/${targetCount} ${tierName} properties`
      );
    }

    // 2. Second pass: If we still have slots to fill, try to fill with remaining properties
    // from each tier in order of priority (Platinum > Diamond > Bronze)
    if (allFeaturedProperties.length < totalPropertiesToShow) {
      const remainingSlotsAfterFirstPass =
        totalPropertiesToShow - allFeaturedProperties.length;
      console.log(`Need to fill ${remainingSlotsAfterFirstPass} more slots`);

      // Try to fill with remaining properties from each tier in priority order
      for (const tierName of Object.keys(tierAllocation)) {
        // Skip if we've already filled all slots
        if (allFeaturedProperties.length >= totalPropertiesToShow) break;

        const remainingSlots =
          totalPropertiesToShow - allFeaturedProperties.length;

        const additionalTierProperties = await prisma.property.findMany({
          where: {
            isActive: true,
            id: {
              notIn: Array.from(selectedIds),
            },
            orders: {
              some: {
                tierName: tierName,
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
            updatedAt: "desc",
          },
          take: remainingSlots,
        });

        // Add additional properties from this tier
        additionalTierProperties.forEach((property) => {
          selectedIds.add(property.id);
          allFeaturedProperties.push({
            ...property,
            displayTier: tierName,
          });
        });

        console.log(
          `Added ${additionalTierProperties.length} more ${tierName} properties`
        );
      }
    }

    // 3. Final pass: If we still don't have enough properties, fill with any active properties
    if (allFeaturedProperties.length < totalPropertiesToShow) {
      const finalRemainingSlots =
        totalPropertiesToShow - allFeaturedProperties.length;
      console.log(
        `Still need ${finalRemainingSlots} more properties, filling with any active properties`
      );

      const fillerProperties = await prisma.property.findMany({
        where: {
          isActive: true,
          id: {
            notIn: Array.from(selectedIds),
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
          updatedAt: "desc",
        },
        take: finalRemainingSlots,
      });

      // Add filler properties
      fillerProperties.forEach((property) => {
        // Determine display tier - use the property's highest tier if it has one
        let displayTier = undefined;
        if (property.orders && property.orders.length > 0) {
          // Find the highest tier if the property has multiple orders
          if (property.orders.some((order) => order.tierName === "Platinum")) {
            displayTier = "Platinum";
          } else if (
            property.orders.some((order) => order.tierName === "Diamond")
          ) {
            displayTier = "Diamond";
          } else if (
            property.orders.some((order) => order.tierName === "Bronze")
          ) {
            displayTier = "Bronze";
          } else {
            displayTier = property.orders[0].tierName;
          }
        }

        allFeaturedProperties.push({
          ...property,
          displayTier: displayTier,
        });
      });

      console.log(`Added ${fillerProperties.length} filler properties`);
    }

    console.log(`Total featured properties: ${allFeaturedProperties.length}`);

    // Make sure we don't exceed our total
    return allFeaturedProperties.slice(0, totalPropertiesToShow);
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
          tierName={property.displayTier}
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
