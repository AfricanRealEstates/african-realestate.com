import { Suspense } from "react";
import Link from "next/link";
import IconMenu from "@/components/globals/icon-menu";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { prisma } from "@/lib/prisma";
import { MoreVertical, Plus, SquarePen, Trash2 } from "lucide-react";
import SearchInput from "../../components/SearchInput";
import Loading from "./loading";

export default async function AgenciesPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const search =
    typeof searchParams.search === "string" ? searchParams.search : undefined;

  return (
    <section className="px-4 sm:px-8 pt-6 sm:pt-12 flex flex-col relative">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8">
        <div className="w-full sm:w-80 mb-4 sm:mb-0">
          <SearchInput search={search} searchType="agencies" />
        </div>

        <div className="w-full sm:w-auto">
          <button className="flex items-center justify-center gap-3 w-full sm:w-auto rounded-md bg-indigo-600 py-2 px-4 text-center text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
            <Plus className="size-4" />
            Add agency
          </button>
        </div>
      </div>

      <Suspense fallback={<Loading />}>
        <div className="p-2">
          <AgenciesTable searchParams={searchParams} />
        </div>
      </Suspense>
    </section>
  );
}

async function AgenciesTable({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const search =
    typeof searchParams.search === "string" ? searchParams.search : undefined;

  const perPage = 10;
  const totalAgencies = await prisma.user.count({
    where: {
      name: {
        contains: search,
      },
      role: "AGENCY",
    },
  });

  const totalPages = Math.ceil(totalAgencies / perPage);

  const page =
    typeof searchParams.page === "string" &&
    +searchParams.page > 1 &&
    +searchParams.page <= totalPages
      ? +searchParams.page
      : 1;

  const agencies = await prisma.user.findMany({
    take: perPage,
    skip: (page - 1) * perPage,
    where: {
      name: {
        contains: search,
      },
      role: "AGENCY",
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
      <p className="text-muted-foreground text-base">
        There are{" "}
        <span className="font-bold text-rose-500 underline underline-offset-4">
          {totalAgencies}
        </span>{" "}
        Agencies so far!
      </p>
      <div className="mt-8 flow-root">
        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
            <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
              <table className="min-w-full divide-y divide-gray-300">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="py-3.5 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
                      Name
                    </th>
                    <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 hidden sm:table-cell">
                      Email
                    </th>
                    <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 hidden md:table-cell">
                      ROLE
                    </th>
                    <th className="py-3.5 pl-3 pr-4 sm:pr-6 text-left text-sm font-semibold text-gray-900">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {agencies.map((user) => (
                    <tr key={user.id}>
                      <td className="whitespace-nowrap py-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                        {user.name}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 hidden sm:table-cell">
                        {user.email}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 hidden md:table-cell">
                        {user.role}
                      </td>
                      <td className="whitespace-nowrap py-4 pl-3 pr-4 sm:pr-6 text-sm font-medium">
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
                            <DropdownMenuItem className="group flex w-full items-center justify-between text-left p-0 text-sm font-base text-neutral-500">
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
      <div className="mt-4 flex flex-col sm:flex-row items-center justify-between">
        <p className="text-sm text-gray-700 mb-4 sm:mb-0">
          Showing{" "}
          <span className="font-semibold">{(page - 1) * perPage + 1}</span> to{" "}
          <span className="font-semibold">
            {Math.min(page * perPage, totalAgencies)}
          </span>{" "}
          of <span className="font-semibold">{totalAgencies}</span> agencies
        </p>
        <div className="space-x-2">
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
      href={`/dashboard/agencies/?${newSearchParams}`}
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
      href={`/dashboard/agencies/?${newSearchParams}`}
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
