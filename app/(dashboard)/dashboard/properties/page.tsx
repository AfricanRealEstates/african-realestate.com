import React, { Suspense } from "react";
import { getCurrentUser } from "@/lib/session";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import SearchInput from "../../components/SearchInput";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Loading from "./loading";
import { EmptyPlaceholder } from "../../components/EmptyPlaceholder";
import PropertiesTable from "./PropertiesTable";

export default async function PropertiesPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  // Fetch the user's properties
  const userProperties = await prisma.property.findMany({
    where: {
      userId: user.id,
    },
    orderBy: {
      createdAt: "desc", // Sort by most recent
    },
  });
  const search =
    typeof searchParams.search === "string" ? searchParams.search : undefined;

  return (
    <section className="px-8 pt-5 flex flex-col">
      <h1 className="text-xl font-semibold text-gray-900 sm:text-2xl mb-4">
        All properties
      </h1>
      {userProperties.length > 0 ? (
        <>
          <div className="sm:flex items-center">
            <div className="flex items-center justify-between mb-8">
              <div className="mt-1 w-80">
                <SearchInput search={search} searchType="properties" />
              </div>
            </div>

            <div className="flex items-center ml-auto space-x-2 sm:space-x-3 mb-8">
              <Button asChild>
                <Link
                  href="/agent/properties/create-property"
                  className="flex items-center gap-3"
                >
                  <Plus className="size-4" />
                  Add properties
                </Link>
              </Button>
              <Button variant="outline">
                <Link href="#" className="flex items-center gap-3">
                  <svg
                    className="w-5 h-5 mr-2 -ml-1"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      d="M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V7.414A2 2 0 0015.414 6L12 2.586A2 2 0 0010.586 2H6zm5 6a1 1 0 10-2 0v3.586l-1.293-1.293a1 1 0 10-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 11.586V8z"
                      clipRule="evenodd"
                    ></path>
                  </svg>
                  Export
                </Link>
              </Button>
            </div>
          </div>

          <Suspense fallback={<Loading />}>
            <PropertiesTable searchParams={searchParams} />
          </Suspense>
        </>
      ) : (
        <EmptyPlaceholder>
          <EmptyPlaceholder.Icon name="post" />
          <EmptyPlaceholder.Title className="text-gray-500">
            No property so far
          </EmptyPlaceholder.Title>
          <EmptyPlaceholder.Description>
            You don&apos;t have any property yet. Start creating one here.
          </EmptyPlaceholder.Description>
          <Button asChild className="bg-blue-500 text-white hover:bg-blue-600">
            <Link href="/agent/properties/create-property">Add Property</Link>
          </Button>
        </EmptyPlaceholder>
      )}
    </section>
  );
}
