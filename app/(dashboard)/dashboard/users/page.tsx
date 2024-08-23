import IconMenu from "@/components/globals/icon-menu";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import prisma from "@/lib/prisma";
import { MoreVertical, Plus, SquarePen, Trash2 } from "lucide-react";
import Link from "next/link";
import React, { Suspense } from "react";
import SearchInput from "../../components/SearchInput";
import Loading from "./loading";
import PromoteAgent from "./PromoteAgent";
import Breadcrumb from "../../components/BreadcrumbDashboard";
import Image from "next/image";
import { UserData } from "@/lib/types";
import { formatDate } from "date-fns";

export default async function UsersPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const search =
    typeof searchParams.search === "string" ? searchParams.search : undefined;

  return (
    <section className="px-8  pt-5 flex flex-col">
      <h1 className="text-xl font-semibold text-gray-900 sm:text-2xl mb-4">
        All users
      </h1>

      <div className="flex items-center mb-4 text-lg font-medium text-blue-600">
        <svg
          className="size-6 mr-2"
          fill="currentColor"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <path
            clip-rule="evenodd"
            fillRule="evenodd"
            d="M13.5 4.938a7 7 0 11-9.006 1.737c.202-.257.59-.218.793.039.278.352.594.672.943.954.332.269.786-.049.773-.476a5.977 5.977 0 01.572-2.759 6.026 6.026 0 012.486-2.665c.247-.14.55-.016.677.238A6.967 6.967 0 0013.5 4.938zM14 12a4 4 0 01-4 4c-1.913 0-3.52-1.398-3.91-3.182-.093-.429.44-.643.814-.413a4.043 4.043 0 001.601.564c.303.038.531-.24.51-.544a5.975 5.975 0 011.315-4.192.447.447 0 01.431-.16A4.001 4.001 0 0114 12z"
          ></path>
        </svg>
        Those who love AFRICAN REAL ESTATE&trade; 💪️
      </div>

      <div className="sm:flex items-center">
        <div className="sm:flex items-center divide-x divide-gray-100 mb-8">
          <div className="mt-1 w-80 pr-6">
            <SearchInput search={search} searchType="users" />
          </div>

          <div className="flex pl-0 space-x-1 sm:pl-2">
            <a
              href="#"
              className="inline-flex justify-center p-1 text-gray-400 rounded cursor-pointer hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
            >
              <svg
                className="w-6 h-6"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z"
                  clip-rule="evenodd"
                ></path>
              </svg>
            </a>
            <a
              href="#"
              className="inline-flex justify-center p-1 text-gray-400 rounded cursor-pointer hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
            >
              <svg
                className="w-6 h-6"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                  clip-rule="evenodd"
                ></path>
              </svg>
            </a>
          </div>
        </div>

        <div className="flex items-center ml-auto space-x-2 sm:space-x-3 mb-8">
          <button className="flex items-center gap-3 w-full rounded-md bg-indigo-600 py-1.5 px-3 text-center text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
            <Plus className="size-4" />
            Add user
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
                clip-rule="evenodd"
              ></path>
            </svg>
            Export
          </a>
        </div>
      </div>

      {/* <div className="my-4">
        <PromoteAgent />
      </div> */}
      <Suspense fallback={<Loading />}>
        <UsersTable searchParams={searchParams} />
      </Suspense>
    </section>
  );
}

async function UsersTable({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const search =
    typeof searchParams.search === "string" ? searchParams.search : undefined;

  const perPage = 5;
  const totalUsers = await prisma.user.count({
    where: {
      name: {
        contains: search,
      },
    },
  });

  const totalPages = Math.ceil(totalUsers / perPage);

  const page =
    typeof searchParams.page === "string" &&
    +searchParams.page > 1 &&
    +searchParams.page <= totalPages
      ? +searchParams.page
      : 1;

  const users = await prisma.user.findMany({
    take: perPage,
    skip: (page - 1) * perPage,
    where: {
      name: {
        contains: search,
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
      <div className="mt-8 flow-root">
        <div className="-my-2 -mx-6">
          <div className="inline-block min-w-full py-2 align-middle px-6">
            <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 rounded-lg">
              <table className="min-w-full divide-y divide-gray-300 table-fixed">
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
                      Name
                    </th>
                    {/* <th className="p-4 text-xs font-medium text-left text-gray-500">
                      Bio
                    </th> */}
                    <th className="p-4 text-xs font-medium text-left text-gray-500">
                      Agent Name
                    </th>
                    <th className="p-4 text-xs font-medium text-left text-gray-500">
                      Whatsapp Number
                    </th>
                    <th className="p-4 text-xs font-medium text-left text-gray-500">
                      Role
                    </th>
                    <th className="p-4 text-xs font-medium text-left text-gray-500">
                      Status
                    </th>
                    <th className="p-4 text-xs font-medium text-left text-gray-500">
                      Joined
                    </th>
                    <th className="p-4 text-xs font-medium text-left text-gray-500">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {users.map((user) => (
                    <tr key={user.id}>
                      <td className="w-4 p-4">
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            id={`checkbox-${user.id}`}
                            className="size-4 border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-blue-300"
                          />
                          <label
                            htmlFor={`checkbox-${user.id}`}
                            className="sr-only"
                          >
                            checkbox
                          </label>
                        </div>
                      </td>
                      <td className="p-4 whitespace-nowrap flex items-center space-x-6">
                        {user.image ? (
                          <Image
                            className="size-10 rounded-full border border-gray-100"
                            src={user.image}
                            alt={`Picture of ${user.name}`}
                            width={40}
                            height={40}
                          />
                        ) : (
                          <Image
                            className="size-10 rounded-full border border-gray-100"
                            src={"/assets/placeholder.jpg"}
                            alt={`Picture of ${user.name}`}
                            width={40}
                            height={40}
                          />
                        )}
                        <div className="text-sm font-normal text-gray-500">
                          <div className="text-base font-medium text-gray-600">
                            {user.name}
                          </div>
                          <div className="text-sm font-normal text-gray-500">
                            {user.email}
                          </div>
                        </div>
                      </td>

                      {user.agentName ? (
                        <td className=" p-4 text-base font-normal text-gray-900 whitespace-nowrap">
                          {user.agentName}
                        </td>
                      ) : (
                        <td className=" p-4 text-base font-normal text-gray-900 whitespace-nowrap">
                          -
                        </td>
                      )}
                      {user.whatsappNumber ? (
                        <td className=" p-4 text-base font-normal text-gray-900 whitespace-nowrap">
                          {user.whatsappNumber}
                        </td>
                      ) : (
                        <td className=" p-4 text-base font-normal text-gray-900 whitespace-nowrap">
                          -
                        </td>
                      )}
                      <td className="p-4 text-base font-normal text-gray-900 whitespace-nowrap">
                        {user.role}
                      </td>
                      <td className="p-4 text-base font-normal text-gray-900 whitespace-nowrap">
                        <div className="flex items-center">
                          {user.isActive ? (
                            <>
                              <div className="size-2.5 rounded-full bg-green-400 mr-2"></div>{" "}
                              Active
                            </>
                          ) : (
                            <>
                              <div className="size-2.5 rounded-full bg-red-500 mr-2"></div>
                              Inactive
                            </>
                          )}
                        </div>
                      </td>
                      <td className="p-4 text-base font-normal text-gray-900 whitespace-nowrap">
                        {formatDate(user.createdAt, "MMM d, yyyy")}
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
                                  text="Block user"
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
            {Math.min(page * perPage, totalUsers)}
          </span>{" "}
          of <span className="font-semibold">{totalUsers}</span> users
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
      href={`/dashboard/users/?${newSearchParams}`}
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
      href={`/dashboard/users/?${newSearchParams}`}
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
