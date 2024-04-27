import { auth } from "@/auth";
import BillingInfo from "@/components/crm/billing-info";
import prisma from "@/lib/prisma";
import React from "react";

export default async function DashboardBilling() {
  const session = await auth();
  const user = session?.user;
  const userSubsciption: any = await prisma.subscription.findFirst({
    where: {
      id: user?.id,
    },
    orderBy: { createdAt: "desc" },
  });
  return (
    <section className="max-w-7xl mx-auto w-full px-8 mt-9">
      <div className="grid gap-1 mb-4">
        <h2 className="text-2xl md:text-3xl">Billing</h2>
        <p className="text-base text-muted-foreground">
          Manage your subscription.
        </p>
      </div>
      <BillingInfo />
    </section>
  );
}
