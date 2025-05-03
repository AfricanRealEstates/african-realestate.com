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
    <div className="max-w-7xl mx-auto py-10">
      <div className="flex justify-between items-center mb-8">
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
