"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import SearchInput from "../../components/SearchInput";
import InviteUserDialog from "./InviteUserDialog";
import UsersTable from "./UsersTable";
import RoleFilter from "./RoleFilter";
import type { User, UserRole } from "@prisma/client";

interface UsersContentProps {
  users: User[];
  totalUsers: number;
  currentPage: number;
  totalPages: number;
  perPage: number;
  searchParams: { [key: string]: string | string[] | undefined };
  isAdmin: boolean;
  roleFilter?: UserRole;
}

export default function UsersContent({
  users,
  totalUsers,
  currentPage,
  totalPages,
  perPage,
  searchParams,
  isAdmin,
  roleFilter,
}: UsersContentProps) {
  const [isInviteDialogOpen, setIsInviteDialogOpen] = useState(false);
  const search =
    typeof searchParams.search === "string" ? searchParams.search : undefined;

  return (
    <>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8">
        <div className="w-full sm:w-auto mb-4 sm:mb-0">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <div className="w-full sm:w-80">
              <SearchInput search={search} searchType="users" />
            </div>

            <div className="flex items-center gap-2">
              <RoleFilter roleFilter={roleFilter} />
              <div className="flex space-x-1">
                <a
                  href="#"
                  className="inline-flex justify-center p-1 text-gray-400 rounded cursor-pointer hover:text-gray-900 hover:bg-gray-100"
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
                      clipRule="evenodd"
                    ></path>
                  </svg>
                </a>
                <a
                  href="#"
                  className="inline-flex justify-center p-1 text-gray-400 rounded cursor-pointer hover:text-gray-900 hover:bg-gray-100"
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
                      clipRule="evenodd"
                    ></path>
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-2 sm:space-x-3">
          {isAdmin && (
            <button
              onClick={() => setIsInviteDialogOpen(true)}
              className="flex items-center gap-3 w-full sm:w-auto rounded-md bg-indigo-600 py-1.5 px-3 text-center text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              <Plus className="size-4" />
              Add user
            </button>
          )}
          <a
            href="#"
            className="inline-flex items-center justify-center px-3 py-2 text-sm font-medium text-center text-gray-800 bg-gray-100 border-gray-50 rounded-lg hover:bg-gray-200 focus:ring-4 focus:ring-blue-300"
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

      <InviteUserDialog
        open={isInviteDialogOpen}
        onOpenChange={setIsInviteDialogOpen}
      />

      <UsersTable
        users={users}
        totalUsers={totalUsers}
        currentPage={currentPage}
        totalPages={totalPages}
        perPage={perPage}
        searchParams={searchParams}
        isAdmin={isAdmin}
      />
    </>
  );
}
