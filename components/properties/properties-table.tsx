// import React from "react";
// import prisma from "@/lib/prisma";
// import ClientTable from "./client-table";
// import { getCurrentUser } from "@/actions/users";
// export default async function PropertiesTable({
//   searchParams,
//   fromAdmin = false,
// }: {
//   searchParams: any;
//   fromAdmin?: boolean;
// }) {
//   const user = await getCurrentUser();

//   const whereAdminCondition = searchParams;

//   if (!fromAdmin) {
//     whereAdminCondition.userId = user?.data?.id;
//   }

//   const properties = await prisma.property.findMany({
//     orderBy: {
//       updatedAt: "desc",
//     },
//     where: whereAdminCondition,
//     include: {
//       user: true,
//     },
//   });
//   return (
//     <div className="mt-8">
//       <ClientTable properties={properties} fromAdmin={fromAdmin} />
//     </div>
//   );
// }

import React from "react";
import prisma from "@/lib/prisma";
import ClientTable from "./client-table";
import { getCurrentUser } from "@/actions/users";
import { Property } from "@prisma/client";

interface PropertiesTableProps {
  searchParams: Record<string, any>;
  fromAdmin?: boolean;
}

export default async function PropertiesTable({
  searchParams,
  fromAdmin = false,
}: PropertiesTableProps) {
  const user = await getCurrentUser();

  let whereAdminCondition: Record<string, any> = { ...searchParams }; // Copy the original searchParams object

  if (!fromAdmin) {
    whereAdminCondition.userId = user?.data?.id;
  }

  // Modify whereAdminCondition to handle integer or float values
  whereAdminCondition = Object.fromEntries(
    Object.entries(whereAdminCondition).map(([key, value]) => {
      // Check if value is numeric
      if (!isNaN(parseFloat(value))) {
        // If numeric, convert value to float
        return [key, parseFloat(value)];
      }
      // If not numeric, return as is
      return [key, value];
    })
  );

  const properties: Property[] = await prisma.property.findMany({
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
