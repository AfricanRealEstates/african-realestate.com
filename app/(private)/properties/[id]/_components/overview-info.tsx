"use client";
import { ButtonSecondary } from "@/components/globals/button-secondary";
import { Raleway } from "next/font/google";
import React, { useState } from "react";
const raleway = Raleway({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-nunitosans",
});

export default function OverviewInfo({ description }: { description: string }) {
  const [showFullDescription, setShowFullDescription] = useState(false);

  // Toggle the state to show or hide the full description
  const toggleDescription = () => {
    setShowFullDescription(!showFullDescription);
  };

  // Extract property description
  const propertyDescription = description;

  // Determine whether to show the full description or truncate it
  const displayedDescription = showFullDescription
    ? propertyDescription
    : propertyDescription.length > 300
    ? `${propertyDescription.slice(0, 300)}...`
    : propertyDescription;

  // Determine the text for the "Read More" or "Read Less" button
  const buttonText = showFullDescription ? "Read Less" : "Read More";
  return (
    <div className="w-full flex flex-col sm:rounded-2xl border-b sm:border-t sm:border-l sm:border-r border-neutral-200 dark:border-neutral-700 space-y-6 sm:space-y-8 pb-10 px-0 sm:p-4 xl:p-8">
      <h2 className="text-2xl font-semibold">Overview</h2>
      <div className="w-14 border-b border-neutral-200"></div>

      <pre
        className={`${raleway.className} max-w-4xl text-sm whitespace-pre-wrap leading-9 text-neutral-600`}
      >
        {displayedDescription}
      </pre>
      {displayedDescription.length > 300 && (
        <ButtonSecondary
          onClick={toggleDescription}
          className="text-primary-500 w-1/2"
        >
          {buttonText}
        </ButtonSecondary>
      )}
    </div>
  );
}
