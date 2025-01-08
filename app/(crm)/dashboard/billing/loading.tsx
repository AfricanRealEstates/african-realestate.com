import CardSkeleton from "@/components/globals/card-skeleton";
import React from "react";

export default function DashboardBillingLoading() {
  return (
    <section className="max-w-7xl mx-auto w-full px-8 mt-9">
      <div className="grid gap-10">
        <CardSkeleton />
      </div>
    </section>
  );
}
