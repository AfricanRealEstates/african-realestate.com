import Image from "next/image";
import Link from "next/link";
import { getSEOTags, renderSchemaTags } from "@/lib/seo";
import { Button } from "@/components/ui/button";
import { prisma } from "@/lib/prisma";

export const metadata = getSEOTags({
  title: "About Us | African Real Estate",
  description:
    "Learn about African Real Estate, our mission, values, and the team behind the leading property marketplace in Africa.",
  canonicalUrlRelative: "about",
});

async function getTeamMembers() {
  try {
    const teamMembers = await prisma.user.findMany({
      where: {
        role: {
          in: ["ADMIN", "SUPPORT"],
        },
        isActive: true,
      },
      select: {
        id: true,
        name: true,
        profilePhoto: true,
        bio: true,
        role: true,
        xLink: true,
        facebookLink: true,
        instagramLink: true,
        linkedinLink: true,
        youtubeLink: true,
      },
    });
    return teamMembers;
  } catch (error) {
    console.error("Error fetching team members:", error);
    return [];
  }
}

export default async function AboutPage() {
  const teamMembers = await getTeamMembers();

  return (
    <div className="bg-white py-16">
      {renderSchemaTags()}

      {/* Hero section */}
      <div className="relative isolate overflow-hidden bg-gradient-to-b from-blue-100/20 pt-14">
        <div className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
          <div className="mx-auto max-w-2xl lg:mx-0 lg:max-w-xl">
            <h1 className="mt-2 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
              About African Real Estate
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              We&apos;re on a mission to transform the real estate experience in
              Africa by connecting property seekers with their dream homes and
              investment opportunities through a transparent, efficient, and
              user-friendly platform.
            </p>
          </div>
          <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 lg:mx-0 lg:mt-10 lg:max-w-none lg:grid-cols-12">
            <div className="relative lg:col-span-5 lg:order-last">
              <Image
                src="/assets/house-1.jpg"
                alt="African Real Estate office"
                width={800}
                height={600}
                className="rounded-2xl object-cover"
              />
            </div>
            <div className="lg:col-span-7">
              <h2 className="text-2xl font-bold tracking-tight text-gray-900">
                Our Story
              </h2>
              <p className="mt-6 text-base leading-7 text-gray-600">
                Founded in 2018, African Real Estate began with a simple idea:
                make property transactions in Africa more accessible,
                transparent, and efficient. What started as a small listing
                platform has grown into the region&apos;s premier real estate
                marketplace, connecting thousands of buyers, sellers, and
                renters across the continent.
              </p>
              <p className="mt-4 text-base leading-7 text-gray-600">
                Our journey has been driven by a deep understanding of the
                unique challenges in the African real estate market. From
                navigating complex land ownership systems to bridging
                information gaps, we&apos;ve built solutions that address the
                specific needs of our users.
              </p>
              <p className="mt-4 text-base leading-7 text-gray-600">
                Today, we&apos;re proud to be the trusted platform for over
                7,000 properties across Kenya and expanding to other African
                countries. Our commitment to innovation, integrity, and
                exceptional service remains at the heart of everything we do.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Values section */}
      <div className="mx-auto mt-16 max-w-7xl px-6 sm:mt-20 lg:px-8">
        <div className="mx-auto max-w-2xl lg:mx-0">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900">
            Our Values
          </h2>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            Our core values guide every decision we make and every interaction
            we have with our clients and partners.
          </p>
        </div>
        <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
          <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3">
            <div className="flex flex-col">
              <dt className="text-xl font-semibold leading-7 text-gray-900">
                <div className="mb-6 flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600">
                  <svg
                    className="h-6 w-6 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                Integrity
              </dt>
              <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-600">
                <p className="flex-auto">
                  We operate with honesty and transparency in all our dealings.
                  We believe in providing accurate information and setting
                  realistic expectations for our clients.
                </p>
              </dd>
            </div>
            <div className="flex flex-col">
              <dt className="text-xl font-semibold leading-7 text-gray-900">
                <div className="mb-6 flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600">
                  <svg
                    className="h-6 w-6 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    />
                  </svg>
                </div>
                Innovation
              </dt>
              <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-600">
                <p className="flex-auto">
                  We continuously seek new ways to improve the real estate
                  experience through technology and creative solutions that
                  address the unique challenges of the African market.
                </p>
              </dd>
            </div>
            <div className="flex flex-col">
              <dt className="text-xl font-semibold leading-7 text-gray-900">
                <div className="mb-6 flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600">
                  <svg
                    className="h-6 w-6 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                </div>
                Community
              </dt>
              <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-600">
                <p className="flex-auto">
                  We&apos;re committed to building and supporting communities.
                  We believe that real estate is not just about properties, but
                  about creating spaces where people can thrive.
                </p>
              </dd>
            </div>
          </dl>
        </div>
      </div>

      {/* Team section */}
      <div className="mx-auto mt-32 max-w-7xl px-6 sm:mt-48 lg:px-8">
        <div className="mx-auto max-w-2xl lg:mx-0">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900">
            Our Team
          </h2>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            Meet the dedicated professionals behind African Real Estate. Our
            diverse team brings together expertise in real estate, technology,
            marketing, and customer service.
          </p>
        </div>
        {/* <ul
          role="list"
          className="mx-auto mt-20 grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 sm:grid-cols-2 lg:mx-0 lg:max-w-none lg:grid-cols-3"
        >
          {teamMembers.length > 0
            ? teamMembers.map((person) => (
                <li key={person.id}>
                  <div className="group relative">
                    <div className="aspect-[3/2] w-full overflow-hidden rounded-2xl bg-gray-100">
                      <Image
                        className="object-cover group-hover:opacity-90 transition-opacity"
                        src={person.profilePhoto || "/assets/placeholder.jpg"}
                        alt={person.name || "Team member"}
                        width={600}
                        height={400}
                      />
                    </div>
                    <h3 className="mt-6 text-lg font-semibold leading-8 text-gray-900">
                      {person.name || "Team Member"}
                    </h3>
                    <p className="text-base leading-7 text-gray-600">
                      {person.role === "ADMIN"
                        ? "Executive"
                        : "Support Specialist"}
                    </p>
                    <p className="mt-4 text-sm leading-6 text-gray-500 line-clamp-3">
                      {person.bio ||
                        "Dedicated to providing exceptional real estate services and customer support."}
                    </p>
                    <ul role="list" className="mt-6 flex gap-x-6">
                      {person.xLink && (
                        <li>
                          <a
                            href={person.xLink}
                            className="text-gray-400 hover:text-gray-500"
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <span className="sr-only">X (Twitter)</span>
                            <Twitter className="h-5 w-5" />
                          </a>
                        </li>
                      )}
                      {person.linkedinLink && (
                        <li>
                          <a
                            href={person.linkedinLink}
                            className="text-gray-400 hover:text-gray-500"
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <span className="sr-only">LinkedIn</span>
                            <Linkedin className="h-5 w-5" />
                          </a>
                        </li>
                      )}
                      {person.facebookLink && (
                        <li>
                          <a
                            href={person.facebookLink}
                            className="text-gray-400 hover:text-gray-500"
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <span className="sr-only">Facebook</span>
                            <Facebook className="h-5 w-5" />
                          </a>
                        </li>
                      )}
                      {person.instagramLink && (
                        <li>
                          <a
                            href={person.instagramLink}
                            className="text-gray-400 hover:text-gray-500"
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <span className="sr-only">Instagram</span>
                            <Instagram className="h-5 w-5" />
                          </a>
                        </li>
                      )}
                      {person.youtubeLink && (
                        <li>
                          <a
                            href={person.youtubeLink}
                            className="text-gray-400 hover:text-gray-500"
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <span className="sr-only">YouTube</span>
                            <Youtube className="h-5 w-5" />
                          </a>
                        </li>
                      )}
                    </ul>
                  </div>
                </li>
              ))
            : // Fallback team members if none are found in the database
              Array.from({ length: 6 }).map((_, index) => (
                <li key={index}>
                  <div className="group relative">
                    <div className="aspect-[3/2] w-full overflow-hidden rounded-2xl bg-gray-100">
                      <Image
                        className="object-cover"
                        src={`/placeholder.svg?height=400&width=600&text=Team+Member+${index + 1}`}
                        alt={`Team member ${index + 1}`}
                        width={600}
                        height={400}
                      />
                    </div>
                    <h3 className="mt-6 text-lg font-semibold leading-8 text-gray-900">
                      {
                        [
                          "John Doe",
                          "Jane Smith",
                          "David Kamau",
                          "Sarah Ochieng",
                          "Michael Mwangi",
                          "Grace Wanjiku",
                        ][index]
                      }
                    </h3>
                    <p className="text-base leading-7 text-gray-600">
                      {
                        [
                          "CEO",
                          "COO",
                          "Head of Sales",
                          "Marketing Director",
                          "Customer Support Lead",
                          "Property Specialist",
                        ][index]
                      }
                    </p>
                    <p className="mt-4 text-sm leading-6 text-gray-500">
                      Dedicated to providing exceptional real estate services
                      and customer support.
                    </p>
                  </div>
                </li>
              ))}
        </ul> */}
      </div>

      {/* CTA section */}
      <div className="relative isolate mt-2 sm:mt-48 sm:pt-16">
        <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="mx-auto flex max-w-2xl flex-col gap-16 bg-blue-50 px-6 py-16 ring-1 ring-white/10 sm:rounded-3xl sm:p-8 lg:mx-0 lg:max-w-none lg:flex-row lg:items-center lg:py-20 xl:gap-x-20 xl:px-20">
            <div className="w-full flex-auto">
              <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                Join our growing community
              </h2>
              <p className="mt-6 text-lg leading-8 text-gray-600">
                Whether you&apos;re looking to buy, sell, or rent property in
                Africa, we&apos;re here to help you every step of the way.
              </p>
              <div className="mt-10 flex flex-col gap-y-4 sm:flex-row sm:gap-x-6 sm:gap-y-0">
                <Button asChild className="">
                  <Link href="/properties">Browse Properties</Link>
                </Button>
                <Button asChild variant="outline" className="">
                  <Link href="/contact">Contact Us</Link>
                </Button>
              </div>
            </div>
            <div className="w-full flex-none">
              <Image
                src="/assets/house-1.jpg"
                alt="Join African Real Estate"
                width={600}
                height={400}
                className="rounded-2xl object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
