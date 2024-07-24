"use client";
import React, { useRef, useState, useEffect } from "react";
import { CarouselRef } from "antd/es/carousel";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import { AnimatePresence, motion, MotionConfig } from "framer-motion";
import useKeypress from "react-use-keypress";
import Image from "next/image";

interface Props {
  property: { coverPhotos: string[]; images: string[] };
}

// Utility function to remove duplicate images
const removeDuplicates = (images: string[]) => Array.from(new Set(images));

export default function ImageCarousel({ property }: Props) {
  const ref = useRef<CarouselRef>(null);
  const thumbnailRef = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const uniqueImages = removeDuplicates(property.images);
  const allImages = [...uniqueImages];

  useKeypress("ArrowRight", () => {
    if (index + 1 < allImages.length) {
      handleChangeIndex(index + 1);
    }
  });

  useKeypress("ArrowLeft", () => {
    if (index > 0) {
      handleChangeIndex(index - 1);
    }
  });

  const handleThumbnailClick = (i: number) => {
    handleChangeIndex(i);
  };

  const handleChangeIndex = (newIndex: number) => {
    setIndex(newIndex);
    scrollThumbnailIntoView(newIndex);
  };

  const scrollThumbnailIntoView = (newIndex: number) => {
    if (thumbnailRef.current) {
      const thumbnailElement = thumbnailRef.current.children[
        newIndex
      ] as HTMLElement;
      if (thumbnailElement) {
        thumbnailElement.scrollIntoView({
          behavior: "smooth",
          block: "nearest",
          inline: "start",
        });
      }
    }
  };

  const handleDoubleClick = () => {
    setIsModalVisible(true);
  };

  const handleCloseModal = () => {
    setIsModalVisible(false);
  };

  useEffect(() => {
    scrollThumbnailIntoView(index);
  }, [index]);

  return (
    <section className="lg:w-3/5 xl:w-2/3 space-y-8 lg:space-y-10 lg:pr-10">
      <MotionConfig transition={{ duration: 0.7, ease: [0.32, 0.72, 0, 1] }}>
        <div
          className="relative overflow-hidden h-full w-full"
          onDoubleClick={handleDoubleClick}
        >
          <div className="relative h-full w-full">
            <motion.div
              animate={{ x: -index * 100 + "%" }}
              className="flex h-full w-full"
              transition={{ duration: 0.5 }}
            >
              {allImages.map((image, i) => (
                <div
                  key={i}
                  className="relative flex-shrink-0 w-full h-full"
                  style={{ flexBasis: "100%" }}
                >
                  <Image
                    src={image}
                    alt={`Property Image ${i}`}
                    layout="fill"
                    objectFit="cover"
                    className="rounded-xl"
                  />
                </div>
              ))}
            </motion.div>

            <AnimatePresence initial={false}>
              {index > 0 && (
                <motion.button
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.7 }}
                  exit={{ opacity: 0, pointerEvents: "none" }}
                  whileHover={{ opacity: 1 }}
                  className="absolute left-2 top-1/2 -mt-4 flex h-8 w-8 items-center justify-center rounded-full bg-white"
                  onClick={() => handleChangeIndex(index - 1)}
                >
                  <ChevronLeftIcon className="h-6 w-6" />
                </motion.button>
              )}
            </AnimatePresence>

            <AnimatePresence initial={false}>
              {index + 1 < allImages.length && (
                <motion.button
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.7 }}
                  exit={{ opacity: 0, pointerEvents: "none" }}
                  whileHover={{ opacity: 1 }}
                  className="absolute right-2 top-1/2 -mt-4 flex h-8 w-8 items-center justify-center rounded-full bg-white"
                  onClick={() => handleChangeIndex(index + 1)}
                >
                  <ChevronRightIcon className="h-6 w-6" />
                </motion.button>
              )}
            </AnimatePresence>
          </div>

          <div className="absolute bottom-0 inset-x-0 h-20 bg-gradient-to-t from-black opacity-50 rounded-b-lg"></div>

          <div className="h-8 min-w-fit rounded-sm px-2 absolute top-3 right-3 flex cursor-pointer items-center justify-center gap-2 bg-white font-medium leading-6">
            {index + 1}/{allImages.length} Photos
          </div>

          <section
            ref={thumbnailRef}
            className="w-full absolute bottom-0 left-0 p-2 px-4 rounded-md shadow-md overflow-x-scroll text-xs scrollbar-hide"
          >
            <div className="flex gap-6 w-max">
              {allImages.map((image, i) => (
                <div key={i} className="relative w-16 h-16">
                  <Image
                    src={image}
                    alt="Thumbnail"
                    layout="fill"
                    objectFit="cover"
                    className={`w-full h-full rounded-full ring-2 ring-gray-100 cursor-pointer ${
                      i === index ? "border-4 border-blue-500" : ""
                    }`}
                    onClick={() => handleThumbnailClick(i)}
                  />
                </div>
              ))}
            </div>
          </section>
        </div>
      </MotionConfig>
    </section>
  );
}
