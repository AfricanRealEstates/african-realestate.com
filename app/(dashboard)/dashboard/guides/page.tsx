import type { Metadata } from "next";
import { GuidesList } from "./guides-list";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { PlusCircle } from "lucide-react";

export const metadata: Metadata = {
  title: "Guide Management | African Real Estate",
  description: "Manage property guides for African Real Estate",
};

export default function GuidesAdminPage() {
  return (
    <div className="w-full mx-auto py-10 px-8">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-y-6 mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Property Guides</h1>
          <p className="text-muted-foreground mt-1">
            Manage guides for different property types and purposes
          </p>
        </div>
        <Link href="/dashboard/guides/new">
          <Button className="flex items-center gap-2">
            <PlusCircle className="h-4 w-4" />
            Create Guide
          </Button>
        </Link>
      </div>
      <GuidesList />
    </div>
  );
}
