"use client";

import { useState, useEffect } from "react";
import PaymentPricingPlans, { PropertyCountRange } from "./PaymentPricingPlans";
import PaystackButton from "./PaystackButton";

interface PaymentSectionProps {
  user: {
    email: string;
    name: string;
    phone: string;
  };
  selectedProperties: string[];
}

export default function PaymentSection({
  user,
  selectedProperties,
}: PaymentSectionProps) {
  const [selectedTier, setSelectedTier] = useState<string | null>(null);
  const [amount, setAmount] = useState<number>(0);

  const propertyCount: PropertyCountRange =
    selectedProperties.length <= 3
      ? "1-3"
      : selectedProperties.length <= 5
      ? "4-5"
      : selectedProperties.length <= 10
      ? "6-10"
      : selectedProperties.length <= 20
      ? "11-20"
      : selectedProperties.length <= 40
      ? "21-40"
      : ">40";

  const handleTierSelect = (tierName: string) => {
    setSelectedTier(tierName);
    // Find the selected tier and set the amount
    const selectedTierData = tiers.find((tier) => tier.name === tierName);
    if (selectedTierData) {
      const pricePerListing = parseInt(selectedTierData.pricing[propertyCount]);
      setAmount(pricePerListing * selectedProperties.length);
    }
  };

  useEffect(() => {
    if (selectedTier) {
      handleTierSelect(selectedTier);
    }
  }, [selectedProperties]);

  if (selectedProperties.length === 0) {
    return null;
  }

  return (
    <div className="mt-8">
      <PaymentPricingPlans
        propertyCount={propertyCount}
        selectedProperties={selectedProperties}
        onTierSelect={handleTierSelect}
      />
      {selectedTier && (
        <div className="mt-8 text-center">
          <h2 className="text-2xl font-bold mb-4">Complete Your Payment</h2>
          <p className="mb-4">Total Amount: KES {amount.toLocaleString()}</p>
          <PaystackButton
            amount={amount}
            email={user.email}
            name={user.name}
            phone={user.phone}
            currency="KES"
          />
        </div>
      )}
    </div>
  );
}

const tiers = [
  {
    name: "Bronze",
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
