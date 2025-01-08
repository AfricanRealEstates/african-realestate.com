import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { getCurrentUser } from "@/lib/session";
import { redirect } from "next/navigation";
import Greeting from "../../components/Greeting";
import {
  getActiveProperties,
  getAdminData,
  getPendingProperties,
  getRejectedProperties,
  getTotalUpvotes,
  getUsers,
} from "@/lib/actions";
import OverviewChart from "../../components/OverviewChart";
import RecentActivity from "../../components/RecentyActivity";

export default async function Admin() {
  const users = await getUsers();
  const user = await getCurrentUser();
  const activeProperties = await getActiveProperties();
  const pendingProperties = await getPendingProperties();
  const rejectedProperties = await getRejectedProperties();
  const data = await getAdminData();
  const totalUpvotes = await getTotalUpvotes();
  const premiumUsers = users.filter((user) => user.isPremium);

  if (!user) {
    redirect("/login");
  }

  // If the user is not an admin, return null to prevent the page from rendering
  if (!user || user.role !== "ADMIN") {
    return null;
  }

  return (
    <section className="px-8 pt-12 flex flex-col">
      <div className="flex flex-col gap-4 mb-4 text-lg font-medium text-blue-600">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="inline-flex items-center gap-0.5">
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
            <Greeting name={user.name!} /> &nbsp;
          </div>
          {user.role === "ADMIN" && (
            <span className="text-red-500 mr-0.5"> (ADMIN) 🤪️</span>
          )}
        </div>

        <div className="hidden md:block">
          <p className="text-gray-400 text-base">
            Here is what&apos;s happening in your business today
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-6">
        <Card className="bg-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-md font-bold">Users</CardTitle>👤
          </CardHeader>
          <CardContent>{users.length}</CardContent>
        </Card>

        <Card className="bg-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-md font-bold">Premium Users</CardTitle>{" "}
            💰
          </CardHeader>
          <CardContent>{premiumUsers.length}</CardContent>
        </Card>

        <Card className="bg-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-md font-bold">
              Active Properties
            </CardTitle>{" "}
            📦
          </CardHeader>
          <CardContent>{activeProperties.length}</CardContent>
        </Card>

        <Card className="bg-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-md font-bold">
              Pending Properties
            </CardTitle>{" "}
            🕒
          </CardHeader>
          <CardContent>{pendingProperties.length}</CardContent>
        </Card>

        <Card className="bg-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-md font-bold">
              Rejected Properties
            </CardTitle>
            👤
          </CardHeader>
          <CardContent>{rejectedProperties.length}</CardContent>
        </Card>

        <Card className="bg-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-md font-bold">
              Favorited Properties
            </CardTitle>{" "}
            🔺
          </CardHeader>
          <CardContent>{totalUpvotes}</CardContent>
        </Card>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-7 my-8 gap-4">
        <Card className="col-span-4 bg-white">
          <CardHeader>
            <CardTitle className="pb-10">Overview</CardTitle>
          </CardHeader>
          <CardContent className="pl-2">
            <OverviewChart data={data} />
          </CardContent>
        </Card>

        <Card className="w-full col-span-4 md:col-span-3 bg-white">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>View recent activity</CardDescription>
          </CardHeader>
          <CardContent>
            <RecentActivity users={users} />
          </CardContent>
        </Card>
      </div>

      <Separator className="my-10" />

      <div className="pb-10 space-y-10">
        <h1 className="text-2xl font-bold">Properties Pending Approval</h1>
        {/* <PendingProducts
    pendingProducts={pendingProducts}
    authenticatedUser={authenticatedUser}
  /> */}
      </div>
    </section>
  );
}
