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
