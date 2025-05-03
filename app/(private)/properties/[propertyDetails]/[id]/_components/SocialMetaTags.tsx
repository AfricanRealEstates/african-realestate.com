"use client";

import { useEffect } from "react";
import type { PropertyWithExtras } from "@/lib/types";

interface SocialMetaTagsProps {
  property: PropertyWithExtras;
  propertyUrl: string;
}

export default function SocialMetaTags({
  property,
  propertyUrl,
}: SocialMetaTagsProps) {
  // Ensure we always have a cover photo
  const shareImage =
    property.coverPhotos && property.coverPhotos.length > 0
      ? property.coverPhotos[0]
      : "/assets/default-property-image.jpg";

  // Make sure the image URL is absolute
  const absoluteShareImage = shareImage.startsWith("http")
    ? shareImage
    : `https://www.african-realestate.com${shareImage}`;

  const formattedPrice = `${property.currency} ${property.price.toLocaleString()}`;
  const location = `${property.locality}, ${property.county}`;
  const title = `${property.title} | African Real Estate`;
  const description = `${property.description.substring(0, 150)}... - ${formattedPrice} - ${location}`;

  // Dynamically update meta tags
  useEffect(() => {
    // Update Open Graph meta tags
    updateMetaTag("og:title", title);
    updateMetaTag("og:description", description);
    updateMetaTag("og:image", absoluteShareImage);
    updateMetaTag("og:url", propertyUrl);

    // Update Twitter Card meta tags
    updateMetaTag("twitter:title", title);
    updateMetaTag("twitter:description", description);
    updateMetaTag("twitter:image", absoluteShareImage);
    updateMetaTag("twitter:url", propertyUrl);
  }, [property.id, absoluteShareImage, title, description, propertyUrl]);

  // Helper function to update meta tags
  const updateMetaTag = (property: string, content: string) => {
    let element = document.querySelector(`meta[property="${property}"]`);

    // For Twitter, we need to check for name attribute as well
    if (!element && property.startsWith("twitter:")) {
      element = document.querySelector(`meta[name="${property}"]`);
    }

    if (element) {
      element.setAttribute("content", content);
    } else {
      const meta = document.createElement("meta");
      if (property.startsWith("twitter:")) {
        meta.setAttribute("name", property);
      } else {
        meta.setAttribute("property", property);
      }
      meta.setAttribute("content", content);
      document.head.appendChild(meta);
    }
  };

  return null; // This component doesn't render anything visible
}
