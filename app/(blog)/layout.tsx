import { Metadata } from "next";
import React from "react";
import { Raleway } from "next/font/google";
import BlogHeader from "./BlogHeader";
import BlogFooter from "./BlogFooter";

const raleway = Raleway({
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Blog",
    template: "%s | African Real Estate",
  },
  description:
    "Explore insights, trends, and opportunities in African real estate. Expert advice on property investment, market analysis, and development across the continent.",
  keywords:
    "African real estate, property investment, real estate market, African property trends, real estate development, African cities, property advice",
  authors: [{ name: "African Real Estate Team" }],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://www.african-realestate.com/blog",
    siteName: "African Real Estate",
    title: "African Real Estate Blog - Insights and Opportunities",
    description:
      "Discover the latest in African real estate. Expert analysis, investment tips, and market trends across the continent's diverse property landscape.",
    images: [
      {
        url: "https://www.african-realestate.com/blog-og-image.jpg",
        width: 1200,
        height: 630,
        alt: "African Real Estate Blog",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@AfricanRealEstate",
    title: "Blog | African Real Estate",
    description:
      "Stay informed about African real estate markets. Expert analysis, investment strategies, and property trends across the continent.",
    images: ["https://www.african-realestate.com/blog-twitter-image.jpg"],
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
  alternates: {
    canonical: "https://www.african-realestate.com/blog",
  },
};

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={raleway.className}>
      <main className="flex flex-col min-h-screen">
        <BlogHeader />
        <section className="grow">{children}</section>
        <BlogFooter />
      </main>
    </div>
  );
}
