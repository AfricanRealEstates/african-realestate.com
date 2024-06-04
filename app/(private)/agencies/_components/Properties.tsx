"use client";
import { ButtonSecondary } from "@/components/globals/button-secondary";
import PropertyCard from "@/components/properties/new/PropertyCard";
import { Tab } from "@headlessui/react";
import { Property, User } from "@prisma/client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import React, { Fragment, useState, useEffect } from "react";

interface Props {
  properties: Property[];
  agent: User | null;
}

const RenderSection1 = ({ properties, agent }: Props) => {
  const session = useSession();
  const [selectedTab, setSelectedTab] = useState("sale");
  const [filteredProperties, setFilteredProperties] = useState<Property[]>([]);

  useEffect(() => {
    const filtered = properties.filter(
      (property) => property.status === selectedTab
    );
    setFilteredProperties(filtered);
  }, [selectedTab, properties]);

  const agentName = agent?.agentName ?? "Realtor";

  const router = useRouter();

  return (
    <div className="w-full flex flex-col sm:rounded-2xl border-b sm:border-t sm:border-l sm:border-r border-neutral-200 dark:border-neutral-700 space-y-6 sm:space-y-8 pb-10 px-0 sm:p-4 xl:p-8">
      <div>
        <h2 className="text-2xl text-indigo-500 font-semibold">{`${agentName} listings`}</h2>
        <span className="block mt-2 text-neutral-500 dark:text-neutral-400">
          {`${agentName}'s listings are very rich, and 5-star reviews help them to be more branded.`}
        </span>
      </div>
      <div className="w-full border-b border-neutral-100"></div>

      <div>
        <Tab.Group>
          <Tab.List className="flex space-x-1 overflow-x-auto">
            {["sale", "let"].map((status) => (
              <Tab key={status} as={Fragment}>
                {({ selected }) => (
                  <button
                    className={`flex-shrink-0 block !leading-none font-medium px-5 py-2.5 text-sm sm:text-base sm:px-6 sm:py-3 capitalize rounded-full focus:outline-none ${
                      selected
                        ? "bg-indigo-600 text-indigo-50 "
                        : "text-neutral-500  hover:text-neutral-900 hover:bg-neutral-100"
                    }`}
                    onClick={() => setSelectedTab(status)}
                  >
                    {status}
                  </button>
                )}
              </Tab>
            ))}
          </Tab.List>

          <div className="w-14 mt-8 border-b border-neutral-100"></div>

          <Tab.Panels>
            {["sale", "let"].map((status) => (
              <Tab.Panel key={status} className="">
                <div className="mt-8 grid grid-cols-1 gap-6 md:gap-7 sm:grid-cols-2">
                  {filteredProperties.length > 0 ? (
                    filteredProperties
                      .filter((property) => property.status === status)
                      .map((property) => (
                        <PropertyCard key={property.id} data={property} />
                      ))
                  ) : (
                    <>
                      <div className="col-span-full flex flex-col gap-y-4 text-center text-neutral-500 border border-neutral-100 rounded-md p-8">
                        <div className="flex gap-1">
                          {agentName} has zero (0) properties available for{" "}
                          <span className="font-semibold text-indigo-500">
                            {status}
                          </span>{" "}
                          right now.
                        </div>
                        <ButtonSecondary
                          onClick={() => router.push("/properties")}
                        >
                          View All Listings
                        </ButtonSecondary>
                      </div>
                    </>
                  )}
                </div>
                {filteredProperties.length > 0 && (
                  <>
                    <div className="border-b border-neutral-100 w-full mt-8"></div>
                    <div className="flex mt-11 justify-center items-center">
                      <ButtonSecondary>Show me more</ButtonSecondary>
                    </div>
                  </>
                )}
              </Tab.Panel>
            ))}
          </Tab.Panels>
        </Tab.Group>
      </div>
    </div>
  );
};

export default RenderSection1;
