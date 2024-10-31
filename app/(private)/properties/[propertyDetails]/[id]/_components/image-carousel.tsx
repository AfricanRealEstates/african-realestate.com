"use client";

import React, { useRef, useState, useEffect } from "react";
import { CarouselRef } from "antd/es/carousel";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import { AnimatePresence, motion, MotionConfig } from "framer-motion";
import useKeypress from "react-use-keypress";
import Image from "next/image";
import heic2any from "heic2any";
import { Phone, Play } from "lucide-react";

interface Props {
  property: {
    coverPhotos: string[];
    images: string[];
  };
  videoLink?: string;
  whatsappNumber: string | null;
}

const removeDuplicates = (images: string[]) => Array.from(new Set(images));

export default function Component({
  property,
  whatsappNumber,
  videoLink,
}: Props) {
  const ref = useRef<CarouselRef>(null);
  const thumbnailRef = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);
  const [allImages, setAllImages] = useState<string[]>([]);
  const [showVideo, setShowVideo] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);

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

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (touchStart - touchEnd > 75) {
      // Swipe left
      if (index + 1 < allImages.length + 1) {
        handleChangeIndex(index + 1);
      }
    }

    if (touchStart - touchEnd < -75) {
      // Swipe right
      if (index > 0) {
        handleChangeIndex(index - 1);
      }
    }
  };

  const handleThumbnailClick = (i: number) => {
    handleChangeIndex(i);
  };

  const handleChangeIndex = (newIndex: number) => {
    setIndex(newIndex);
    scrollThumbnailIntoView(newIndex);
    setShowVideo(false);
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
    <section className="w-full lg:w-3/5 xl:w-2/3 space-y-4 lg:space-y-10 lg:pr-10 h-full">
      <MotionConfig transition={{ duration: 0.7, ease: [0.32, 0.72, 0, 1] }}>
        <div className="relative overflow-hidden h-[350px] sm:h-[400px] md:h-[500px] lg:h-[570px] w-full">
          <div
            className="relative h-full w-full"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
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
                    onDoubleClick={() => setShowPreview(true)}
                  />
                  {videoLink && (
                    <button
                      className="absolute top-2 right-2 bg-black bg-opacity-50 p-2 rounded-full"
                      onClick={() => setShowVideo(true)}
                    >
                      <Play className="w-6 h-6 text-white" />
                    </button>
                  )}
                  {showVideo && videoLink && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-75">
                      <video
                        src={videoLink}
                        controls
                        className="w-full h-full object-contain"
                        onClick={(e) => e.stopPropagation()}
                      />
                      <button
                        className="absolute top-2 right-2 bg-white p-2 rounded-full"
                        onClick={() => setShowVideo(false)}
                      >
                        Close
                      </button>
                    </div>
                  )}
                </div>
              ))}
              <div
                className="relative flex-shrink-0 w-full h-full"
                style={{ flexBasis: "100%" }}
              >
                <Image
                  src="/assets/house-1.jpg"
                  alt="House Background"
                  layout="fill"
                  objectFit="cover"
                  className="rounded-xl"
                />
                <div className="absolute inset-0 bg-black bg-opacity-70 flex flex-col items-center justify-center text-white p-4 sm:p-8">
                  <h2 className="text-2xl sm:text-4xl font-bold mb-2 sm:mb-4 text-center">
                    Ready to Make This Your Property?
                  </h2>
                  <p className="text-lg sm:text-2xl mb-4 sm:mb-8 text-center">
                    Contact Agent now to schedule a viewing!
                  </p>
                  <button
                    className="flex items-center justify-center px-4 sm:px-8 py-2 sm:py-4 text-xl sm:text-3xl font-bold bg-gradient-to-r from-teal-400 to-blue-500 hover:from-teal-500 hover:to-blue-600 text-white rounded-full shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-teal-300 focus:ring-opacity-50"
                    onClick={() => {
                      if (whatsappNumber) {
                        window.location.href = `tel:${whatsappNumber}`;
                      }
                    }}
                  >
                    <Phone className="w-6 h-6 sm:w-8 sm:h-8 mr-2 sm:mr-4" />
                    {whatsappNumber ? (
                      <>
                        {whatsappNumber.substring(0, 7)}
                        <span className="text-white opacity-70">*****</span>
                      </>
                    ) : (
                      "Call Now"
                    )}
                  </button>
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
            <div className="flex gap-2 sm:gap-4 w-max">
              {allImages.map((image, i) => (
                <div
                  key={i}
                  className="relative w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16"
                >
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
                  {videoLink && i === 0 && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-full">
                      <Play className="w-6 h-6 text-white" />
                    </div>
                  )}
                </div>
              ))}
              <div className="relative w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16">
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

      {showPreview && (
        <div
          className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50"
          onClick={() => setShowPreview(false)}
        >
          <div className="relative max-w-4xl max-h-full">
            <Image
              src={allImages[index]}
              alt={`Property Image ${index}`}
              width={1200}
              height={800}
              className="object-contain"
            />
            <button
              className="absolute top-4 right-4 bg-white p-2 rounded-full"
              onClick={() => setShowPreview(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
