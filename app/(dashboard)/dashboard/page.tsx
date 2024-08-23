import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import prisma from "@/lib/prisma";
import {
  Users,
  HousePlus,
  LayoutList,
  ShoppingCart,
  Plus,
  Loader2,
} from "lucide-react";
import React, { Suspense } from "react";
import DashboardHeader from "../components/DashboardHeader";
import { getCurrentUser } from "@/lib/session";
import { redirect } from "next/navigation";
import { PropertiesTable } from "./properties/page";
import SearchInput from "../components/SearchInput";
import Greeting from "../components/Greeting";
import { EmptyPlaceholder } from "../components/EmptyPlaceholder";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  // Search
  const search =
    typeof searchParams.search === "string" ? searchParams.search : undefined;

  // Fetch the user's properties
  const userProperties = await prisma.property.findMany({
    where: {
      userId: user.id,
    },
  });

  const totalUsers = await prisma.user.count();
  const totalProperties = await prisma.property.count();
  const totalOrders = await prisma.order.count();
  const totalSubscriptions = await prisma.subscription.count();

  const stats = [
    {
      name: "Total Users",
      stat: totalUsers,
      icon: <Users className="size-4 text-muted-foreground" />,
    },
    {
      name: "Total Properties",
      stat: totalProperties,
      icon: <HousePlus className="size-4 text-muted-foreground" />,
    },
    {
      name: "Total Orders",
      stat: totalOrders,
      icon: <LayoutList className="size-4 text-muted-foreground" />,
    },
    {
      name: "Total Subscriptions",
      stat: totalSubscriptions,
      icon: <ShoppingCart className="size-4 text-muted-foreground" />,
    },
  ];

  return (
    <section className="px-8 pt-5">
      <div className="grid grid-cols-1 my-4 xl:grid-cols-2 xl:gap-4">
        <div className="duration-700 ease-in-out py-6">
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
            <div className="inline-flex items-center gap-0.5">
              <Greeting name={user.name!} /> &nbsp;
              {user.role === "ADMIN" && (
                <span className="text-red-500 mr-0.5"> (ADMIN) 🤪️</span>
              )}
            </div>
          </div>

          <h3 className="mb-4 text-xl font-medium text-gray-500">
            Welcome to African Real Estate
          </h3>
        </div>
      </div>

      {/* Conditional rendering of properties or no properties message */}
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

          <Suspense fallback={<Loader2 className="animate-spin" />}>
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
