import config from "@/services/config";
import type { Metadata } from "next";

export const getSEOTags = ({
  title,
  description,
  keywords,
  openGraph,
  canonicalUrlRelative,
  extraTags,
}: Metadata & {
  canonicalUrlRelative?: string;
  extraTags?: Record<string, any>;
} = {}) => {
  const defaultTitle = "Home | African Real Estate";
  const defaultDescription =
    "Discover luxurious and affordable properties across Kenya. Your trusted partner in African real estate investments.";
  const defaultKeywords = [
    "African real estate",
    "Kenya property",
    "Nairobi homes",
    "luxury apartments Kenya",
    "real estate investment Africa",
  ];

  return {
    title: title || defaultTitle,
    description: description || defaultDescription,
    keywords: keywords || defaultKeywords,
    authors: [{ name: "African Real Estate" }],
    creator: "African Real Estate",
    formatDetection: {
      email: false,
      address: false,
      telephone: false,
    },
    applicationName: config.appName,
    metadataBase: new URL(
      process.env.NODE_ENV === "development"
        ? "http://localhost:3000"
        : `https://${config.domainName}`
    ),
    openGraph: {
      title: openGraph?.title || defaultTitle,
      description: openGraph?.description || defaultDescription,
      url: openGraph?.url || `https://${config.domainName}`,
      siteName: openGraph?.title || config.appName,
      locale: "en_KE", // Changed to Kenyan English
      type: "website",
      images: [
        {
          url: `https://${config.domainName}/og-image.jpg`,
          width: 1200,
          height: 630,
          alt: "African Real Estate in Kenya",
        },
      ],
    },
    twitter: {
      title: openGraph?.title || defaultTitle,
      description: openGraph?.description || defaultDescription,
      card: "summary_large_image",
      creator: "@AfricanRealEsta",
      images: [`https://${config.domainName}/twitter-image.jpg`],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    icons: {
      icon: "/favicon.ico",
      shortcut: "/favicon-16x16.png",
      apple: "/apple-touch-icon.png",
    },
    manifest: "/site.webmanifest",
    verification: {
      google: "Ip7b3Hpc1VU0LkPSh0lgqyz3ImGRpGjc2BLLCvz3Xzo",
    },
    alternates: {
      canonical: canonicalUrlRelative
        ? `https://${config.domainName}${canonicalUrlRelative}`
        : `https://${config.domainName}`,
    },
    ...extraTags,
  };
};

export const renderSchemaTags = () => {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify({
          "@context": "http://schema.org",
          "@type": "RealEstateAgent",
          name: config.appName,
          description:
            "Premier African real estate agency specializing in luxury and affordable properties across Kenya and Africa.",
          image: `https://${config.domainName}/logo.png`,
          url: `https://${config.domainName}/`,
          telephone: "+254732945534",
          address: {
            "@type": "PostalAddress",
            streetAddress: "123 Kenyatta Avenue",
            addressLocality: "Nairobi",
            addressRegion: "Nairobi",
            postalCode: "00100",
            addressCountry: "KE",
          },
          geo: {
            "@type": "GeoCoordinates",
            latitude: "-1.2921",
            longitude: "36.8219",
          },
          sameAs: [
            "https://web.facebook.com/AfricanRealEstateMungaiKihara",
            "https://www.youtube.com/c/AfricanRealEstate",
            "https://www.tiktok.com/@africanrealestate",
            "https://www.instagram.com/africanrealestate_/",
          ],
          openingHoursSpecification: {
            "@type": "OpeningHoursSpecification",
            dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
            opens: "07:00",
            closes: "20:00",
          },
          priceRange: "$$",
          areaServed: {
            "@type": "Country",
            name: "Kenya",
          },
          makesOffer: [
            {
              "@type": "Offer",
              itemOffered: {
                "@type": "Service",
                name: "Property Sales",
              },
            },
            {
              "@type": "Offer",
              itemOffered: {
                "@type": "Service",
                name: "Property Rentals",
              },
            },
            {
              "@type": "Offer",
              itemOffered: {
                "@type": "Service",
                name: "Property Management",
              },
            },
          ],
          aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: "4.9",
            ratingCount: "13",
            bestRating: "5",
            worstRating: "1",
          },
        }),
      }}
    ></script>
  );
};
