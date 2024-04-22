"use client";
import { Property } from "@prisma/client";
import { Carousel } from "antd";
import { CarouselRef } from "antd/es/carousel";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import React, { useRef, useState } from "react";

interface Props {
  property: Property;
}

export default function ImageCarousel({ property }: Props) {
  const ref = useRef<CarouselRef>(null);

  return (
    <div className="sm:col-span-2 relative">
      <Carousel
        ref={ref}
        autoplay
        className="overflow-hidden rounded-lg"
        style={{ maxHeight: "500px" }} // Set max height for the Carousel
      >
        {property.images &&
          property.images.map((image) => {
            return (
              <div key={image}>
                <Image
                  height={500}
                  width={500}
                  alt="Property Image"
                  className="object-cover object-center w-full h-[500px] overflow-hidden lg:h-full bg-gradient-to-l from-black to-75%"
                  style={{ maxHeight: "500px" }} // Ensure all images have max height
                  src={image}
                />
              </div>
            );
          })}
      </Carousel>
      <div className="absolute inset-y-0 left-0 flex items-center justify-center">
        <button
          onClick={() => {
            ref.current?.prev();
          }}
          className="bg-gray-200 hover:bg-gray-200 p-1 rounded-full"
        >
          <ChevronLeft />
        </button>
      </div>
      <div className="absolute inset-y-0 right-0 flex items-center justify-center">
        <button
          onClick={() => {
            ref.current?.next();
          }}
          className="bg-gray-200 hover:bg-gray-300 transition-all ease-linear p-1 rounded-full"
        >
          <ChevronRight />
        </button>
      </div>
      <div className="h-8 min-w-fit rounded-sm px-2 absolute bottom-6 right-3 flex cursor-pointer items-center justify-center gap-2 bg-white font-medium leading-6">
        {property.images.length} Photos
      </div>
    </div>
  );
}
