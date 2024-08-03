import React from "react";
import prisma from "@/lib/prisma";
import { Property } from "@prisma/client";
import PropertyCard from "./new/PropertyCard";

export default async function AllProperties({
  searchParams,
}: {
  searchParams: any;
}) {
  // Modify where clause to handle integer or float values
  const properties: Property[] = await prisma.property.findMany({
    where: Object.fromEntries(
      Object.entries(searchParams).map(([key, value]) => {
        // Check if value is numeric
        if (!isNaN(parseFloat(value as string))) {
          // If numeric, convert value to float
          return [key, parseFloat(value as string)];
        }
        // If not numeric, return as is
        return [key, value];
      })
    ),
    orderBy: {
      updatedAt: "desc",
    },
  });
  return (
    <section className="mx-auto mb-8 gap-8 grid w-full grid-cols-[repeat(auto-fill,minmax(335px,1fr))] justify-center">
      {properties.map((property) => {
        return <PropertyCard key={property.id} data={property} />;
      })}
    </section>
  );
}
