"use client";
import { Property } from "@prisma/client";
import { CarouselRef } from "antd/es/carousel";
import Image from "next/image";
import React, { useRef, useState } from "react";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import { AnimatePresence, motion, MotionConfig } from "framer-motion";
import useKeypress from "react-use-keypress";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Card, CardContent } from "@/components/ui/card";

interface Props {
  property: Property;
}

let collapsedAspectRatio = 1 / 2;
let fullAspectRatio = 3 / 2;
let gap = 2;
let margin = 12;

export default function ImageCarousel({ property }: Props) {
  const ref = useRef<CarouselRef>(null);
  const [index, setIndex] = useState(0);

  useKeypress("ArrowRight", () => {
    if (index + 1 < property.images.length) {
      setIndex(index + 1);
    }
  });

  useKeypress("ArrowLeft", () => {
    if (index > 0) {
      setIndex((i) => i - 1);
    }
  });
  return (
    <section className="lg:w-3/5 xl:w-2/3 space-y-8 lg:space-y-10 lg:pr-10">
      <MotionConfig transition={{ duration: 0.7, ease: [0.32, 0.72, 0, 1] }}>
        <div className="h-full">
          <div className="mx-auto flex h-full flex-col justify-center relative">
            <div className="overflow-hidden relative h-full w-full">
              <motion.div
                animate={{ x: `-${index * 100}%` }}
                className="flex h-full rounded-xl" // Flex container
              >
                {property.images.map((image, i) => {
                  return (
                    <Image
                      key={image}
                      src={image}
                      width={300}
                      height={300}
                      alt="Property Image"
                      // animate={{ opacity: i === index ? 1 : 0.3 }}
                      className="aspect-[3/2] h-full min-w-full max-w-full object-cover rounded-xl" // Ensure the image takes up full width without extending beyond
                    />
                  );
                })}
              </motion.div>

              <AnimatePresence initial={false}>
                {index > 0 && (
                  <motion.button
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.7 }}
                    exit={{ opacity: 0, pointerEvents: "none" }}
                    whileHover={{ opacity: 1 }}
                    className="absolute left-2 top-1/2 -mt-4 flex h-8 w-8 items-center justify-center rounded-full bg-white"
                    onClick={() => setIndex(index - 1)}
                  >
                    <ChevronLeftIcon className="h-6 w-6" />
                  </motion.button>
                )}
              </AnimatePresence>

              <AnimatePresence initial={false}>
                {index + 1 < property.images.length && (
                  <motion.button
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.7 }}
                    exit={{ opacity: 0, pointerEvents: "none" }}
                    whileHover={{ opacity: 1 }}
                    className="absolute right-2 top-1/2 -mt-4 flex h-8 w-8 items-center justify-center rounded-full bg-white"
                    onClick={() => setIndex(index + 1)}
                  >
                    <ChevronRightIcon className="h-6 w-6" />
                  </motion.button>
                )}
              </AnimatePresence>
            </div>

            <div className="absolute bottom-0 inset-x-0 h-20 bg-gradient-to-t from-black opacity-50 rounded-b-lg"></div>

            <div className="h-8 min-w-fit rounded-sm px-2 absolute top-3 right-3 flex cursor-pointer items-center justify-center gap-2 bg-white font-medium leading-6">
              {property.images.length} Photos
            </div>

            <section className="w-full absolute -bottom-9 left-0 p-4 backdrop-blur-sm rounded-md shadow-md overflow-scroll text-xs scrollbar-hide">
              <div className="flex gap-8 w-max">
                {property.images.map((image) => (
                  <div
                    key={index}
                    className="flex flex-col items-center gap-2 cursor-pointer"
                  >
                    <Image
                      src={image}
                      alt="Stories"
                      width={64}
                      height={64}
                      className="w-16 h-16 rounded-full ring-2 ring-gray-100"
                    />
                  </div>
                ))}
              </div>
            </section>

            {/* <Carousel
              opts={{
                align: "start",
              }}
              className="w-full absolute -bottom-9 left-0 px-4 bg-white overflow-scroll scrollbar-hide"
            >
              <CarouselContent className="flex gap-8 w-max">
                {property.images.map((image) => (
                  <CarouselItem
                    key={index}
                    className="flex items-center gap-2 cursor-pointer"
                  >
                    <Image
                      width={64}
                      height={64}
                      src={image}
                      alt="Property"
                      className="w-16 h-16 rounded-md ring-2"
                    />
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="absolute bottom-0 left-0" />
              <CarouselNext className="absolute bottom-0 right-0" />
            </Carousel> */}
          </div>
        </div>
      </MotionConfig>
    </section>
  );
}
