import type React from "react";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Star,
  Home,
  BarChart2,
  TrendingUp,
  ShoppingCart,
  CheckCircle,
  XCircle,
  ChevronRight,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

import {
  getUserFavorites,
  getUserBookmarks,
  getUserRatings,
  getUserProperties,
  getUserStats,
  getPropertySummary,
  getAdminSummary,
  getRecentOrders,
} from "./data";
import { auth } from "@/auth";
import DashboardTabs from "../components/DashboardTabs";
import PropertyPaymentManager from "./properties/PropertyPaymentManager";
import { prisma } from "@/lib/prisma";

export default async function DashboardPage({
  searchParams = {},
}: {
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  const session = await auth();
  const user = session?.user;

  if (!user) {
    redirect("/login");
  }

  const page =
    typeof searchParams.page === "string"
      ? Number.parseInt(searchParams.page, 10)
      : 1;
  const favorites = await getUserFavorites(user.id, page);
  const bookmarks = await getUserBookmarks(user.id, page);
  const properties = await getUserProperties(user.id, page);
  const ratings = await getUserRatings(user.id);
  const stats = await getUserStats(user.id);
  const propertySummary = await getPropertySummary(user.id);

  // Fetch the user's properties
  const userProperties = await prisma.property.findMany({
    where: {
      userId: user.id,
    },
    orderBy: {
      createdAt: "desc", // Sort by most recent
    },
  });

  let adminSummary;
  let recentOrders;
  if (user.role === "ADMIN") {
    adminSummary = await getAdminSummary();
    recentOrders = await getRecentOrders(page);
  }

  const currentHour = new Date().getHours();
  let greeting = "Good evening";
  if (currentHour >= 5 && currentHour < 12) {
    greeting = "Good morning";
  } else if (currentHour >= 12 && currentHour < 18) {
    greeting = "Good afternoon";
  }

  return (
    <div className="min-h-screen">
      <Card className="bg-white sticky top-0 z-10 shadow-none">
        <div className="w-full mx-auto py-4 px-1">
          <h1 className="text-xl md:text-2xl lg:text-3xl font-bold text-gradient bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-indigo-600">
            {greeting}, {user.name}
          </h1>
          <p className="text-gray-500 mt-1 text-sm">
            Welcome to your dashboard
          </p>
        </div>
      </Card>

      <main className="w-full mx-auto py-6">
        {/* Add PropertyPaymentManager component here */}
        {userProperties.length > 0 && (
          <Card className="mb-6 bg-white shadow-md">
            <CardContent className="p-4">
              <PropertyPaymentManager
                properties={userProperties}
                user={{
                  id: user.id!,
                  email: user.email || "",
                  name: user.name || "",
                  phone: user.phoneNumber || "",
                }}
              />
            </CardContent>
          </Card>
        )}

        {user.role === "ADMIN" && adminSummary && (
          <Card className="mb-6 bg-white shadow-md">
            <CardHeader className="p-4">
              <CardTitle className="text-lg">Admin Summary</CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <StatCard
                  icon={<ShoppingCart className="h-5 w-5 text-blue-500" />}
                  title="Total Orders"
                  value={adminSummary.totalOrders}
                />
                <StatCard
                  icon={<CheckCircle className="h-5 w-5 text-green-500" />}
                  title="Total Revenue"
                  value={`KES ${adminSummary.totalRevenue.toLocaleString()}`}
                />
                <AdminPropertyCard
                  icon={<Home className="h-5 w-5 text-emerald-500" />}
                  title="Active Properties"
                  value={adminSummary.activeProperties}
                  href="/dashboard/properties?status=active"
                />
                <AdminPropertyCard
                  icon={<XCircle className="h-5 w-5 text-red-500" />}
                  title="Inactive Properties"
                  value={adminSummary.inActiveProperties}
                  href="/dashboard/properties?status=inactive"
                />
              </div>
              <div className="mt-4">
                <Link href="/dashboard/property-management">
                  <Button variant="outline" size="sm">
                    Manage All Properties
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        )}

        <Card className="mb-6 bg-white shadow-none">
          <CardHeader className="p-4">
            <CardTitle className="text-lg">Your Property Summary</CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <StatCard
                icon={<BarChart2 className="h-5 w-5 text-blue-500" />}
                title="Total Likes"
                value={propertySummary.totalLikes}
              />
              <StatCard
                icon={<TrendingUp className="h-5 w-5 text-green-500" />}
                title="Total Bookmarks"
                value={propertySummary.totalBookmarks}
              />
              <StatCard
                icon={<Star className="h-5 w-5 text-yellow-500" />}
                title="Avg Rating"
                value={propertySummary.averageRating.toFixed(1)}
              />
            </div>
          </CardContent>
        </Card>

        <DashboardTabs
          favorites={favorites}
          bookmarks={bookmarks}
          ratings={ratings}
          recentOrders={recentOrders}
          stats={stats}
          isAdmin={user.role === "ADMIN"}
        />
      </main>
    </div>
  );
}

function StatCard({
  icon,
  title,
  value,
}: {
  icon: React.ReactNode;
  title: string;
  value: number | string;
}) {
  return (
    <div className="flex items-center space-x-2">
      {icon}
      <div>
        <p className="text-xs text-gray-500">{title}</p>
        <p className="text-lg font-semibold">{value}</p>
      </div>
    </div>
  );
}

function AdminPropertyCard({
  icon,
  title,
  value,
  href,
}: {
  icon: React.ReactNode;
  title: string;
  value: number | string;
  href: string;
}) {
  return (
    <Link href={href} className="group">
      <div className="flex items-center space-x-2 p-2 rounded-md transition-colors hover:bg-gray-50">
        {icon}
        <div>
          <p className="text-xs text-gray-500">{title}</p>
          <p className="text-lg font-semibold">{value}</p>
        </div>
        <div className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity">
          <ChevronRight className="h-4 w-4 text-gray-400" />
        </div>
      </div>
    </Link>
  );
}
