import { Suspense } from "react";
import { getCurrentUser } from "@/lib/session";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import SearchInput from "../../components/SearchInput";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Loading from "./loading";
import { EmptyPlaceholder } from "../../components/EmptyPlaceholder";
import PropertyPaymentManager from "./PropertyPaymentManager";

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
    <section className="pt-2 flex flex-col relative">
      <h1 className="text-xl lg:font-semibold text-gray-900 sm:text-2xl mb-4">
        All properties
      </h1>
      {userProperties.length > 0 ? (
        <>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-2 lg:mb-8">
            <div className="w-full sm:w-80 mb-4 sm:mb-0">
              <SearchInput search={search} searchType="properties" />
            </div>
            <div className="flex items-center space-x-2 sm:space-x-3">
              <Button asChild>
                <Link
                  href="/agent/properties/create-property"
                  className="flex items-center gap-3 text-sm"
                >
                  <Plus className="size-4" />
                  Add properties
                </Link>
              </Button>
            </div>
          </div>
          <div className="mb-6 overflow-hidden">
            <Suspense fallback={<Loading />}>
              <PropertyPaymentManager
                properties={userProperties}
                user={{
                  id: user.id || "",
                  email: user.email || "",
                  name: user.name || "",
                  phone: user.phoneNumber || "",
                }}
              />
            </Suspense>
          </div>
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
