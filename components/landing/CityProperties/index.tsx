import React from "react";
import CitySlider from "./CitySlider";
import { prisma } from "@/lib/prisma";

async function getPropertiesByNearbyTown() {
  try {
    // Fetch all necessary data in a single query
    const propertiesByTown = await prisma.property.groupBy({
      by: ["nearbyTown"],
      _count: {
        id: true,
      },
      orderBy: {
        _count: {
          id: "desc",
        },
      },
      take: 20,
    });

    const townNames = propertiesByTown.map((town) => town.nearbyTown);

    const allProperties = await prisma.property.findMany({
      where: {
        nearbyTown: {
          in: townNames,
        },
      },
      select: {
        id: true,
        nearbyTown: true,
        coverPhotos: true,
        title: true,
        propertyType: true,
        price: true,
        currency: true,
        propertyDetails: true,
        createdAt: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    // Group properties by town
    const groupedProperties = townNames.map((town) => ({
      town,
      properties: allProperties.filter((prop) => prop.nearbyTown === town),
    }));

    return groupedProperties;
  } catch (error) {
    console.error("Error fetching properties:", error);
    return [];
  }
}

export default async function CityProperties() {
  const propertiesByTown = await getPropertiesByNearbyTown();

  const cities = propertiesByTown.map((townData, index) => ({
    id: index,
    cityName: townData.town,
    image: townData.properties[0]?.coverPhotos[0] || `/assets/kitengela.webp`,
    numberOfProperties: townData.properties.length,
  }));

  return (
    <div className="border-b border-neutral-100 mb-4 text-[#4e4e4e]">
      <div className="mx-auto w-[95%] max-w-7xl px-2 py-16 md:px-2 md:py-12 lg:py-16">
        <div className="flex flex-col items-center justify-center gap-2">
          <p className="text-[12px] uppercase text-blue-600 font-semibold leading-relaxed">
            Explore the Hottest Properties near You
          </p>
          <h2 className="text-center tracking-tight text-3xl font-bold sm:text-4xl my-1">
            Our Most Popular Towns
          </h2>
        </div>

        <div className="mt-10 md:mt-16">
          {cities.length > 0 ? (
            <CitySlider cities={cities} />
          ) : (
            <p className="text-center text-gray-500">
              No cities available at the moment.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
