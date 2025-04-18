"use client";

import type { PropertyWithExtras } from "@/lib/types";
import { useEffect, useState } from "react";
import Image from "next/image";

interface PropertySharePreviewProps {
  property: PropertyWithExtras;
  isOpen: boolean;
  onClose: () => void;
}

export default function PropertySharePreview({
  property,
  isOpen,
  onClose,
}: PropertySharePreviewProps) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;
  if (!isOpen) return null;

  const imageUrl = property.coverPhotos[0] || "/assets/Kilimani.webp";
  const formattedPrice = `${property.currency} ${property.price.toLocaleString()}`;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-md w-full overflow-hidden">
        <div className="p-4 border-b">
          <h3 className="text-lg font-semibold">Share Preview</h3>
          <p className="text-sm text-gray-500">
            This is how your property will appear when shared
          </p>
        </div>

        <div className="p-4">
          <div className="border rounded-lg overflow-hidden">
            {/* WhatsApp preview */}
            <div className="bg-[#DCF8C6] p-3 rounded-t-lg">
              <p className="text-sm font-medium">WhatsApp Preview</p>
            </div>

            <div className="p-3 space-y-2">
              <div className="aspect-video relative rounded-lg overflow-hidden">
                <Image
                  src={imageUrl || "/placeholder.svg"}
                  alt={property.title}
                  fill
                  className="object-cover"
                />
              </div>

              <h4 className="font-bold text-sm">{property.title}</h4>
              <p className="text-xs text-gray-600 line-clamp-2">
                {property.description.substring(0, 120)}...
              </p>

              <div className="flex items-center text-xs text-gray-500">
                <span>african-realestate.com</span>
              </div>
            </div>
          </div>

          <div className="mt-4 space-y-2">
            <h4 className="font-medium">Property Details</h4>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>
                <span className="text-gray-500">Price:</span> {formattedPrice}
              </div>
              <div>
                <span className="text-gray-500">Location:</span>{" "}
                {property.locality}
              </div>
              <div>
                <span className="text-gray-500">Bedrooms:</span>{" "}
                {property.bedrooms}
              </div>
              <div>
                <span className="text-gray-500">Bathrooms:</span>{" "}
                {property.bathrooms}
              </div>
            </div>
          </div>
        </div>

        <div className="p-4 bg-gray-50 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 rounded-md text-sm font-medium hover:bg-gray-300"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
