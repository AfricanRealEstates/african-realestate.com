import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { auth } from "@/auth";
import { getRecommendedProperties } from "@/actions/properties";
import PropertyCard from "@/components/properties/new/PropertyCard";

export default async function RecommendedProperties() {
  const session = await auth();
  const userId = session?.user?.id;

  const properties = await getRecommendedProperties(userId);

  if (!properties || properties.length === 0) {
    return null;
  }

  return (
    <section className="container mx-auto py-12 px-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-blue-600">
          Recommended For You
        </h2>
        <Link
          href="/properties"
          className="text-blue-600 flex items-center hover:underline"
        >
          View all <ChevronRight className="h-4 w-4 ml-1" />
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {properties.map((property) => (
          <PropertyCard key={property.id} data={property as any} />
        ))}
      </div>
    </section>
  );
}
