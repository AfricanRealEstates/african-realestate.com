"use client";

import { useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { PropertyType, PropertyStatus } from "./Guides";

interface GuidesContentProps {
  propertyTypes: PropertyType[];
  propertyStatuses: PropertyStatus[];
}

export default function GuidesContent({
  propertyTypes,
  propertyStatuses,
}: GuidesContentProps) {
  const [activeType, setActiveType] = useState(propertyTypes[0].value);
  const [activeStatus, setActiveStatus] = useState("sale");

  return (
    <div className="flex flex-col lg:flex-row gap-8">
      <div className="lg:w-1/4">
        <div className="sticky top-8 bg-neutral-50 rounded-lg shadow-sm p-6">
          <h2 className="text-2xl font-semibold mb-6 text-gray-800">
            Property Types
          </h2>
          <ScrollArea className="h-[calc(100vh-300px)]">
            <nav className="space-y-2">
              {propertyTypes.map((type) => (
                <button
                  key={type.value}
                  onClick={() => setActiveType(type.value)}
                  className={cn(
                    "w-full text-left px-4 py-3 rounded-md transition-all duration-300 ease-in-out",
                    activeType === type.value
                      ? "bg-gray-200 text-gray-900 font-medium"
                      : "hover:bg-gray-100 text-gray-600"
                  )}
                >
                  {type.label}
                </button>
              ))}
            </nav>
          </ScrollArea>
        </div>
      </div>

      <div className="lg:w-3/4">
        <div className="flex gap-4 mb-8">
          {propertyStatuses.map((status) => (
            <button
              key={status.value}
              onClick={() => setActiveStatus(status.value)}
              className={cn(
                "px-6 py-3 rounded-full text-sm font-medium transition-all duration-300 ease-in-out",
                activeStatus === status.value
                  ? "bg-gray-600 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              )}
            >
              {status.label}
            </button>
          ))}
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {propertyTypes
            .find((type) => type.value === activeType)
            ?.subOptions.map((subOption) => (
              <div
                key={subOption.value}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 ease-in-out"
              >
                <div className="h-40 bg-gray-200"></div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-2 text-gray-800">
                    {subOption.label}
                  </h3>
                  <p className="text-sm text-gray-500 mb-4">
                    Guide for {subOption.label} ({activeStatus})
                  </p>
                  <p className="text-gray-600">
                    Here you can add dynamic content for each guide.
                  </p>
                  <button className="mt-4 px-4 py-2 bg-gray-100 text-gray-500 rounded-md hover:bg-gray-300 transition-colors duration-300 ease-in-out">
                    Read More
                  </button>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}
