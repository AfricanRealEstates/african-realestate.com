"use client";
import Image from "next/image";
import { formatDate } from "date-fns";
import { useRouter, useSearchParams } from "next/navigation";
import UserActions from "./UserActions";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import type { User } from "@prisma/client";

interface UsersTableProps {
  users: User[];
  totalUsers: number;
  currentPage: number;
  totalPages: number;
  perPage: number;
  searchParams: { [key: string]: string | string[] | undefined };
  isAdmin: boolean;
}

export default function UsersTable({
  users,
  totalUsers,
  currentPage,
  totalPages,
  perPage,
  searchParams,
  isAdmin,
}: UsersTableProps) {
  const router = useRouter();
  const search = useSearchParams();

  const createPageURL = (pageNumber: number | string) => {
    const params = new URLSearchParams(search?.toString());
    if (pageNumber === 1) {
      params.delete("page");
    } else {
      params.set("page", pageNumber.toString());
    }
    return `/dashboard/users?${params.toString()}`;
  };

  // Generate pagination items
  const generatePaginationItems = () => {
    const items = [];
    const maxVisiblePages = 5;

    // Always show first page
    items.push(
      <PaginationItem key="1">
        <PaginationLink href={createPageURL(1)} isActive={currentPage === 1}>
          1
        </PaginationLink>
      </PaginationItem>
    );

    if (totalPages <= maxVisiblePages) {
      // Show all pages if total is less than max visible
      for (let i = 2; i <= totalPages; i++) {
        items.push(
          <PaginationItem key={i}>
            <PaginationLink
              href={createPageURL(i)}
              isActive={currentPage === i}
            >
              {i}
            </PaginationLink>
          </PaginationItem>
        );
      }
    } else {
      // Show ellipsis and surrounding pages
      if (currentPage > 3) {
        items.push(
          <PaginationItem key="start-ellipsis">
            <PaginationEllipsis />
          </PaginationItem>
        );
      }

      // Show current page and surrounding pages
      for (
        let i = Math.max(2, currentPage - 1);
        i <= Math.min(totalPages - 1, currentPage + 1);
        i++
      ) {
        items.push(
          <PaginationItem key={i}>
            <PaginationLink
              href={createPageURL(i)}
              isActive={currentPage === i}
            >
              {i}
            </PaginationLink>
          </PaginationItem>
        );
      }

      if (currentPage < totalPages - 2) {
        items.push(
          <PaginationItem key="end-ellipsis">
            <PaginationEllipsis />
          </PaginationItem>
        );
      }

      // Always show last page
      if (totalPages > 1) {
        items.push(
          <PaginationItem key={totalPages}>
            <PaginationLink
              href={createPageURL(totalPages)}
              isActive={currentPage === totalPages}
            >
              {totalPages}
            </PaginationLink>
          </PaginationItem>
        );
      }
    }

    return items;
  };

  return (
    <>
      <div className="mt-8 flow-root">
        <div className="overflow-x-auto">
          <div className="inline-block min-w-full align-middle">
            <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
              <table className="min-w-full divide-y divide-gray-300">
                {/* ... table header and body remain the same ... */}
                <thead className="bg-gray-50 uppercase">
                  <tr>
                    <th className="py-3.5 pl-4 pr-3 text-left text-xs font-medium text-gray-500 sm:pl-6">
                      <span className="sr-only">Select</span>
                    </th>
                    <th className="py-3.5 px-3 text-left text-xs font-medium text-gray-500">
                      Name
                    </th>
                    <th className="py-3.5 px-3 text-left text-xs font-medium text-gray-500 hidden sm:table-cell">
                      Agent Name
                    </th>
                    <th className="py-3.5 px-3 text-left text-xs font-medium text-gray-500 hidden md:table-cell">
                      Whatsapp Number
                    </th>
                    <th className="py-3.5 px-3 text-left text-xs font-medium text-gray-500 hidden lg:table-cell">
                      Role
                    </th>
                    <th className="py-3.5 px-3 text-left text-xs font-medium text-gray-500 hidden xl:table-cell">
                      Joined
                    </th>
                    <th className="py-3.5 px-3 text-left text-xs font-medium text-gray-500">
                      Status
                    </th>
                    <th className="py-3.5 px-3 text-left text-xs font-medium text-gray-500">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {users.map((user) => (
                    <tr key={user.id}>
                      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                        <input
                          type="checkbox"
                          className="size-4 border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-blue-300"
                        />
                      </td>
                      <td className="whitespace-nowrap py-4 px-3 text-sm">
                        <div className="flex items-center">
                          <div className="size-10 flex-shrink-0">
                            <Image
                              className="size-10 rounded-full"
                              src={user.image || "/assets/placeholder.jpg"}
                              alt={`Picture of ${user.name}`}
                              width={40}
                              height={40}
                            />
                          </div>
                          <div className="ml-4">
                            <div className="font-medium text-gray-900">
                              {user.name}
                            </div>
                            <div className="text-gray-500">{user.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="whitespace-nowrap py-4 px-3 text-sm text-gray-500 hidden sm:table-cell">
                        {user.agentName || "-"}
                      </td>
                      <td className="whitespace-nowrap py-4 px-3 text-sm text-gray-500 hidden md:table-cell">
                        {user.whatsappNumber || "-"}
                      </td>
                      <td className="whitespace-nowrap py-4 px-3 text-sm text-gray-500 hidden lg:table-cell">
                        {user.role}
                      </td>
                      <td className="whitespace-nowrap py-4 px-3 text-sm text-gray-500 hidden xl:table-cell">
                        {formatDate(user.createdAt, "MMM d, yyyy")}
                      </td>
                      <td className="whitespace-nowrap py-4 px-3 text-sm text-gray-500">
                        <div className="flex items-center">
                          <div
                            className={`size-2.5 rounded-full mr-2 ${user.isActive ? "bg-green-400" : "bg-red-500"}`}
                          ></div>
                          {user.isActive
                            ? "Active"
                            : user.suspensionEndDate
                              ? `Suspended until ${formatDate(user.suspensionEndDate, "MMM d, yyyy")}`
                              : "Blocked"}
                        </div>
                      </td>
                      <td className="whitespace-nowrap py-4 pl-3 pr-4 text-sm font-medium sm:pr-6">
                        {isAdmin && <UserActions user={user} />}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      <div className="mt-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-sm text-gray-700">
          Showing{" "}
          <span className="font-semibold">
            {(currentPage - 1) * perPage + 1}
          </span>{" "}
          to{" "}
          <span className="font-semibold">
            {Math.min(currentPage * perPage, totalUsers)}
          </span>{" "}
          of <span className="font-semibold">{totalUsers}</span> users
        </p>

        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                href={createPageURL(currentPage - 1)}
                aria-disabled={currentPage <= 1}
              />
            </PaginationItem>

            {generatePaginationItems()}

            <PaginationItem>
              <PaginationNext
                href={createPageURL(currentPage + 1)}
                aria-disabled={currentPage >= totalPages}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </>
  );
}
