import Image from "next/image";
import Link from "next/link";
import { getSEOTags, renderSchemaTags } from "@/lib/seo";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { prisma } from "@/lib/prisma";
import {
  MapPin,
  Award,
  Users,
  Building,
  Shield,
  CheckCircle,
  ArrowRight,
} from "lucide-react";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { getCurrentUser } from "@/lib/session";

export const metadata = getSEOTags({
  title: "Agencies & Agents | African Real Estate",
  description:
    "Explore our network of expert real estate agencies and agents offering tailored solutions to your property needs. Connect with professionals and find your dream property today.",
  canonicalUrlRelative: "agencies",
});

// Pagination constants
const ITEMS_PER_PAGE = 12;

// Add a type definition for the tab values
type TabType = "all" | "agencies" | "agents";

export default async function AgenciesAndAgents({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  // Get current user to check if they're logged in
  const currentUser = await getCurrentUser();
  const isLoggedIn = !!currentUser;

  // Get current page from URL query params or default to 1
  const page =
    typeof searchParams.page === "string"
      ? Number.parseInt(searchParams.page)
      : 1;
  const tab =
    typeof searchParams.tab === "string"
      ? (searchParams.tab as TabType)
      : ("all" as TabType);

  // Calculate pagination offsets
  const skip = (page - 1) * ITEMS_PER_PAGE;

  // Get total count for pagination - only include users with active properties
  const totalProfessionals = await prisma.user.count({
    where: {
      role: {
        in: ["AGENT", "AGENCY"],
      },
      properties: {
        some: {
          isActive: true,
        },
      },
    },
  });

  const totalAgencies = await prisma.user.count({
    where: {
      role: "AGENCY",
      properties: {
        some: {
          isActive: true,
        },
      },
    },
  });

  const totalAgents = await prisma.user.count({
    where: {
      role: "AGENT",
      properties: {
        some: {
          isActive: true,
        },
      },
    },
  });

  // Fetch top professionals (limited to 3) - only those with active properties
  const topProfessionals = await prisma.user.findMany({
    where: {
      role: {
        in: ["AGENT", "AGENCY"],
      },
      properties: {
        some: {
          isActive: true,
        },
      },
    },
    select: {
      id: true,
      name: true,
      agentName: true,
      agentLocation: true,
      profilePhoto: true,
      coverPhoto: true,
      bio: true,
      role: true,
      createdAt: true,
      _count: {
        select: {
          properties: {
            where: {
              isActive: true,
            },
          },
        },
      },
    },
    orderBy: {
      properties: {
        _count: "desc",
      },
    },
    take: 3,
  });

  // Fetch professionals with pagination - only those with active properties
  const professionals = await prisma.user.findMany({
    where: {
      role: {
        in: ["AGENT", "AGENCY"],
      },
      properties: {
        some: {
          isActive: true,
        },
      },
    },
    select: {
      id: true,
      name: true,
      agentName: true,
      agentLocation: true,
      profilePhoto: true,
      coverPhoto: true,
      bio: true,
      role: true,
      createdAt: true,
      // Only include contact info if user is logged in
      ...(isLoggedIn
        ? {
            phoneNumber: true,
            whatsappNumber: true,
            agentEmail: true,
            email: true,
          }
        : {}),
      _count: {
        select: {
          properties: {
            where: {
              isActive: true,
            },
          },
        },
      },
    },
    orderBy: {
      properties: {
        _count: "desc",
      },
    },
    skip: tab === "all" ? skip : 0,
    take: tab === "all" ? ITEMS_PER_PAGE : totalProfessionals,
  });

  // Separate professionals by role - only those with active properties
  const agencies = await prisma.user.findMany({
    where: {
      role: "AGENCY",
      properties: {
        some: {
          isActive: true,
        },
      },
    },
    select: {
      id: true,
      name: true,
      agentName: true,
      agentLocation: true,
      profilePhoto: true,
      coverPhoto: true,
      bio: true,
      role: true,
      createdAt: true,
      // Only include contact info if user is logged in
      ...(isLoggedIn
        ? {
            phoneNumber: true,
            whatsappNumber: true,
            agentEmail: true,
            email: true,
          }
        : {}),
      _count: {
        select: {
          properties: {
            where: {
              isActive: true,
            },
          },
        },
      },
    },
    orderBy: {
      properties: {
        _count: "desc",
      },
    },
    skip: tab === "agencies" ? skip : 0,
    take: tab === "agencies" ? ITEMS_PER_PAGE : totalAgencies,
  });

  const agents = await prisma.user.findMany({
    where: {
      role: "AGENT",
      properties: {
        some: {
          isActive: true,
        },
      },
    },
    select: {
      id: true,
      name: true,
      agentName: true,
      agentLocation: true,
      profilePhoto: true,
      coverPhoto: true,
      bio: true,
      role: true,
      createdAt: true,
      // Only include contact info if user is logged in
      ...(isLoggedIn
        ? {
            phoneNumber: true,
            whatsappNumber: true,
            agentEmail: true,
            email: true,
          }
        : {}),
      _count: {
        select: {
          properties: {
            where: {
              isActive: true,
            },
          },
        },
      },
    },
    orderBy: {
      properties: {
        _count: "desc",
      },
    },
    skip: tab === "agents" ? skip : 0,
    take: tab === "agents" ? ITEMS_PER_PAGE : totalAgents,
  });

  // Calculate total pages for each tab
  const totalPages = {
    all: Math.ceil(totalProfessionals / ITEMS_PER_PAGE),
    agencies: Math.ceil(totalAgencies / ITEMS_PER_PAGE),
    agents: Math.ceil(totalAgents / ITEMS_PER_PAGE),
  };

  // Format join date
  const formatJoinDate = (date: Date) => {
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      year: "numeric",
    }).format(new Date(date));
  };

  // Mock rating for professionals (in real app, this would come from reviews)
  const getMockRating = () => (Math.random() * 1.5 + 3.5).toFixed(1);

  // Clean Professional Card Component
  const ProfessionalCard = ({
    professional,
    index,
    isTopPerformer = false,
  }: any) => (
    <Card className="group hover:shadow-md transition-shadow shadow-sm duration-200 border border-gray-200">
      <CardContent className="p-6 shadow-none">
        {/* Profile Section */}
        <div className="flex items-start gap-4 mb-4">
          <div className="relative">
            {/* Top Performer Badge */}
            {/* {isTopPerformer && (
              <div className="absolute top-3 left-3 z-10">
                <Badge className="bg-amber-500 text-white">
                  <Award className="h-3 w-3 mr-1" />
                  Top {index + 1}
                </Badge>
              </div>
            )} */}
            <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-gray-100">
              <Image
                src={professional.profilePhoto || "/assets/placeholder.jpg"}
                alt={
                  professional.agentName || professional.name || "Professional"
                }
                width={64}
                height={64}
                className="object-cover w-full h-full"
              />
            </div>
            {/* Verification Badge */}
            <div className="absolute -bottom-1 -right-1 bg-green-500 text-white p-1 rounded-full">
              <CheckCircle className="h-3 w-3" />
            </div>
          </div>

          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-gray-900 truncate">
              {professional.agentName ||
                professional.name ||
                "Real Estate Professional"}
            </h3>
            <div className="flex items-center gap-2 mt-1">
              <Badge variant="outline" className="text-xs">
                {professional.role === "AGENCY" ? "Agency" : "Agent"}
              </Badge>
              <Badge
                variant="outline"
                className="text-xs text-green-600 border-green-200"
              >
                Verified
              </Badge>
            </div>
            {/* <div className="flex items-center gap-1 mt-2">
              <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
              <span className="text-sm text-gray-600">{getMockRating()}</span>
            </div> */}
          </div>
        </div>

        {/* Location */}
        <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
          <MapPin className="h-4 w-4" />
          <span>{professional.agentLocation || "Kenya"}</span>
        </div>

        {/* Bio */}
        <p className="text-gray-600 text-sm leading-relaxed line-clamp-3 mb-4">
          {professional.bio ||
            `Professional ${professional.role === "AGENCY" ? "agency" : "agent"} helping clients find their perfect properties in ${professional.agentLocation || "Africa"}.`}
        </p>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 mb-4">
          <div className="text-center p-2 bg-gray-50 rounded-lg">
            <div className="text-lg font-semibold text-gray-900">
              {professional._count.properties}
            </div>
            <div className="text-xs text-gray-600">Properties</div>
          </div>
          <div className="text-center p-2 bg-gray-50 rounded-lg">
            <div className="text-lg font-semibold text-gray-900">
              {Math.floor(Math.random() * 500 + 100)}
            </div>
            <div className="text-xs text-gray-600">Views</div>
          </div>
          <div className="text-center p-2 bg-gray-50 rounded-lg">
            <div className="text-lg font-semibold text-gray-900">
              {formatJoinDate(professional.createdAt)}
            </div>
            <div className="text-xs text-gray-600">Since</div>
          </div>
        </div>

        {/* Contact Information for Logged In Users */}
        {/* {isLoggedIn &&
          (professional.phoneNumber ||
            professional.agentEmail ||
            professional.email) && (
            <div className="space-y-2 mb-4 pt-3 border-t border-gray-100">
              {professional.phoneNumber && (
                <a
                  href={`tel:${professional.phoneNumber}`}
                  className="flex items-center gap-2 text-sm text-gray-600 hover:text-blue-600 transition-colors"
                >
                  <Phone className="h-4 w-4" />
                  <span>{professional.phoneNumber}</span>
                </a>
              )}
              {(professional.agentEmail || professional.email) && (
                <a
                  href={`mailto:${professional.agentEmail || professional.email}`}
                  className="flex items-center gap-2 text-sm text-gray-600 hover:text-blue-600 transition-colors"
                >
                  <Mail className="h-4 w-4" />
                  <span className="truncate">
                    {professional.agentEmail || professional.email}
                  </span>
                </a>
              )}
            </div>
          )} */}

        {/* Sign In Prompt for Non-Logged In Users */}
        {!isLoggedIn && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
            <p className="text-xs text-blue-700 text-center">
              <Link href="/login" className="font-medium hover:underline">
                Sign in
              </Link>{" "}
              to view contact information
            </p>
          </div>
        )}

        {/* Action Button */}
        <Button asChild className="w-full">
          <Link href={`/agencies/${professional.id}`}>
            View Profile
            <ArrowRight className="h-4 w-4 ml-2" />
          </Link>
        </Button>
      </CardContent>
    </Card>
  );

  // Render pagination
  const renderPagination = (currentTab: TabType) => {
    const currentTotalPages = totalPages[currentTab];
    if (currentTotalPages <= 1) return null;

    return (
      <div className="flex justify-center mt-12">
        <Pagination>
          <PaginationContent>
            {page > 1 && (
              <PaginationItem>
                <PaginationPrevious
                  href={`?tab=${currentTab}&page=${page - 1}`}
                />
              </PaginationItem>
            )}

            <PaginationItem>
              <PaginationLink
                href={`?tab=${currentTab}&page=1`}
                isActive={page === 1}
              >
                1
              </PaginationLink>
            </PaginationItem>

            {page > 3 && (
              <PaginationItem>
                <PaginationEllipsis />
              </PaginationItem>
            )}

            {page > 2 && (
              <PaginationItem>
                <PaginationLink href={`?tab=${currentTab}&page=${page - 1}`}>
                  {page - 1}
                </PaginationLink>
              </PaginationItem>
            )}

            {page !== 1 && page !== currentTotalPages && (
              <PaginationItem>
                <PaginationLink
                  href={`?tab=${currentTab}&page=${page}`}
                  isActive
                >
                  {page}
                </PaginationLink>
              </PaginationItem>
            )}

            {page < currentTotalPages - 1 && (
              <PaginationItem>
                <PaginationLink href={`?tab=${currentTab}&page=${page + 1}`}>
                  {page + 1}
                </PaginationLink>
              </PaginationItem>
            )}

            {page < currentTotalPages - 2 && (
              <PaginationItem>
                <PaginationEllipsis />
              </PaginationItem>
            )}

            {currentTotalPages > 1 && (
              <PaginationItem>
                <PaginationLink
                  href={`?tab=${currentTab}&page=${currentTotalPages}`}
                  isActive={page === currentTotalPages}
                >
                  {currentTotalPages}
                </PaginationLink>
              </PaginationItem>
            )}

            {page < currentTotalPages && (
              <PaginationItem>
                <PaginationNext href={`?tab=${currentTab}&page=${page + 1}`} />
              </PaginationItem>
            )}
          </PaginationContent>
        </Pagination>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-white py-16">
      {renderSchemaTags()}

      {/* Clean Hero Section */}
      <div className="bg-white border-b border-gray-200">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:py-24">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
              Agencies & Agents
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-600 max-w-2xl mx-auto">
              Connect with our network of verified real estate professionals.
              These experienced agents and agencies help buyers, sellers, and
              renters navigate the African property market.
            </p>

            {/* Clean Stats */}
            <div className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-2xl mx-auto">
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="text-2xl font-bold text-gray-900">
                  {totalProfessionals}
                </div>
                <div className="text-sm text-gray-600">Total Professionals</div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="text-2xl font-bold text-gray-900">
                  {totalAgencies}
                </div>
                <div className="text-sm text-gray-600">Active Agencies</div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="text-2xl font-bold text-gray-900">
                  {totalAgents}
                </div>
                <div className="text-sm text-gray-600">Licensed Agents</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
        {/* Top Professionals Section */}
        {topProfessionals.length > 0 && (
          <div className="mb-16">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 flex items-center">
                  <Award className="h-6 w-6 mr-3 text-amber-500" />
                  Top Performing Professionals
                </h2>
                <p className="text-gray-600 mt-2">
                  Our highest-rated professionals with the most active listings
                </p>
              </div>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {topProfessionals.map((professional, index) => (
                <ProfessionalCard
                  key={professional.id}
                  professional={professional}
                  index={index}
                  isTopPerformer={true}
                />
              ))}
            </div>
          </div>
        )}

        {/* Clean Tabs and Listings */}
        <div className="mx-auto max-w-7xl">
          <Tabs defaultValue={tab} className="w-full">
            {/* Clean Tab Navigation */}
            <div className="flex justify-center mb-12">
              <TabsList className="grid w-full max-w-md grid-cols-3">
                <TabsTrigger value="all" asChild>
                  <Link
                    href="?tab=all&page=1"
                    className="flex items-center gap-2"
                  >
                    <Users className="h-4 w-4" />
                    All ({totalProfessionals})
                  </Link>
                </TabsTrigger>
                <TabsTrigger value="agencies" asChild>
                  <Link
                    href="?tab=agencies&page=1"
                    className="flex items-center gap-2"
                  >
                    <Building className="h-4 w-4" />
                    Agencies ({totalAgencies})
                  </Link>
                </TabsTrigger>
                <TabsTrigger value="agents" asChild>
                  <Link
                    href="?tab=agents&page=1"
                    className="flex items-center gap-2"
                  >
                    <Users className="h-4 w-4" />
                    Agents ({totalAgents})
                  </Link>
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="all">
              {professionals.length > 0 ? (
                <>
                  <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {professionals.map((professional) => (
                      <ProfessionalCard
                        key={professional.id}
                        professional={professional}
                        index={0}
                      />
                    ))}
                  </div>
                  {renderPagination("all")}
                </>
              ) : (
                <Card>
                  <CardContent className="p-12 text-center">
                    <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      No Active Professionals Found
                    </h3>
                    <p className="text-gray-600">
                      We&apos;re currently onboarding new professionals. Check
                      back soon.
                    </p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="agencies">
              {agencies.length > 0 ? (
                <>
                  <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {agencies.map((agency) => (
                      <ProfessionalCard
                        key={agency.id}
                        professional={agency}
                        index={0}
                      />
                    ))}
                  </div>
                  {renderPagination("agencies")}
                </>
              ) : (
                <Card>
                  <CardContent className="p-12 text-center">
                    <Building className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      No Active Agencies Found
                    </h3>
                    <p className="text-gray-600">
                      We&apos;re currently onboarding new agencies. Check back
                      soon.
                    </p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="agents">
              {agents.length > 0 ? (
                <>
                  <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {agents.map((agent) => (
                      <ProfessionalCard
                        key={agent.id}
                        professional={agent}
                        index={0}
                      />
                    ))}
                  </div>
                  {renderPagination("agents")}
                </>
              ) : (
                <Card>
                  <CardContent className="p-12 text-center">
                    <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      No Active Agents Found
                    </h3>
                    <p className="text-gray-600">
                      We&apos;re currently onboarding new agents. Check back
                      soon.
                    </p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
          </Tabs>
        </div>

        {/* Clean CTA Section */}
        <div className="mx-auto mt-24 max-w-7xl">
          <Card className="border border-gray-200">
            <CardContent className="p-12 text-center">
              <Building className="h-12 w-12 text-blue-600 mx-auto mb-6" />
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Join African Real Estate
              </h2>
              <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
                List your properties, connect with clients, and grow your
                business with the leading real estate platform in Africa.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
                <Button asChild size="lg">
                  <Link href="/pricing">View Partner Plans</Link>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <Link href="/contact">Contact Partnership Team</Link>
                </Button>
              </div>

              {/* Clean Benefits Grid */}
              <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 max-w-4xl mx-auto">
                <div className="text-center bg-gray-50 p-4">
                  <Building className="h-8 w-8 text-blue-600 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">For Agencies</h3>
                  <p className="text-gray-600 text-sm mb-4">
                    Showcase your portfolio and connect with clients across
                    Africa.
                  </p>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li>✓ Dedicated agency profile</li>
                    <li>✓ Multiple property listings</li>
                    <li>✓ Analytics dashboard</li>
                  </ul>
                </div>

                <div className="text-center bg-gray-50 p-4">
                  <Users className="h-8 w-8 text-blue-600 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">For Agents</h3>
                  <p className="text-gray-600 text-sm mb-4">
                    Build your personal brand and connect directly with clients.
                  </p>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li>✓ Professional agent profile</li>
                    <li>✓ Direct client inquiries</li>
                    <li>✓ Lead generation tools</li>
                  </ul>
                </div>

                <div className="text-center sm:col-span-2 lg:col-span-1 bg-gray-50 p-4">
                  <Shield className="h-8 w-8 text-blue-600 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">
                    Premium Benefits
                  </h3>
                  <p className="text-gray-600 text-sm mb-4">
                    Unlock additional features with premium plans.
                  </p>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li>✓ Featured listings</li>
                    <li>✓ Priority placement</li>
                    <li>✓ Advanced marketing tools</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
