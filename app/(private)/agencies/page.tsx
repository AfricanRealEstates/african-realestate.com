import React from "react";
import { Raleway } from "next/font/google";
import prisma from "@/lib/prisma";
import Link from "next/link";
import Image from "next/image";
import { BadgeCheck } from "lucide-react";
import { EnvelopeIcon, PhoneIcon } from "@heroicons/react/20/solid";
import { UserRole } from "@prisma/client";
const raleway = Raleway({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-nunitosans",
});

export default async function Agencies() {
  const agents = await prisma.user.findMany({
    include: {
      Property: true,
    },
  });

  const agentsWithSubscriptions = await prisma.user.findMany({
    where: {
      AND: [
        { role: UserRole.AGENT }, // filter users with role Agent
        { Subscription: { some: {} } },
      ],
    },
  });

  return (
    <div className={`${raleway.className}`}>
      <section className="mx-auto w-[95%] max-w-7xl px-5 py-24 md:px-10 md:py-24 lg:py-32">
        <h2 className="text-center text-2xl font-bold md:text-4xl lg:text-left">
          Agencies
        </h2>
        <p className="font-medium capitalize mb-8 mt-4 text-center text-sm text-[#636363] sm:text-base md:mb-12 lg:mb-16 lg:text-left">
          Discover our network of expert agents
          {/* offering diverse array of
          properties tailored to meet your unique needs */}
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
                  {agent.name}
                </h3>
                <dl className="mt-1 flex flex-grow flex-col justify-between">
                  <dt className="sr-only">Title</dt>
                  <dd className="text-sm my-4 text-gray-500">{agent.role}</dd>
                  <dt className="sr-only">Role</dt>

                  <dd className="mt-3">
                    <span className="inline-flex items-center rounded-full bg-neutral-50 px-2 py-1 text-xs font-medium text-indigo-700 ring-1 ring-inset ring-indigo-600/20">
                      {agent.Property.length} listings
                    </span>
                  </dd>
                </dl>
              </div>
              <div>
                <div className="-mt-px flex divide-x divide-gray-200">
                  <div className="flex w-0 flex-1">
                    <a
                      href={`mailto:${agent.email}`}
                      className="relative -mr-px inline-flex w-0 flex-1 items-center justify-center gap-x-3 rounded-bl-lg border border-transparent py-4 text-sm font-semibold text-gray-900"
                    >
                      <EnvelopeIcon
                        className="h-5 w-5 text-gray-400"
                        aria-hidden="true"
                      />
                      Email
                    </a>
                  </div>
                  <div className="-ml-px flex w-0 flex-1 bg-neutral-50 text-indigo-500 hover:bg-indigo-600 hover:text-neutral-50 transition-colors ease-linear">
                    <Link
                      href={`/properties`}
                      className="relative inline-flex w-0 flex-1 items-center justify-center gap-x-3 rounded-br-lg border border-transparent py-4 text-sm font-semibold"
                    >
                      {/* <PhoneIcon
                        className="h-5 w-5 text-gray-400"
                        aria-hidden="true"
                      /> */}
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
