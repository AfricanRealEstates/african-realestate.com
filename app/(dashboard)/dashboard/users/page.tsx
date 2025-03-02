import { Suspense } from "react";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import Loading from "./loading";
import UsersContent from "./UserContent";
import { UserRole } from "@prisma/client";

export default async function UsersPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const session = await auth();
  const isAdmin = session?.user?.role === "ADMIN";

  const search =
    typeof searchParams.search === "string" ? searchParams.search : undefined;

  // Get role filter from searchParams and validate it's a valid UserRole
  const roleFilter =
    typeof searchParams.role === "string"
      ? Object.values(UserRole).includes(searchParams.role as UserRole)
        ? (searchParams.role as UserRole)
        : undefined
      : undefined;

  const perPage = 5;

  // Build where clause for Prisma query
  const whereClause = {
    ...(search && {
      name: {
        contains: search,
      },
    }),
    ...(roleFilter && {
      role: roleFilter,
    }),
  };

  // Get total users count with filters
  const totalUsers = await prisma.user.count({
    where: whereClause,
  });

  const totalPages = Math.ceil(totalUsers / perPage);

  const page =
    typeof searchParams.page === "string" &&
    +searchParams.page > 1 &&
    +searchParams.page <= totalPages
      ? +searchParams.page
      : 1;

  // Fetch users with filters
  const users = await prisma.user.findMany({
    take: perPage,
    skip: (page - 1) * perPage,
    where: whereClause,
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <section className="px-4 sm:px-8 pt-5 flex flex-col h-full overflow-hidden">
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
            clipRule="evenodd"
            fillRule="evenodd"
            d="M13.5 4.938a7 7 0 11-9.006 1.737c.202-.257.59-.218.793.039.278.352.594.672.943.954.332.269.786-.049.773-.476a5.977 5.977 0 01.572-2.759 6.026 6.026 0 012.486-2.665c.247-.14.55-.016.677.238A6.967 6.967 0 0013.5 4.938zM14 12a4 4 0 01-4 4c-1.913 0-3.52-1.398-3.91-3.182-.093-.429.44-.643.814-.413a4.043 4.043 0 001.601.564c.303.038.531-.24.51-.544a5.975 5.975 0 011.315-4.192.447.447 0 01.431-.16A4.001 4.001 0 0114 12z"
          ></path>
        </svg>
        Those who love AFRICAN REAL ESTATE&trade; 💪️
      </div>

      <Suspense fallback={<Loading />}>
        <UsersContent
          users={users}
          totalUsers={totalUsers}
          currentPage={page}
          totalPages={totalPages}
          perPage={perPage}
          searchParams={searchParams}
          isAdmin={isAdmin}
          roleFilter={roleFilter}
        />
      </Suspense>
    </section>
  );
}
