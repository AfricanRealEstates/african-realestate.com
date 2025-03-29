"use client";
import { useState } from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Heart, Bookmark, Star, ShoppingCart, ChevronDown } from "lucide-react";

interface DashboardTabsProps {
  favorites: any;
  bookmarks: any;
  ratings: any[];
  recentOrders?: any;
  stats: any;
  isAdmin: boolean;
}

export default function DashboardTabs({
  favorites,
  bookmarks,
  ratings,
  recentOrders,
  stats,
  isAdmin,
}: DashboardTabsProps) {
  const [activeTab, setActiveTab] = useState("orders");

  const tabs = [
    ...(isAdmin ? [{ id: "orders", label: "Orders", icon: ShoppingCart }] : []),
    { id: "favorites", label: "Favorites", icon: Heart },
    { id: "bookmarks", label: "Bookmarks", icon: Bookmark },
    { id: "ratings", label: "Ratings", icon: Star },
  ];

  return (
    <Card className="bg-white shadow-none flex flex-col h-full">
      <CardContent className="p-0 flex flex-col h-full">
        <div className="border-b p-2 md:p-4">
          <div className="md:hidden">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="w-full justify-between">
                  <span className="flex items-center">
                    {(() => {
                      const activeTabObj = tabs.find(
                        (tab) => tab.id === activeTab
                      );
                      return (
                        activeTabObj?.icon && (
                          <activeTabObj.icon className="h-4 w-4 mr-2" />
                        )
                      );
                    })()}
                    {tabs.find((tab) => tab.id === activeTab)?.label}
                  </span>
                  <ChevronDown className="h-4 w-4 ml-2" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-full">
                {tabs.map((tab) => (
                  <DropdownMenuItem
                    key={tab.id}
                    onSelect={() => setActiveTab(tab.id)}
                  >
                    <tab.icon className="h-4 w-4 mr-2" />
                    <span>{tab.label}</span>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <div className="hidden md:flex space-x-2 overflow-x-auto">
            {tabs.map((tab) => (
              <Button
                key={tab.id}
                variant={activeTab === tab.id ? "default" : "ghost"}
                className="flex-shrink-0"
                onClick={() => setActiveTab(tab.id)}
              >
                <tab.icon className="h-4 w-4 mr-2" />
                <span>{tab.label}</span>
              </Button>
            ))}
          </div>
        </div>
        <div className="flex-grow relative">
          {activeTab === "favorites" && (
            <PropertyList
              properties={favorites.items}
              currentPage={favorites.currentPage}
              totalPages={favorites.totalPages}
              emptyMessage="You haven't favorited any properties yet."
              showActions={false}
            />
          )}
          {activeTab === "bookmarks" && (
            <PropertyList
              properties={bookmarks.items}
              currentPage={bookmarks.currentPage}
              totalPages={bookmarks.totalPages}
              emptyMessage="You haven't bookmarked any properties yet."
              showActions={false}
            />
          )}
          {activeTab === "ratings" && <RatingsList ratings={ratings} />}
          {isAdmin && activeTab === "orders" && recentOrders && (
            <OrdersList
              orders={recentOrders.orders}
              currentPage={recentOrders.currentPage}
              totalPages={recentOrders.totalPages}
            />
          )}
        </div>
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
            <CardContent className="p-3 flex-grow flex flex-col">
              <h3 className="font-semibold text-base mb-1 line-clamp-1">
                {property.title}
              </h3>
              <p className="font-bold text-base mb-2">
                {property.currency} {property.price.toLocaleString()}
              </p>
              <Button
                asChild
                size="sm"
                className="bg-blue-500 hover:bg-blue-600 active:bg-blue-700 text-white transition-colors"
              >
                <Link href={`/properties/${property.id}`}>View Details</Link>
              </Button>
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
    <div className="flex flex-col sm:flex-row justify-center items-center space-y-2 sm:space-y-0 sm:space-x-2">
      <Button variant="outline" size="sm" disabled={currentPage === 1} asChild>
        <Link href={`?page=${currentPage - 1}`}>Previous</Link>
      </Button>
      <span className="text-sm">
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
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-sm truncate">
                {rating.property.title}
              </h3>
              <p className="text-xs text-gray-500 truncate">
                {rating.property.locality}, {rating.property.county}
              </p>
            </div>
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
    <div className="space-y-6 p-4">
      <div className="grid gap-6">
        {orders.map((order) => (
          <Card key={order.id} className="bg-white shadow-sm">
            <CardContent className="p-4">
              <div className="mb-4">
                {/* <img
                  src={
                    order.property.coverPhotos[0] ||
                    "/placeholder.svg?height=100&width=100"
                  }
                  alt={order.property.title}
                  className="w-full h-40 object-cover rounded-md"
                /> */}
              </div>
              <div className="flex flex-wrap justify-between items-center mb-4">
                <h3 className="font-semibold text-lg">
                  Order #{order.id.split("_")[1]}
                </h3>
                <span className="text-sm text-gray-500">
                  {new Date(order.createdAt).toLocaleDateString()}
                </span>
              </div>
              <div className="space-y-2">
                <p>
                  <span className="font-medium">Property:</span>
                  <Link
                    href={`/properties/${order.propertyDetails}/${order.propertyId}`}
                    className="text-blue-600 hover:underline"
                  >
                    View Property
                  </Link>
                </p>
                <p>
                  <span className="font-medium">Price Paid:</span>{" "}
                  {order.property.currency} {order.pricePaid.toLocaleString()}
                </p>
                <p>
                  <span className="font-medium">Tier:</span>{" "}
                  {order.tierName || "N/A"}
                </p>
                <p>
                  <span className="font-medium">Expiry Date:</span>{" "}
                  {order.expiryDate
                    ? new Date(order.expiryDate).toLocaleDateString()
                    : "N/A"}
                </p>
                <p>
                  <span className="font-medium">User:</span> {order.user.name}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      <Pagination currentPage={currentPage} totalPages={totalPages} />
    </div>
  );
}
