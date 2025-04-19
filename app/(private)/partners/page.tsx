import Image from "next/image";
import Link from "next/link";
import { getSEOTags, renderSchemaTags } from "@/lib/seo";
import { Button } from "@/components/ui/button";
import { prisma } from "@/lib/prisma";
import {
  MapPin,
  Phone,
  Mail,
  Building,
  Home,
  ExternalLink,
} from "lucide-react";

export const metadata = getSEOTags({
  title: "Partners & Agents | African Real Estate",
  description:
    "Meet our network of trusted real estate agents and agency partners across Africa. Find experienced professionals to help with your property needs.",
  canonicalUrlRelative: "partners",
});

async function getPartners() {
  try {
    const partners = await prisma.user.findMany({
      where: {
        role: {
          in: ["AGENT", "AGENCY"],
        },
        isActive: true,
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
        phoneNumber: true,
        whatsappNumber: true,
        agentEmail: true,
        role: true,
        xLink: true,
        facebookLink: true,
        instagramLink: true,
        linkedinLink: true,
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
      take: 50,
    });
    return partners;
  } catch (error) {
    console.error("Error fetching partners:", error);
    return [];
  }
}

export default async function PartnersPage() {
  const partners = await getPartners();

  return (
    <div className="bg-white">
      {renderSchemaTags()}
      <div className="mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
            Our Partners & Agents
          </h1>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            Meet our network of trusted real estate professionals. These
            experienced agents and agencies help buyers, sellers, and renters
            navigate the African property market.
          </p>
        </div>

        {/* Partner Benefits */}
        <div className="mx-auto mt-20 max-w-7xl">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            <div className="rounded-xl bg-blue-50 p-8">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-600">
                <Building className="h-6 w-6 text-white" />
              </div>
              <h3 className="mt-6 text-xl font-bold text-gray-900">
                For Agencies
              </h3>
              <p className="mt-4 text-gray-600">
                Join our network of premier agencies to expand your reach,
                access exclusive tools, and connect with qualified leads. Our
                platform helps you showcase your properties to a wider audience.
              </p>
              <div className="mt-6">
                <Button asChild>
                  <Link href="/register">Become a Partner Agency</Link>
                </Button>
              </div>
            </div>
            <div className="rounded-xl bg-green-50 p-8">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-green-600">
                <Home className="h-6 w-6 text-white" />
              </div>
              <h3 className="mt-6 text-xl font-bold text-gray-900">
                For Agents
              </h3>
              <p className="mt-4 text-gray-600">
                Individual agents can leverage our platform to list properties,
                build their personal brand, and connect with potential clients.
                Enjoy flexible pricing plans and powerful marketing tools.
              </p>
              <div className="mt-6">
                <Button asChild>
                  <Link href="/register">Become a Partner Agent</Link>
                </Button>
              </div>
            </div>
            <div className="rounded-xl bg-purple-50 p-8">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-purple-600">
                <ExternalLink className="h-6 w-6 text-white" />
              </div>
              <h3 className="mt-6 text-xl font-bold text-gray-900">
                For Clients
              </h3>
              <p className="mt-4 text-gray-600">
                Looking for a property? Our network of verified agents and
                agencies can help you find your dream home or investment
                opportunity. Connect with experienced professionals you can
                trust.
              </p>
              <div className="mt-6">
                <Button asChild>
                  <Link href="/properties">Browse Properties</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Featured Partners */}
        <div className="mx-auto mt-24 max-w-7xl">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900">
            Featured Partners
          </h2>
          <p className="mt-4 text-lg text-gray-600">
            These are some of our most active agents and agencies with
            properties currently listed on our platform.
          </p>

          <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {partners.length > 0
              ? partners.map((partner) => (
                  <div
                    key={partner.id}
                    className="group relative flex flex-col rounded-xl border border-gray-200 bg-white shadow-sm hover:shadow-md transition-shadow overflow-hidden"
                  >
                    <div className="relative h-40 w-full overflow-hidden bg-gray-100">
                      <Image
                        src={partner.coverPhoto || "/assets/house-1.jpg"}
                        alt={
                          partner.agentName ||
                          partner.name ||
                          "Real Estate Agent"
                        }
                        fill
                        className="object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
                      <div className="absolute bottom-4 left-4 right-4 flex items-center gap-4">
                        <div className="relative h-16 w-16 overflow-hidden rounded-full border-2 border-white bg-white">
                          <Image
                            src={
                              partner.profilePhoto || "/assets/placeholder.jpg"
                            }
                            alt={partner.agentName || partner.name || "Agent"}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-white">
                            {partner.agentName ||
                              partner.name ||
                              "Real Estate Professional"}
                          </h3>
                          <p className="text-sm text-white/80">
                            {partner.role === "AGENCY" ? "Agency" : "Agent"}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="flex-1 p-6">
                      <div className="flex items-center gap-x-2 text-sm text-gray-500 mb-4">
                        <MapPin className="h-4 w-4 text-gray-400" />
                        <span>{partner.agentLocation || "Kenya"}</span>
                      </div>
                      <p className="text-gray-600 line-clamp-3 mb-4">
                        {partner.bio ||
                          "Experienced real estate professional helping clients find their perfect properties in Africa."}
                      </p>
                      <div className="space-y-2 text-sm">
                        {partner.phoneNumber && (
                          <div className="flex items-center gap-x-2">
                            <Phone className="h-4 w-4 text-gray-400" />
                            <a
                              href={`tel:${partner.phoneNumber}`}
                              className="text-gray-600 hover:text-blue-600"
                            >
                              {partner.phoneNumber}
                            </a>
                          </div>
                        )}
                        {partner.agentEmail && (
                          <div className="flex items-center gap-x-2">
                            <Mail className="h-4 w-4 text-gray-400" />
                            <a
                              href={`mailto:${partner.agentEmail}`}
                              className="text-gray-600 hover:text-blue-600"
                            >
                              {partner.agentEmail}
                            </a>
                          </div>
                        )}
                      </div>
                      <div className="mt-6 flex items-center justify-between">
                        <div className="text-sm text-gray-500">
                          <span className="font-medium text-gray-900">
                            {partner._count.properties}
                          </span>{" "}
                          active listings
                        </div>
                        <Button asChild size="sm" variant="outline">
                          <Link href={`/agencies/${partner.id}`}>
                            View Profile
                          </Link>
                        </Button>
                      </div>
                    </div>
                  </div>
                ))
              : // Fallback if no partners are found
                Array.from({ length: 6 }).map((_, index) => (
                  <div
                    key={index}
                    className="group relative flex flex-col rounded-xl border border-gray-200 bg-white shadow-sm hover:shadow-md transition-shadow overflow-hidden"
                  >
                    <div className="relative h-40 w-full overflow-hidden bg-gray-100">
                      <Image
                        src={`/placeholder.svg?height=300&width=600&text=Real+Estate+Agent+${index + 1}`}
                        alt={`Real Estate Agent ${index + 1}`}
                        fill
                        className="object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
                      <div className="absolute bottom-4 left-4 right-4 flex items-center gap-4">
                        <div className="relative h-16 w-16 overflow-hidden rounded-full border-2 border-white bg-white">
                          <Image
                            src={`/placeholder.svg?height=100&width=100&text=Agent+${index + 1}`}
                            alt={`Agent ${index + 1}`}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-white">
                            {
                              [
                                "John Doe Realty",
                                "Nairobi Homes",
                                "Kenya Property Experts",
                                "Urban Living",
                                "Coastal Properties",
                                "Luxury Estates",
                              ][index]
                            }
                          </h3>
                          <p className="text-sm text-white/80">
                            {index % 2 === 0 ? "Agency" : " Agent"}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="flex-1 p-6">
                      <div className="flex items-center gap-x-2 text-sm text-gray-500 mb-4">
                        <MapPin className="h-4 w-4 text-gray-400" />
                        <span>
                          {
                            [
                              "Nairobi",
                              "Mombasa",
                              "Kisumu",
                              "Nakuru",
                              "Eldoret",
                              "Malindi",
                            ][index]
                          }
                          , Kenya
                        </span>
                      </div>
                      <p className="text-gray-600 line-clamp-3 mb-4">
                        Experienced real estate professional helping clients
                        find their perfect properties in Africa.
                      </p>
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center gap-x-2">
                          <Phone className="h-4 w-4 text-gray-400" />
                          <span className="text-gray-600">
                            +254 7xx xxx xxx
                          </span>
                        </div>
                        <div className="flex items-center gap-x-2">
                          <Mail className="h-4 w-4 text-gray-400" />
                          <span className="text-gray-600">
                            contact@example.com
                          </span>
                        </div>
                      </div>
                      <div className="mt-6 flex items-center justify-between">
                        <div className="text-sm text-gray-500">
                          <span className="font-medium text-gray-900">
                            {Math.floor(Math.random() * 20) + 5}
                          </span>{" "}
                          active listings
                        </div>
                        <Button asChild size="sm">
                          <Link href="/agencies">View Profile</Link>
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
          </div>

          <div className="mt-12 text-center">
            <Button asChild variant="outline">
              <Link href="/agencies">View All Agents</Link>
            </Button>
          </div>
        </div>

        {/* Become a Partner CTA */}
        <div className="mx-auto mt-24 max-w-7xl">
          <div className="rounded-2xl bg-gradient-to-r bg-blue-50 px-6 py-16 sm:p-16">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-3xl font-bold tracking-tight text-gray-900">
                Become a Partner
              </h2>
              <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-gray-600">
                Join our network of trusted real estate professionals. List your
                properties, connect with clients, and grow your business with
                African Real Estate.
              </p>
              <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-6">
                <Button asChild className=" w-full sm:w-auto">
                  <Link href="/pricing">View Partner Plans</Link>
                </Button>
                <Button asChild variant="outline" className="w-full sm:w-auto">
                  <Link href="/contact">Contact Partnership Team</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
