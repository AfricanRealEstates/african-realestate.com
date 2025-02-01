import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blog | African Real Estate",
  description:
    "Discover the latest real estate news, tips, and insights on our blog. Topics include housing, finance, investing, and home decor.",
  openGraph: {
    title: "Blog | African Real Estate",
    description:
      "Discover the latest real estate news, tips, and insights on our blog. Topics include housing, finance, investing, and home decor.",
    images: [
      {
        url: "/assets/blog.svg", // Make sure this image exists in your public folder
        width: 1200,
        height: 630,
        alt: "African Real Estate Blog",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Blog | African Real Estate",
    description:
      "Discover the latest real estate news, tips, and insights on our blog. Topics include housing, finance, investing, and home decor.",
    images: ["/assets/blog.svg"], // Make sure this image exists in your public folder
  },
};
