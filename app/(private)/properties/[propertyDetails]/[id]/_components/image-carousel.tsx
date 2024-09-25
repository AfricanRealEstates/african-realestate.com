"use client";

import React, { useRef, useState, useEffect } from "react";
import { CarouselRef } from "antd/es/carousel";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import { AnimatePresence, motion, MotionConfig } from "framer-motion";
import useKeypress from "react-use-keypress";
import Image from "next/image";
import heic2any from "heic2any";

interface Props {
  property: { coverPhotos: string[]; images: string[] };
}

const removeDuplicates = (images: string[]) => Array.from(new Set(images));

export default function ImageCarousel({ property }: Props) {
  const ref = useRef<CarouselRef>(null);
  const thumbnailRef = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);
  const [allImages, setAllImages] = useState<string[]>([]);

  // Combine and remove duplicate images
  const combinedImages = [
    ...(property.coverPhotos || []),
    ...(property.images || []),
  ];
  const uniqueImages = removeDuplicates(combinedImages);

  // Function to convert HEIC images to JPEG
  const convertHeicImages = async (images: string[]) => {
    const convertedImages = await Promise.all(
      images.map(async (image) => {
        if (image.toLowerCase().endsWith(".heic")) {
          try {
            const response = await fetch(image);
            const blob = await response.blob();
            const convertedBlob = await heic2any({
              blob,
              toType: "image/jpeg",
            });

            // If result is an array of blobs, pick the first one
            const resultBlob = Array.isArray(convertedBlob)
              ? convertedBlob[0]
              : convertedBlob;
            return URL.createObjectURL(resultBlob as Blob);
          } catch (error) {
            console.error("Error converting HEIC image:", error);
            return image; // If conversion fails, use the original image
          }
        } else {
          return image; // Return non-HEIC images unchanged
        }
      })
    );
    setAllImages(convertedImages);
  };

  useKeypress("ArrowRight", () => {
    if (index + 1 < allImages.length + 1) {
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

  // Convert HEIC images on component mount
  useEffect(() => {
    convertHeicImages(uniqueImages);
  }, [property]);

  useEffect(() => {
    scrollThumbnailIntoView(index);
  }, [index]);

  return (
    <section className="lg:w-3/5 xl:w-2/3 space-y-8 lg:space-y-10 lg:pr-10">
      <MotionConfig transition={{ duration: 0.7, ease: [0.32, 0.72, 0, 1] }}>
        <div className="relative overflow-hidden h-full w-full">
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
                    className="rounded-xl object-cover"
                  />
                </div>
              ))}
              <div
                className="relative flex-shrink-0 w-full h-full bg-gradient-to-r from-blue-500 to-indigo-600"
                style={{ flexBasis: "100%" }}
              >
                <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-8">
                  <h2 className="text-4xl font-bold mb-4 text-center">
                    Ready to Make This Your Home?
                  </h2>
                  <p className="text-2xl mb-8 text-center">
                    Call us now to schedule a viewing!
                  </p>
                  <div className="text-3xl font-bold">Phone: 0732 945534</div>
                </div>
              </div>
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
              {index + 1 < allImages.length + 1 && (
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
            {index + 1}/{allImages.length + 1} Photos
          </div>

          <section
            ref={thumbnailRef}
            className="w-full absolute bottom-0 left-0 p-2 rounded-md shadow-md overflow-x-scroll text-xs scrollbar-hide"
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
              <div className="relative w-16 h-16">
                <div
                  className={`w-full h-full rounded-full ring-2 ring-gray-100 cursor-pointer bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center text-white text-xs font-bold ${
                    index === allImages.length ? "border-4 border-blue-500" : ""
                  }`}
                  onClick={() => handleThumbnailClick(allImages.length)}
                >
                  Call Us
                </div>
              </div>
            </div>
          </section>
        </div>
      </MotionConfig>
    </section>
  );
}
