import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import NotFound from "@/app/not-found";
import { formatDate } from "date-fns";
import Avatar from "@/components/globals/avatar";
import { Raleway } from "next/font/google";
import { Mail } from "lucide-react";
import {
  FaFacebook,
  FaInstagram,
  FaLinkedin,
  FaTiktok,
  FaYoutube,
} from "react-icons/fa";
import PropertyCard from "@/components/properties/new/PropertyCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Link from "next/link";
import { Suspense } from "react";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { PropertySkeleton } from "../_components/PropertySkeleton";

const raleway = Raleway({
  subsets: ["latin"],
  display: "swap",
});

// Number of properties to show per page
const PROPERTIES_PER_PAGE = 6;

interface AgencyDetailsProps {
  params: {
    id: string;
  };
  searchParams: {
    page?: string;
    status: string;
  };
}

export async function generateMetadata({
  params: { id },
}: AgencyDetailsProps): Promise<Metadata> {
  const agency = await prisma.user.findUnique({
    where: { id },
    select: {
      name: true,
      agentName: true,
      bio: true,
      role: true,
      image: true,
    },
  });

  if (!agency) return { title: "Agency Not Found" };

  const displayName = agency.role === "AGENCY" ? agency.agentName : agency.name;

  return {
    title: `${displayName || "Agency"} Properties | African Real Estate`,
    description:
      agency.bio?.substring(0, 160) ||
      `Browse properties listed by ${displayName} on African Real Estate.`,
    openGraph: {
      title: `${displayName} - Real Estate Agency`,
      description:
        agency.bio?.substring(0, 160) ||
        `Browse properties listed by ${displayName} on African Real Estate.`,
      images: agency.image ? [{ url: agency.image }] : undefined,
      type: "profile",
    },
    twitter: {
      card: "summary_large_image",
      title: `${displayName} - Real Estate Agency`,
      description:
        agency.bio?.substring(0, 160) ||
        `Browse properties listed by ${displayName} on African Real Estate.`,
      images: agency.image ? [agency.image] : undefined,
    },
  };
}

// Separate component for the sidebar to avoid re-rendering
function AgencySidebar({ agency }: { agency: any }) {
  return (
    <div
      className={`${raleway.className} w-full flex flex-col items-center text-center sm:rounded-2xl sm:border border-neutral-200 dark:border-neutral-700 space-y-6 sm:space-y-7 px-0 sm:p-6 xl:p-8`}
    >
      <Avatar
        hasChecked
        hasCheckedClass="w-6 h-6 -top-0.5 right-2"
        sizeClass="w-28 h-28"
        imgUrl={agency.image}
      />

      {agency?.name ? (
        <div className="space-y-3 text-center flex flex-col items-center">
          <h2 className="text-xl text-indigo-500 font-semibold">
            {agency.role === "AGENCY" ? (
              <>
                {agency?.name} - {agency.agentName}
              </>
            ) : (
              <>{agency?.name}</>
            )}
          </h2>
        </div>
      ) : (
        <p className="text-neutral-500">No agency yet</p>
      )}

      <div className="border-b border-neutral-50 w-full"></div>

      <p className="text-neutral-500 font-semibold">Bio</p>
      {agency?.bio ? (
        <p className={`text-neutral-500 text-left text-sm`}>
          {agency.bio.length > 250
            ? `${agency.bio.substring(0, 250)}...`
            : agency.bio}
        </p>
      ) : (
        <p className="text-neutral-500">No bio yet</p>
      )}

      <div className="border-b border-neutral-50 w-full"></div>

      <div className="!space-x-3 flex items-center justify-center">
        {agency.facebookLink && (
          <Link
            href={agency.facebookLink}
            target="_blank"
            rel="noopener noreferrer"
          >
            <p className="w-9 h-9 flex items-center justify-center rounded-full bg-neutral-100 dark:bg-neutral-800 text-xl hover:bg-blue-600 hover:text-white transition-colors">
              <FaFacebook />
            </p>
          </Link>
        )}
        {agency.tiktokLink && (
          <Link
            href={agency.tiktokLink}
            target="_blank"
            rel="noopener noreferrer"
          >
            <p className="w-9 h-9 flex items-center justify-center rounded-full bg-neutral-100 dark:bg-neutral-800 text-xl hover:bg-black hover:text-white transition-colors">
              <FaTiktok />
            </p>
          </Link>
        )}
        {agency.youtubeLink && (
          <Link
            href={agency.youtubeLink}
            target="_blank"
            rel="noopener noreferrer"
          >
            <p className="w-9 h-9 flex items-center justify-center rounded-full bg-neutral-100 dark:bg-neutral-800 text-xl hover:bg-red-600 hover:text-white transition-colors">
              <FaYoutube />
            </p>
          </Link>
        )}
        {agency.instagramLink && (
          <Link
            href={agency.instagramLink}
            target="_blank"
            rel="noopener noreferrer"
          >
            <p className="w-9 h-9 flex items-center justify-center rounded-full bg-neutral-100 dark:bg-neutral-800 text-xl hover:bg-red-600 hover:text-white transition-colors">
              <FaInstagram />
            </p>
          </Link>
        )}
        {agency.linkedinLink && (
          <Link
            href={agency.linkedinLink}
            target="_blank"
            rel="noopener noreferrer"
          >
            <p className="w-9 h-9 flex items-center justify-center rounded-full bg-neutral-100 dark:bg-neutral-800 text-xl hover:bg-blue-700 hover:text-white transition-colors">
              <FaLinkedin />
            </p>
          </Link>
        )}
      </div>

      <div className="border-b border-neutral-50 w-full"></div>

      <div className="space-y-4">
        <div className="flex items-center space-x-4">
          <Mail className="h-6 w-6 text-neutral-400" />
          <Link
            href={`mailto:${agency.email}`}
            className="text-neutral-600 hover:text-indigo-500 transition-colors"
          >
            Talk to {agency.role === "AGENCY" ? "Agency" : "Agent"}
          </Link>
        </div>
        <div className="flex items-center space-x-4">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 text-neutral-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"
            />
          </svg>
          <span className="text-neutral-600">Replies Fast</span>
        </div>

        <div className="flex items-center space-x-4">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 text-neutral-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
          <span className="text-neutral-600">
            Member since {formatDate(agency.createdAt, "MMM d, yyyy")}
          </span>
        </div>
      </div>
    </div>
  );
}

// Separate component for property listings with pagination
async function PropertyListings({
  agencyId,
  status,
  page = 1,
}: {
  agencyId: string;
  status: "sale" | "let";
  page?: number;
}) {
  // Calculate pagination
  const skip = (page - 1) * PROPERTIES_PER_PAGE;

  // Fetch only the properties needed for this page
  const properties = await prisma.property.findMany({
    where: {
      userId: agencyId,
      status: status,
      isActive: true,
    },
    orderBy: {
      updatedAt: "desc",
    },
    take: PROPERTIES_PER_PAGE,
    skip: skip,
  });

  // Get total count for pagination
  const totalCount = await prisma.property.count({
    where: {
      userId: agencyId,
      status: status,
      isActive: true,
    },
  });

  const totalPages = Math.ceil(totalCount / PROPERTIES_PER_PAGE);

  return (
    <div>
      <div className="grid grid-cols-1 gap-6 md:gap-7 sm:grid-cols-2">
        {properties.length > 0 ? (
          properties.map((property) => (
            <PropertyCard key={property.id} data={property as any} />
          ))
        ) : (
          <p className="col-span-2 text-center py-8 text-neutral-500">
            No {status === "sale" ? "properties for sale" : "properties to let"}{" "}
            available.
          </p>
        )}
      </div>

      {/* shadcn/ui Pagination */}
      {totalPages > 1 && (
        <div className="mt-8">
          <PaginationWithStatus
            totalPages={totalPages}
            currentPage={page}
            status={status}
          />
        </div>
      )}
    </div>
  );
}

// Add this new component for pagination
function PaginationWithStatus({
  totalPages,
  currentPage,
  status,
}: {
  totalPages: number;
  currentPage: number;
  status: string;
}) {
  // Calculate which page numbers to show
  const showPages = () => {
    const pages = [];

    // Always show first page
    pages.push(1);

    // Calculate range around current page
    const startPage = Math.max(2, currentPage - 1);
    const endPage = Math.min(totalPages - 1, currentPage + 1);

    // Add ellipsis after first page if needed
    if (startPage > 2) {
      pages.push("ellipsis-start");
    }

    // Add pages around current page
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    // Add ellipsis before last page if needed
    if (endPage < totalPages - 1) {
      pages.push("ellipsis-end");
    }

    // Always show last page if there's more than one page
    if (totalPages > 1) {
      pages.push(totalPages);
    }

    return pages;
  };

  const pages = showPages();

  return (
    <Pagination>
      <PaginationContent>
        {currentPage > 1 && (
          <PaginationItem>
            <PaginationPrevious
              href={`?page=${currentPage - 1}&status=${status}`}
            />
          </PaginationItem>
        )}

        {pages.map((page, i) => (
          <PaginationItem key={i}>
            {page === "ellipsis-start" || page === "ellipsis-end" ? (
              <PaginationEllipsis />
            ) : (
              <PaginationLink
                href={`?page=${page}&status=${status}`}
                isActive={page === currentPage}
              >
                {page}
              </PaginationLink>
            )}
          </PaginationItem>
        ))}

        {currentPage < totalPages && (
          <PaginationItem>
            <PaginationNext
              href={`?page=${currentPage + 1}&status=${status}`}
            />
          </PaginationItem>
        )}
      </PaginationContent>
    </Pagination>
  );
}

// Main component with optimized data fetching
export default async function AgencyDetails({
  params: { id },
  searchParams,
}: AgencyDetailsProps) {
  const page = searchParams.page ? Number.parseInt(searchParams.page) : 1;
  const status = searchParams.status || "sale";

  // Fetch only the agency data without properties initially
  const agency = await prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
      bio: true,
      role: true,
      agentName: true,
      createdAt: true,
      facebookLink: true,
      tiktokLink: true,
      youtubeLink: true,
      instagramLink: true,
      linkedinLink: true,
      // Don't include properties here
    },
  });

  if (!agency) {
    return <NotFound />;
  }

  // Get property counts for tabs
  const [saleCount, letCount] = await Promise.all([
    prisma.property.count({
      where: {
        userId: id,
        status: "sale",
        isActive: true,
      },
    }),
    prisma.property.count({
      where: {
        userId: id,
        status: "let",
        isActive: true,
      },
    }),
  ]);

  return (
    <>
      <div
        className={`${raleway.className} w-[95%] lg:max-w-7xl mx-auto py-[90px] lg:py-[120px]`}
      >
        <div className="mt-12 mb-24 lg:mb-32 flex flex-col lg:flex-row">
          <div className="block flex-grow mb-24 lg:mb-0 lg:w-2/5 xl:w-1/3">
            <div className="lg:sticky lg:top-24">
              <AgencySidebar agency={agency} />
            </div>
          </div>
          <div className="w-full lg:w-3/5 xl:w-2/3 space-y-8 lg:space-y-10 lg:pl-10 flex-shrink-0">
            <div className="w-full flex flex-col sm:rounded-2xl border-b sm:border-t sm:border-l sm:border-r border-neutral-200 dark:border-neutral-700 space-y-6 sm:space-y-8 pb-10 px-0 sm:p-4 xl:p-8">
              <div>
                <h2 className="text-2xl text-indigo-500 font-semibold">
                  {agency.role === "AGENCY" ? agency.agentName : agency.name}{" "}
                  listings
                </h2>
                <span className="block mt-2 text-neutral-500 dark:text-neutral-400">
                  {agency.role === "AGENCY" ? agency.agentName : agency.name}
                  &apos;s listings are very rich, and 5-star reviews help them
                  to be more branded.
                </span>
              </div>

              <div className="w-full border-b border-neutral-100"></div>

              <Tabs defaultValue={status} className="w-full">
                <TabsList>
                  <TabsTrigger value="sale" asChild>
                    <Link href={`?status=sale`}>For Sale ({saleCount})</Link>
                  </TabsTrigger>
                  <TabsTrigger value="let" asChild>
                    <Link href={`?status=let`}>To Let ({letCount})</Link>
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="sale" className="mt-8">
                  <Suspense fallback={<PropertySkeletons />}>
                    <PropertyListings agencyId={id} status="sale" page={page} />
                  </Suspense>
                </TabsContent>
                <TabsContent value="let" className="mt-8">
                  <Suspense fallback={<PropertySkeletons />}>
                    <PropertyListings agencyId={id} status="let" page={page} />
                  </Suspense>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

// Skeleton loader for properties
function PropertySkeletons() {
  return (
    <div className="grid grid-cols-1 gap-6 md:gap-7 sm:grid-cols-2">
      {Array.from({ length: 4 }).map((_, i) => (
        <PropertySkeleton key={i} />
      ))}
    </div>
  );
}
