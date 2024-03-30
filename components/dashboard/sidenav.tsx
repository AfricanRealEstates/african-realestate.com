import {
  Bell,
  Home,
  LineChart,
  Package,
  Package2,
  ShoppingCart,
  Users,
} from "lucide-react";
import Link from "next/link";
import React from "react";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";

export default async function Sidenav() {
  const user = await getServerSession(authOptions);
  const posts = await prisma.post.findMany({
    orderBy: { createdAt: "desc" },
  });

  const [userSubscription, propertiesCount] = (await Promise.all([
    prisma.subscription.findFirst({
      where: {
        userId: user?.user.id,
      },
      orderBy: {
        createdAt: "desc",
      },
    }),
    prisma.property.count({
      where: {
        userId: user?.user.id,
      },
    }),
  ])) as any;
  return (
    <>
      <aside className="hidden border-r bg-neutral-50 md:block h-screen">
        <div className="flex h-full max-h-screen flex-col gap-2">
          <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
            <Link href="/" className="flex items-center gap-2 font-semibold">
              <Package2 className="h-6 w-6" />
              <span className="">African Real Estate</span>
            </Link>
            {/* <Button variant="outline" size="icon" className="ml-auto h-8 w-8">
              <Bell className="h-2 w-2" />
              <span className="sr-only">Toggle notifications</span>
            </Button> */}
          </div>
          {/* Side Navigations */}
          <article className="flex-1">
            <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
              <Link
                href="/dashboard"
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-gray-500 transition-all hover:bg-gray-100 hover:text-gray-700"
              >
                <Home className="h-4 w-4" />
                Dashboard
              </Link>
              <Link
                href="/dashboard/posts"
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-gray-500 transition-all hover:bg-gray-100 hover:text-gray-700"
              >
                <ShoppingCart className="h-4 w-4" />
                Posts
                {posts.length > 0 && (
                  <Badge className="ml-auto flex h-6 w-6 shrink-0 items-center justify-center rounded-full">
                    {posts.length}
                  </Badge>
                )}
              </Link>
              <Link
                href="/dashboard/properties"
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-gray-500 transition-all hover:bg-gray-100 hover:text-gray-700"
              >
                <Package className="h-4 w-4" />
                Properties
              </Link>
              <Link
                href="/dashboard/agents"
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-gray-500 transition-all hover:bg-gray-100 hover:text-gray-700"
              >
                <Users className="h-4 w-4" />
                Agents
              </Link>
              <Link
                href="/dashboard/analytics"
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-gray-500 transition-all hover:bg-gray-100 hover:text-gray-700"
              >
                <LineChart className="h-4 w-4" />
                Analytics
              </Link>
            </nav>
          </article>
          <article className="ml-auto p-4">
            {!userSubscription ? (
              <Card>
                <CardHeader className="p-2 pt-0 md:p-4">
                  <CardTitle className="text-lg">Upgrade to Pro</CardTitle>
                  <CardDescription className="text-sm">
                    Unlock all features and get unlimited access to our support
                    team
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-2 pt-0 md:p-4 md:pt-0">
                  <Button size="sm" className="w-full">
                    Upgrade
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <>
                <Card>
                  <CardHeader className="p-2 pt-0 md:p-4">
                    <CardTitle className="text-lg">
                      🎉️ {userSubscription?.plan.name} Plan
                    </CardTitle>
                    <CardDescription className="text-sm">
                      Congratulations! You have the Silver Package powers. Post
                      more properties and enjoy more perks
                    </CardDescription>
                  </CardHeader>
                </Card>
              </>
            )}
          </article>
        </div>
      </aside>
    </>
  );
}
