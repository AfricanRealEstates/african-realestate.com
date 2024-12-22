"use client";

import { useState } from "react";
import { Property } from "@prisma/client";
import PropertiesTable from "./PropertiesTable";
import PricingPlanModal from "./PricingPlanModal";
import { Button } from "@/components/ui/button";

interface PropertyPaymentManagerProps {
  properties: Property[];
  user: {
    email: string;
    name: string;
    phone: string;
  };
}

export default function PropertyPaymentManager({
  properties,
  user,
}: PropertyPaymentManagerProps) {
  const [selectedProperties, setSelectedProperties] = useState<string[]>([]);
  const [isPricingModalOpen, setIsPricingModalOpen] = useState(false);

  const handlePropertySelect = (propertyId: string, isSelected: boolean) => {
    setSelectedProperties((prev) =>
      isSelected
        ? [...prev, propertyId]
        : prev.filter((id) => id !== propertyId)
    );
  };

  return (
    <div>
      <PropertiesTable
        properties={properties}
        selectedProperties={selectedProperties}
        onPropertySelect={handlePropertySelect}
      />
      {selectedProperties.length > 0 && (
        <div className="mt-4 text-center">
          <Button onClick={() => setIsPricingModalOpen(true)}>
            Pay for Selected Properties ({selectedProperties.length})
          </Button>
        </div>
      )}
      <PricingPlanModal
        isOpen={isPricingModalOpen}
        onClose={() => setIsPricingModalOpen(false)}
        selectedProperties={selectedProperties}
        user={user}
      />
    </div>
  );
}
