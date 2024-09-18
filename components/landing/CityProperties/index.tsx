import React from "react";
import CitySlider from "./CitySlider";
import prisma from "@/lib/prisma";

async function getPropertiesByNearbyTown() {
  // Group by nearbyTown and get the count of properties for each town
  const propertiesByTown = await prisma.property.groupBy({
    by: ["nearbyTown"],
    _count: {
      id: true,
    },
    orderBy: {
      _count: {
        id: "desc", // Order by town with the most properties
      },
    },
    take: 10, // Limit to top 7 towns
  });

  const properties = await Promise.all(
    propertiesByTown.map(async (town) => {
      // Fetch properties for each town, including the coverPhoto of the first property
      const townProperties = await prisma.property.findMany({
        where: {
          nearbyTown: town.nearbyTown,
        },
        orderBy: {
          createdAt: "desc", // Fetch the latest properties
        },
        // take: 5, // Fetch the latest 5 properties
        select: {
          id: true,
          coverPhotos: true, // Assuming coverPhotos is an array
          title: true,
          propertyType: true,
          price: true,
          currency: true,
          propertyDetails: true,
        },
      });

      // Return the town and its properties
      return {
        town: town.nearbyTown,
        properties: townProperties,
      };
    })
  );

  return properties;
}

export default async function CityProperties() {
  const propertiesByTown = await getPropertiesByNearbyTown();

  // Create an array for CitySlider with the first property's coverPhoto
  const cities = propertiesByTown.map((townData, index) => ({
    id: index,
    cityName: townData.town,
    image: townData.properties[1]?.coverPhotos[0] || `/assets/kitengela.webp`, // Use the first property's coverPhoto, fallback to a default image
    numberOfProperties: townData.properties.length,
  }));

  console.log(cities);

  return (
    <div className={`border-b border-neutral-100 mb-4 text-[#4e4e4e]`}>
      <div className="mx-auto w-[95%] max-w-7xl px-2 py-16 md:px-2 md:py-12 lg:py-16">
        <div className="flex flex-col items-center justify-center gap-2">
          <p
            className={`text-[12px] uppercase text-blue-600 font-semibold leading-relaxed`}
          >
            Explore the Hottest Properties near You
          </p>
          <h2
            className={`text-center tracking-tight text-3xl font-bold sm:text-4xl my-1`}
          >
            Our Most Popular Towns
          </h2>
        </div>

        <div className="mt-10 md:mt-16">
          {/* Pass the cities data to CitySlider */}
          <CitySlider cities={cities} />
        </div>
      </div>
    </div>
  );
}
