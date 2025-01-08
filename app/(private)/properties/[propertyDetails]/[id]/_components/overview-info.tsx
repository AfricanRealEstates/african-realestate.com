"use client";

import { ButtonSecondary } from "@/components/globals/button-secondary";
import { Raleway } from "next/font/google";
import React, { useState, useEffect } from "react";

const raleway = Raleway({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-nunitosans",
});

export default function OverviewInfo({
  description,
  serviceCharge,
  currency,
}: {
  description: string;
  serviceCharge?: number | null;
  currency?: string;
}) {
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [displayedDescription, setDisplayedDescription] = useState("");

  // Function to hide phone numbers
  const hidePhoneNumbers = (text: string) => {
    const phoneRegex = /\b(07\d{8})\b/g;
    return text.replace(phoneRegex, (match) => {
      const lastFourDigits = match.slice(-4);
      return `07XXXX${lastFourDigits}`;
    });
  };

  // Toggle the state to show or hide the full description
  const toggleDescription = () => {
    setShowFullDescription(!showFullDescription);
  };

  useEffect(() => {
    let processedDescription = hidePhoneNumbers(description);

    if (!showFullDescription && processedDescription.length > 300) {
      setDisplayedDescription(`${processedDescription.slice(0, 300)}...`);
    } else {
      setDisplayedDescription(processedDescription);
    }
  }, [description, showFullDescription]);

  const readButtonText = showFullDescription ? "Read Less" : "Read More";

  return (
    <div className="mt-4 lg:mt-0 w-full flex flex-col sm:rounded-2xl border-b sm:border-t sm:border-l sm:border-r border-neutral-200  space-y-4 sm:space-y-4 pb-10 px-0 sm:p-4 xl:p-5">
      <h2 className="text-2xl font-semibold">Overview</h2>
      <div className="w-14 border-b border-neutral-200"></div>

      <div
        className={`${raleway.className} max-w-4xl text-sm whitespace-pre-wrap leading-9 text-neutral-600`}
      >
        {serviceCharge && (
          <p className="">
            - The service charge of this property is:{" "}
            <span className="font-bold text-indigo-500 ">
              {currency === "USD" ? "$" : "Ksh."}{" "}
              {serviceCharge?.toLocaleString()}
            </span>
          </p>
        )}
        {displayedDescription}
      </div>
      <div className="flex space-x-4">
        {description.length > 300 && (
          <ButtonSecondary
            onClick={toggleDescription}
            className="text-primary-500"
          >
            {readButtonText}
          </ButtonSecondary>
        )}
      </div>
    </div>
  );
}
