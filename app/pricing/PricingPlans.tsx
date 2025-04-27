"use client";

import { Check, HelpCircle } from "lucide-react"; // HelpCircle = nice question mark icon
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"; // import Tooltip
import Link from "next/link";
import { useState } from "react";

const tiers = [
  {
    name: "Bronze",
    title: "Intermediate Agent",
    duration: "30 DAYS",
    durationInDays: 30,
    description: "Perfect for getting started with property listings",
    features: [
      "Basic Listing",
      "Special landing page",
      "Local & Display visibility",
      "Feature for 6hrs",
    ],
    pricing: {
      "1-3": "400",
      "4-5": "350",
      "6-10": "320",
      "11-20": "300",
      "21-40": "275",
      ">40": "250",
    },
  },
  {
    name: "Diamond",
    title: "Advanced Agent",
    duration: "30 DAYS",
    durationInDays: 30,
    description: "Everything in Bronze, plus enhanced visibility",
    recommended: true,
    features: [
      "Everything in Bronze, Plus",
      "Special marketing campaign",
      "Recommended Leads",
      "Feature for 24hrs",
      "Diamond crest on Listings",
    ],
    pricing: {
      "1-3": "1200",
      "4-5": "1100",
      "6-10": "1000",
      "11-20": "900",
      "21-40": "800",
      ">40": "700",
    },
  },
  {
    name: "Platinum",
    title: "Super Agent",
    duration: "60 DAYS",
    durationInDays: 60,
    description: "Everything in Diamond, plus premium features",
    features: [
      "Everything in Diamond, Plus",
      "Feature for 14 days",
      "Platinum Crest on Listings",
      "Top placement on search results",
      "Extra 30 days for free Marketing",
      "5-10 Qualified leads",
      "Pre-qualification for a free video shoot",
      "Special feature in our social media",
      "24/7 Customer Support",
    ],
    pricing: {
      "1-3": "4000",
      "4-5": "3500",
      "6-10": "3000",
      "11-20": "2500",
      "21-40": "2000",
      ">40": "1500",
    },
  },
];

export default function PricingPlans() {
  const [selectedRange, setSelectedRange] = useState<string>("1-3"); // default "1-3"

  return (
    <div className="px-4">
      <TooltipProvider>
        {/* Select + Icon aligned */}
        <div className="mx-auto my-12 flex max-w-sm items-center space-x-2">
          <Select
            onValueChange={(value) => setSelectedRange(value)}
            value={selectedRange}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select number of listings">
                {selectedRange
                  ? `${selectedRange} Listings`
                  : "Select number of listings"}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              {Object.keys(tiers[0].pricing).map((range) => (
                <SelectItem key={range} value={range}>
                  {range} Listings
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Tooltip with Question mark */}
          <Tooltip>
            <TooltipTrigger asChild>
              <HelpCircle className="h-5 w-5 text-gray-500 hover:text-gray-700 cursor-pointer" />
            </TooltipTrigger>
            <TooltipContent side="right" className="text-sm">
              Select how many properties you want to list
            </TooltipContent>
          </Tooltip>

          {/* Reset button */}
          {/* <Button
            variant="outline"
            size="icon"
            onClick={() => setSelectedRange("1-3")}
            className="h-9 w-9 ml-2"
          >
            reset
          </Button> */}
        </div>
      </TooltipProvider>

      {/* Pricing Cards */}
      <div className="isolate mx-auto grid max-w-md grid-cols-1 gap-8 lg:mx-0 lg:max-w-none lg:grid-cols-3 mt-8">
        {tiers.map((plan) => {
          const price = selectedRange
            ? plan.pricing[selectedRange as keyof typeof plan.pricing]
            : "";

          return (
            <div
              key={plan.name}
              className={`rounded-3xl p-8 ring-1 ring-gray-200 ${
                plan.recommended
                  ? "bg-white shadow-xl ring-2 ring-blue-600 relative"
                  : "bg-white/5 hover:shadow-md transition-shadow duration-300"
              }`}
            >
              {plan.recommended && (
                <div className="absolute -top-5 left-0 right-0 mx-auto w-32 rounded-full bg-blue-600 px-3 py-1 text-center text-sm font-semibold text-white">
                  Recommended
                </div>
              )}
              <div className="flex items-center justify-between gap-x-4">
                <h2 className="text-lg font-semibold leading-8 text-gray-900">
                  {plan.title}
                </h2>
                <span className="rounded-full bg-gray-100 px-2.5 py-1 text-xs font-semibold text-gray-900">
                  {plan.name}
                </span>
              </div>
              <p className="mt-4 text-sm leading-6 text-gray-600">
                {plan.description}
              </p>

              {/* Price display */}
              {price && (
                <div className="mt-6 flex items-center gap-2">
                  <p className="text-4xl font-bold tracking-tight text-blue-500">
                    KES {price}
                  </p>
                  <span className="text-sm font-semibold leading-6 text-gray-600">
                    / Per listing
                  </span>
                </div>
              )}

              <p className="mt-2 text-sm text-gray-500 text-center">
                {plan.duration}
              </p>

              {/* Features list */}
              <ul
                role="list"
                className="mt-8 space-y-3 text-sm leading-6 text-gray-600"
              >
                {plan.features.map((feature) => (
                  <li key={feature} className="flex gap-x-3">
                    <Check
                      className="h-6 w-5 flex-none text-blue-600"
                      aria-hidden="true"
                    />
                    {feature}
                  </li>
                ))}
              </ul>

              <Button
                asChild
                className="mt-8 w-full"
                variant={plan.recommended ? "default" : "outline"}
              >
                <Link href="/pay">Select Plan</Link>
              </Button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
