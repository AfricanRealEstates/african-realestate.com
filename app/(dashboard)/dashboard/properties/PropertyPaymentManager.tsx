"use client";

import { useState, useMemo } from "react";
import { Property } from "@prisma/client";
import PropertiesTable from "./PropertiesTable";
import PricingPlanModal from "./PricingPlanModal";
import { Button } from "@/components/ui/button";
import { PropertyPaymentCTA } from "./PropertyPaymentCTA";

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
  const [showUnpaidProperties, setShowUnpaidProperties] = useState(false);

  const { unpaidPropertiesCount, totalPropertiesCount } = useMemo(() => {
    const unpaidCount = properties.filter(
      (property) => !property.isActive
    ).length;
    return {
      unpaidPropertiesCount: unpaidCount,
      totalPropertiesCount: properties.length,
    };
  }, [properties]);

  const handlePropertySelect = (propertyId: string, isSelected: boolean) => {
    setSelectedProperties((prev) =>
      isSelected
        ? [...prev, propertyId]
        : prev.filter((id) => id !== propertyId)
    );
  };

  const togglePropertyView = () => {
    setShowUnpaidProperties((prev) => !prev);
  };

  const filteredProperties = properties.filter((property) =>
    showUnpaidProperties ? !property.isActive : property.isActive
  );

  return (
    <div>
      <PropertyPaymentCTA
        unpaidPropertiesCount={unpaidPropertiesCount}
        totalPropertiesCount={totalPropertiesCount}
        showUnpaidProperties={showUnpaidProperties}
        onTogglePropertyView={togglePropertyView}
      />
      {filteredProperties.length > 0 ? (
        <>
          <PropertiesTable
            properties={filteredProperties}
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
        </>
      ) : (
        <div className="text-center py-8">
          <p className="text-gray-500">
            {showUnpaidProperties
              ? "Great job! All your properties are paid and published."
              : "You don't have any paid properties yet. Pay for your properties to publish them."}
          </p>
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
