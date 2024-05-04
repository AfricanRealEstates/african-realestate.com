import { auth } from "@/auth";
import { EmptyPlaceholder } from "@/components/globals/empty-placeholder";
import PropertiesTable from "@/components/properties/properties-table";
import { Button } from "@/components/ui/button";
import { getSEOTags } from "@/lib/seo";
import { Loader2, Plus } from "lucide-react";
import { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import React, { Suspense } from "react";

export const metadata = getSEOTags({
  title: "Dashboard | African Real Estate",
  canonicalUrlRelative: "/",
});

export default async function Dashboard() {
  const session = await auth();
  const user = session?.user;

  if (!user) {
    redirect("/login");
  }

  return (
    <div className="h-full bg-background">
      <section className="border-b bg-card mt-10">
        <div className="max-w-7xl mx-auto w-full px-8 flex flex-wrap items-center justify-between gap-6 py-8">
          <p className="text-3xl font-bold">
            Hello,{" "}
            <strong className="text-indigo-400 mr-1">{user.name}!</strong>
            👋️
          </p>

          <div className="flex items-center gap-3">
            <Button
              asChild
              variant={"outline"}
              className="flex items-center gap-x-2 border-indigo-500 bg-indigo-500 text-white hover:bg-indigo-700 hover:text-white"
            >
              <Link href="/agent/properties/create-property">
                <Plus />
                <span>Create listing</span>
              </Link>
            </Button>
          </div>
        </div>
      </section>
      <section className="w-full max-w-7xl mx-auto px-8 mt-16">
        <Suspense fallback={<Loader2 className="animate-spin" />}>
          <PropertiesTable />
        </Suspense>
        {/* <EmptyPlaceholder>
          <EmptyPlaceholder.Icon name="post" />
          <EmptyPlaceholder.Title>No property created</EmptyPlaceholder.Title>
          <EmptyPlaceholder.Description>
            You don&apos;t have any property yet. Start creating a listing.
          </EmptyPlaceholder.Description>
          <Button variant={"outline"} asChild>
            <Link
              href="/agent/properties/create-property"
              className="flex items-center gap-x-4"
            >
              <Plus />
              <span>Add a listing</span>
            </Link>
          </Button>
        </EmptyPlaceholder> */}
      </section>
    </div>
  );
}
