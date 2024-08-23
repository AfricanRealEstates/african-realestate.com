import React, { Suspense } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import prisma from "@/lib/prisma";
import SearchInput from "../../components/SearchInput";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { MoreVertical, Plus, SquarePen, Trash2 } from "lucide-react";
import IconMenu from "@/components/globals/icon-menu";
import Loading from "./loading";
import { auth } from "@/auth"; // Assuming you have a function to fetch the logged-in user
import Breadcrumb from "../../components/BreadcrumbDashboard";
import { formatDate } from "date-fns";
import { EmptyPlaceholder } from "../../components/EmptyPlaceholder";
import { getCurrentUser } from "@/lib/session";
import { redirect } from "next/navigation";

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
              <button className="flex items-center gap-3 w-full rounded-md bg-indigo-600 py-1.5 px-3 text-center text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
                <Plus className="size-4" />
                Add properties
              </button>
              <a
                href="#"
                className="inline-flex items-center justify-center w-1/2 px-3 py-2.5 text-sm font-medium text-center text-gray-800 bg-gray-100 border-gray-50 rounded-lg hover:bg-gray-200 focus:ring-4 focus:ring-blue-300 sm:w-auto"
              >
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
              </a>
            </div>
          </div>

          <Suspense fallback={<Loading />}>
            <PropertiesTable searchParams={searchParams} />
          </Suspense>
        </>
      ) : (
        <>
          <EmptyPlaceholder>
            <EmptyPlaceholder.Icon name="post" />
            <EmptyPlaceholder.Title className="text-gray-500">
              No property so far
            </EmptyPlaceholder.Title>
            <EmptyPlaceholder.Description>
              You don&apos;t have any property yet. Start creating one here.
            </EmptyPlaceholder.Description>
            <Button
              asChild
              className="bg-blue-500 text-white hover:bg-blue-600"
            >
              <Link href="">Add Property</Link>
            </Button>
          </EmptyPlaceholder>
        </>
      )}
    </section>
  );
}

export async function PropertiesTable({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const search =
    typeof searchParams.search === "string" ? searchParams.search : undefined;

  // Fetch the authenticated user
  const user = await auth();

  if (!user) {
    return <p>You must be logged in to view properties.</p>;
  }

  const perPage = 5;

  // Fetch the properties based on the role of the user
  const whereClause = {
    title: {
      contains: search,
    },
    ...(user.user.role !== "ADMIN" && {
      userId: user.user.id, // Fetch only properties for the logged-in user if not ADMIN
    }),
  };

  const totalProperties = await prisma.property.count({
    where: whereClause,
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
    where: whereClause,
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
      <div className="mt-8 flow-root">
        <div className="-my-2 -mx-6">
          <div className="inline-block min-w-full py-2 align-middle px-6">
            <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 rounded-lg">
              <table className="min-w-full divide-y divide-gray-300">
                <thead className="bg-gray-50 uppercase">
                  <tr>
                    <th className="p-4">
                      <div className="flex items-center">
                        <input
                          id="checkbox-all"
                          type="checkbox"
                          aria-describedby="checkbox-1"
                          className="size-4 border-gray-300 rounded bg-white focus:ring-3 focus:ring-blue-300"
                        />
                        <label
                          htmlFor="checkbox-all"
                          className="sr-only"
                        ></label>
                      </div>
                    </th>

                    <th className="p-4 text-xs font-medium text-left text-gray-500">
                      Title
                    </th>

                    <th className="p-4 text-xs font-medium text-left text-gray-500">
                      Status
                    </th>
                    <th className="p-4 text-xs font-medium text-left text-gray-500">
                      Property Detail
                    </th>
                    <th className="p-4 text-xs font-medium text-left text-gray-500">
                      Currency
                    </th>
                    <th className="p-4 text-xs font-medium text-left text-gray-500">
                      Price
                    </th>
                    <th className="p-4 text-xs font-medium text-left text-gray-500">
                      Added on
                    </th>
                    <th className="p-4 text-xs font-medium text-left text-gray-500">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {properties.map((property) => (
                    <tr key={property.id} className="hover:bg-gray-100">
                      <td className="w-4 p-4">
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            id={`checkbox-${property.id}`}
                            className="size-4 border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-blue-300"
                          />
                          <label
                            htmlFor={`checkbox-${property.id}`}
                            className="sr-only"
                          >
                            checkbox
                          </label>
                        </div>
                      </td>
                      <td className="p-4 text-base font-normal text-gray-900 whitespace-nowrap">
                        {property.title}
                      </td>
                      <td className="p-4 text-base font-normal text-gray-900 whitespace-nowrap capitalize">
                        {property.status}
                      </td>
                      <td className="p-4 text-base font-normal text-gray-900 whitespace-nowrap">
                        {property.propertyDetails}
                      </td>
                      <td className="p-4 text-base font-normal text-gray-900 whitespace-nowrap">
                        {property.currency}
                      </td>
                      <td className="p-4 text-base font-normal text-gray-900 whitespace-nowrap">
                        {property.price.toLocaleString()}
                      </td>
                      <td className="p-4 text-base font-normal text-gray-900 whitespace-nowrap">
                        {formatDate(property.createdAt, "MMM d, yyyy")}
                      </td>
                      <td className="p-4 text-base font-normal text-gray-900 whitespace-nowrap">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              className="flex size-8 p-0 data-[state=open]:bg-muted"
                            >
                              <MoreVertical className="size-4" />
                              <span className="sr-only">Open menu</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent
                            align="end"
                            className="w-[160px] z-50"
                          >
                            <DropdownMenuItem className="group flex w-full items-center justify-between text-left p-0 text-sm font-base text-neutral-500">
                              <button className="w-full justify-start flex rounded-md p-2 transition-all duration-75 hover:bg-neutral-100">
                                <IconMenu
                                  text="Edit"
                                  icon={<SquarePen className="size-4" />}
                                />
                              </button>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="group flex w-full items-center justify-between  text-left p-0 text-sm font-base text-neutral-500 ">
                              <button className="w-full justify-start flex text-red-500 rounded-md p-2 transition-all duration-75 hover:bg-neutral-100">
                                <IconMenu
                                  text="Delete"
                                  icon={<Trash2 className="size-4" />}
                                />
                              </button>
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
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
}

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
      href={`/dashboard/properties/?${newSearchParams}`}
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
      href={`/dashboard/properties/?${newSearchParams}`}
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
