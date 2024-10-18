import React from "react";
import Link from "next/link";
import { formatDate } from "date-fns";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreVertical, Eye, Copy, SquarePen, Trash2 } from "lucide-react";
import IconMenu from "@/components/globals/icon-menu";
import prisma from "@/lib/prisma";
import { auth } from "@/auth";

export default async function PropertiesTable({
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

  const perPage = 10;

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
    orderBy: {
      createdAt: "desc",
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
                              <Link
                                href={`/properties/${property.propertyDetails}/${property.id}`}
                                className="w-full justify-start flex rounded-md p-2 transition-all duration-75 hover:bg-neutral-100"
                              >
                                <IconMenu
                                  text="View"
                                  icon={<Eye className="size-4" />}
                                />
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="group flex w-full items-center justify-between text-left p-0 text-sm font-base text-neutral-500">
                              <Link
                                href={`/agent/properties/create-property/?cloneFrom=${property.id}`}
                                className="w-full justify-start flex rounded-md p-2 transition-all duration-75 hover:bg-neutral-100"
                              >
                                <IconMenu
                                  text="Duplicate"
                                  icon={<Copy className="size-4" />}
                                />
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="group flex w-full items-center justify-between text-left p-0 text-sm font-base text-neutral-500">
                              <Link
                                href={`/agent/properties/edit-property/${property.id}`}
                                className="w-full justify-start flex rounded-md p-2 transition-all duration-75 hover:bg-neutral-100"
                              >
                                <IconMenu
                                  text="Edit"
                                  icon={<SquarePen className="size-4" />}
                                />
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="group flex w-full items-center justify-between  text-left p-0 text-sm font-base text-neutral-500 ">
                              <Link
                                href={`/agent/properties`}
                                className="w-full justify-start flex text-red-500 rounded-md p-2 transition-all duration-75 hover:bg-neutral-100"
                              >
                                <IconMenu
                                  text="Delete"
                                  icon={<Trash2 className="size-4" />}
                                />
                              </Link>
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
