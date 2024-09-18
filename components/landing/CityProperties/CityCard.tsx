import Image from "next/image";
import Link from "next/link";
import React from "react";

interface CityProps {
  city: {
    id: number;
    image: string;
    cityName: string;
    numberOfProperties: number;
  };
}

export default function CityCard({ city }: CityProps) {
  return (
    <Link href={`/properties/town/${encodeURIComponent(city.cityName)}`}>
      <div className="relative rounded-lg overflow-hidden m-2">
        <Image
          src={city.image || "/assets/Kilimani.webp"}
          alt="Image"
          width={700}
          height={500}
          className="rounded-lg w-full h-[350px] object-cover"
        />
        <div className="absolute inset-0 bg-black opacity-40"></div>
        <div className="absolute p-4 top-4">
          <h1 className="text-lg font-semibold text-white capitalize">
            {city.cityName}
          </h1>
          <p className="text-gray-300">{city.numberOfProperties} Properties</p>
        </div>
      </div>
    </Link>
  );
}
