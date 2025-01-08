"use client";
import { Property } from "@prisma/client";
import Image from "next/image";
import { useEffect, useState } from "react";

interface RelatedPropertyProps {
  property: Property;
}

const RelatedProperty = ({ property }: RelatedPropertyProps) => {
  const [randomImage, setRandomImage] = useState<string | null>(null);

  useEffect(() => {
    if (property.images && property.images.length > 0) {
      const randomIndex = Math.floor(Math.random() * property.images.length);
      setRandomImage(property.images[randomIndex]);
    }
  }, [property.images]);

  return (
    <>
      {randomImage && (
        <>
          <article className="group relative">
            <div className="aspect-h-3 aspect-w-4 max-h-[500px] overflow-hidden rounded-lg bg-gray-100">
              <Image
                key={randomImage}
                height={400}
                width={400}
                src={randomImage}
                alt={property.title}
                className="object-cover object-center w-full h-[500px] overflow-hidden lg:h-full bg-gradient-to-l from-black to-75%"
                style={{ maxHeight: "500px" }} // Ensure all images have max height
              />
              <div
                className="flex items-end p-4 opacity-0 group-hover:opacity-100"
                aria-hidden="true"
              >
                <div className="w-full rounded-md bg-white bg-opacity-75 px-4 py-2 text-center text-sm font-medium text-gray-900 backdrop-blur backdrop-filter">
                  View Product
                </div>
              </div>
            </div>

            <div className="mt-4 flex items-center justify-between space-x-8 text-base font-medium text-gray-900">
              <h3>
                <a href="#">
                  <span aria-hidden="true" className="absolute inset-0" />
                  {property.title}
                </a>
              </h3>
              <p>{property.price}</p>
            </div>
            <p className="mt-1 text-sm text-gray-500">
              {property.propertyType}
            </p>
          </article>
        </>
      )}
    </>
  );
};

export default RelatedProperty;
