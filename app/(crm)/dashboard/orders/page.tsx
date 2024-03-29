import DashboardTitle from "@/components/dashboard/dashboard-title";
import { Button } from "@/components/ui/button";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Dashboard - Orders",
};

export default function Orders() {
  return (
    <>
      <DashboardTitle title="Orders" />
      <article className="h-96 mt-4 flex flex-1 items-center justify-center rounded-lg border border-dashed shadow-sm">
        <div className="flex flex-col items-center gap-1 text-center">
          <h3 className="text-2xl font-bold tracking-tight">
            You have no products
          </h3>
          <p className="text-sm text-gray-500">
            You can start selling as soon as you add a property.
          </p>
          <Button className="mt-4">Add Property</Button>
        </div>
      </article>
    </>
  );
}
