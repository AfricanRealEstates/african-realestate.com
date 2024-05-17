"use client";
import { Route } from "@/types/types";
import Image, { StaticImageData } from "next/image";
import { useSwipeable } from "react-swipeable";
import React, { useState } from "react";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import { AnimatePresence, motion, MotionConfig } from "framer-motion";
import Link from "next/link";
import { variants } from "@/lib/utils/animation-variants";

export interface GallerySliderProps {
  className?: string;
  // galleryImgs: (StaticImageData | string)[];
  galleryImgs: string[];
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
  const images = galleryImgs;

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
      if (index < images?.length - 1) {
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

  let currentImage = images[index];
  return (
    // <MotionConfig
    //   transition={{
    //     x: { type: "spring", stiffness: 300, damping: 30 },
    //     opacity: { duration: 0.2 },
    //   }}
    // >
    //   <div
    //     className={`relative group group/cardGallerySlider ${className}`}
    //     {...handlers}
    //   >
    //     {/* Main image */}
    //     <div className={`w-full overflow-hidden ${galleryClass}`}>
    //       <Link
    //         href={href}
    //         className={`relative flex items-center justify-center ${ratioClass}`}
    //       >
    //         <AnimatePresence initial={false} custom={direction}>
    //           <motion.div
    //             key={index}
    //             custom={direction}
    //             variants={variants(340, 1)}
    //             initial="enter"
    //             animate="center"
    //             exit="exit"
    //             className="inset-0 h-[300px]"
    //           >
    //             <Image
    //               src={currentImage || ""}
    //               fill
    //               alt="Property Card"
    //               className={`object-cover ${imageClass}`}
    //               onLoad={() => setLoaded(true)}
    //               sizes="(max-width: 1025px) 100vw, 300px"
    //             />
    //           </motion.div>
    //         </AnimatePresence>
    //       </Link>
    //     </div>

    //     <>

    //       {loaded && navigation && (
    //         <div className="opacity-0 group-hover/cardGallerySlider:opacity-100 transition-opacity ">
    //           {index > 0 && (
    //             <button
    //               className="absolute w-8 h-8 left-3 top-[calc(50%-16px)] backdrop-blur-xs text-w-3005 pointer-events-auto z-50 hidden -translate-y-1/2 place-items-center rounded-full bg-black/40 opacity-0 transition-opacity hover:text-white group-hover:opacity-100 md:grid right-4"
    //               style={{ transform: "translate3d(0, 0, 0)" }}
    //               onClick={() => changePhotoId(index - 1)}
    //             >
    //               <ChevronLeftIcon className="h-4 w-4 text-neutral-400 transition-colors hover:text-white" />
    //             </button>
    //           )}
    //           {index + 1 < images.length && (
    //             <button
    //               className="absolute w-8 h-8 right-3 top-[calc(50%-16px)] backdrop-blur-xs text-w-3005 pointer-events-auto z-50 hidden -translate-y-1/2 place-items-center rounded-full bg-black/40 opacity-0 transition-opacity hover:text-white group-hover:opacity-100 md:grid"
    //               style={{ transform: "translate3d(0, 0, 0)" }}
    //               onClick={() => changePhotoId(index + 1)}
    //             >
    //               <ChevronRightIcon className="h-4 w-4 text-neutral-400 transition-colors hover:text-white" />
    //             </button>
    //           )}
    //         </div>
    //       )}

    //       <div className="absolute bottom-0 inset-x-0 h-10 bg-gradient-to-t from-neutral-900 opacity-50 rounded-b-lg"></div>
    //       <div className="flex items-center justify-center absolute bottom-2 left-1/2 transform -translate-x-1/2 space-x-1.5">
    //         {images.map((_, i) => (
    //           <button
    //             className={`w-1.5 h-1.5 rounded-full ${
    //               i === index ? "bg-white" : "bg-white/60 "
    //             }`}
    //             onClick={() => changePhotoId(i)}
    //             key={i}
    //           />
    //         ))}
    //       </div>
    //     </>
    //   </div>
    // </MotionConfig>
    <Link href={href}>
      <MotionConfig transition={{ duration: 0.7, ease: [0.32, 0.72, 0, 1] }}>
        <div className="h-full bg-black">
          <div className="mx-auto flex h-full max-w-7xl flex-col justify-center">
            <div className="relative overflow-hidden group">
              <motion.div
                animate={{ x: `-${index * 100}%` }}
                className="flex h-[300px]"
              >
                {galleryImgs.map((image) => {
                  return (
                    <Image
                      key={image}
                      src={image}
                      height={300}
                      width={400}
                      className="object-cover w-full h-full transition duration-300 group-hover:scale-[1.01]"
                      sizes="(max-width: 1025px) 100vw, 300px"
                      alt="Property Image"
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
                    className="absolute left-2 top-1/2 -mt-4 flex size-6 items-center justify-center rounded-full text-black bg-black/40 opacity-0 transition-opacity hover:text-white group-hover:opacity-100 pointer-events-auto z-50 backdrop-blur-xs"
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
                {index + 1 < images.length && (
                  <motion.button
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.7 }}
                    exit={{ opacity: 0, pointerEvents: "none" }}
                    whileHover={{ opacity: 1 }}
                    className="absolute right-2 top-1/2 -mt-4 flex size-6 items-center justify-center rounded-full text-black bg-black/40 opacity-0 transition-opacity hover:text-white group-hover:opacity-100 pointer-events-auto z-50 backdrop-blur-xs"
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
                {images.map((_, i) => (
                  <button
                    className={`w-1.5 h-1.5 rounded-full ${
                      i === index ? "bg-white" : "bg-white/60 "
                    }`}
                    onClick={() => changePhotoId(i)}
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
