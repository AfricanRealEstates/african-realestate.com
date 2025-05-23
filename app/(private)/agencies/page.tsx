import Image from "next/image";
import Link from "next/link";
import { getSEOTags, renderSchemaTags } from "@/lib/seo";
import { Button } from "@/components/ui/button";
import { prisma } from "@/lib/prisma";
import {
  MapPin,
  Phone,
  Mail,
  Award,
  Users,
  Building,
  Shield,
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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

  // Get total count for pagination
  const totalProfessionals = await prisma.user.count({
    where: {
      role: {
        in: ["AGENT", "AGENCY"],
      },
      properties: {
        some: {}, // This ensures at least one property exists
      },
    },
  });

  const totalAgencies = await prisma.user.count({
    where: {
      role: "AGENCY",
      properties: {
        some: {}, // This ensures at least one property exists
      },
    },
  });

  const totalAgents = await prisma.user.count({
    where: {
      role: "AGENT",
      properties: {
        some: {}, // This ensures at least one property exists
      },
    },
  });

  // Fetch top professionals (limited to 3)
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

  // Fetch professionals with pagination
  const professionals = await prisma.user.findMany({
    where: {
      role: {
        in: ["AGENT", "AGENCY"],
      },
      properties: {
        some: {}, // This ensures at least one property exists
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

  // Separate professionals by role
  const agencies = await prisma.user.findMany({
    where: {
      role: "AGENCY",
      properties: {
        some: {}, // This ensures at least one property exists
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
        some: {}, // This ensures at least one property exists
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

  // Render pagination
  const renderPagination = (currentTab: TabType) => {
    const currentTotalPages = totalPages[currentTab];
    if (currentTotalPages <= 1) return null;

    return (
      <Pagination className="mt-12">
        <PaginationContent>
          {page > 1 && (
            <PaginationItem>
              <PaginationPrevious
                href={`?tab=${currentTab}&page=${page - 1}`}
              />
            </PaginationItem>
          )}

          {/* First page */}
          <PaginationItem>
            <PaginationLink
              href={`?tab=${currentTab}&page=1`}
              isActive={page === 1}
            >
              1
            </PaginationLink>
          </PaginationItem>

          {/* Ellipsis if needed */}
          {page > 3 && (
            <PaginationItem>
              <PaginationEllipsis />
            </PaginationItem>
          )}

          {/* Pages around current page */}
          {page > 2 && (
            <PaginationItem>
              <PaginationLink href={`?tab=${currentTab}&page=${page - 1}`}>
                {page - 1}
              </PaginationLink>
            </PaginationItem>
          )}

          {page !== 1 && page !== currentTotalPages && (
            <PaginationItem>
              <PaginationLink href={`?tab=${currentTab}&page=${page}`} isActive>
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

          {/* Ellipsis if needed */}
          {page < currentTotalPages - 2 && (
            <PaginationItem>
              <PaginationEllipsis />
            </PaginationItem>
          )}

          {/* Last page */}
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
    );
  };

  return (
    <div className="bg-white">
      {renderSchemaTags()}
      <div className="mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
            Agencies & Agents
          </h1>
          <p className="mt-6 text-base leading-8 text-gray-600">
            Connect with our network of trusted real estate professionals. These
            experienced agents and agencies help buyers, sellers, and renters
            navigate the African property market.
          </p>
        </div>

        {/* Top Professionals Section */}
        <div className="mt-16">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-gray-900 flex items-center">
              <Award className="h-6 w-6 mr-2 text-amber-500" />
              Top Performing Professionals
            </h2>
            {/* <Link
              href="?tab=all&page=1"
              className="text-blue-600 hover:text-blue-800 font-medium flex items-center"
            >
              View all professionals
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="size-4 ml-1"
              >
                <path d="M5 12h14" />
                <path d="m12 5 7 7-7 7" />
              </svg>
            </Link> */}
          </div>

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {topProfessionals.map((professional, index) => (
              <div
                key={professional.id}
                className="group relative flex flex-col rounded-xl border border-gray-200 bg-white shadow-sm hover:shadow-md transition-shadow overflow-hidden"
              >
                <div className="absolute top-4 right-4 z-10">
                  <div className="bg-amber-500 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center">
                    <Award className="h-3 w-3 mr-1" />
                    Top {index + 1}
                  </div>
                </div>
                <div className="relative h-40 w-full overflow-hidden bg-gray-100">
                  <Image
                    src={professional.coverPhoto || "/assets/house-1.jpg"}
                    alt={
                      professional.agentName ||
                      professional.name ||
                      "Real Estate Professional"
                    }
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
                  <div className="absolute bottom-4 left-4 right-4 flex items-center gap-4">
                    <div className="relative h-16 w-16 overflow-hidden rounded-full border-2 border-white bg-white">
                      <Image
                        src={
                          professional.profilePhoto || "/assets/placeholder.jpg"
                        }
                        alt={
                          professional.agentName || professional.name || "Agent"
                        }
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white">
                        {professional.agentName ||
                          professional.name ||
                          "Real Estate Professional"}
                      </h3>
                      <p className="text-sm text-white/80">
                        {professional.role === "AGENCY" ? "Agency" : " Agent"}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="flex-1 p-6">
                  <div className="flex items-center gap-x-2 text-sm text-gray-500 mb-4">
                    <MapPin className="h-4 w-4 text-gray-400" />
                    <span>{professional.agentLocation || "Kenya"}</span>
                  </div>
                  <p className="text-gray-600 line-clamp-3 mb-4">
                    {professional.bio ||
                      "Experienced real estate professional helping clients find their perfect properties in Africa."}
                  </p>
                  <div className="mt-6 flex items-center justify-between">
                    <div className="text-sm text-gray-500">
                      <span className="font-medium text-gray-900">
                        {professional._count.properties}
                      </span>{" "}
                      active listings
                    </div>
                    <Button asChild size="sm" variant="outline">
                      <Link
                        href={`/${professional.role === "AGENCY" ? "agencies" : "agencies"}/${professional.id}`}
                      >
                        View Profile
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Tabs and Listings */}
        <div className="mx-auto mt-20 max-w-7xl">
          <Tabs defaultValue={tab} className="w-full">
            <div className="flex justify-center mb-12">
              <TabsList className="grid w-full max-w-md grid-cols-3">
                <TabsTrigger value="all" asChild>
                  <Link href="?tab=all&page=1" className="w-full">
                    All Professionals
                  </Link>
                </TabsTrigger>
                <TabsTrigger value="agencies" asChild>
                  <Link href="?tab=agencies&page=1" className="w-full">
                    Agencies
                  </Link>
                </TabsTrigger>
                <TabsTrigger value="agents" asChild>
                  <Link href="?tab=agents&page=1" className="w-full">
                    Agents
                  </Link>
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="all">
              <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                {professionals.length > 0 ? (
                  professionals.map((professional) => (
                    <div
                      key={professional.id}
                      className="group relative flex flex-col rounded-xl border border-gray-200 bg-white shadow-sm hover:shadow-md transition-shadow overflow-hidden"
                    >
                      <div className="relative h-40 w-full overflow-hidden bg-gray-100">
                        <Image
                          src={professional.coverPhoto || "/assets/house-1.jpg"}
                          alt={
                            professional.agentName ||
                            professional.name ||
                            "Real Estate Professional"
                          }
                          fill
                          className="object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
                        <div className="absolute bottom-4 left-4 right-4 flex items-center gap-4">
                          <div className="relative h-16 w-16 overflow-hidden rounded-full border-2 border-white bg-white">
                            <Image
                              src={
                                professional.profilePhoto ||
                                "/assets/placeholder.jpg"
                              }
                              alt={
                                professional.agentName ||
                                professional.name ||
                                "Agent"
                              }
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div>
                            <h3 className="text-lg font-semibold text-white">
                              {professional.agentName ||
                                professional.name ||
                                "Real Estate Professional"}
                            </h3>
                            <p className="text-sm text-white/80">
                              {professional.role === "AGENCY"
                                ? "Agency"
                                : " Agent"}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="flex-1 p-6">
                        <div className="flex items-center gap-x-2 text-sm text-gray-500 mb-4">
                          <MapPin className="h-4 w-4 text-gray-400" />
                          <span>{professional.agentLocation || "Kenya"}</span>
                        </div>
                        <p className="text-gray-600 line-clamp-3 mb-4">
                          {professional.bio ||
                            "Experienced real estate professional helping clients find their perfect properties in Africa."}
                        </p>
                        {isLoggedIn && professional.phoneNumber && (
                          <div className="space-y-2 text-sm">
                            <div className="flex items-center gap-x-2">
                              <Phone className="h-4 w-4 text-gray-400" />
                              <a
                                href={`tel:${professional.phoneNumber}`}
                                className="text-gray-600 hover:text-blue-600"
                              >
                                {professional.phoneNumber}
                              </a>
                            </div>
                            {(professional.agentEmail ||
                              professional.email) && (
                              <div className="flex items-center gap-x-2">
                                <Mail className="h-4 w-4 text-gray-400" />
                                <a
                                  href={`mailto:${professional.agentEmail || professional.email}`}
                                  className="text-gray-600 hover:text-blue-600"
                                >
                                  {professional.agentEmail ||
                                    professional.email}
                                </a>
                              </div>
                            )}
                          </div>
                        )}
                        {!isLoggedIn && (
                          <div className="text-sm text-gray-500 mb-4 italic">
                            <Link
                              href="/login"
                              className="text-blue-600 hover:underline"
                            >
                              Sign in
                            </Link>{" "}
                            to view contact information
                          </div>
                        )}
                        <div className="mt-6 flex items-center justify-between">
                          <div className="text-sm text-gray-500">
                            <span className="font-medium text-gray-900">
                              {professional._count.properties}
                            </span>{" "}
                            active listings
                          </div>
                          <Button asChild size="sm" variant="outline">
                            <Link
                              href={`/${professional.role === "AGENCY" ? "agencies" : "agencies"}/${professional.id}`}
                            >
                              View Profile
                            </Link>
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="col-span-full text-center py-12">
                    <p className="text-lg text-gray-600">
                      No active professionals found.
                    </p>
                    <p className="text-sm text-gray-500 mt-2">
                      Check back later for updates.
                    </p>
                  </div>
                )}
              </div>
              {renderPagination("all")}
            </TabsContent>

            <TabsContent value="agencies">
              <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                {agencies.length > 0 ? (
                  agencies.map((agency) => (
                    <div
                      key={agency.id}
                      className="group relative flex flex-col rounded-xl border border-gray-200 bg-white shadow-sm hover:shadow-md transition-shadow overflow-hidden"
                    >
                      <div className="relative h-40 w-full overflow-hidden bg-gray-100">
                        <Image
                          src={agency.coverPhoto || "/assets/house-1.jpg"}
                          alt={
                            agency.agentName ||
                            agency.name ||
                            "Real Estate Agency"
                          }
                          fill
                          className="object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
                        <div className="absolute bottom-4 left-4 right-4 flex items-center gap-4">
                          <div className="relative h-16 w-16 overflow-hidden rounded-full border-2 border-white bg-white">
                            <Image
                              src={
                                agency.profilePhoto || "/assets/placeholder.jpg"
                              }
                              alt={agency.agentName || agency.name || "Agency"}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div>
                            <h3 className="text-lg font-semibold text-white">
                              {agency.agentName ||
                                agency.name ||
                                "Real Estate Agency"}
                            </h3>
                            <p className="text-sm text-white/80">Agency</p>
                          </div>
                        </div>
                      </div>
                      <div className="flex-1 p-6">
                        <div className="flex items-center gap-x-2 text-sm text-gray-500 mb-4">
                          <MapPin className="h-4 w-4 text-gray-400" />
                          <span>{agency.agentLocation || "Kenya"}</span>
                        </div>
                        <p className="text-gray-600 line-clamp-3 mb-4">
                          {agency.bio ||
                            "Professional real estate agency helping clients find their perfect properties in Africa."}
                        </p>
                        {isLoggedIn && agency.phoneNumber && (
                          <div className="space-y-2 text-sm">
                            <div className="flex items-center gap-x-2">
                              <Phone className="h-4 w-4 text-gray-400" />
                              <a
                                href={`tel:${agency.phoneNumber}`}
                                className="text-gray-600 hover:text-blue-600"
                              >
                                {agency.phoneNumber}
                              </a>
                            </div>
                            {(agency.agentEmail || agency.email) && (
                              <div className="flex items-center gap-x-2">
                                <Mail className="h-4 w-4 text-gray-400" />
                                <a
                                  href={`mailto:${agency.agentEmail || agency.email}`}
                                  className="text-gray-600 hover:text-blue-600"
                                >
                                  {agency.agentEmail || agency.email}
                                </a>
                              </div>
                            )}
                          </div>
                        )}
                        {!isLoggedIn && (
                          <div className="text-sm text-gray-500 mb-4 italic">
                            <Link
                              href="/login"
                              className="text-blue-600 hover:underline"
                            >
                              Sign in
                            </Link>{" "}
                            to view contact information
                          </div>
                        )}
                        <div className="mt-6 flex items-center justify-between">
                          <div className="text-sm text-gray-500">
                            <span className="font-medium text-gray-900">
                              {agency._count.properties}
                            </span>{" "}
                            active listings
                          </div>
                          <Button asChild size="sm" variant="outline">
                            <Link href={`/agencies/${agency.id}`}>
                              View Profile
                            </Link>
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="col-span-full text-center py-12">
                    <p className="text-lg text-gray-600">
                      No active agencies found.
                    </p>
                    <p className="text-sm text-gray-500 mt-2">
                      Check back later for updates.
                    </p>
                  </div>
                )}
              </div>
              {renderPagination("agencies")}
            </TabsContent>

            <TabsContent value="agents">
              <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                {agents.length > 0 ? (
                  agents.map((agent) => (
                    <div
                      key={agent.id}
                      className="group relative flex flex-col rounded-xl border border-gray-200 bg-white shadow-sm hover:shadow-md transition-shadow overflow-hidden"
                    >
                      <div className="relative h-40 w-full overflow-hidden bg-gray-100">
                        <Image
                          src={agent.coverPhoto || "/assets/house-1.jpg"}
                          alt={agent.name || "Real Estate Agent"}
                          fill
                          className="object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
                        <div className="absolute bottom-4 left-4 right-4 flex items-center gap-4">
                          <div className="relative h-16 w-16 overflow-hidden rounded-full border-2 border-white bg-white">
                            <Image
                              src={
                                agent.profilePhoto || "/assets/placeholder.jpg"
                              }
                              alt={agent.name || "Agent"}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div>
                            <h3 className="text-lg font-semibold text-white">
                              {agent.name || "Real Estate Agent"}
                            </h3>
                            <p className="text-sm text-white/80">Agent</p>
                          </div>
                        </div>
                      </div>
                      <div className="flex-1 p-6">
                        <div className="flex items-center gap-x-2 text-sm text-gray-500 mb-4">
                          <MapPin className="h-4 w-4 text-gray-400" />
                          <span>{agent.agentLocation || "Kenya"}</span>
                        </div>
                        <p className="text-gray-600 line-clamp-3 mb-4">
                          {agent.bio ||
                            "Experienced real estate agent helping clients find their perfect properties in Africa."}
                        </p>
                        {isLoggedIn && agent.phoneNumber && (
                          <div className="space-y-2 text-sm">
                            <div className="flex items-center gap-x-2">
                              <Phone className="h-4 w-4 text-gray-400" />
                              <a
                                href={`tel:${agent.phoneNumber}`}
                                className="text-gray-600 hover:text-blue-600"
                              >
                                {agent.phoneNumber}
                              </a>
                            </div>
                            {(agent.agentEmail || agent.email) && (
                              <div className="flex items-center gap-x-2">
                                <Mail className="h-4 w-4 text-gray-400" />
                                <a
                                  href={`mailto:${agent.agentEmail || agent.email}`}
                                  className="text-gray-600 hover:text-blue-600"
                                >
                                  {agent.agentEmail || agent.email}
                                </a>
                              </div>
                            )}
                          </div>
                        )}
                        {!isLoggedIn && (
                          <div className="text-sm text-gray-500 mb-4 italic">
                            <Link
                              href="/login"
                              className="text-blue-600 hover:underline"
                            >
                              Sign in
                            </Link>{" "}
                            to view contact information
                          </div>
                        )}
                        <div className="mt-6 flex items-center justify-between">
                          <div className="text-sm text-gray-500">
                            <span className="font-medium text-gray-900">
                              {agent._count.properties}
                            </span>{" "}
                            active listings
                          </div>
                          <Button asChild size="sm" variant="outline">
                            <Link href={`/agencies/${agent.id}`}>
                              View Profile
                            </Link>
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="col-span-full text-center py-12">
                    <p className="text-lg text-gray-600">
                      No active agents found.
                    </p>
                    <p className="text-sm text-gray-500 mt-2">
                      Check back later for updates.
                    </p>
                  </div>
                )}
              </div>
              {renderPagination("agents")}
            </TabsContent>
          </Tabs>
        </div>

        {/* Become a Partner CTA */}
        <div className="mx-auto mt-24 max-w-7xl">
          <div className="rounded-2xl bg-gradient-to-r from-blue-50 to-indigo-100 px-6 py-16 sm:p-16">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-3xl font-bold tracking-tight text-gray-900">
                Join African Real Estate
              </h2>
              <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-gray-600">
                List your properties, connect with clients, and grow your
                business with the leading real estate platform in Africa.
              </p>
              <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-6">
                <Button
                  asChild
                  className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700"
                >
                  <Link href="/pricing">View Partner Plans</Link>
                </Button>
                <Button asChild variant="outline" className="w-full sm:w-auto">
                  <Link href="/contact">Contact Partnership Team</Link>
                </Button>
              </div>
            </div>

            <div className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              <div className="flex flex-col items-center bg-white p-6 rounded-xl shadow-sm">
                <div className="bg-blue-100 p-3 rounded-full mb-4">
                  <Building className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold mb-2">For Agencies</h3>
                <p className="text-center text-gray-600 mb-4">
                  Showcase your agency&apos;s portfolio and connect with
                  potential clients looking for properties across Africa.
                </p>
                <ul className="space-y-2 text-sm text-gray-600 mb-6">
                  <li className="flex items-center">
                    <svg
                      className="h-5 w-5 text-green-500 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M5 13l4 4L19 7"
                      ></path>
                    </svg>
                    Dedicated agency profile
                  </li>
                  <li className="flex items-center">
                    <svg
                      className="h-5 w-5 text-green-500 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M5 13l4 4L19 7"
                      ></path>
                    </svg>
                    Multiple property listings
                  </li>
                  <li className="flex items-center">
                    <svg
                      className="h-5 w-5 text-green-500 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M5 13l4 4L19 7"
                      ></path>
                    </svg>
                    Analytics dashboard
                  </li>
                </ul>
              </div>

              <div className="flex flex-col items-center bg-white p-6 rounded-xl shadow-sm">
                <div className="bg-blue-100 p-3 rounded-full mb-4">
                  <Users className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold mb-2">For Agents</h3>
                <p className="text-center text-gray-600 mb-4">
                  Build your personal brand and connect directly with clients
                  looking for their dream properties.
                </p>
                <ul className="space-y-2 text-sm text-gray-600 mb-6">
                  <li className="flex items-center">
                    <svg
                      className="h-5 w-5 text-green-500 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M5 13l4 4L19 7"
                      ></path>
                    </svg>
                    Professional agent profile
                  </li>
                  <li className="flex items-center">
                    <svg
                      className="h-5 w-5 text-green-500 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M5 13l4 4L19 7"
                      ></path>
                    </svg>
                    Direct client inquiries
                  </li>
                  <li className="flex items-center">
                    <svg
                      className="h-5 w-5 text-green-500 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M5 13l4 4L19 7"
                      ></path>
                    </svg>
                    Lead generation tools
                  </li>
                </ul>
              </div>

              <div className="flex flex-col items-center bg-white p-6 rounded-xl shadow-sm">
                <div className="bg-blue-100 p-3 rounded-full mb-4">
                  <Shield className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Premium Benefits</h3>
                <p className="text-center text-gray-600 mb-4">
                  Unlock additional features and gain more visibility with our
                  premium partnership plans.
                </p>
                <ul className="space-y-2 text-sm text-gray-600 mb-6">
                  <li className="flex items-center">
                    <svg
                      className="h-5 w-5 text-green-500 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M5 13l4 4L19 7"
                      ></path>
                    </svg>
                    Featured listings
                  </li>
                  <li className="flex items-center">
                    <svg
                      className="h-5 w-5 text-green-500 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M5 13l4 4L19 7"
                      ></path>
                    </svg>
                    Priority placement
                  </li>
                  <li className="flex items-center">
                    <svg
                      className="h-5 w-5 text-green-500 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M5 13l4 4L19 7"
                      ></path>
                    </svg>
                    Advanced marketing tools
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
