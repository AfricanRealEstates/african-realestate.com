"use client";

import { useState } from "react";
import PropertiesTable from "./PropertiesTable";
import { Property } from "@prisma/client";

interface PropertiesTableWrapperProps {
  properties: Property[];
  onSelectedPropertiesChange: (selectedProperties: string[]) => void;
}

export default function PropertiesTableWrapper({
  properties,
  onSelectedPropertiesChange,
}: PropertiesTableWrapperProps) {
  const [selectedProperties, setSelectedProperties] = useState<string[]>([]);

  const handlePropertySelect = (propertyId: string, isSelected: boolean) => {
    setSelectedProperties((prev) => {
      const newSelection = isSelected
        ? [...prev, propertyId]
        : prev.filter((id) => id !== propertyId);
      onSelectedPropertiesChange(newSelection);
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
