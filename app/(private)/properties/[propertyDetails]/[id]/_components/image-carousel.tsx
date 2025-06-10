"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import useKeypress from "react-use-keypress";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import {
  Phone,
  Play,
  Maximize,
  Minimize,
  X,
  ImageIcon,
  Video,
  ExternalLink,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useSwipeable } from "react-swipeable";

interface ImageCarouselProps {
  property: {
    coverPhotos: string[];
    images?: string[];
    id: string;
    title: string;
  };
  videoLink?: string | null;
  whatsappNumber?: string | null;
}

// Utility function to detect and convert YouTube URLs
const getVideoEmbedUrl = (
  url: string
): { embedUrl: string; isYouTube: boolean; isDirectVideo: boolean } => {
  if (!url) return { embedUrl: "", isYouTube: false, isDirectVideo: false };

  // YouTube URL patterns
  const youtubeRegex =
    /(?:youtube\.com\/(?:[^/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?/\s]{11})/;
  const youtubeMatch = url.match(youtubeRegex);

  if (youtubeMatch) {
    const videoId = youtubeMatch[1];
    return {
      embedUrl: `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1`,
      isYouTube: true,
      isDirectVideo: false,
    };
  }

  // Check if it's a direct video file
  const videoExtensions = [".mp4", ".webm", ".ogg", ".mov", ".avi"];
  const isDirectVideo = videoExtensions.some((ext) =>
    url.toLowerCase().includes(ext)
  );

  return {
    embedUrl: url,
    isYouTube: false,
    isDirectVideo,
  };
};

// Utility function to optimize CloudFront image URLs
const optimizeImageUrl = (
  url: string,
  width?: number,
  quality?: number
): string => {
  if (!url) return "/placeholder.svg";

  // If it's already a CloudFront URL, we can add query parameters for optimization
  if (url.includes("dw1utqy4bbv8r.cloudfront.net")) {
    const params = new URLSearchParams();
    if (width) params.set("w", width.toString());
    if (quality) params.set("q", quality.toString());

    const separator = url.includes("?") ? "&" : "?";
    return params.toString() ? `${url}${separator}${params.toString()}` : url;
  }

  return url;
};

export default function EnhancedImageCarousel({
  property,
  videoLink,
  whatsappNumber,
}: ImageCarouselProps) {
  // State management
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const [isImageLoaded, setIsImageLoaded] = useState<boolean[]>([]);
  const [showControls, setShowControls] = useState(true);
  const [imageLoadErrors, setImageLoadErrors] = useState<boolean[]>([]);
  const [preloadedImages, setPreloadedImages] = useState<Set<number>>(
    new Set([0])
  );

  // Refs
  const carouselRef = useRef<HTMLDivElement>(null);
  const thumbnailsRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const fullscreenContainerRef = useRef<HTMLDivElement>(null);
  const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Video processing
  const videoInfo = videoLink ? getVideoEmbedUrl(videoLink) : null;

  // Combine and deduplicate images
  const allImages = [
    ...(property.coverPhotos || []),
    ...(property.images || []).filter(
      (img) => img && !property.coverPhotos.includes(img)
    ),
  ].filter(Boolean);

  // Initialize image loading state arrays
  useEffect(() => {
    const imageCount = allImages.length;
    setIsImageLoaded(new Array(imageCount).fill(false));
    setImageLoadErrors(new Array(imageCount).fill(false));
  }, [allImages.length]);

  // Handle image load events
  const handleImageLoaded = (index: number) => {
    setIsImageLoaded((prev) => {
      const newState = [...prev];
      newState[index] = true;
      return newState;
    });
  };

  // Handle image load errors
  const handleImageError = (index: number) => {
    setImageLoadErrors((prev) => {
      const newState = [...prev];
      newState[index] = true;
      return newState;
    });
  };

  // Navigation functions
  const goToPrevious = useCallback(() => {
    if (isVideoPlaying) {
      setIsVideoPlaying(false);
      setCurrentIndex(0);
      return;
    }
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? allImages.length - 1 : prevIndex - 1
    );
  }, [allImages.length, isVideoPlaying]);

  const goToNext = useCallback(() => {
    if (isVideoPlaying) {
      setIsVideoPlaying(false);
      setCurrentIndex(0);
      return;
    }
    setCurrentIndex((prevIndex) =>
      prevIndex === allImages.length - 1 ? 0 : prevIndex + 1
    );
  }, [allImages.length, isVideoPlaying]);

  // Keyboard navigation
  useKeypress(["ArrowLeft"], goToPrevious);
  useKeypress(["ArrowRight"], goToNext);
  useKeypress(["Escape"], () => {
    if (isFullscreen) setIsFullscreen(false);
    if (isVideoPlaying) setIsVideoPlaying(false);
  });

  // Swipe handlers
  const swipeHandlers = useSwipeable({
    onSwipedLeft: () => goToNext(),
    onSwipedRight: () => goToPrevious(),
    trackMouse: true,
    preventScrollOnSwipe: true,
  });

  // Scroll thumbnail into view when current index changes
  useEffect(() => {
    if (thumbnailsRef.current && !isVideoPlaying) {
      const thumbnailElement = thumbnailsRef.current.children[
        currentIndex
      ] as HTMLElement;
      if (thumbnailElement) {
        thumbnailElement.scrollIntoView({
          behavior: "smooth",
          block: "nearest",
          inline: "center",
        });
      }
    }
  }, [currentIndex, isVideoPlaying]);

  // Handle fullscreen toggle
  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
    // Hide body scroll when in fullscreen
    if (!isFullscreen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
  };

  // Handle video toggle
  const toggleVideo = () => {
    if (videoInfo) {
      setIsVideoPlaying(!isVideoPlaying);
      setIsVideoLoaded(false);

      if (!isVideoPlaying) {
        // Reset video if it's a direct video
        if (videoInfo.isDirectVideo && videoRef.current) {
          videoRef.current.currentTime = 0;
          videoRef.current
            .play()
            .catch((e) => console.error("Video play failed:", e));
        }
      }
    }
  };

  // Auto-hide controls after inactivity
  const resetControlsTimeout = useCallback(() => {
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current);
    }
    setShowControls(true);
    controlsTimeoutRef.current = setTimeout(() => {
      if (isFullscreen || isVideoPlaying) {
        setShowControls(false);
      }
    }, 3000);
  }, [isFullscreen, isVideoPlaying]);

  // Reset controls timeout on mouse move
  useEffect(() => {
    if (isFullscreen || isVideoPlaying) {
      resetControlsTimeout();
      const handleMouseMove = () => resetControlsTimeout();
      const handleTouchStart = () => resetControlsTimeout();

      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("touchstart", handleTouchStart);

      return () => {
        window.removeEventListener("mousemove", handleMouseMove);
        window.removeEventListener("touchstart", handleTouchStart);
        if (controlsTimeoutRef.current) {
          clearTimeout(controlsTimeoutRef.current);
        }
      };
    }
  }, [isFullscreen, isVideoPlaying, resetControlsTimeout]);

  // Handle video end
  const handleVideoEnd = () => {
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
    }
  };

  // Handle video/iframe loading
  const handleVideoLoad = () => {
    setIsVideoLoaded(true);
  };

  // Clean up body overflow on unmount
  useEffect(() => {
    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);

  // Handle fullscreen ESC key
  useEffect(() => {
    const handleEscKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isFullscreen) {
        setIsFullscreen(false);
        document.body.style.overflow = "unset";
      }
    };
    window.addEventListener("keydown", handleEscKey);
    return () => window.removeEventListener("keydown", handleEscKey);
  }, [isFullscreen]);

  // Handle call to action click
  const handleCallToAction = () => {
    if (whatsappNumber) {
      window.location.href = `tel:${whatsappNumber}`;
    }
  };

  // Open video in new tab for YouTube
  const openVideoInNewTab = () => {
    if (videoLink) {
      window.open(videoLink, "_blank", "noopener,noreferrer");
    }
  };

  // Preload adjacent images to eliminate loading states during navigation
  useEffect(() => {
    // Preload current image and adjacent images (previous and next)
    const imagesToPreload = [
      currentIndex,
      currentIndex > 0 ? currentIndex - 1 : allImages.length - 1,
      currentIndex < allImages.length - 1 ? currentIndex + 1 : 0,
    ];

    // Create new Image objects to preload
    imagesToPreload.forEach((index) => {
      if (!preloadedImages.has(index) && allImages[index]) {
        // Use window.Image to explicitly reference the browser's native Image constructor
        const img = new window.Image();
        img.src = optimizeImageUrl(
          allImages[index],
          isFullscreen ? 1920 : 800,
          isFullscreen ? 90 : 80
        );
        img.onload = () => {
          setPreloadedImages((prev) => new Set([...prev, index]));
          handleImageLoaded(index);
        };
        img.onerror = () => handleImageError(index);
      }
    });
  }, [currentIndex, allImages, preloadedImages, isFullscreen]);

  // Render the main carousel content
  const renderCarouselContent = () => (
    <div
      className={cn(
        "relative overflow-hidden rounded-lg bg-gray-900",
        isFullscreen
          ? "h-screen w-screen flex items-center justify-center"
          : "h-[350px] sm:h-[400px] md:h-[500px] lg:h-[570px] w-full"
      )}
      {...swipeHandlers}
    >
      {/* Video Player */}
      {videoInfo && isVideoPlaying ? (
        <div
          className={cn(
            "bg-black flex items-center justify-center",
            isFullscreen ? "w-full h-full" : "absolute inset-0 z-10"
          )}
        >
          {!isVideoLoaded && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-900">
              <div className="flex flex-col items-center gap-4">
                <Skeleton className="h-12 w-12 rounded-full" />
                <div className="text-white text-sm">Loading video...</div>
              </div>
            </div>
          )}

          {videoInfo.isYouTube ? (
            <iframe
              ref={iframeRef}
              src={videoInfo.embedUrl}
              className={cn(
                "border-0",
                isFullscreen
                  ? "w-full h-full max-w-7xl max-h-[90vh]"
                  : "w-full h-full"
              )}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              onLoad={handleVideoLoad}
              title="Property Video"
            />
          ) : videoInfo.isDirectVideo ? (
            <video
              ref={videoRef}
              src={videoInfo.embedUrl}
              className={cn(
                "object-contain",
                isFullscreen
                  ? "w-full h-full max-w-7xl max-h-[90vh]"
                  : "w-full h-full"
              )}
              controls={showControls}
              autoPlay
              playsInline
              onEnded={handleVideoEnd}
              onLoadedData={handleVideoLoad}
              onClick={() => setShowControls(!showControls)}
            />
          ) : (
            <div className="flex flex-col items-center gap-4 text-white p-8">
              <Video className="h-16 w-16 opacity-50" />
              <p className="text-lg">Unsupported video format</p>
              <Button
                onClick={openVideoInNewTab}
                variant="outline"
                className="text-white border-white hover:bg-white hover:text-black"
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                Open in New Tab
              </Button>
            </div>
          )}
        </div>
      ) : (
        /* Image Carousel */
        <div
          className={cn(
            "relative",
            isFullscreen
              ? "w-full h-full flex items-center justify-center"
              : "h-full w-full"
          )}
        >
          <AnimatePresence initial={false}>
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className={cn(
                isFullscreen
                  ? "relative max-w-7xl max-h-[90vh] w-full h-full"
                  : "absolute inset-0"
              )}
            >
              {!isImageLoaded[currentIndex] &&
                !imageLoadErrors[currentIndex] &&
                !preloadedImages.has(currentIndex) && (
                  <div className="absolute inset-0 bg-gray-100 animate-pulse flex items-center justify-center">
                    <ImageIcon className="h-12 w-12 text-gray-400" />
                  </div>
                )}

              {imageLoadErrors[currentIndex] ? (
                <div className="absolute inset-0 bg-gray-200 flex items-center justify-center">
                  <div className="text-center text-gray-500">
                    <ImageIcon className="h-12 w-12 mx-auto mb-2" />
                    <p>Failed to load image</p>
                  </div>
                </div>
              ) : (
                <Image
                  src={optimizeImageUrl(
                    allImages[currentIndex] ||
                      "/placeholder.svg?height=600&width=800",
                    isFullscreen ? 1920 : 800,
                    isFullscreen ? 90 : 80
                  )}
                  alt={`${property.title} - Image ${currentIndex + 1}`}
                  fill={!isFullscreen}
                  width={isFullscreen ? 1920 : undefined}
                  height={isFullscreen ? 1080 : undefined}
                  className={cn(
                    "transition-opacity duration-300",
                    isFullscreen
                      ? "object-contain w-full h-full"
                      : "object-cover",
                    isImageLoaded[currentIndex] ||
                      preloadedImages.has(currentIndex)
                      ? "opacity-100"
                      : "opacity-0"
                  )}
                  onLoad={() => handleImageLoaded(currentIndex)}
                  onError={() => handleImageError(currentIndex)}
                  priority={
                    currentIndex === 0 || preloadedImages.has(currentIndex)
                  }
                  sizes={
                    isFullscreen ? "100vw" : "(max-width: 768px) 100vw, 66vw"
                  }
                  quality={isFullscreen ? 90 : 80}
                />
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      )}

      {/* Video Button Overlay */}
      {videoInfo && !isVideoPlaying && currentIndex === 0 && (
        <button
          onClick={toggleVideo}
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-4 z-20 transition-all duration-300 hover:scale-110 group"
          aria-label="Play video"
        >
          <Play className="h-8 w-8 group-hover:scale-110 transition-transform" />
        </button>
      )}

      {/* Controls Overlay - conditionally shown */}
      <div
        className={cn(
          "absolute inset-0 transition-opacity duration-300 flex items-center justify-between px-4 pointer-events-none",
          showControls ? "opacity-100" : "opacity-0"
        )}
      >
        {/* Previous Button */}
        {(currentIndex > 0 || isVideoPlaying) && (
          <button
            onClick={goToPrevious}
            className="bg-white/80 hover:bg-white rounded-full p-2 shadow-lg transition-all duration-200 hover:scale-110 pointer-events-auto"
            aria-label="Previous image"
          >
            <ChevronLeftIcon className="h-6 w-6" />
          </button>
        )}

        <div className="flex-1" />

        {/* Next Button */}
        {(currentIndex < allImages.length - 1 || isVideoPlaying) && (
          <button
            onClick={goToNext}
            className="bg-white/80 hover:bg-white rounded-full p-2 shadow-lg transition-all duration-200 hover:scale-110 pointer-events-auto"
            aria-label="Next image"
          >
            <ChevronRightIcon className="h-6 w-6" />
          </button>
        )}
      </div>

      {/* Top Controls */}
      <div
        className={cn(
          "absolute top-4 right-4 flex items-center gap-2 transition-opacity duration-300 z-20",
          showControls ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
      >
        {/* Counter */}
        <div className="bg-black/50 text-white text-sm px-3 py-1 rounded-full backdrop-blur-sm">
          {isVideoPlaying ? (
            <div className="flex items-center gap-1">
              <Video className="h-3 w-3" />
              <span>Video</span>
            </div>
          ) : (
            `${currentIndex + 1}/${allImages.length}`
          )}
        </div>

        {/* Video Toggle Button (if video exists) */}
        {videoInfo && (
          <button
            onClick={toggleVideo}
            className="bg-black/50 hover:bg-black/70 text-white rounded-full p-2 backdrop-blur-sm transition-colors"
            aria-label={isVideoPlaying ? "Show images" : "Play video"}
          >
            {isVideoPlaying ? (
              <ImageIcon className="h-4 w-4" />
            ) : (
              <Video className="h-4 w-4" />
            )}
          </button>
        )}

        {/* Fullscreen Toggle */}
        <button
          onClick={toggleFullscreen}
          className="bg-black/50 hover:bg-black/70 text-white rounded-full p-2 backdrop-blur-sm transition-colors"
          aria-label={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
        >
          {isFullscreen ? (
            <Minimize className="h-4 w-4" />
          ) : (
            <Maximize className="h-4 w-4" />
          )}
        </button>

        {/* Close Button (only in fullscreen) */}
        {isFullscreen && (
          <button
            onClick={() => {
              setIsFullscreen(false);
              document.body.style.overflow = "unset";
            }}
            className="bg-black/50 hover:bg-black/70 text-white rounded-full p-2 backdrop-blur-sm transition-colors"
            aria-label="Close fullscreen"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Bottom Gradient Overlay (only when not in fullscreen) */}
      {!isFullscreen && (
        <div className="absolute bottom-0 inset-x-0 h-24 bg-gradient-to-t from-black/70 to-transparent pointer-events-none"></div>
      )}
    </div>
  );

  // Render thumbnails
  const renderThumbnails = () => (
    <div
      ref={thumbnailsRef}
      className={cn(
        "flex gap-2 overflow-x-auto scrollbar-hide py-2 px-4 bg-white/80 backdrop-blur-sm rounded-lg",
        isFullscreen
          ? "fixed bottom-4 left-0 right-0 mx-auto z-30 max-w-4xl w-auto justify-center"
          : "mt-4"
      )}
      style={{
        maxWidth: isFullscreen ? "calc(100vw - 32px)" : undefined,
        margin: isFullscreen ? "0 auto" : undefined,
      }}
    >
      {/* Video Thumbnail (if video exists) */}
      {videoInfo && (
        <button
          onClick={toggleVideo}
          className={cn(
            "relative flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all",
            isVideoPlaying
              ? "border-blue-500 ring-2 ring-blue-300"
              : "border-transparent hover:border-gray-300"
          )}
        >
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-10">
            <Play className="h-6 w-6 text-white" />
          </div>
          <Image
            src={optimizeImageUrl(
              allImages[0] || "/placeholder.svg?height=100&width=100",
              100,
              70
            )}
            alt="Video thumbnail"
            width={64}
            height={64}
            className="object-cover w-full h-full"
          />
        </button>
      )}

      {/* Image Thumbnails */}
      {allImages.map((image, index) => (
        <button
          key={index}
          onClick={() => {
            setCurrentIndex(index);
            setIsVideoPlaying(false);
          }}
          className={cn(
            "relative flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all",
            currentIndex === index && !isVideoPlaying
              ? "border-blue-500 ring-2 ring-blue-300"
              : "border-transparent hover:border-gray-300"
          )}
        >
          <Image
            src={optimizeImageUrl(
              image || "/placeholder.svg?height=100&width=100",
              100,
              70
            )}
            alt={`Thumbnail ${index + 1}`}
            width={64}
            height={64}
            className="object-cover w-full h-full"
            priority={
              index === currentIndex ||
              index === currentIndex + 1 ||
              index === currentIndex - 1
            }
          />
        </button>
      ))}

      {/* Call to Action Thumbnail */}
      {whatsappNumber && (
        <button
          onClick={handleCallToAction}
          className="flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center text-white text-xs font-bold hover:from-blue-600 hover:to-indigo-700 transition-all"
        >
          <Phone className="h-6 w-6" />
        </button>
      )}
    </div>
  );

  return (
    <>
      {/* Regular view */}
      <section className="w-full lg:w-3/5 xl:w-2/3 space-y-4 lg:space-y-6 lg:pr-10">
        <div ref={carouselRef} className="relative">
          {renderCarouselContent()}
          {!isFullscreen && !isVideoPlaying && renderThumbnails()}
        </div>
      </section>

      {/* Fullscreen view */}
      {isFullscreen && (
        <div
          ref={fullscreenContainerRef}
          className="fixed inset-0 z-50 bg-black flex items-center justify-center overflow-hidden"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          onClick={(e) => {
            if (e.target === fullscreenContainerRef.current) {
              setIsFullscreen(false);
              document.body.style.overflow = "unset";
            }
          }}
        >
          <div className="w-full h-full flex items-center justify-center">
            {renderCarouselContent()}
          </div>
          {!isVideoPlaying && renderThumbnails()}
        </div>
      )}
    </>
  );
}
