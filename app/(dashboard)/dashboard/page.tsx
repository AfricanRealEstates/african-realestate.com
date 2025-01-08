import React from "react";
import Link from "next/link";
import Image from "next/image";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
<<<<<<< HEAD
import { Heart, Bookmark, Star, Home, ChevronRight, BarChart2, TrendingUp, Award, MoreVertical, Edit, Copy, Trash, DollarSign, ShoppingCart, CheckCircle, XCircle } from 'lucide-react';
=======
import {
  Heart,
  Bookmark,
  Star,
  Home,
  ChevronRight,
  BarChart2,
  TrendingUp,
  Award,
  MoreVertical,
  Edit,
  Copy,
  Trash,
} from "lucide-react";
>>>>>>> f588dfc1d1d2f657f3c33a7620ad863c09c74e3e
import {
  getUserFavorites,
  getUserBookmarks,
  getUserRatings,
  getUserProperties,
  getUserStats,
  getPropertySummary,
<<<<<<< HEAD
  getAdminSummary,
  getRecentOrders,
=======
>>>>>>> f588dfc1d1d2f657f3c33a7620ad863c09c74e3e
} from "./data";
import { auth } from "@/auth";
import { deleteProperty } from "@/actions/deleteProperty";

export default async function Component({
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
    typeof searchParams.page === "string" ? parseInt(searchParams.page, 10) : 1;
  const favorites = await getUserFavorites(user.id, page);
  const bookmarks = await getUserBookmarks(user.id, page);
  const properties = await getUserProperties(user.id, page);
  const ratings = await getUserRatings(user.id);
  const stats = await getUserStats(user.id);
  const propertySummary = await getPropertySummary(user.id);

<<<<<<< HEAD
  // Fetch admin summary and recent orders if user is an admin
  let adminSummary;
  let recentOrders;
  if (user.role === 'ADMIN') {
    adminSummary = await getAdminSummary();
    recentOrders = await getRecentOrders(page);
  }

=======
>>>>>>> f588dfc1d1d2f657f3c33a7620ad863c09c74e3e
  const currentHour = new Date().getHours();
  let greeting = "Good evening";
  if (currentHour < 12) {
    greeting = "Good morning";
  } else if (currentHour < 18) {
    greeting = "Good afternoon";
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <h1 className="text-xl md:text-2xl lg:text-3xl font-bold text-gradient bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-indigo-600">
            {greeting}, {user.name}
          </h1>
          <p className="text-gray-500 mt-1 text-sm">
            Welcome to your dashboard
          </p>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6">
<<<<<<< HEAD
        {user.role === 'ADMIN' && adminSummary && (
          <Card className="mb-6 bg-white shadow-md">
            <CardHeader className="p-4">
              <CardTitle className="text-lg">Admin Summary</CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <StatCard
                  icon={<ShoppingCart className="h-5 w-5 text-blue-500" />}
                  title="Total Orders"
                  value={adminSummary.totalOrders}
                />
                <StatCard
                  icon={<DollarSign className="h-5 w-5 text-green-500" />}
                  title="Total Revenue"
                  value={`KES ${adminSummary.totalRevenue.toLocaleString()}`}
                />
                <StatCard
                  icon={<CheckCircle className="h-5 w-5 text-emerald-500" />}
                  title="Active Properties"
                  value={adminSummary.activeProperties}
                />
                <StatCard
                  icon={<XCircle className="h-5 w-5 text-red-500" />}
                  title="Expired Properties"
                  value={adminSummary.expiredProperties}
                />
              </div>
            </CardContent>
          </Card>
        )}

=======
>>>>>>> f588dfc1d1d2f657f3c33a7620ad863c09c74e3e
        <Card className="mb-6 bg-white shadow-md">
          <CardHeader className="p-4">
            <CardTitle className="text-lg">Your Property Summary</CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <div className="grid grid-cols-3 gap-4">
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

        <Card className="bg-white shadow-md flex flex-col h-[calc(100vh-200px)]">
          <CardContent className="p-0 flex flex-col h-full">
            <Tabs
              defaultValue="properties"
              className="w-full h-full flex flex-col"
            >
              <div className="border-b">
                <TabsList className="flex w-full justify-start">
                  <TabsTrigger
                    value="properties"
                    className="flex-shrink-0 px-3 py-2 flex items-center text-sm"
                  >
                    <Home className="h-4 w-4 mr-1" />
                    <span className="hidden sm:inline">Properties</span>
                    <span className="ml-1 bg-primary text-primary-foreground rounded-full px-1.5 py-0.5 text-xs">
                      {stats.propertiesCount}
                    </span>
                  </TabsTrigger>
                  <TabsTrigger
                    value="favorites"
                    className="flex-shrink-0 px-3 py-2 flex items-center text-sm"
                  >
                    <Heart className="h-4 w-4 mr-1" />
                    <span className="hidden sm:inline">Favorites</span>
                  </TabsTrigger>
                  <TabsTrigger
                    value="bookmarks"
                    className="flex-shrink-0 px-3 py-2 flex items-center text-sm"
                  >
                    <Bookmark className="h-4 w-4 mr-1" />
                    <span className="hidden sm:inline">Bookmarks</span>
                  </TabsTrigger>
                  <TabsTrigger
                    value="ratings"
                    className="flex-shrink-0 px-3 py-2 flex items-center text-sm"
                  >
                    <Star className="h-4 w-4 mr-1" />
                    <span className="hidden sm:inline">Ratings</span>
                  </TabsTrigger>
<<<<<<< HEAD
                  {user.role === 'ADMIN' && (
                    <TabsTrigger
                      value="orders"
                      className="flex-shrink-0 px-3 py-2 flex items-center text-sm"
                    >
                      <ShoppingCart className="h-4 w-4 mr-1" />
                      <span className="hidden sm:inline">Orders</span>
                    </TabsTrigger>
                  )}
=======
>>>>>>> f588dfc1d1d2f657f3c33a7620ad863c09c74e3e
                </TabsList>
              </div>
              <div className="flex-grow overflow-y-auto">
                <TabsContent value="properties" className="h-full">
                  <PropertyList
                    properties={properties.items}
                    currentPage={properties.currentPage}
                    totalPages={properties.totalPages}
                    emptyMessage="You haven't posted any properties yet."
                    showActions={true}
                  />
                </TabsContent>
                <TabsContent value="favorites" className="h-full">
                  <PropertyList
                    properties={favorites.items}
                    currentPage={favorites.currentPage}
                    totalPages={favorites.totalPages}
                    emptyMessage="You haven't favorited any properties yet."
                    showActions={false}
                  />
                </TabsContent>
                <TabsContent value="bookmarks" className="h-full">
                  <PropertyList
                    properties={bookmarks.items}
                    currentPage={bookmarks.currentPage}
                    totalPages={bookmarks.totalPages}
                    emptyMessage="You haven't bookmarked any properties yet."
                    showActions={false}
                  />
                </TabsContent>
                <TabsContent value="ratings" className="h-full">
                  <RatingsList ratings={ratings} />
                </TabsContent>
<<<<<<< HEAD
                {user.role === 'ADMIN' && recentOrders && (
                  <TabsContent value="orders" className="h-full">
                    <OrdersList
                      orders={recentOrders.orders}
                      currentPage={recentOrders.currentPage}
                      totalPages={recentOrders.totalPages}
                    />
                  </TabsContent>
                )}
=======
>>>>>>> f588dfc1d1d2f657f3c33a7620ad863c09c74e3e
              </div>
            </Tabs>
          </CardContent>
        </Card>
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

function PropertyList({
  properties,
  currentPage,
  totalPages,
  emptyMessage,
  showActions,
}: {
  properties: any[];
  currentPage: number;
  totalPages: number;
  emptyMessage: string;
  showActions: boolean;
}) {
  if (properties.length === 0) {
    return <p className="text-center text-gray-500">{emptyMessage}</p>;
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {properties.map((property) => (
          <Card key={property.id} className="bg-white shadow-sm">
            <div className="relative h-40">
              <Image
                src={property.coverPhotos[0]}
                alt={property.title}
                layout="fill"
                objectFit="cover"
              />
            </div>
            <CardContent className="p-3">
              <h3 className="font-semibold text-base mb-1 line-clamp-1">
                {property.title}
              </h3>
              <p className="text-gray-600 text-sm mb-1 line-clamp-1">
                {property.locality}, {property.county}
              </p>
              <p className="font-bold text-base mb-2">
                {property.currency} {property.price.toLocaleString()}
              </p>
              <div className="flex justify-between items-center">
                <Button
                  asChild
                  size="sm"
                  className="bg-blue-500 hover:bg-blue-600 active:bg-blue-700 text-white transition-colors"
                >
                  <Link
                    href={`/properties/${property.propertyDetails}/${property.id}`}
                  >
                    View Details
                  </Link>
                </Button>
                {showActions && (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem asChild>
                        <Link
                          href={`/agent/properties/edit-property/${property.id}`}
                        >
                          <Edit className="mr-2 h-4 w-4" />
                          Edit
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link
                          href={`/agent/properties/create-property?cloneFrom=${property.id}`}
                        >
                          <Copy className="mr-2 h-4 w-4" />
                          Duplicate
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <form action={deleteProperty}>
                          <input
                            type="hidden"
                            name="propertyId"
                            value={property.id}
                          />
                          <button
                            type="submit"
                            className="flex items-center w-full"
                          >
                            <Trash className="mr-2 h-4 w-4" />
                            Delete
                          </button>
                        </form>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      <Pagination currentPage={currentPage} totalPages={totalPages} />
    </div>
  );
}

function Pagination({
  currentPage,
  totalPages,
}: {
  currentPage: number;
  totalPages: number;
}) {
  return (
    <div className="flex justify-center space-x-2">
      <Button variant="outline" size="sm" disabled={currentPage === 1} asChild>
        <Link href={`?page=${currentPage - 1}`}>Previous</Link>
      </Button>
      <span className="flex items-center text-sm">
        Page {currentPage} of {totalPages}
      </span>
      <Button
        variant="outline"
        size="sm"
        disabled={currentPage === totalPages}
        asChild
      >
        <Link href={`?page=${currentPage + 1}`}>Next</Link>
      </Button>
    </div>
  );
}

function RatingsList({ ratings }: { ratings: any[] }) {
  if (ratings.length === 0) {
    return (
      <p className="text-center text-gray-500">
        You haven&apos;t rated any properties yet.
      </p>
    );
  }

  return (
    <div className="space-y-3">
      {ratings.map((rating) => (
        <Card key={rating.id} className="bg-white shadow-sm">
          <CardContent className="p-3 flex items-center space-x-3">
            <Avatar className="h-10 w-10">
              <AvatarImage
                src={rating.property.coverPhotos[0]}
                alt={rating.property.title}
              />
              <AvatarFallback>{rating.property.title[0]}</AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-sm truncate">
                {rating.property.title}
              </h3>
              <p className="text-xs text-gray-500 truncate">
                {rating.property.locality}, {rating.property.county}
              </p>
            </div>
            <div className="flex items-center">
              <Star className="h-4 w-4 text-yellow-500 mr-1" />
              <span className="font-bold text-sm">
                {rating.ratings.toFixed(1)}
              </span>
            </div>
            <Button variant="ghost" size="sm" className="p-1" asChild>
              <Link
                href={`/properties/${rating.property.propertyDetails}/${rating.property.id}`}
              >
                <ChevronRight className="h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
<<<<<<< HEAD

function OrdersList({
  orders,
  currentPage,
  totalPages,
}: {
  orders: any[];
  currentPage: number;
  totalPages: number;
}) {
  if (orders.length === 0) {
    return <p className="text-center text-gray-500">No orders found.</p>;
  }

  return (
    <div className="space-y-4">
      <div className="grid gap-4">
        {orders.map((order) => (
          <Card key={order.id} className="bg-white shadow-sm">
            <CardContent className="p-4">
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-semibold text-base">Order #{order.id}</h3>
                <span className="text-sm text-gray-500">
                  {new Date(order.createdAt).toLocaleDateString()}
                </span>
              </div>
              <p className="text-sm text-gray-600 mb-1">
                User: {order.user.name} ({order.user.email})
              </p>
              <p className="text-sm text-gray-600 mb-1">
                Property: {order.property.title}
              </p>
              <p className="font-bold text-base">
                Amount: KES {order.pricePaid.toLocaleString()}
              </p>
              <Button
                asChild
                size="sm"
                className="mt-2 bg-blue-500 hover:bg-blue-600 active:bg-blue-700 text-white transition-colors"
              >
                <Link href={`/properties/${order.property.propertyDetails}/${order.property.id}`}>
                  View Property
                </Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
      <Pagination currentPage={currentPage} totalPages={totalPages} />
    </div>
  );
}
=======
>>>>>>> f588dfc1d1d2f657f3c33a7620ad863c09c74e3e
