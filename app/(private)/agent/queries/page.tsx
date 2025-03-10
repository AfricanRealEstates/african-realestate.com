import PageTitle from "@/components/globals/page-title";
import React from "react";
import { prisma } from "@/lib/prisma";
import UserQueriesTable from "@/components/queries/user-queries-table";
import { getSEOTags } from "@/lib/seo";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { getCurrentUser } from "@/lib/session";

export const metadata = getSEOTags({
  title: "Agent - Queries | African Real Estate",
  canonicalUrlRelative: "/agent/queries",
});

export default async function Queries() {
  const session = await auth();
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  console.log(user);
  const queries = await prisma.query.findMany({
    where: {
      userId: user?.id,
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
