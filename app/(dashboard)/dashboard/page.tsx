import React from "react";
import Link from "next/link";
import Image from "next/image";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
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
  BarChart2,
  TrendingUp,
  Award,
  MoreVertical,
  Edit,
  Copy,
  Trash,
} from "lucide-react";
import {
  getUserFavorites,
  getUserBookmarks,
  getUserRatings,
  getUserProperties,
  getUserStats,
  getPropertySummary,
} from "./data";
import { auth } from "@/auth";
import { deleteProperty } from "@/actions/deleteProperty";

export default async function UserDashboard({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
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

  const currentHour = new Date().getHours();
  let greeting = "Good evening";
  if (currentHour < 12) {
    greeting = "Good morning";
  } else if (currentHour < 18) {
    greeting = "Good afternoon";
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-lg lg:text-4xl font-bold text-gradient bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-indigo-600">
            {greeting}, {user.name}
          </h1>
          <p className="text-gray-500 mt-2 text-sm lg:text-base">
            Welcome to your dashboard
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          icon={<Heart className="h-6 w-6 text-red-500" />}
          title="Favorites"
          value={stats.favoritesCount}
        />
        <StatCard
          icon={<Bookmark className="h-6 w-6 text-blue-500" />}
          title="Bookmarks"
          value={stats.bookmarksCount}
        />
        <StatCard
          icon={<Star className="h-6 w-6 text-yellow-500" />}
          title="Avg. Rating"
          value={stats.averageRating.toFixed(1)}
        />
        <StatCard
          icon={<Home className="h-6 w-6 text-green-500" />}
          title="Properties"
          value={stats.propertiesCount}
        />
      </div>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Your Property Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center space-x-2">
              <BarChart2 className="h-5 w-5 text-blue-500" />
              <span>Total Likes: {propertySummary.totalLikes}</span>
            </div>
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5 text-green-500" />
              <span>Total Bookmarks: {propertySummary.totalBookmarks}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Award className="h-5 w-5 text-yellow-500" />
              <span>
                Average Rating: {propertySummary.averageRating.toFixed(1)}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="properties" className="space-y-4">
        <ScrollArea className="w-full whitespace-nowrap rounded-md border">
          <TabsList className="inline-flex w-max p-1 h-10">
            <TabsTrigger value="properties" className="px-3">
              Your Properties
            </TabsTrigger>
            <TabsTrigger value="favorites" className="px-3">
              Favorites
            </TabsTrigger>
            <TabsTrigger value="bookmarks" className="px-3">
              Bookmarks
            </TabsTrigger>
            <TabsTrigger value="ratings" className="px-3">
              Your Ratings
            </TabsTrigger>
          </TabsList>
          <ScrollBar orientation="horizontal" className="invisible" />
        </ScrollArea>
        <TabsContent value="properties">
          <PropertyList
            properties={properties.items}
            currentPage={properties.currentPage}
            totalPages={properties.totalPages}
            emptyMessage="You haven't posted any properties yet."
            showActions={true}
          />
        </TabsContent>
        <TabsContent value="favorites">
          <PropertyList
            properties={favorites.items}
            currentPage={favorites.currentPage}
            totalPages={favorites.totalPages}
            emptyMessage="You haven't favorited any properties yet."
            showActions={false}
          />
        </TabsContent>
        <TabsContent value="bookmarks">
          <PropertyList
            properties={bookmarks.items}
            currentPage={bookmarks.currentPage}
            totalPages={bookmarks.totalPages}
            emptyMessage="You haven't bookmarked any properties yet."
            showActions={false}
          />
        </TabsContent>
        <TabsContent value="ratings">
          <RatingsList ratings={ratings} />
        </TabsContent>
      </Tabs>
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
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
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
    return <p className="text-center text-gray-500">{emptyMessage}</p>;
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {properties.map((property) => (
          <Card key={property.id} className="overflow-hidden bg-white">
            <div className="relative h-48">
              <Image
                src={property.coverPhotos[0]}
                alt={property.title}
                layout="fill"
                objectFit="cover"
              />
            </div>
            <CardContent className="p-4">
              <div>
                <h3 className="font-semibold text-lg mb-2 line-clamp-2">
                  {property.title}
                </h3>
                <p className="text-gray-600 mb-2 line-clamp-2">
                  {property.locality}, {property.county}
                </p>
                <p className="font-bold text-lg mb-4 line-clamp-2">
                  {property.currency} {property.price.toLocaleString()}
                </p>
              </div>

              <div className="flex justify-between items-center">
                <Button
                  asChild
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
                      <Button variant="ghost" className="h-8 w-8 p-0">
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
                          Clone
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
      <Button variant="outline" disabled={currentPage === 1} asChild>
        <Link href={`?page=${currentPage - 1}`}>Previous</Link>
      </Button>
      <span className="flex items-center">
        Page {currentPage} of {totalPages}
      </span>
      <Button variant="outline" disabled={currentPage === totalPages} asChild>
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
    <div className="space-y-4">
      {ratings.map((rating) => (
        <Card key={rating.id}>
          <CardContent className="p-4 flex items-center space-x-4">
            <Avatar className="h-12 w-12">
              <AvatarImage
                src={rating.property.coverPhotos[0]}
                alt={rating.property.title}
              />
              <AvatarFallback>{rating.property.title[0]}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h3 className="font-semibold">{rating.property.title}</h3>
              <p className="text-sm text-gray-500">
                {rating.property.locality}, {rating.property.county}
              </p>
            </div>
            <div className="flex items-center">
              <Star className="h-5 w-5 text-yellow-500 mr-1" />
              <span className="font-bold">{rating.ratings.toFixed(1)}</span>
            </div>
            <Button variant="ghost" size="sm" asChild>
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
