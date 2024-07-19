"use client";
import { Property } from "@prisma/client";
import React, { useRef, useState, useEffect } from "react";
import { CarouselRef } from "antd/es/carousel";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import { AnimatePresence, motion, MotionConfig } from "framer-motion";
import useKeypress from "react-use-keypress";
import { Carousel } from "antd";
// import ImageModal from "./ImageModal"; // Import the ImageModal component

interface Props {
  property: Property;
}

// Utility function to remove duplicate images
const removeDuplicates = (images: string[]) => {
  return Array.from(new Set(images));
};

export default function ImageCarousel({ property }: Props) {
  const ref = useRef<CarouselRef>(null);
  const thumbnailRef = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);
  const [isModalVisible, setIsModalVisible] = useState(false); // Modal visibility state

  const uniqueCoverPhotos = removeDuplicates(property.coverPhotos);
  const uniqueImages = removeDuplicates(property.images);
  const allImages = [...uniqueCoverPhotos, ...uniqueImages];

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
          inline: "start", // Ensure it aligns with the start of the scroll container
        });
      }
    }
  };

  const handleDoubleClick = () => {
    setIsModalVisible(true); // Open modal on double-click
  };

  const handleCloseModal = () => {
    setIsModalVisible(false); // Close modal
  };

  useEffect(() => {
    scrollThumbnailIntoView(index);
  }, [index]);

  return (
    <section className="lg:w-3/5 xl:w-2/3 space-y-8 lg:space-y-10 lg:pr-10">
      <MotionConfig transition={{ duration: 0.7, ease: [0.32, 0.72, 0, 1] }}>
        <div className="h-full" onDoubleClick={handleDoubleClick}>
          <div className="mx-auto flex h-full flex-col justify-center relative">
            <div className="overflow-hidden relative h-full w-full">
              <motion.div
                animate={{ x: -index * 100 + "%" }}
                className="flex h-full rounded-xl"
              >
                {allImages.map((image, i) => (
                  <img
                    key={i}
                    src={image}
                    alt="Property Image"
                    width={300}
                    height={300}
                    className="aspect-[3/2] h-full min-w-full max-w-full object-cover rounded-xl"
                  />
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
              className="w-full absolute bottom-0 -left-0 p-4 rounded-md shadow-md overflow-x-scroll text-xs scrollbar-hide"
            >
              <div className="flex gap-8 w-max">
                {allImages.map((image, i) => (
                  <img
                    key={i}
                    src={image}
                    alt="Thumbnail"
                    width={64}
                    height={64}
                    className={`w-16 h-16 rounded-full ring-2 ring-gray-100 cursor-pointer ${
                      i === index ? "border-4 border-blue-500" : ""
                    }`}
                    onClick={() => handleThumbnailClick(i)}
                  />
                ))}
              </div>
            </section>
          </div>
        </div>
      </MotionConfig>

      {/* <ImageModal
        images={allImages}
        visible={isModalVisible}
        onClose={handleCloseModal}
        initialIndex={index} // Pass the current index to the modal
      /> */}
    </section>
  );
}

interface ImageModalProps {
  images: string[];
  visible: boolean;
  onClose: () => void;
  initialIndex: number; // Add initialIndex prop
}

const ImageModal: React.FC<ImageModalProps> = ({
  images,
  visible,
  onClose,
  initialIndex,
}) => {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="h-screen fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75"
        >
          <div className="relative w-full h-full max-w-4xl max-h-[80vh]">
            <button
              className="absolute top-3 right-3 text-white text-2xl"
              onClick={onClose}
            >
              &times;
            </button>
            <Carousel
              className="h-full w-full"
              dots={false}
              arrows
              initialSlide={initialIndex} // Set the initial slide
              prevArrow={<ChevronLeftIcon className="h-8 w-8 text-white" />}
              nextArrow={<ChevronRightIcon className="h-8 w-8 text-white" />}
            >
              {images.map((image, index) => (
                <div key={index} className="w-full h-full">
                  <img
                    src={image}
                    alt={`Modal Image ${index + 1}`}
                    className="object-cover w-full h-full"
                  />
                </div>
              ))}
            </Carousel>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
