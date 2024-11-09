"use client";

import { useState, useEffect } from "react";
import PaymentPricingPlans, { PropertyCountRange } from "./payment-form";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";

interface Property {
  id: string;
  title: string;
  propertyType: string;
  price: number;
  currency: string;
  isActive: boolean;
}

interface PaymentPricingPlansWrapperProps {
  properties: Property[];
  isAdmin: boolean;
}

export default function PaymentPricingPlansWrapper({
  properties,
  isAdmin,
}: PaymentPricingPlansWrapperProps) {
  const [selectedProperties, setSelectedProperties] = useState<string[]>([]);
  const [propertyCount, setPropertyCount] = useState<PropertyCountRange>("1-3");

  useEffect(() => {
    const count = selectedProperties.length;
    if (count <= 3) setPropertyCount("1-3");
    else if (count <= 5) setPropertyCount("4-5");
    else if (count <= 10) setPropertyCount("6-10");
    else if (count <= 20) setPropertyCount("11-20");
    else if (count <= 40) setPropertyCount("21-40");
    else setPropertyCount(">40");
  }, [selectedProperties]);

  const handlePropertySelection = (propertyId: string) => {
    setSelectedProperties((prev) =>
      prev.includes(propertyId)
        ? prev.filter((id) => id !== propertyId)
        : [...prev, propertyId]
    );
  };

  return (
    <div className="container px-4 mx-auto">
      <h2 className="text-2xl font-bold mb-4">Your Properties</h2>
      <Table className="mb-8">
        <TableHeader>
          <TableRow>
            <TableHead className="w-[50px]">Select</TableHead>
            <TableHead>Title</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {properties.map((property) => (
            <TableRow key={property.id}>
              <TableCell>
                <Checkbox
                  id={`property-${property.id}`}
                  checked={selectedProperties.includes(property.id)}
                  onCheckedChange={() => handlePropertySelection(property.id)}
                />
              </TableCell>
              <TableCell>{property.title}</TableCell>
              <TableCell>{property.propertyType}</TableCell>
              <TableCell>{`${
                property.currency
              } ${property.price.toLocaleString()}`}</TableCell>
              <TableCell>{property.isActive ? "Active" : "Inactive"}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <PaymentPricingPlans
        propertyCount={propertyCount}
        selectedProperties={selectedProperties}
      />
    </div>
  );
}
