import DashboardTitle from "@/components/dashboard/dashboard-title";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Plus } from "lucide-react";
import { Metadata } from "next";
import Link from "next/link";
import React from "react";

export const metadata: Metadata = {
  title: "Dashboard - Properties",
};

export default function Properties() {
  return (
    <>
      <section className="flex justify-between items-center gap-4">
        <DashboardTitle title="Properties" />
        <Button asChild>
          <Link href="/agent/properties/create-property" className="flex gap-2">
            {" "}
            <Plus />
            <span>Add Property</span>
          </Link>
        </Button>
      </section>
      <ProductsTable />
    </>
  );
}

function ProductsTable() {
  return (
    <Table className="mt-8">
      <TableHeader>
        <TableRow>
          <TableHead className="w-0">
            <span className="sr-only">Available For Purchase</span>
          </TableHead>
          <TableHead>Title</TableHead>
          <TableHead>Price</TableHead>
          <TableHead>Orders</TableHead>
          <TableHead className="w-0">
            <span className="sr-only">Actions</span>
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody></TableBody>
    </Table>
  );
}
