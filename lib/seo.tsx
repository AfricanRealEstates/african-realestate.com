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
  const defaultTitle = "Home - African Real Estate";
  const defaultDescription =
    "Discover luxurious and affordable properties across Kenya and Africa. Your trusted partner in African real estate investments, offering expert guidance and unparalleled market insights.";
  const defaultKeywords = [
    "African real estate",
    "Kenya property",
    "Nairobi homes",
    "luxury apartments Kenya",
    "real estate investment Africa",
    "African property portal",
    "buy property in Kenya",
    "rent apartments in Nairobi",
    "commercial real estate Africa",
    "residential properties Kenya",
    "African real estate market",
    "property listings Kenya",
    "real estate agents Nairobi",
    "African property investment",
    "affordable housing Kenya",
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
      locale: "en_KE",
      type: "website",
      images: [
        {
          url: `https://${config.domainName}/og-image.jpg`,
          width: 1200,
          height: 630,
          alt: "African Real Estate: Your Gateway to Premium Properties in Kenya and Africa",
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
        ? `https://${config.domainName}/${canonicalUrlRelative}`
        : `https://${config.domainName}`,
      languages: {
        'en-KE': `https://${config.domainName}/en`,
        'sw-KE': `https://${config.domainName}/sw`,
      },
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
            "Premier African real estate agency specializing in luxury and affordable properties across Kenya and Africa. Offering comprehensive property services including sales, rentals, and management.",
          image: `https://${config.domainName}/logo.png`,
          url: `https://${config.domainName}/`,
          telephone: "+254732945534",
          email: "info@african-realestate.com",
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
            "https://twitter.com/AfricanRealEsta",
            "https://www.linkedin.com/company/african-real-estate",
          ],
          openingHoursSpecification: {
            "@type": "OpeningHoursSpecification",
            dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
            opens: "07:00",
            closes: "20:00",
          },
          priceRange: "$$",
          areaServed: [
            {
              "@type": "Country",
              name: "Kenya",
            },
            {
              "@type": "Country",
              name: "Tanzania",
            },
            {
              "@type": "Country",
              name: "Uganda",
            },
          ],
          makesOffer: [
            {
              "@type": "Offer",
              itemOffered: {
                "@type": "Service",
                name: "Property Sales",
                description: "Buy luxurious and affordable properties across Kenya and Africa",
              },
            },
            {
              "@type": "Offer",
              itemOffered: {
                "@type": "Service",
                name: "Property Rentals",
                description: "Rent high-quality apartments and homes in prime African locations",
              },
            },
            {
              "@type": "Offer",
              itemOffered: {
                "@type": "Service",
                name: "Property Management",
                description: "Professional management services for property owners and investors",
              },
            },
            {
              "@type": "Offer",
              itemOffered: {
                "@type": "Service",
                name: "Real Estate Investment Advisory",
                description: "Expert guidance on real estate investments in the African market",
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

