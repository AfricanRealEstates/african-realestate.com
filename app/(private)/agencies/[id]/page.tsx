import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session";
import AgencyProfileClient from "./agentcy-profile-client";
import { getSEOTags } from "@/lib/seo";

interface AgencyPageProps {
  params: {
    id: string;
  };
  searchParams: {
    page?: string;
    sort?: string;
    order?: string;
    propertyType?: string;
    status?: string;
  };
}

export async function generateMetadata({ params }: { params: { id: string } }) {
  const agency = await prisma.user.findUnique({
    where: {
      id: params.id,
      role: {
        in: ["AGENCY", "AGENT"],
      },
    },
    select: {
      name: true,
      agentName: true,
      bio: true,
      agentLocation: true,
      profilePhoto: true,
      coverPhoto: true,
    },
  });

  if (!agency) {
    return getSEOTags({
      title: "Agency Not Found | African Real Estate",
      description: "The requested agency profile could not be found.",
    });
  }

  const agencyName =
    agency.agentName || agency.name || "Real Estate Professional";
  const description =
    agency.bio ||
    `Professional real estate services by ${agencyName} in ${agency.agentLocation || "Africa"}.`;

  return getSEOTags({
    title: `${agencyName} | African Real Estate`,
    description,
    canonicalUrlRelative: `/agencies/${params.id}`,
    openGraph: {
      images: "",
    },
  });
}

export default async function AgencyPage({
  params,
  searchParams,
}: AgencyPageProps) {
  const currentUser = await getCurrentUser();
  const isLoggedIn = !!currentUser;

  // Get agency/agent details
  const agency = await prisma.user.findUnique({
    where: {
      id: params.id,
      role: {
        in: ["AGENCY", "AGENT"],
      },
    },
    include: {
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
  });

  if (!agency) {
    notFound();
  }

  // Get pagination and sorting parameters
  const page = Number(searchParams.page) || 1;
  const sort = searchParams.sort || "createdAt";
  const order = (searchParams.order as "asc" | "desc") || "desc";
  const propertyType = searchParams.propertyType;
  const status = searchParams.status;
  const pageSize = 12;

  // Build where clause for properties
  const whereClause: any = {
    userId: agency.id,
    isActive: true,
  };

  if (propertyType) {
    whereClause.propertyType = propertyType;
  }

  if (status) {
    whereClause.status = status;
  }

  // Get properties with pagination
  const [properties, totalCount] = await Promise.all([
    prisma.property.findMany({
      where: whereClause,
      include: {
        views: true,
        likes: true,
        orders: true,
      },
      orderBy: {
        [sort]: order,
      },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    prisma.property.count({
      where: whereClause,
    }),
  ]);

  const totalPages = Math.ceil(totalCount / pageSize);

  // Get property statistics
  const propertyStats = await prisma.property.groupBy({
    by: ["propertyType"],
    where: {
      userId: agency.id,
      isActive: true,
    },
    _count: {
      id: true,
    },
  });

  const statusStats = await prisma.property.groupBy({
    by: ["status"],
    where: {
      userId: agency.id,
      isActive: true,
    },
    _count: {
      id: true,
    },
  });

  // Get unique property types and statuses for filters
  const availablePropertyTypes = propertyStats.map((stat) => stat.propertyType);
  const availableStatuses = statusStats.map((stat) => stat.status);

  return (
    <AgencyProfileClient
      agency={agency}
      properties={properties}
      totalCount={totalCount}
      totalPages={totalPages}
      currentPage={page}
      propertyStats={propertyStats}
      statusStats={statusStats}
      availablePropertyTypes={availablePropertyTypes}
      availableStatuses={availableStatuses}
      isLoggedIn={isLoggedIn}
      searchParams={searchParams}
    />
  );
}
