"use client";

import { useState } from "react";
import { usePaystackPayment } from "react-paystack";
import { Button } from "@/components/ui/button";

interface PaystackButtonProps {
  amount: number;
  email: string;
  name: string;
  phone: string;
  currency?: string;
}

export default function PaystackButton({
  amount,
  email,
  name,
  phone,
  currency = "KES",
}: PaystackButtonProps) {
  const [isLoading, setIsLoading] = useState(false);

  const config = {
    reference: new Date().getTime().toString(),
    email: email,
    amount: amount * 100, // Paystack expects amount in cents
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
      ],
    },
    currency: currency,
  };

  const initializePayment = usePaystackPayment(config);

  const onSuccess = (reference: any) => {
    setIsLoading(false);
    console.log("Payment successful", reference);
    // You can add more logic here, like updating the database
  };

  const onClose = () => {
    setIsLoading(false);
    console.log("Payment closed");
  };

  const handlePayment = () => {
    setIsLoading(true);
    initializePayment({ onSuccess, onClose });
  };

  return (
    <Button onClick={handlePayment} disabled={isLoading}>
      {isLoading
        ? "Processing..."
        : amount === 0
        ? "Complete Free Order"
        : "Pay with Paystack"}
    </Button>
  );
}
