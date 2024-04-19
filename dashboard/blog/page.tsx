import DashboardTitle from "@/components/dashboard/dashboard-title";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";
import React from "react";

export default function Blog() {
  return (
    <section className="flex justify-between items-center gap-4">
      <DashboardTitle title="Blog" />
      <Button asChild>
        <Link href="/dashboard/blog/new" className="flex gap-2">
          {" "}
          <Plus />
          <span>Create a blog</span>
        </Link>
      </Button>
    </section>
  );
}
