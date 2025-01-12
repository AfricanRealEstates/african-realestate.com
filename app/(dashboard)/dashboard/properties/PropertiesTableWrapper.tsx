"use client";

import { useState } from "react";
import PropertiesTable from "./PropertiesTable";
import { Property } from "@prisma/client";

interface PropertiesTableWrapperProps {
  properties: Property[];
  onSelectedPropertiesChange: (selectedProperties: string[], selectedPropertyNumbers: number[]) => void;
}

export default function PropertiesTableWrapper({
  properties,
  onSelectedPropertiesChange,
}: PropertiesTableWrapperProps) {
  const [selectedProperties, setSelectedProperties] = useState<string[]>([]);
  const [selectedPropertyNumbers, setSelectedPropertyNumbers] = useState<number[]>([]);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  const handlePropertySelect = (propertyId: string, propertyNumber: number, isSelected: boolean) => {
    setSelectedProperties((prev) => {
      const newSelection = isSelected
        ? [...prev, propertyId]
        : prev.filter((id) => id !== propertyId);

      setSelectedPropertyNumbers((prevNumbers) => {
        const newNumbers = isSelected
          ? [...prevNumbers, propertyNumber]
          : prevNumbers.filter((num) => num !== propertyNumber);

        onSelectedPropertiesChange(newSelection, newNumbers);
        return newNumbers;
      });

      return newSelection;
    });
  };

  return (
    <PropertiesTable
      properties={properties}
      selectedProperties={selectedProperties}
      onPropertySelect={handlePropertySelect}
    />
  );
}

