import { Raleway } from "next/font/google";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import Image from "next/image";
import { EnvelopeIcon } from "@heroicons/react/20/solid";
import { UserRole } from "@prisma/client";

const raleway = Raleway({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-nunitosans",
});

export async function generateMetadata() {
  return {
    title: "Agencies | Discover Expert Agents - Your Real Estate Partner",
    description:
      "Explore our network of expert real estate agencies offering tailored solutions to your property needs. Connect with professionals and find your dream property today.",
    openGraph: {
      title: "Agencies | Expert Real Estate Professionals",
      description:
        "Discover our trusted network of real estate agencies with expert agents to guide you through your property journey.",
      url: "https://www.african-realestate.com/agencies",
      images: [
        {
          url: "https://www.african-realestate.com/assets/house-1.jpg", // Update with a relevant image
          width: 1200,
          height: 630,
          alt: "Agencies Page",
        },
      ],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: "Agencies | Expert Real Estate Professionals",
      description:
        "Explore trusted real estate agencies to find tailored property solutions.",
      images: ["https://www.african-realestate.com/assets/house-1.jpg"], // Update
    },
    alternates: {
      canonical: "https://www.african-realestate.com/agencies", // Update with your canonical URL
    },
  };
}

export default async function Agencies() {
  const agents = await prisma.user.findMany({
    include: {
      properties: true,
    },
    where: {
      role: UserRole.AGENCY,
    },
  });

  const agentsWithSubscriptions = await prisma.user.findMany({
    where: {
      AND: [
        { role: UserRole.AGENCY }, // filter users with role Agent
        { subscriptions: { some: {} } },
      ],
    },
  });

  return (
    <div className={`${raleway.className}`}>
      <section className="mx-auto w-[95%] max-w-7xl px-5 py-24 md:px-10 md:py-24 lg:py-32">
        <h1 className="text-center text-2xl font-bold md:text-4xl lg:text-left">
          Agencies
        </h1>
        <p className="font-medium capitalize mb-8 mt-4 text-center text-sm text-[#636363] sm:text-base md:mb-12 lg:mb-16 lg:text-left">
          Discover our network of expert agents
        </p>

        <ul
          role="list"
          className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
        >
          {agents.map((agent) => (
            <li
              key={agent.id}
              className="col-span-1 flex flex-col divide-y divide-gray-200 border-gray-200 border rounded-lg bg-white text-center shadow"
            >
              <div className="flex flex-1 flex-col p-8">
                <Image
                  width={40}
                  height={40}
                  className="mx-auto size-10 flex-shrink-0 rounded-full"
                  src={agent.image || "/assets/placeholder.jpg"}
                  alt={agent.name!}
                />
                <h3 className="mt-6 text-sm font-medium text-gray-900">
                  {agent.role === "AGENT" ? agent.name : agent.agentName}
                </h3>
                <dl className="mt-1 flex flex-grow flex-col justify-between">
                  <dt className="sr-only">Title</dt>
                  <dd className="text-sm my-4 text-gray-500">AGENCY</dd>
                  <dt className="sr-only">Role</dt>

                  <dd className="mt-3">
                    <span className="inline-flex items-center rounded-full bg-neutral-50 px-2 py-1 text-xs font-medium text-indigo-700 ring-1 ring-inset ring-indigo-600/20">
                      {agent.properties.length} listings
                    </span>
                  </dd>
                </dl>
              </div>
              <div>
                <div className="-mt-px flex divide-x divide-gray-200">
                  <div className="flex w-0 flex-1">
                    <Link
                      href={`mailto:${agent.email}`}
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
                      href={`/agencies/${agent.id}`}
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
      </section>
    </div>
  );
}
