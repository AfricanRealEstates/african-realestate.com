"use client";
import { Route } from "@/types/types";
import Image from "next/image";
import { useSwipeable } from "react-swipeable";
import React, { useState, useEffect } from "react";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import { AnimatePresence, motion, MotionConfig } from "framer-motion";
import Link from "next/link";
import heic2any from "heic2any";

export interface GallerySliderProps {
  className?: string;
  galleryImgs: string[];
  coverPhotos: string[];
  ratioClass?: string;
  uniqueID: string;
  href?: Route<string>;
  imageClass?: string;
  galleryClass?: string;
  navigation?: boolean;
}

export default function GallerySlider({
  className = "",
  galleryImgs,
  coverPhotos,
  ratioClass = "aspect-w-4 aspect-h-3",
  imageClass = "",
  uniqueID = "uniqueID",
  galleryClass = "rounded-xl",
  href = "",
  navigation = true,
}: GallerySliderProps) {
  const [loaded, setLoaded] = useState(false);
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const [convertedImages, setConvertedImages] = useState<string[]>([]);
  const [convertedCovers, setConvertedCovers] = useState<string[]>([]);

  useEffect(() => {
    const convertHeicImages = async (
      images: string[],
      setImages: React.Dispatch<React.SetStateAction<string[]>>
    ) => {
      const converted = await Promise.all(
        images.map(async (image) => {
          if (image.toLowerCase().endsWith(".heic")) {
            try {
              console.log(`Converting HEIC: ${image}`);
              const response = await fetch(image);
              const blob = await response.blob();

              const result = await heic2any({ blob, toType: "image/jpeg" });

              const convertedBlob = Array.isArray(result) ? result[0] : result;
              const objectURL = URL.createObjectURL(convertedBlob as Blob);

              console.log(`Converted URL: ${objectURL}`);
              return objectURL;
            } catch (error) {
              console.error("Error converting HEIC image", error);
              return image; // Fallback to original image if conversion fails
            }
          } else {
            return image;
          }
        })
      );
      setImages(converted);
    };

    convertHeicImages(coverPhotos, setConvertedCovers);
    convertHeicImages(galleryImgs, setConvertedImages);
  }, [coverPhotos, galleryImgs]);

  // useEffect(() => {
  //   const convertHeicImages = async (
  //     images: string[],
  //     setImages: React.Dispatch<React.SetStateAction<string[]>>
  //   ) => {
  //     const converted = await Promise.all(
  //       images.map(async (image) => {
  //         if (image.toLowerCase().endsWith(".heic")) {
  //           try {
  //             const response = await fetch(image);
  //             const blob = await response.blob();

  //             // Perform the conversion
  //             const result = await heic2any({ blob, toType: "image/jpeg" });

  //             // Handle the case where result could be a Blob or Blob[]
  //             const convertedBlob = Array.isArray(result) ? result[0] : result;

  //             return URL.createObjectURL(convertedBlob as Blob);
  //           } catch (error) {
  //             console.error("Error converting HEIC image", error);
  //             return image; // Return the original image if conversion fails
  //           }
  //         } else {
  //           return image; // If not HEIC, return the original image
  //         }
  //       })
  //     );
  //     setImages(converted);
  //   };

  //   // Convert coverPhotos and galleryImgs
  //   convertHeicImages(coverPhotos, setConvertedCovers);
  //   convertHeicImages(galleryImgs, setConvertedImages);
  // }, [coverPhotos, galleryImgs]);

  function changePhotoId(newVal: number) {
    if (newVal > index) {
      setDirection(1);
    } else {
      setDirection(-1);
    }
    setIndex(newVal);
  }

  const handlers = useSwipeable({
    onSwipedLeft: () => {
      if (index < convertedImages?.length - 1) {
        changePhotoId(index + 1);
      }
    },
    onSwipedRight: () => {
      if (index > 0) {
        changePhotoId(index - 1);
      }
    },
    trackMouse: true,
  });

  let currentImage = convertedImages[index];

  return (
    <Link href={href}>
      <MotionConfig transition={{ duration: 0.7, ease: [0.32, 0.72, 0, 1] }}>
        <div className="h-full bg-black">
          <div className="mx-auto flex h-full max-w-7xl flex-col justify-center">
            <div className="relative overflow-hidden group">
              <motion.div
                animate={{ x: `-${index * 100}%` }}
                className="flex h-[300px] w-full"
              >
                {convertedCovers.map((image) => (
                  <div
                    key={image}
                    className="flex-shrink-0 w-full h-full relative"
                  >
                    <Image
                      src={image}
                      layout="fill"
                      className="object-cover w-full h-full transition duration-300 ease-in-out hover:scale-110 hover:opacity-50"
                      alt="Property Image"
                    />
                  </div>
                ))}
                {convertedImages.map((image) => (
                  <div
                    key={image}
                    className="flex-shrink-0 w-full h-full relative"
                  >
                    {image.startsWith("blob:") ? (
                      <img
                        src={image}
                        className="object-cover w-full h-full transition duration-300 ease-in-out hover:scale-110 hover:opacity-50"
                        alt="Property Image"
                      />
                    ) : (
                      <Image
                        src={image}
                        layout="fill"
                        className="object-cover w-full h-full transition duration-300 ease-in-out hover:scale-110 hover:opacity-50"
                        alt="Property Image"
                      />
                    )}
                  </div>
                ))}
              </motion.div>

              {/* Navigation buttons and dots */}
              <AnimatePresence initial={false}>
                {index > 0 && (
                  <motion.button
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.7 }}
                    exit={{ opacity: 0, pointerEvents: "none" }}
                    whileHover={{ opacity: 1 }}
                    className="absolute left-2 top-1/2 -mt-4 flex size-6 items-center justify-center rounded-full text-neutral-200 bg-black/40 opacity-0 transition-opacity hover:text-white group-hover:opacity-100 pointer-events-auto z-20 backdrop-blur-xs"
                    onClick={(e) => {
                      e.preventDefault();
                      setIndex(index - 1);
                    }}
                  >
                    <ChevronLeftIcon className="size-4" />
                  </motion.button>
                )}
              </AnimatePresence>

              <AnimatePresence initial={false}>
                {index + 1 < convertedImages.length && (
                  <motion.button
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.7 }}
                    exit={{ opacity: 0, pointerEvents: "none" }}
                    whileHover={{ opacity: 1 }}
                    className="absolute right-2 top-1/2 -mt-4 z-20 flex size-6 items-center justify-center rounded-full text-neutral-200 bg-black/40 opacity-0 transition-opacity hover:text-white group-hover:opacity-100 pointer-events-auto backdrop-blur-xs"
                    onClick={(e) => {
                      e.preventDefault();
                      setIndex(index + 1);
                    }}
                  >
                    <ChevronRightIcon className="size-4" />
                  </motion.button>
                )}
              </AnimatePresence>

              <div className="absolute bottom-0 inset-x-0 h-10 bg-gradient-to-t from-neutral-900 opacity-50 rounded-b-lg"></div>

              <div className="flex items-center justify-center absolute bottom-2 left-1/2 transform -translate-x-1/2 space-x-1.5">
                {convertedImages.map((_, i) => (
                  <button
                    className={`w-1.5 h-1.5 rounded-full ${
                      i === index ? "bg-white" : "bg-white/60 "
                    }`}
                    onClick={(e) => {
                      e.preventDefault();
                      changePhotoId(i);
                    }}
                    key={i}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </MotionConfig>
    </Link>
  );
}
