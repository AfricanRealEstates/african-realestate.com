"use client";
import Image from "next/image";
import { formatDate } from "date-fns";
import { useRouter, useSearchParams } from "next/navigation";
import UserActions from "./UserActions";
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

  const currentSearchParams = new URLSearchParams(search?.toString());

  if (currentPage > 1) {
    currentSearchParams.set("page", `${currentPage}`);
  }

  return (
    <>
      <div className="mt-8 flow-root">
        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
            <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
              <table className="min-w-full divide-y divide-gray-300">
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
      <div className="mt-4 flex flex-col sm:flex-row items-center justify-between">
        <p className="text-sm text-gray-700 mb-4 sm:mb-0">
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
        <div className="space-x-2">
          <PaginationButton
            direction="previous"
            currentPage={currentPage}
            totalPages={totalPages}
            currentSearchParams={currentSearchParams}
          />
          <PaginationButton
            direction="next"
            currentPage={currentPage}
            totalPages={totalPages}
            currentSearchParams={currentSearchParams}
          />
        </div>
      </div>
    </>
  );
}

interface PaginationButtonProps {
  direction: "previous" | "next";
  currentPage: number;
  totalPages: number;
  currentSearchParams: URLSearchParams;
}

function PaginationButton({
  direction,
  currentPage,
  totalPages,
  currentSearchParams,
}: PaginationButtonProps) {
  const router = useRouter();
  const newSearchParams = new URLSearchParams(currentSearchParams);

  if (direction === "previous") {
    if (currentPage > 2) {
      newSearchParams.set("page", `${currentPage - 1}`);
    } else {
      newSearchParams.delete("page");
    }
  } else {
    newSearchParams.set("page", `${currentPage + 1}`);
  }

  const handleClick = () => {
    router.push(`/dashboard/users?${newSearchParams.toString()}`);
  };

  const isDisabled =
    direction === "previous" ? currentPage <= 1 : currentPage >= totalPages;
  const buttonText = direction === "previous" ? "Previous" : "Next";

  return isDisabled ? (
    <button
      disabled
      className="inline-flex items-center justify-center rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-semibold text-gray-900 opacity-50"
    >
      {buttonText}
    </button>
  ) : (
    <button
      onClick={handleClick}
      className="inline-flex items-center justify-center rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-semibold text-gray-900 hover:bg-gray-50"
    >
      {buttonText}
    </button>
  );
}
