import React from "react";
import { Sheet, SheetContent, SheetTrigger } from "../ui/sheet";
import { Button } from "../ui/button";
import { CircleUser, Menu, Search } from "lucide-react";
import Link from "next/link";
import {
  Bell,
  Home,
  LineChart,
  Package,
  Package2,
  ShoppingCart,
  Users,
} from "lucide-react";
import { Badge } from "../ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Input } from "../ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import Image from "next/image";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import prisma from "@/lib/prisma";

export default async function Header() {
  const userId = await getServerSession(authOptions);
  // get posts

  const posts = await prisma.post.findMany({
    orderBy: { createdAt: "desc" },
  });

  const [userSubscription, propertiesCount] = (await Promise.all([
    prisma.subscription.findFirst({
      where: {
        userId: userId?.user.id,
      },
      orderBy: {
        createdAt: "desc",
      },
    }),
    prisma.property.count({
      where: {
        userId: userId?.user.id,
      },
    }),
  ])) as any;
  return (
    <div>
      <header className="flex h-14 items-center gap-4 border-b bg-gray-50 px-4 lg:h-[60px] lg:px-6">
        <Sheet>
          <SheetTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="shrink-0 md:hidden"
            >
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle navigation menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="flex flex-col">
            <nav className="grid gap-2 text-lg font-medium">
              <Link
                href="/"
                className="flex items-center gap-2 text-lg font-semibold"
              >
                <Package2 className="h-6 w-6" />
                <span className="sr-only">African Real Estate</span>
              </Link>
              <hr className="my-3" />
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
            <div className="mt-auto">
              {!userSubscription ? (
                <Card>
                  <CardHeader className="p-2 pt-0 md:p-4">
                    <CardTitle className="text-lg">Upgrade to Pro</CardTitle>
                    <CardDescription className="text-sm">
                      Unlock all features and get unlimited access to our
                      support team
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
                        Congratulations! You have the Silver Package powers.
                        Post more properties and enjoy more perks
                      </CardDescription>
                    </CardHeader>
                  </Card>
                </>
              )}
            </div>
          </SheetContent>
        </Sheet>
        <div className="w-full flex-1">
          <form>
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                type="search"
                placeholder="Search..."
                className="w-full appearance-none bg-white pl-8 shadow-none md:w-2/3 lg:w-1/3"
              />
            </div>
          </form>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild className="bg-white">
            <Button variant="secondary" size="icon" className="rounded-full">
              <Image
                src={userId?.user.image || "/assets/placeholder.jpg"}
                height={20}
                width={30}
                alt="User"
                className="rounded-full object-cover"
              />
              <span className="sr-only">Toggle user menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Settings</DropdownMenuItem>
            <DropdownMenuItem>Support</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Logout</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </header>
    </div>
  );
}
