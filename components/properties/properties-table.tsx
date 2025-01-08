import React from "react";
import { prisma } from "@/lib/prisma";
import ClientTable from "./client-table";
import { Property } from "@prisma/client";
import { auth } from "@/auth";

interface PropertiesTableProps {
  searchParams?: Record<string, any>;
  fromAdmin?: boolean;
}

export default async function PropertiesTable({
  searchParams,
  fromAdmin = false,
}: PropertiesTableProps) {
  const session = await auth();
  const user = session?.user;

  let whereAdminCondition: Record<string, any> = { ...searchParams }; // Copy the original searchParams object

  if (!fromAdmin) {
    whereAdminCondition.userId = user?.id;
  }

  // Modify whereAdminCondition to handle integer or float values
  whereAdminCondition = Object.fromEntries(
    Object.entries(whereAdminCondition).map(([key, value]) => {
      if (key === "userId") {
        // If it's the userId key and value is not NaN, parse it to an integer
        if (!isNaN(parseInt(value))) {
          return [key, value];
        } else {
          // If it's not a valid integer, keep it as string
          return [key, value];
        }
      }

      // Check if value is numeric
      if (!isNaN(parseFloat(value))) {
        // If numeric, convert value to float
        return [key, parseFloat(value)];
      }
      // If not numeric, return as is
      return [key, value];
    })
  );

  const properties = await prisma.property.findMany({
    orderBy: {
      updatedAt: "desc",
    },
    where: whereAdminCondition,
    include: {
      user: true,
    },
  });

  return (
    <div className="mt-8">
      <ClientTable properties={properties} fromAdmin={fromAdmin} />
    </div>
  );
}
