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
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

export default async function PropertiesTable({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const search =
    typeof searchParams.search === "string" ? searchParams.search : undefined;

  const user = await auth();

  if (!user) {
    return <p>You must be logged in to view properties.</p>;
  }

  const perPage = 10;

  const whereClause = {
    title: {
      contains: search,
    },
    ...(user.user.role !== "ADMIN" && {
      userId: user.user.id,
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
        <div className="-mx-4 -my-2 sm:-mx-6">
          <div className="inline-block min-w-full py-2 align-middle">
            <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-300">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="p-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        <span className="sr-only">Select</span>
                      </th>
                      <th className="p-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Property Number
                      </th>
                      <th className="p-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Title
                      </th>
                      <th className="p-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">
                        Status
                      </th>
                      <th className="p-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell">
                        Property Detail
                      </th>
                      <th className="p-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">
                        Currency
                      </th>
                      <th className="p-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Price
                      </th>
                      <th className="p-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">
                        Added on
                      </th>
                      <th className="p-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {properties.map((property) => (
                      <tr key={property.id} className="hover:bg-gray-100">
                        <td className="p-4">
                          <input
                            type="checkbox"
                            className="size-4 border-gray-300 rounded focus:ring-blue-500"
                          />
                        </td>
                        <td className="p-4 text-sm font-medium text-gray-900">
                          {property.propertyNumber}
                        </td>
                        <td className="p-4 text-sm font-medium text-gray-900">
                          {property.title}
                        </td>
                        <td className="p-4 text-sm text-gray-500 hidden sm:table-cell capitalize">
                          {property.status}
                        </td>
                        <td className="p-4 text-sm text-gray-500 hidden lg:table-cell">
                          {property.propertyDetails}
                        </td>
                        <td className="p-4 text-sm text-gray-500 hidden md:table-cell">
                          {property.currency}
                        </td>
                        <td className="p-4 text-sm text-gray-900">
                          {property.price.toLocaleString()}
                        </td>
                        <td className="p-4 text-sm text-gray-500 hidden sm:table-cell">
                          {formatDate(property.createdAt, "MMM d, yyyy")}
                        </td>
                        <td className="p-4 text-sm font-medium">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="ghost"
                                className="size-8 p-0 data-[state=open]:bg-muted"
                              >
                                <MoreVertical className="size-4" />
                                <span className="sr-only">Open menu</span>
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent
                              align="end"
                              className="w-[160px]"
                            >
                              <DropdownMenuItem asChild>
                                <Link
                                  href={`/properties/${property.propertyDetails}/${property.id}`}
                                  className="flex w-full items-center"
                                >
                                  <IconMenu
                                    text="View"
                                    icon={<Eye className="size-4 mr-2" />}
                                  />
                                </Link>
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem asChild>
                                <Link
                                  href={`/agent/properties/create-property/?cloneFrom=${property.id}`}
                                  className="flex w-full items-center"
                                >
                                  <IconMenu
                                    text="Duplicate"
                                    icon={<Copy className="size-4 mr-2" />}
                                  />
                                </Link>
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem asChild>
                                <Link
                                  href={`/agent/properties/edit-property/${property.id}`}
                                  className="flex w-full items-center"
                                >
                                  <IconMenu
                                    text="Edit"
                                    icon={<SquarePen className="size-4 mr-2" />}
                                  />
                                </Link>
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem asChild>
                                <Link
                                  href={`/agent/properties`}
                                  className="flex w-full items-center text-red-500"
                                >
                                  <IconMenu
                                    text="Delete"
                                    icon={<Trash2 className="size-4 mr-2" />}
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
      </div>
      <div className="mt-4 flex flex-col sm:flex-row items-center justify-between">
        <p className="text-sm text-gray-700 mb-4 sm:mb-0">
          Showing{" "}
          <span className="font-semibold">{(page - 1) * perPage + 1}</span> to{" "}
          <span className="font-semibold">
            {Math.min(page * perPage, totalProperties)}
          </span>{" "}
          of <span className="font-semibold">{totalProperties}</span> properties
        </p>
        <div className="flex space-x-2">
          <PreviousPage page={page} currentSearchParams={currentSearchParams} />
          <NextPage
            page={page}
            totalPages={totalPages}
            currentSearchParams={currentSearchParams}
          />
        </div>
      </div>
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
