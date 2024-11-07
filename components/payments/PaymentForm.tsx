"use client";
import React from "react";
import { usePaystackPayment } from "react-paystack";
import { Button } from "../ui/button";

export interface TransactionProps {
  reference?: string;
  email: string;
  amount: number; //Amount is in the country's lowest currency. E.g Kobo, so 20000 kobo = N200
  publicKey?: string;
  currency?: string;
}

const config = {
  reference: new Date().getTime().toString(),
  email: "user@example.com",
  amount: 20000, //Amount is in the country's lowest currency. E.g Kobo, so 20000 kobo = N200
  publicKey: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY as string,
  currency: "KES",
};

// you can call this function anything
const onSuccess = (reference: any) => {
  // Implementation for whatever you want to do with reference and after success call.
  console.log(reference);
};

// you can call this function anything
const onClose = () => {
  // implementation for  whatever you want to do when the Paystack dialog closed.
  console.log("closed");
};

const PaystackHookExample = () => {
  const initializePayment = usePaystackPayment(config);
  return (
    <div>
      <Button
        onClick={() => {
          initializePayment({ onSuccess, onClose });
        }}
      >
        Paystack Hooks Implementation
      </Button>
    </div>
  );
};

function PaymentForm() {
  return (
    <div className="max-w-4xl mx-auto p-8">
      <PaystackHookExample />
    </div>
  );
}

export default PaymentForm;
