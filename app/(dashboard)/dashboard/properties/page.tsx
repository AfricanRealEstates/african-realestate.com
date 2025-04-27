import { Suspense } from "react";
import { getCurrentUser } from "@/lib/session";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import SearchInput from "./SearchInput";
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

  const search =
    typeof searchParams.search === "string" ? searchParams.search : undefined;

  const userProperties = await prisma.property.findMany({
    where: {
      userId: user.id,
      ...(search && {
        OR: [
          {
            title: {
              contains: search,
              mode: "insensitive",
            },
          },
          {
            propertyNumber: {
              equals: Number.isNaN(Number(search)) ? undefined : Number(search),
            },
          },
          {
            user: {
              OR: [
                {
                  name: {
                    contains: search,
                    mode: "insensitive",
                  },
                },
                {
                  email: {
                    contains: search,
                    mode: "insensitive",
                  },
                },
                {
                  phoneNumber: {
                    contains: search,
                    mode: "insensitive",
                  },
                },
              ],
            },
          },
        ],
      }),
    },
    orderBy: {
      createdAt: "desc",
    },
    include: {
      user: true, // required for searching by owner details
    },
  });

  return (
    <section className="pt-1 flex flex-col relative">
      <h1 className="text-lg lg:font-semibold text-gray-900 sm:text-2xl mb-2">
        All properties
      </h1>

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-2 lg:mb-8">
        <div className="w-full sm:w-80 mb-4 sm:mb-0">
          <SearchInput search={search} searchType="properties" />
        </div>
        <div className="flex items-center space-x-2 sm:space-x-3">
          <Button asChild>
            <Link
              href="/agent/properties/create-property"
              className="flex items-center gap-3 text-xs lg:text-sm"
            >
              <Plus className="size-4" />
              Add properties
            </Link>
          </Button>
        </div>
      </div>

      {search && (
        <p className="text-sm text-gray-600 mb-4">
          {userProperties.length}{" "}
          {userProperties.length === 1 ? "property" : "properties"} found for
          &quot;
          <span className="font-semibold">{search}</span>&quot;
        </p>
      )}

      {userProperties.length > 0 ? (
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
      ) : (
        <EmptyPlaceholder>
          <EmptyPlaceholder.Icon name="search" />
          <EmptyPlaceholder.Title className="text-gray-500">
            {search ? "No properties match your search" : "No property so far"}
          </EmptyPlaceholder.Title>
          <EmptyPlaceholder.Description>
            {search
              ? "Try adjusting your search keywords or check your spelling."
              : "You don’t have any property yet. Start creating one here."}
          </EmptyPlaceholder.Description>
          {!search && (
            <Button
              asChild
              className="bg-blue-500 text-white hover:bg-blue-600"
            >
              <Link href="/agent/properties/create-property">Add Property</Link>
            </Button>
          )}
        </EmptyPlaceholder>
      )}
    </section>
  );
}
