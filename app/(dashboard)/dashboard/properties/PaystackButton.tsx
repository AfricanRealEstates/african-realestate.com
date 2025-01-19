"use client";

import { useState, useCallback } from "react";
import { usePaystackPayment } from "react-paystack";
import { Button } from "@/components/ui/button";
import { processPayment } from "./processPayment";

interface PaystackButtonProps {
  propertyIds: string[];
  propertyNumbers: number[];
  amount: number;
  email: string;
  name: string;
  phone: string;
  userId: string;
  tierDuration: number;
  tierName: string;
  onClose: () => void;
  onSuccess: (reference: any) => void;
  onModalOpen: () => void;
}

export default function PaystackButton({
  propertyIds,
  propertyNumbers,
  amount,
  email,
  name,
  phone,
  userId,
  tierDuration,
  tierName,
  onClose,
  onSuccess,
  onModalOpen,
}: PaystackButtonProps) {
  const [isLoading, setIsLoading] = useState(false);

  const config = {
    reference: new Date().getTime().toString(),
    email: email,
    amount: Math.round(amount * 100), // Convert to cents
    publicKey: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY!,
    metadata: {
      custom_fields: [
        {
          display_name: "Name",
          variable_name: "name",
          value: name,
        },
        {
          display_name: "Phone",
          variable_name: "phone",
          value: phone,
        },
        {
          display_name: "User ID",
          variable_name: "userId",
          value: userId,
        },
        {
          display_name: "Property Numbers",
          variable_name: "propertyNumbers",
          value: propertyNumbers.join(", "),
        },
        {
          display_name: "Tier Name",
          variable_name: "tierName",
          value: tierName,
        },
      ],
    },
    currency: "KES",
  };

  const initializePayment = usePaystackPayment(config);

  const handleSuccess = useCallback(
    async (reference: any) => {
      setIsLoading(false);
      console.log("Payment successful", reference);

      try {
        const result = await processPayment({
          propertyIds,
          amount,
          userId,
          reference: reference.reference,
          tierDuration,
          tierName,
        });

        if (result.success) {
          console.log("Properties activated:", result.properties);
          console.log("Order created:", result.order);
          onSuccess(reference);
        } else {
          console.error("Failed to process payment:", result.error);
          // Handle the error (e.g., show an error message to the user)
        }
      } catch (error) {
        console.error("Error processing payment:", error);
        // Handle the error (e.g., show an error message to the user)
      }

      onClose();
    },
    [propertyIds, amount, userId, tierDuration, tierName, onSuccess, onClose]
  );

  const handleClose = useCallback(() => {
    setIsLoading(false);
    console.log("Payment closed");
    onClose();
  }, [onClose]);

  const handlePayment = useCallback(() => {
    setIsLoading(true);
    if (amount === 0) {
      // For zero amount, bypass Paystack and directly call processPayment
      handleSuccess({ reference: `FREE_${new Date().getTime()}` });
    } else {
      onModalOpen(); // Call this function when Paystack modal is about to open
      initializePayment({ onSuccess: handleSuccess, onClose: handleClose });
    }
  }, [initializePayment, handleSuccess, handleClose, amount, onModalOpen]);

  return (
    <Button onClick={handlePayment} disabled={isLoading}>
      {isLoading
        ? "Processing..."
        : amount === 0
        ? `Activate ${propertyIds.length} ${
            propertyIds.length === 1 ? "Property" : "Properties"
          } for Free`
        : `Pay for ${propertyIds.length} ${
            propertyIds.length === 1 ? "Property" : "Properties"
          }`}
    </Button>
  );
}
