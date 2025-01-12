"use client";

import { useState, useMemo } from "react";
import { Property } from "@prisma/client";
import PropertiesTable from "./PropertiesTable";
import { Button } from "@/components/ui/button";
import { PropertyPaymentCTA } from "./PropertyPaymentCTA";
import PricingPlanSection from "./PricingPlanSection";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from 'lucide-react';

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
  const [selectedPropertyNumbers, setSelectedPropertyNumbers] = useState<number[]>([]);
  const [viewMode, setViewMode] = useState<"unpaid" | "paid" | "all">("unpaid");
  const [showPricingPlan, setShowPricingPlan] = useState(false);

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

  const handlePropertySelect = (propertyId: string, propertyNumber: number, isSelected: boolean) => {
    setSelectedProperties((prev) =>
      isSelected
        ? [...prev, propertyId]
        : prev.filter((id) => id !== propertyId)
    );
    setSelectedPropertyNumbers((prev) =>
      isSelected
        ? [...prev, propertyNumber]
        : prev.filter((num) => num !== propertyNumber)
    );
  };

  const filteredProperties = useMemo(() => {
    switch (viewMode) {
      case "unpaid":
        return properties.filter((property) => !property.isActive);
      case "paid":
        return properties.filter((property) => property.isActive);
      case "all":
      default:
        return properties;
    }
  }, [properties, viewMode]);

  const handlePayButtonClick = () => {
    if (selectedProperties.length === 0) {
      // If no properties are selected, select all unpaid properties
      const unpaidProperties = properties.filter((property) => !property.isActive);
      setSelectedProperties(unpaidProperties.map((property) => property.id));
      setSelectedPropertyNumbers(unpaidProperties.map((property) => property.propertyNumber));
    }
    setShowPricingPlan(true);
  };

  return (
    <div className="space-y-6">
      <PropertyPaymentCTA
        unpaidPropertiesCount={unpaidPropertiesCount}
        paidPropertiesCount={paidPropertiesCount}
        totalPropertiesCount={totalPropertiesCount}
        viewMode={viewMode}
        onChangeViewMode={setViewMode}
      />

      {/* {unpaidPropertiesCount > 0 && (
        <Alert variant="default">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Attention</AlertTitle>
          <AlertDescription>
            You have {unpaidPropertiesCount} unpaid properties. Pay now to publish them and increase your visibility!
          </AlertDescription>
        </Alert>
      )} */}

      {filteredProperties.length > 0 ? (
        <>
          <PropertiesTable
            properties={filteredProperties}
            selectedProperties={selectedProperties}
            onPropertySelect={handlePropertySelect}
          />
          <div className="mt-4 flex justify-center">
            <Button
              onClick={handlePayButtonClick}
              size="lg"
              className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-full shadow-lg transform transition-all duration-300 ease-in-out hover:scale-105"
            >
              {selectedProperties.length > 0
                ? `Pay for Selected Properties (${selectedProperties.length})`
                : "Complete Payment to Go Live!"}
            </Button>
          </div>
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
      {showPricingPlan && (
        <PricingPlanSection
          selectedProperties={selectedProperties}
          propertyNumbers={selectedPropertyNumbers}
          user={user}
          onClose={() => setShowPricingPlan(false)}
        />
      )}
    </div>
  );
}

