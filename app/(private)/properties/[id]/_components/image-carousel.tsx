"use client";
import { Property } from "@prisma/client";
import { Carousel } from "antd";
import { CarouselRef } from "antd/es/carousel";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import React, { useRef, useState } from "react";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import { AnimatePresence, motion, MotionConfig } from "framer-motion";
import useKeypress from "react-use-keypress";

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
    // <div className="sm:col-span-2 relative">
    //   <Carousel
    //     ref={ref}
    //     autoplay
    //     className="overflow-hidden rounded-lg"
    //     style={{ maxHeight: "550px" }} // Set max height for the Carousel
    //   >
    //     {property.images &&
    //       property.images.map((image) => {
    //         return (
    //           <div key={image}>
    //             <Image
    //               height={500}
    //               width={500}
    //               alt="Property Image"
    //               className="object-cover object-center w-full h-[550px] overflow-hidden lg:h-full bg-gradient-to-l from-black to-75%"
    //               style={{ maxHeight: "550px" }} // Ensure all images have max height
    //               src={image}
    //             />
    //           </div>
    //         );
    //       })}
    //   </Carousel>
    //   <div className="absolute inset-y-0 left-0 flex items-center justify-center">
    //     <button
    //       onClick={() => {
    //         ref.current?.prev();
    //       }}
    //       className="bg-gray-200 hover:bg-gray-200 p-1 rounded-full"
    //     >
    //       <ChevronLeft />
    //     </button>
    //   </div>
    //   <div className="absolute inset-y-0 right-0 flex items-center justify-center">
    //     <button
    //       onClick={() => {
    //         ref.current?.next();
    //       }}
    //       className="bg-gray-200 hover:bg-gray-300 transition-all ease-linear p-1 rounded-full"
    //     >
    //       <ChevronRight />
    //     </button>
    //   </div>
    //   <div className="h-8 min-w-fit rounded-sm px-2 absolute top-3 right-3 flex cursor-pointer items-center justify-center gap-2 bg-white font-medium leading-6">
    //     {property.images.length} Photos
    //   </div>
    // </div>
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

            {/* <div className="absolute left-1/2 bottom-2">
              <motion.div
                initial={false}
                animate={{
                  x: `-${
                    index * 100 * (collapsedAspectRatio / fullAspectRatio) +
                    index * gap +
                    margin
                  }%`,
                }}
                style={{ aspectRatio: fullAspectRatio, gap: `${gap}%` }}
                className="flex h-14 w-14"
              >
                {property.images.map((image, i) => (
                  <motion.button
                    key={image}
                    onClick={() => setIndex(i)}
                    whileHover={{ opacity: 1 }}
                    initial={false}
                    animate={i === index ? "active" : "inactive"}
                    variants={{
                      active: {
                        marginLeft: `${margin}%`,
                        marginRight: `${margin}%`,
                        opacity: 1,
                        aspectRatio: fullAspectRatio,
                      },
                      inactive: {
                        marginLeft: "0%",
                        marginRight: "0%",
                        opacity: 0.5,
                        aspectRatio: collapsedAspectRatio,
                      },
                    }}
                  >
                    <motion.img
                      src={image}
                      className="h-full w-full object-cover"
                    />
                  </motion.button>
                ))}
              </motion.div>
            </div> */}

            <div className="h-8 min-w-fit rounded-sm px-2 absolute top-3 right-3 flex cursor-pointer items-center justify-center gap-2 bg-white font-medium leading-6">
              {property.images.length} Photos
            </div>
          </div>
        </div>
      </MotionConfig>
    </section>
  );
}
