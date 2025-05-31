import Link from "next/link";
import { getSEOTags, renderSchemaTags } from "@/lib/seo";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Award,
  Users,
  Building,
  Shield,
  ArrowRight,
  Sparkles,
  TrendingUp,
  AlertCircle,
} from "lucide-react";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { getCurrentUser } from "@/lib/session";
import {
  getPersonalizedProfessionals,
  getTopProfessionals,
  getProfessionalCounts,
} from "@/actions/getPersonalizedProfessionals";
import ProfessionalCard from "./_components/professional-card";

export const metadata = getSEOTags({
  title: "Agencies & Agents | African Real Estate",
  description:
    "Explore our network of expert real estate agencies and agents offering tailored solutions to your property needs. Connect with professionals and find your dream property today.",
  canonicalUrlRelative: "agencies",
});

type TabType = "all" | "agencies" | "agents";

interface SearchParams {
  [key: string]: string | string[] | undefined;
}

export default async function AgenciesAndAgents({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const currentUser = await getCurrentUser();
  const isLoggedIn = !!currentUser;

  // Parse search parameters
  const page =
    typeof searchParams.page === "string"
      ? Number.parseInt(searchParams.page)
      : 1;
  const tab =
    typeof searchParams.tab === "string"
      ? (searchParams.tab as TabType)
      : ("all" as TabType);
  const search =
    typeof searchParams.search === "string" ? searchParams.search : undefined;
  const sortBy =
    typeof searchParams.sort === "string" ? searchParams.sort : "random";
  const refreshSeed =
    typeof searchParams.refresh === "string"
      ? Number.parseInt(searchParams.refresh)
      : undefined;

  // Get counts for all professional types
  const counts = await getProfessionalCounts();

  // Get top professionals (randomized per user)
  const topProfessionals = await getTopProfessionals(3, refreshSeed);

  // Get professionals for current tab (randomized per user)
  const roleFilter =
    tab === "all" ? "ALL" : tab === "agencies" ? "AGENCY" : "AGENT";
  const professionalsData = await getPersonalizedProfessionals({
    role: roleFilter as any,
    page,
    limit: 12,
    search,
    sortBy: sortBy as any,
    refreshSeed,
  });

  // Render pagination component (limited to 6 pages)
  const renderPagination = (
    currentTab: TabType,
    totalPages: number,
    hasMore: boolean
  ) => {
    if (totalPages <= 1) return null;

    return (
      <div className="space-y-4 mt-4">
        <div className="flex justify-center">
          <Pagination>
            <PaginationContent>
              {page > 1 && (
                <PaginationItem>
                  <PaginationPrevious
                    href={`?tab=${currentTab}&page=${page - 1}&${search ? `search=${search}&` : ""}sort=${sortBy}`}
                  />
                </PaginationItem>
              )}

              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (pageNum) => (
                  <PaginationItem key={pageNum}>
                    <PaginationLink
                      href={`?tab=${currentTab}&page=${pageNum}&${search ? `search=${search}&` : ""}sort=${sortBy}`}
                      isActive={page === pageNum}
                    >
                      {pageNum}
                    </PaginationLink>
                  </PaginationItem>
                )
              )}

              {page < totalPages && (
                <PaginationItem>
                  <PaginationNext
                    href={`?tab=${currentTab}&page=${page + 1}&${search ? `search=${search}&` : ""}sort=${sortBy}`}
                  />
                </PaginationItem>
              )}
            </PaginationContent>
          </Pagination>
        </div>

        {/* Show message if there are more results beyond 6 pages */}
        {hasMore && (
          <div className="text-center">
            <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 px-4 py-2 rounded-lg text-sm">
              <AlertCircle className="h-4 w-4" />
              <span>
                Showing first 6 pages. Use search to find specific
                professionals.
              </span>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {renderSchemaTags()}

      {/* Hero Section */}
      <div className="bg-white border-b border-gray-200">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:py-24 lg:py-32">
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-4 mt-4">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
              <span className="text-sm font-medium text-blue-600 uppercase tracking-wide">
                Professional Network
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-gray-900 mb-6">
              Agencies & Agents
            </h1>

            <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              Connect with our network of verified real estate professionals.
              These experienced agents and agencies help buyers, sellers, and
              renters navigate the African property market.
            </p>

            {/* Dynamic personalization indicator */}
            {isLoggedIn && (
              <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 px-4 py-2 rounded-full text-sm font-medium mb-8">
                <Sparkles className="h-4 w-4" />
                Personalized recommendations for you
              </div>
            )}

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 max-w-2xl mx-auto">
              <div className="bg-blue-50 p-4 sm:p-6 rounded-xl">
                <div className="text-2xl sm:text-3xl font-bold text-blue-900 mb-1">
                  {/* {counts.totalProfessionals} */}
                  300+
                </div>
                <div className="text-sm text-blue-700">Total Professionals</div>
              </div>
              <div className="bg-green-50 p-4 sm:p-6 rounded-xl">
                <div className="text-2xl sm:text-3xl font-bold text-green-900 mb-1">
                  {/* {counts.totalAgencies} */}
                  200+
                </div>
                <div className="text-sm text-green-700">Active Agencies</div>
              </div>
              <div className="bg-purple-50 p-4 sm:p-6 rounded-xl">
                <div className="text-2xl sm:text-3xl font-bold text-purple-900 mb-1">
                  {/* {counts.totalAgents} */}
                  100+
                </div>
                <div className="text-sm text-purple-700">Licensed Agents</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Top Professionals Section */}
        {topProfessionals.length > 0 && (
          <div className="mb-12 sm:mb-16">
            <div className="text-center mb-8">
              <div className="flex items-center justify-center gap-2 mb-4">
                <Award className="h-6 w-6 text-amber-500" />
                <span className="text-sm font-medium text-amber-600 uppercase tracking-wide">
                  {isLoggedIn ? "Recommended for You" : "Top Performers"}
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
                {isLoggedIn
                  ? "Featured Professionals"
                  : "Top Performing Professionals"}
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                {isLoggedIn
                  ? "Professionals selected based on your preferences and activity"
                  : "Our highest-rated professionals with the most active listings"}
              </p>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {topProfessionals.map((professional, index) => (
                <ProfessionalCard
                  key={professional.id}
                  professional={professional}
                  isLoggedIn={isLoggedIn}
                  showTopBadge={!isLoggedIn}
                  rank={index + 1}
                />
              ))}
            </div>
          </div>
        )}

        {/* Main Content with Tabs */}
        <Tabs defaultValue={tab} className="w-full">
          {/* Tab Navigation */}
          <div className="flex justify-center mb-8">
            <TabsList className="grid w-full max-w-md grid-cols-3 h-auto p-1">
              <TabsTrigger
                value="all"
                asChild
                className="data-[state=active]:bg-white"
              >
                <Link
                  href="?tab=all&page=1"
                  className="flex items-center gap-2 px-4 py-3"
                >
                  <Users className="h-4 w-4" />
                  <span className="hidden sm:inline">All</span>
                  <span className="text-xs">({counts.totalProfessionals})</span>
                </Link>
              </TabsTrigger>
              <TabsTrigger
                value="agencies"
                asChild
                className="data-[state=active]:bg-white"
              >
                <Link
                  href="?tab=agencies&page=1"
                  className="flex items-center gap-2 px-4 py-3"
                >
                  <Building className="h-4 w-4" />
                  <span className="hidden sm:inline">Agencies</span>
                  <span className="text-xs">({counts.totalAgencies})</span>
                </Link>
              </TabsTrigger>
              <TabsTrigger
                value="agents"
                asChild
                className="data-[state=active]:bg-white"
              >
                <Link
                  href="?tab=agents&page=1"
                  className="flex items-center gap-2 px-4 py-3"
                >
                  <Users className="h-4 w-4" />
                  <span className="hidden sm:inline">Agents</span>
                  <span className="text-xs">({counts.totalAgents})</span>
                </Link>
              </TabsTrigger>
            </TabsList>
          </div>

          {/* Search and Filters */}
          {/* <div className="mb-8">
            <SearchAndFilters
              currentTab={tab}
              onRefresh={() => {
                const newRefreshSeed = Math.floor(Math.random() * 10000);
                const params = new URLSearchParams(window.location.search);
                params.set("refresh", newRefreshSeed.toString());
                params.set("page", "1");
                window.location.href = `?${params.toString()}`;
              }}
              isRefreshing={false}
            />
          </div> */}

          {/* Dynamic content indicator */}
          {isLoggedIn && (
            <div className="flex items-center justify-center gap-2 text-sm text-gray-600 mb-6">
              <TrendingUp className="h-4 w-4 text-blue-500" />
              <span>Results are personalized based on your activity</span>
            </div>
          )}

          {/* Tab Content */}
          <TabsContent value="all">
            {professionalsData.professionals.length > 0 ? (
              <>
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {professionalsData.professionals
                    .slice(0, 6)
                    .map((professional) => (
                      <ProfessionalCard
                        key={professional.id}
                        professional={professional}
                        isLoggedIn={isLoggedIn}
                      />
                    ))}
                </div>
                {renderPagination(
                  "all",
                  professionalsData.totalPages,
                  professionalsData.hasMore
                )}
              </>
            ) : (
              <Card>
                <CardContent className="p-8 sm:p-12 text-center">
                  <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {search
                      ? "No professionals found"
                      : "No Active Professionals Found"}
                  </h3>
                  <p className="text-gray-600">
                    {search
                      ? `No professionals match your search for "${search}". Try different keywords.`
                      : "We're currently onboarding new professionals. Check back soon."}
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="agencies">
            {professionalsData.professionals.length > 0 ? (
              <>
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {professionalsData.professionals.slice(0, 6).map((agency) => (
                    <ProfessionalCard
                      key={agency.id}
                      professional={agency}
                      isLoggedIn={isLoggedIn}
                    />
                  ))}
                </div>
                {renderPagination(
                  "agencies",
                  professionalsData.totalPages,
                  professionalsData.hasMore
                )}
              </>
            ) : (
              <Card>
                <CardContent className="p-8 sm:p-12 text-center">
                  <Building className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {search ? "No agencies found" : "No Active Agencies Found"}
                  </h3>
                  <p className="text-gray-600">
                    {search
                      ? `No agencies match your search for "${search}". Try different keywords.`
                      : "We're currently onboarding new agencies. Check back soon."}
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="agents">
            {professionalsData.professionals.length > 0 ? (
              <>
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {professionalsData.professionals.slice(0, 6).map((agent) => (
                    <ProfessionalCard
                      key={agent.id}
                      professional={agent}
                      isLoggedIn={isLoggedIn}
                    />
                  ))}
                </div>
                {renderPagination(
                  "agents",
                  professionalsData.totalPages,
                  professionalsData.hasMore
                )}
              </>
            ) : (
              <Card>
                <CardContent className="p-8 sm:p-12 text-center">
                  <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {search ? "No agents found" : "No Active Agents Found"}
                  </h3>
                  <p className="text-gray-600">
                    {search
                      ? `No agents match your search for "${search}". Try different keywords.`
                      : "We're currently onboarding new agents. Check back soon."}
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>

        {/* CTA Section */}
        <div className="mt-16 sm:mt-24">
          <Card className="border-0 shadow-lg bg-white">
            <CardContent className="p-8 sm:p-12 text-center">
              <div className="max-w-4xl mx-auto">
                <div className="flex items-center justify-center mb-6">
                  <div className="p-3 bg-blue-100 rounded-full">
                    <Building className="h-8 w-8 text-blue-600" />
                  </div>
                </div>

                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
                  Join African Real Estate
                </h2>

                <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
                  List your properties, connect with clients, and grow your
                  business with the leading real estate platform in Africa.
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
                  <Button asChild size="lg" className="w-full sm:w-auto">
                    <Link href="/pricing" className="flex items-center gap-2">
                      View Partner Plans
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </Button>
                  <Button
                    asChild
                    variant="outline"
                    size="lg"
                    className="w-full sm:w-auto"
                  >
                    <Link href="/contact">Contact Partnership Team</Link>
                  </Button>
                </div>

                {/* Benefits Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
                  <div className="text-center bg-gray-50 p-6 rounded-xl">
                    <Building className="h-8 w-8 text-blue-600 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">For Agencies</h3>
                    <p className="text-gray-600 text-sm mb-4">
                      Showcase your portfolio and connect with clients across
                      Africa.
                    </p>
                    <ul className="space-y-2 text-sm text-gray-600">
                      <li className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                        Dedicated agency profile
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                        Multiple property listings
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                        Analytics dashboard
                      </li>
                    </ul>
                  </div>

                  <div className="text-center bg-gray-50 p-6 rounded-xl">
                    <Users className="h-8 w-8 text-blue-600 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">For Agents</h3>
                    <p className="text-gray-600 text-sm mb-4">
                      Build your personal brand and connect directly with
                      clients.
                    </p>
                    <ul className="space-y-2 text-sm text-gray-600">
                      <li className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                        Professional agent profile
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                        Direct client inquiries
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                        Lead generation tools
                      </li>
                    </ul>
                  </div>

                  <div className="text-center bg-gray-50 p-6 rounded-xl md:col-span-1">
                    <Shield className="h-8 w-8 text-blue-600 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">
                      Premium Benefits
                    </h3>
                    <p className="text-gray-600 text-sm mb-4">
                      Unlock additional features with premium plans.
                    </p>
                    <ul className="space-y-2 text-sm text-gray-600">
                      <li className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                        Featured listings
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                        Priority placement
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                        Advanced marketing tools
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
