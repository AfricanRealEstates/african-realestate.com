import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Suspense } from "react";
import PropertiesTable from "./PropertiesTable";
import Loading from "./loading";
import { prisma } from "@/lib/prisma";
import { PaginationComponent } from "./Pagination";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";

interface SearchParams {
  status?: string;
  page?: string;
  search?: string;
}

export default async function PropertiesManagementPage({
  searchParams = {},
}: {
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    redirect("/dashboard");
  }

  const status = searchParams.status as string | undefined;
  const search = searchParams.search as string | undefined;
  const page =
    typeof searchParams.page === "string"
      ? Number.parseInt(searchParams.page, 10)
      : 1;
  const limit = 10;
  const skip = (page - 1) * limit;

  // Determine the active tab based on the status query parameter
  let activeTab = "all";
  if (status === "active") activeTab = "active";
  if (status === "inactive") activeTab = "inactive";

  // Build the where clause based on the status and search query
  const whereClause: any = {};
  if (status === "active") whereClause.isActive = true;
  if (status === "inactive") whereClause.isActive = false;

  if (search) {
    // Check if search is a number (for propertyNumber)
    const isNumeric = /^\d+$/.test(search);

    whereClause.OR = [
      // If search is numeric, search by propertyNumber as a number
      ...(isNumeric ? [{ propertyNumber: Number.parseInt(search, 10) }] : []),
      // Text-based searches
      { title: { contains: search, mode: "insensitive" } },
      { location: { contains: search, mode: "insensitive" } },
      { description: { contains: search, mode: "insensitive" } },
      { country: { contains: search, mode: "insensitive" } },
      { county: { contains: search, mode: "insensitive" } },
      { locality: { contains: search, mode: "insensitive" } },
      { propertyType: { contains: search, mode: "insensitive" } },
      { user: { name: { contains: search, mode: "insensitive" } } },
      { user: { email: { contains: search, mode: "insensitive" } } },
    ];
  }

  // Get total count for pagination
  const totalProperties = await prisma.property.count({
    where: whereClause,
  });

  const totalPages = Math.ceil(totalProperties / limit);

  return (
    <div className="container mx-auto py-2 px-2">
      <div className="relative h-full">
        <Card>
          <CardHeader>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <CardTitle className="text-xl sm:text-2xl font-bold">
                Properties Management
              </CardTitle>

              {/* Search Form */}
              <form
                className="flex w-full md:w-auto"
                action="/dashboard/property-management"
                method="get"
              >
                {status && <input type="hidden" name="status" value={status} />}
                <div className="relative flex-1 md:w-80">
                  <Input
                    type="text"
                    name="search"
                    placeholder="Search properties..."
                    defaultValue={search || ""}
                    className="pr-10"
                  />
                  <Button
                    type="submit"
                    size="icon"
                    variant="ghost"
                    className="absolute right-0 top-0 h-full"
                  >
                    <Search className="h-4 w-4" />
                  </Button>
                </div>
              </form>
            </div>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue={activeTab} className="w-full">
              <TabsList className="grid w-full grid-cols-3 mb-6 overflow-x-auto">
                <Link
                  href={`/dashboard/property-management${search ? `?search=${encodeURIComponent(search)}` : ""}`}
                  className="w-full"
                >
                  <TabsTrigger
                    value="all"
                    className="w-full text-xs sm:text-sm"
                  >
                    All Properties
                  </TabsTrigger>
                </Link>
                <Link
                  href={`/dashboard/property-management?status=active${search ? `&search=${encodeURIComponent(search)}` : ""}`}
                  className="w-full"
                >
                  <TabsTrigger
                    value="active"
                    className="w-full text-xs sm:text-sm"
                  >
                    Active Properties
                  </TabsTrigger>
                </Link>
                <Link
                  href={`/dashboard/property-management?status=inactive${search ? `&search=${encodeURIComponent(search)}` : ""}`}
                  className="w-full"
                >
                  <TabsTrigger
                    value="inactive"
                    className="w-full text-xs sm:text-sm"
                  >
                    Inactive Properties
                  </TabsTrigger>
                </Link>
              </TabsList>

              <div className="overflow-x-auto">
                <Suspense fallback={<Loading />}>
                  <TabsContent value="all">
                    <PropertiesTable page={page} search={search} />
                  </TabsContent>
                  <TabsContent value="active">
                    <PropertiesTable
                      status="active"
                      page={page}
                      search={search}
                    />
                  </TabsContent>
                  <TabsContent value="inactive">
                    <PropertiesTable
                      status="inactive"
                      page={page}
                      search={search}
                    />
                  </TabsContent>
                </Suspense>
              </div>
            </Tabs>

            {/* Improved Pagination */}
            {totalPages > 1 && (
              <div className="mt-6 flex justify-center">
                <PaginationComponent
                  currentPage={page}
                  totalPages={totalPages}
                  baseUrl="/dashboard/property-management"
                  queryParams={{
                    ...(status ? { status } : {}),
                    ...(search ? { search } : {}),
                  }}
                />
              </div>
            )}

            {/* Show search results info */}
            {search && (
              <div className="mt-4 text-sm text-muted-foreground">
                Found {totalProperties}{" "}
                {totalProperties === 1 ? "property" : "properties"} matching
                &quot;
                {search}&quot;{status && ` with status: ${status}`}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
