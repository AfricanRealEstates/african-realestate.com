import PageTitle from "@/components/globals/page-title";
import React from "react";
import prisma from "@/lib/prisma";
import UserQueriesTable from "@/components/queries/user-queries-table";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import { getSEOTags } from "@/lib/seo";

export const metadata = getSEOTags({
  title: "Agent - Queries | African Real Estate",
  canonicalUrlRelative: "/agent/queries",
});

export default async function Queries() {
  const user = await getServerSession(authOptions);
  console.log(user);
  const queries = await prisma.query.findMany({
    where: {
      userId: user?.user?.id,
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
