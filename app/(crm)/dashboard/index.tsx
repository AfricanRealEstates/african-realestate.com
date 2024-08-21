import { auth } from "@/auth";
import { SearchInput } from "@/components/crm/search-input";
import prisma from "@/lib/prisma";
import { getSEOTags } from "@/lib/seo";
import { ChevronRightIcon } from "@heroicons/react/20/solid";
import { Plus } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import React, { Suspense } from "react";
import Loading from "./loading";
import { getCurrentUser } from "@/lib/session";

export const metadata = getSEOTags({
  title: "Dashboard | African Real Estate",
  canonicalUrlRelative: "/",
});

export default async function Dashboard({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const user = await getCurrentUser();
  // const user = session?.user;

  if (!user) {
    redirect("/login");
  }

  const search =
    typeof searchParams.search === "string"
      ? searchParams.search.toLowerCase()
      : undefined;
  const properties = await prisma.property.findMany({
    where: {
      userId: user.id,
    },
  });

  return (
    <div className="h-full bg-gray-50">
      <section className="border-b border-neutral-50 bg-card mt-4">
        <div className="max-w-7xl mx-auto w-full px-8 flex flex-wrap items-center justify-between gap-6 py-3">
          <p className="text-2xl font-bold">
            Hello, <strong className="text-blue-400 mr-1">{user.name}!</strong>
            👋️
          </p>
        </div>
      </section>
      <section className="w-full lg:max-w-7xl mx-auto px-8 mt-8">
        {properties.length >= 1 && (
          <>
            <h2 className="break-normal text-lg font-medium sm:text-2xl">
              🎉 Congratulations, you&apos;ve created a listing!
            </h2>
            <h3 className="text-xs text-muted-foreground sm:text-sm mt-4">
              You can view your listings below.
            </h3>
          </>
        )}

        <article className="flex items-center justify-between mt-4">
          <div className="w-80 mt-1">
            <SearchInput search={search} />
          </div>
          <div className="mt-0 ml-16 flex-none">
            <button
              type="button"
              className="block rounded-md bg-blue-600 py-1.5 px-3 text-center text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              <Link
                href="/agent/properties/create-property"
                className="flex items-center"
              >
                <Plus className="size-4 gap-3" />
                <span>Create listing</span>
              </Link>
            </button>
          </div>
        </article>
        <Suspense fallback={<Loading />}>
          <PropertiesTable searchParams={searchParams} userId={user.id!} />
        </Suspense>
      </section>
    </div>
  );
}

const PropertiesTable = async ({
  searchParams,
  userId,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
  userId: string;
}) => {
  const search =
    typeof searchParams.search === "string"
      ? searchParams.search.toLowerCase()
      : undefined;

  const perPage = 10;
  const totalProperties = await prisma.property.count({
    where: {
      userId: userId, // Filter properties by the logged-in user ID
      title: {
        contains: search?.toLowerCase(),
      },
    },
  });
  const totalPages = Math.ceil(totalProperties / perPage);

  const page =
    typeof searchParams.page === "string" &&
    +searchParams.page > 1 &&
    +searchParams.page <= totalPages
      ? +searchParams.page
      : 1;
  const properties = await prisma.property.findMany({
    take: perPage,
    skip: (page - 1) * perPage,
    where: {
      userId: userId, // Filter properties by the logged-in user ID
      title: {
        contains: search?.toLowerCase(),
      },
    },
  });

  const currentSearchParams = new URLSearchParams();

  if (search) {
    currentSearchParams.set("search", search);
  }

  if (page > 1) {
    currentSearchParams.set("page", `${page}`);
  }
  return (
    <>
      <div className="my-2 -mx-6">
        <div className="inline-block min-w-full py-2 align-middle px-6">
          <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 rounded-lg">
            <table className="min-w-full divide-y divide-gray-300">
              <thead className="bg-gray-50">
                <tr>
                  <th className="py-3.5 pr-3 text-left text-sm font-semibold w-[62px] sm:w-auto text-gray-900 pl-4">
                    Property Name
                  </th>
                  <th className="px-3 py-3.5 text-left text-sm font-semibold w-[130px] sm:w-auto text-gray-900">
                    Currency
                  </th>
                  <th className="px-3 py-3.5 text-left text-sm font-semibold w-[130px] sm:w-auto text-gray-900">
                    Price
                  </th>
                  <th className="px-3 py-3.5 text-left text-sm font-semibold w-[175px] sm:w-auto text-gray-900">
                    status
                  </th>
                  <th className="relative py-3.5 pl-3 pr-4">
                    <span className="sr-only">Edit</span>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {properties.slice(0, 10).map((property) => (
                  <tr key={property.id}>
                    <td className="whitespace-nowrap py-4 pr-3 text-sm font-medium text-gray-900 pl-4">
                      <Link
                        href={`/properties/${property.id}`}
                        className="text-blue-500 hover:text-blue-600 transition-all hover:underline underline-offset-4"
                      >
                        {property.title}
                      </Link>
                    </td>
                    <td className="whitespace-nowrap py-4 pr-3 text-sm font-medium text-gray-900 pl-4">
                      {property.currency}
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm font-medium max-w-[130px] sm:w-auto truncate">
                      {property.price.toLocaleString()}
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 max-w-[175px] sm:w-auto truncate">
                      {property.status}
                    </td>
                    <td className="relative whitespace-nowrap py-4 pl-4 pr-4 text-right text-sm font-medium">
                      <Link
                        href={`agent/properties/edit-property/${property.id}`}
                        className="text-blue-500 hover:text-blue-600 inline-flex items-center"
                      >
                        Edit
                        <ChevronRightIcon className="w-4 h-4" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <article className="mt-4 flex items-center justify-between">
        <p className="text-sm text-gray-700">
          Showing{" "}
          <span className="font-semibold">{(page - 1) * perPage + 1}</span> to{" "}
          <span className="font-semibold">
            {Math.min(page * perPage, totalProperties)}
          </span>{" "}
          of <span className="font-semibold">{totalProperties}</span> properties
        </p>
        <div className="space-x-2">
          <PreviousPage page={page} currentSearchParams={currentSearchParams} />
          <NextPage
            page={page}
            totalPages={totalPages}
            currentSearchParams={currentSearchParams}
          />
        </div>
      </article>
    </>
  );
};
function PreviousPage({
  page,
  currentSearchParams,
}: {
  page: number;
  currentSearchParams: URLSearchParams;
}) {
  const newSearchParams = new URLSearchParams(currentSearchParams);

  if (page > 2) {
    newSearchParams.set("page", `${page - 1}`);
  } else {
    newSearchParams.delete("page");
  }

  return page > 1 ? (
    <Link
      href={`/dashboard/?${newSearchParams}`}
      className="inline-flex items-center justify-center rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-semibold text-gray-900 hover:bg-gray-50"
    >
      Previous
    </Link>
  ) : (
    <button
      disabled
      className="inline-flex items-center justify-center rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-semibold text-gray-900 opacity-50"
    >
      Previous
    </button>
  );
}

function NextPage({
  page,
  totalPages,
  currentSearchParams,
}: {
  page: number;
  totalPages: number;
  currentSearchParams: URLSearchParams;
}) {
  const newSearchParams = new URLSearchParams(currentSearchParams);

  newSearchParams.set("page", `${page + 1}`);

  return page < totalPages ? (
    <Link
      href={`/dashboard/?${newSearchParams}`}
      className="inline-flex items-center justify-center rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-semibold text-gray-900 hover:bg-gray-50"
    >
      Next
    </Link>
  ) : (
    <button
      disabled
      className="inline-flex items-center justify-center rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-semibold text-gray-900 opacity-50"
    >
      Next
    </button>
  );
}
