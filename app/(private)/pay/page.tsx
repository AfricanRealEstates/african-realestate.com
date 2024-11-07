import PaymentForm from "@/components/payments/PaymentForm";
import PaymentPricingPlans from "@/components/properties/properties-form/payment-form";
import React from "react";

export default function Pay() {
  return (
    <div className="py-24">
      <PaymentPricingPlans />
      <PaymentForm />
    </div>
  );
}
