import { Raleway } from "next/font/google";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import Image from "next/image";
import {
  EnvelopeIcon,
  BuildingOfficeIcon,
  UserIcon,
} from "@heroicons/react/20/solid";
import { UserRole, type User } from "@prisma/client";
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

const raleway = Raleway({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-nunitosans",
});

export async function generateMetadata() {
  return {
    title:
      "Agencies & Agents | Discover Real Estate Professionals - Your Real Estate Partner",
    description:
      "Explore our network of expert real estate agencies and agents offering tailored solutions to your property needs. Connect with professionals and find your dream property today.",
    openGraph: {
      title: "Agencies & Agents | Expert Real Estate Professionals",
      description:
        "Discover our trusted network of real estate agencies and individual agents to guide you through your property journey.",
      url: "https://www.african-realestate.com/agencies",
      images: [
        {
          url: "https://www.african-realestate.com/assets/house-1.jpg",
          width: 1200,
          height: 630,
          alt: "Agencies & Agents Page",
        },
      ],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: "Agencies & Agents | Expert Real Estate Professionals",
      description:
        "Explore trusted real estate agencies and agents to find tailored property solutions.",
      images: ["https://www.african-realestate.com/assets/house-1.jpg"],
    },
    alternates: {
      canonical: "https://www.african-realestate.com/agencies",
    },
  };
}

// Pagination constants
const ITEMS_PER_PAGE = 8;

// Add a type definition for the tab values
type TabType = "all" | "agencies" | "agents";

// Define the type for properties
type Property = {
  id: string;
  // Add other property fields as needed
  // This is a simplified version
};

// Define the type for professionals that matches the Prisma User model with properties
type ProfessionalWithProperties = User & {
  properties: Property[];
};

export default async function AgenciesAndAgents({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
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
        in: [UserRole.AGENCY, UserRole.AGENT],
      },
      properties: {
        some: {}, // This ensures at least one property exists
      },
    },
  });

  const totalAgencies = await prisma.user.count({
    where: {
      role: UserRole.AGENCY,
      properties: {
        some: {}, // This ensures at least one property exists
      },
    },
  });

  const totalAgents = await prisma.user.count({
    where: {
      role: UserRole.AGENT,
      properties: {
        some: {}, // This ensures at least one property exists
      },
    },
  });

  // Fetch professionals with pagination
  const professionals = await prisma.user.findMany({
    include: {
      properties: true,
    },
    where: {
      role: {
        in: [UserRole.AGENCY, UserRole.AGENT],
      },
      properties: {
        some: {}, // This ensures at least one property exists
      },
    },
    orderBy: {
      role: "asc", // Sort by role to group agencies and agents
    },
    skip,
    take: ITEMS_PER_PAGE,
  });

  // Separate professionals by role
  const agencies = await prisma.user.findMany({
    include: {
      properties: true,
    },
    where: {
      role: UserRole.AGENCY,
      properties: {
        some: {}, // This ensures at least one property exists
      },
    },
    skip: tab === "agencies" ? skip : 0,
    take:
      tab === "agencies"
        ? ITEMS_PER_PAGE
        : totalAgencies > ITEMS_PER_PAGE
          ? ITEMS_PER_PAGE
          : totalAgencies,
  });

  const agents = await prisma.user.findMany({
    include: {
      properties: true,
    },
    where: {
      role: UserRole.AGENT,
      properties: {
        some: {}, // This ensures at least one property exists
      },
    },
    skip: tab === "agents" ? skip : 0,
    take:
      tab === "agents"
        ? ITEMS_PER_PAGE
        : totalAgents > ITEMS_PER_PAGE
          ? ITEMS_PER_PAGE
          : totalAgents,
  });

  // Calculate total pages for each tab
  const totalPages = {
    all: Math.ceil(totalProfessionals / ITEMS_PER_PAGE),
    agencies: Math.ceil(totalAgencies / ITEMS_PER_PAGE),
    agents: Math.ceil(totalAgents / ITEMS_PER_PAGE),
  };

  // Update the renderProfessionalCards function to use the correct type
  const renderProfessionalCards = (
    professionals: ProfessionalWithProperties[]
  ) => {
    if (professionals.length === 0) {
      return (
        <div className="text-center py-12">
          <p className="text-lg text-gray-600">
            No active professionals found in this category.
          </p>
          <p className="text-sm text-gray-500 mt-2">
            Check back later for updates.
          </p>
        </div>
      );
    }

    return (
      <ul
        role="list"
        className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
      >
        {professionals.map((professional) => (
          <li
            key={professional.id}
            className="col-span-1 flex flex-col divide-y divide-gray-200 border-gray-200 border rounded-lg bg-white text-center shadow"
          >
            <div className="flex flex-1 flex-col p-8">
              <Image
                width={40}
                height={40}
                className="mx-auto size-10 flex-shrink-0 rounded-full"
                src={professional.image || "/assets/placeholder.jpg"}
                alt={professional.name || "Professional"}
              />
              <h3 className="mt-6 text-sm font-medium text-gray-900">
                {professional.role === "AGENT"
                  ? professional.name
                  : professional.agentName}
              </h3>
              <dl className="mt-1 flex flex-grow flex-col justify-between">
                <dt className="sr-only">Title</dt>
                <dd className="text-sm my-4 text-gray-500 flex items-center justify-center gap-1">
                  {professional.role === "AGENCY" ? (
                    <>
                      <BuildingOfficeIcon className="h-4 w-4" />
                      AGENCY
                    </>
                  ) : (
                    <>
                      <UserIcon className="h-4 w-4" />
                      AGENT
                    </>
                  )}
                </dd>
                <dt className="sr-only">Role</dt>

                <dd className="mt-3">
                  <span className="inline-flex items-center rounded-full bg-neutral-50 px-2 py-1 text-xs font-medium text-indigo-700 ring-1 ring-inset ring-indigo-600/20">
                    {professional.properties.length} listings
                  </span>
                </dd>
              </dl>
            </div>
            <div>
              <div className="-mt-px flex divide-x divide-gray-200">
                <div className="flex w-0 flex-1">
                  <Link
                    href={`mailto:${professional.email}`}
                    className="relative -mr-px inline-flex w-0 flex-1 items-center justify-center gap-x-3 rounded-bl-lg border border-transparent py-4 text-sm font-semibold text-gray-900"
                  >
                    <EnvelopeIcon
                      className="h-5 w-5 text-gray-400"
                      aria-hidden="true"
                    />
                    Email
                  </Link>
                </div>
                <div className="-ml-px flex w-0 flex-1 bg-neutral-50 text-indigo-500 hover:bg-indigo-600 hover:text-neutral-50 transition-colors ease-linear">
                  <Link
                    href={`/${professional.role === "AGENCY" ? "agencies" : "agents"}/${professional.id}`}
                    className="relative inline-flex w-0 flex-1 items-center justify-center gap-x-3 rounded-br-lg border border-transparent py-4 text-sm font-semibold"
                  >
                    View Listings
                  </Link>
                </div>
              </div>
            </div>
          </li>
        ))}
      </ul>
    );
  };

  // Update the renderPagination function with proper typing
  const renderPagination = (currentTab: TabType) => {
    const currentTotalPages = totalPages[currentTab];
    if (currentTotalPages <= 1) return null;

    return (
      <Pagination className="mt-8">
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
    <div className={`${raleway.className}`}>
      <section className="mx-auto w-[95%] max-w-7xl px-5 py-24 md:px-10 md:py-24 lg:py-32">
        <h1 className="text-center text-2xl font-bold md:text-4xl lg:text-left">
          Agencies & Agents
        </h1>
        <p className="font-medium capitalize mb-8 mt-4 text-center text-sm text-[#636363] sm:text-base md:mb-12 lg:mb-16 lg:text-left">
          Discover our network of active real estate professionals
        </p>

        <Tabs defaultValue={tab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="all" asChild>
              <Link href="?tab=all&page=1">All</Link>
            </TabsTrigger>
            <TabsTrigger value="agencies" asChild>
              <Link href="?tab=agencies&page=1">Agencies</Link>
            </TabsTrigger>
            <TabsTrigger value="agents" asChild>
              <Link href="?tab=agents&page=1">Agents</Link>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="all">
            {professionals.length > 0 ? (
              <>
                {renderProfessionalCards(professionals)}
                {renderPagination("all")}
              </>
            ) : (
              <div className="text-center py-12">
                <p className="text-lg text-gray-600">
                  No active real estate professionals found.
                </p>
                <p className="text-sm text-gray-500 mt-2">
                  Check back later for updates.
                </p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="agencies">
            {renderProfessionalCards(agencies)}
            {renderPagination("agencies")}
          </TabsContent>

          <TabsContent value="agents">
            {renderProfessionalCards(agents)}
            {renderPagination("agents")}
          </TabsContent>
        </Tabs>
      </section>
    </div>
  );
}
