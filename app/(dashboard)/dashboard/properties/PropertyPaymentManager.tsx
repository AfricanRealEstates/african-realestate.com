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
    id: string;
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
  const [viewMode, setViewMode] = useState<"unpaid" | "paid" | "all">("unpaid");

  const { unpaidPropertiesCount, paidPropertiesCount, totalPropertiesCount } =
    useMemo(() => {
      const unpaidCount = properties.filter(
        (property) => !property.isActive // Inactive = Unpaid
      ).length;
      return {
        unpaidPropertiesCount: unpaidCount,
        paidPropertiesCount: properties.length - unpaidCount,
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

  const filteredProperties = useMemo(() => {
    switch (viewMode) {
      case "unpaid":
        return properties.filter((property) => !property.isActive); // Unpaid = Inactive
      case "paid":
        return properties.filter((property) => property.isActive); // Paid = Active
      case "all":
      default:
        return properties;
    }
  }, [properties, viewMode]);

  return (
    <div>
      <PropertyPaymentCTA
        unpaidPropertiesCount={unpaidPropertiesCount}
        paidPropertiesCount={paidPropertiesCount}
        totalPropertiesCount={totalPropertiesCount}
        viewMode={viewMode}
        onChangeViewMode={setViewMode}
      />
      {filteredProperties.length > 0 ? (
        <>
          <PropertiesTable
            properties={filteredProperties}
            selectedProperties={selectedProperties}
            onPropertySelect={handlePropertySelect}
          />
          {selectedProperties.length > 0 && viewMode !== "paid" && (
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
            {viewMode === "unpaid"
              ? "No properties to pay for."
              : viewMode === "paid"
              ? "You don't have any paid properties yet. Pay for your properties to publish them."
              : "You don't have any properties yet."}
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
