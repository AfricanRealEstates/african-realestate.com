import PageTitle from "@/components/globals/page-title";
import React from "react";
import prisma from "@/lib/prisma";
import AgentsTable from "@/components/agents/agents-table";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import Login from "@/app/(auth)/login/page";
import { getSEOTags } from "@/lib/seo";

export const metadata = getSEOTags({
  title: "Admin - Agents | African Real Estate",
  canonicalUrlRelative: "/admin/agents",
});
export default async function Agents() {
  const users = await prisma.user.findMany({
    orderBy: {
      updatedAt: "desc",
    },
  });

  return (
    <div className="w-[95%] lg:max-w-7xl mx-auto py-[90px] lg:py-[120px]">
      <PageTitle title="Admin / Agents" />
      <AgentsTable users={users} />
    </div>
  );
}
