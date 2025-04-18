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
  useEffect(() => {
    // This component dynamically updates meta tags for better social sharing
    // especially useful for WhatsApp and other platforms that might not read
    // server-rendered meta tags correctly

    const imageUrl = property.coverPhotos[0] || "/assets/Kilimani.webp";
    const absoluteImageUrl = imageUrl.startsWith("http")
      ? imageUrl
      : `${window.location.origin}${imageUrl}`;

    const formattedPrice = `${property.currency} ${property.price.toLocaleString()}`;
    const location = `${property.locality}, ${property.county}`;
    const title = `${property.title} | African Real Estate`;
    const description = `${property.description.substring(0, 150)}... - ${formattedPrice} - ${location}`;

    // Helper function to create or update meta tags
    const updateMetaTag = (
      name: string,
      content: string,
      isProperty = false
    ) => {
      const selector = isProperty
        ? `meta[property="${name}"]`
        : `meta[name="${name}"]`;
      let tag = document.querySelector(selector);

      if (!tag) {
        tag = document.createElement("meta");
        if (isProperty) {
          tag.setAttribute("property", name);
        } else {
          tag.setAttribute("name", name);
        }
        document.head.appendChild(tag);
      }

      tag.setAttribute("content", content);
    };

    // Update OpenGraph tags
    updateMetaTag("og:title", title, true);
    updateMetaTag("og:description", description, true);
    updateMetaTag("og:image", absoluteImageUrl, true);
    updateMetaTag("og:url", propertyUrl, true);
    updateMetaTag("og:type", "website", true);
    updateMetaTag("og:site_name", "African Real Estate", true);

    // WhatsApp specific tags
    updateMetaTag("og:whatsapp:title", title, true);
    updateMetaTag("og:whatsapp:description", description, true);
    updateMetaTag("og:whatsapp:image", absoluteImageUrl, true);

    // Twitter tags
    updateMetaTag("twitter:card", "summary_large_image");
    updateMetaTag("twitter:title", title);
    updateMetaTag("twitter:description", description);
    updateMetaTag("twitter:image", absoluteImageUrl);
    updateMetaTag("twitter:site", "@AfricanRealEsta");

    // Property specific tags
    updateMetaTag("og:price:amount", property.price.toString(), true);
    updateMetaTag("og:price:currency", property.currency, true);
    updateMetaTag(
      "og:availability",
      property.status === "sale" ? "for sale" : "to let",
      true
    );
  }, [property, propertyUrl]);

  // This component doesn't render anything visible
  return null;
}
