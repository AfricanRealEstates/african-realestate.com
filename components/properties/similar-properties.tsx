import { prisma } from "@/lib/prisma";
import PropertyCard from "@/components/properties/new/PropertyCard";
import type { PropertyData } from "@/lib/types";

interface SimilarPropertiesProps {
  propertyId: string;
  propertyDetails: string;
  status: string;
  price: number;
  county: string;
  limit?: number;
}

async function getSimilarProperties({
  propertyId,
  propertyDetails,
  status,
  price,
  county,
  limit = 3,
}: SimilarPropertiesProps) {
  try {
    // Query for similar properties with simplified approach
    const similarProperties = await prisma.property.findMany({
      where: {
        AND: [
          { isActive: true },
          { id: { not: propertyId } }, // Exclude the current property
          {
            OR: [
              { propertyDetails }, // Same property details
              {
                AND: [
                  { status }, // Same status (sale/let)
                  { county }, // Same county
                ],
              },
            ],
          },
        ],
      },
      orderBy: { updatedAt: "desc" },
      take: limit,
    });

    return similarProperties;
  } catch (error) {
    console.error("Error fetching similar properties:", error);
    return [];
  }
}

export default async function SimilarProperties({
  propertyId,
  propertyDetails,
  status,
  price,
  county,
  limit = 3,
}: SimilarPropertiesProps) {
  try {
    const properties = await getSimilarProperties({
      propertyId,
      propertyDetails,
      status,
      price,
      county,
      limit,
    });

    if (properties.length === 0) {
      return null;
    }

    return (
      <div className="mt-8">
        <h2 className="text-2xl font-semibold mb-6">Similar Properties</h2>
        <div className="grid grid-cols-1 gap-x-8 gap-y-8 sm:grid-cols-2 sm:gap-y-10 lg:grid-cols-3">
          {properties.map((property) => (
            <PropertyCard key={property.id} data={property as PropertyData} />
          ))}
        </div>
      </div>
    );
  } catch (error) {
    console.error("Error in SimilarProperties component:", error);
    return null;
  }
}
