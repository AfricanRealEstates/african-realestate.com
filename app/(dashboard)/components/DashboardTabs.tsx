"use client";
import Link from "next/link";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Heart,
  Bookmark,
  Star,
  Home,
  ChevronRight,
  ShoppingCart,
  MoreVertical,
  Edit,
  Copy,
  Trash,
} from "lucide-react";

import { deleteProperty } from "@/actions/deleteProperty";

interface DashboardTabsProps {
  properties: any;
  favorites: any;
  bookmarks: any;
  ratings: any[];
  recentOrders?: any;
  stats: any;
  isAdmin: boolean;
}

export default function DashboardTabs({
  properties,
  favorites,
  bookmarks,
  ratings,
  recentOrders,
  stats,
  isAdmin,
}: DashboardTabsProps) {
  return (
    <Card className="bg-white shadow-md flex flex-col h-[calc(100vh-200px)]">
      <CardContent className="p-0 flex flex-col h-full">
        <Tabs defaultValue="properties" className="w-full h-full flex flex-col">
          <div className="border-b overflow-x-auto">
            <TabsList className="flex w-full justify-start">
              <TabsTrigger
                value="properties"
                className="flex-shrink-0 px-3 py-2 flex items-center text-sm"
              >
                <Home className="h-4 w-4 mr-1" />
                <span className="sm:inline">Properties</span>
                <span className="ml-1 bg-primary text-primary-foreground rounded-full px-1.5 py-0.5 text-xs">
                  {stats.propertiesCount}
                </span>
              </TabsTrigger>
              <TabsTrigger
                value="favorites"
                className="flex-shrink-0 px-3 py-2 flex items-center text-sm"
              >
                <Heart className="h-4 w-4 mr-1" />
                <span className="sm:inline">Favorites</span>
              </TabsTrigger>
              <TabsTrigger
                value="bookmarks"
                className="flex-shrink-0 px-3 py-2 flex items-center text-sm"
              >
                <Bookmark className="h-4 w-4 mr-1" />
                <span className="sm:inline">Bookmarks</span>
              </TabsTrigger>
              <TabsTrigger
                value="ratings"
                className="flex-shrink-0 px-3 py-2 flex items-center text-sm"
              >
                <Star className="h-4 w-4 mr-1" />
                <span className="sm:inline">Ratings</span>
              </TabsTrigger>
              {isAdmin && (
                <TabsTrigger
                  value="orders"
                  className="flex-shrink-0 px-3 py-2 flex items-center text-sm"
                >
                  <ShoppingCart className="h-4 w-4 mr-1" />
                  <span className="sm:inline">Orders</span>
                </TabsTrigger>
              )}
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
            {isAdmin && recentOrders && (
              <TabsContent value="orders" className="h-full">
                <OrdersList
                  orders={recentOrders.orders}
                  currentPage={recentOrders.currentPage}
                  totalPages={recentOrders.totalPages}
                />
              </TabsContent>
            )}
          </div>
        </Tabs>
      </CardContent>
    </Card>
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
    return <p className="text-center text-gray-500 p-4">{emptyMessage}</p>;
  }

  return (
    <div className="space-y-4 p-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {properties.map((property) => (
          <Card key={property.id} className="bg-white shadow-sm flex flex-col">
            <div className="relative h-40">
              <Image
                src={property.coverPhotos[0] || "/placeholder.svg"}
                alt={property.title}
                layout="fill"
                objectFit="cover"
              />
            </div>
            <CardContent className="p-3 flex-grow flex flex-col">
              <h3 className="font-semibold text-base mb-1 line-clamp-1">
                {property.title}
              </h3>
              <p className="text-gray-600 text-sm mb-1 line-clamp-1">
                {property.locality}, {property.county}
              </p>
              <p className="font-bold text-base mb-2">
                {property.currency} {property.price.toLocaleString()}
              </p>
              <div className="flex justify-between items-center mt-auto">
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
      <p className="text-center text-gray-500 p-4">
        You haven&apos;t rated any properties yet.
      </p>
    );
  }

  return (
    <div className="space-y-3 p-4">
      {ratings.map((rating) => (
        <Card key={rating.id} className="bg-white shadow-sm">
          <CardContent className="p-3 flex items-center space-x-3">
            <Avatar className="h-10 w-10 flex-shrink-0">
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
            <div className="flex items-center flex-shrink-0">
              <Star className="h-4 w-4 text-yellow-500 mr-1" />
              <span className="font-bold text-sm">
                {rating.ratings.toFixed(1)}
              </span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="p-1 flex-shrink-0"
              asChild
            >
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
    return <p className="text-center text-gray-500 p-4">No orders found.</p>;
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-6">
        {orders.map((order) => (
          <div
            key={order.id}
            className="bg-white rounded-lg border border-gray-200 p-6"
          >
            <div className="flex flex-wrap justify-between items-center mb-4">
              <h3 className="font-semibold text-lg">Order #{order.id}</h3>
              <span className="text-sm text-gray-500">
                {new Date(order.createdAt).toLocaleDateString()}
              </span>
            </div>
            <div className="space-y-2 mb-4">
              <p className="text-sm text-gray-600">
                <span className="font-medium">User:</span> {order.user.name} (
                {order.user.email})
              </p>
              <p className="text-sm text-gray-600">
                <span className="font-medium">Property:</span>{" "}
                {order.property.title}
              </p>
              <p className="text-lg font-bold">
                Amount: KES {order.pricePaid.toLocaleString()}
              </p>
            </div>
            <Button
              asChild
              size="sm"
              className="bg-blue-500 hover:bg-blue-600 text-white transition-colors"
            >
              <Link
                href={`/properties/${order.property.propertyDetails}/${order.property.id}`}
              >
                View Property
              </Link>
            </Button>
          </div>
        ))}
      </div>
      <Pagination currentPage={currentPage} totalPages={totalPages} />
    </div>
  );
}
