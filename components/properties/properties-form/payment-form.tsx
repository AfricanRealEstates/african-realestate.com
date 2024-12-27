"use client";

import { useState } from "react";
import { Check } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FeatureList } from "@/app/(dashboard)/dashboard/properties/FeatureList";

export type PropertyCountRange =
  | "1-3"
  | "4-5"
  | "6-10"
  | "11-20"
  | "21-40"
  | ">40";

interface PaymentPricingPlansProps {
  propertyCount: PropertyCountRange;
  selectedProperties: string[];
}

export default function PaymentPricingPlans({
  propertyCount,
  selectedProperties,
}: PaymentPricingPlansProps) {
  const [selectedTier, setSelectedTier] = useState<string | null>(null);

  const handleTierSelection = (tierName: string) => {
    setSelectedTier(tierName);
  };

  const tiers = [
    {
      name: "Bronze",
      title: "Intermediate Agent",
      duration: "30 DAYS",
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
      description: "Everything in Bronze, plus enhanced visibility",
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

  return (
    <div className="container px-4 py-16 mx-auto">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold tracking-tight text-blue-900">
          Our Pricing Plans
        </h1>
        <p className="mt-4 text-lg text-muted-foreground">
          Choose the perfect plan for your real estate business
        </p>
      </div>

      <div className="mb-8 flex justify-center">
        <div className="inline-flex items-center rounded-lg border p-2 bg-muted">
          <Label className="mr-3 text-sm font-medium">
            Selected Properties:
          </Label>
          <Select value={propertyCount} disabled>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1-3">1-3 properties</SelectItem>
              <SelectItem value="4-5">4-5 properties</SelectItem>
              <SelectItem value="6-10">6-10 properties</SelectItem>
              <SelectItem value="11-20">11-20 properties</SelectItem>
              <SelectItem value="21-40">21-40 properties</SelectItem>
              <SelectItem value=">40">More than 40</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {tiers.map((tier, index) => (
          <Card
            key={tier.name}
            className={`flex flex-col ${
              selectedTier === tier.name ? "ring-2 ring-blue-500" : ""
            }`}
          >
            <CardHeader>
              <CardTitle className="text-xl text-blue-800">
                {tier.title}
                <span
                  className={`ml-2 inline-block px-2 py-1 text-xs font-semibold rounded-full ${
                    index === 0
                      ? "bg-yellow-100 text-yellow-800"
                      : index === 1
                      ? "bg-blue-100 text-blue-800"
                      : "bg-purple-100 text-purple-800"
                  }`}
                >
                  {tier.name}
                </span>
              </CardTitle>
              <CardDescription>{tier.description}</CardDescription>
            </CardHeader>
            <CardContent className="flex-grow">
              <div className="mb-6">
                <span className="text-3xl font-bold">
                  KES {parseInt(tier.pricing[propertyCount]).toLocaleString()}
                </span>
                <span className="text-muted-foreground ml-1">per listing</span>
                <p className="text-sm text-muted-foreground mt-1">
                  {tier.duration}
                </p>
              </div>
              <FeatureList
                features={tier.features}
                initialVisibleCount={tier.name === "Platinum" ? 5 : 4}
              />
            </CardContent>
            <CardFooter>
              <Button
                className="w-full"
                variant={selectedTier === tier.name ? "default" : "outline"}
                style={{
                  backgroundColor:
                    selectedTier === tier.name ? "#3b82f6" : "transparent",
                  color: selectedTier === tier.name ? "white" : "#3b82f6",
                  borderColor: "#3b82f6",
                }}
                onClick={() => handleTierSelection(tier.name)}
                disabled={selectedProperties.length === 0}
              >
                {selectedTier === tier.name ? "Selected" : "Select Plan"}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
