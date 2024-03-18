import PageTitle from "@/components/globals/page-title";
import React from "react";
import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/actions/users";
import UserQueriesTable from "@/components/queries/user-queries-table";

export default async function Queries() {
  const user = await getCurrentUser();
  const queries = await prisma.query.findMany({
    where: {
      userId: user?.data?.id,
    },
    include: {
      property: true,
    },
  });

  return (
    <div className="w-[95%] lg:max-w-7xl mx-auto py-[90px] lg:py-[120px]">
      <PageTitle title="Queries" />
      <UserQueriesTable queries={queries} />
    </div>
  );
}
