"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import type { Property } from "@prisma/client";
import PropertyCard from "@/components/properties/new/PropertyCard";

export default function RecentlyViewed() {
  const [recentProperties, setRecentProperties] = useState<Property[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Fetch recently viewed properties from localStorage
    const fetchRecentlyViewed = async () => {
      try {
        const viewedIds = JSON.parse(
          localStorage.getItem("recentlyViewedProperties") || "[]"
        );

        if (viewedIds.length === 0) {
          setIsLoading(false);
          return;
        }

        // Fetch property details using server action
        const response = await fetch("/api/properties/recently-viewed", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ propertyIds: viewedIds }),
        });

        if (response.ok) {
          const data = await response.json();
          setRecentProperties(data);
        }
      } catch (error) {
        console.error("Error fetching recently viewed properties:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRecentlyViewed();
  }, []);

  if (isLoading) {
    return <div className="container mx-auto py-8">Loading...</div>;
  }

  if (recentProperties.length === 0) {
    return null;
  }

  return (
    <section className="container mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-blue-600">
          Recently Viewed Properties
        </h2>
        <Link
          href="/properties"
          className="text-blue-600 flex items-center hover:underline"
        >
          View all <ChevronRight className="h-4 w-4 ml-1" />
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {recentProperties.map((property) => (
          <PropertyCard key={property.id} data={property as any} />
        ))}
      </div>
    </section>
  );
}
