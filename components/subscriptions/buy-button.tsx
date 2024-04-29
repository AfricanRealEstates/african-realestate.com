"use client";

import React, { useState } from "react";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { getStripeClientSecret } from "@/actions/payments";
import CheckoutForm from "./checkout-form";
import { Button } from "../ui/button";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
);
export default function BuyButton({
  subscription,
  isSelected,
}: {
  subscription: any;
  isSelected: boolean;
}) {
  const [clientSecret, setClientSecret] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [showCheckoutForm, setShowCheckoutForm] = useState(false);

  const getClientSecret = async () => {
    try {
      setLoading(true);
      const res = await getStripeClientSecret(subscription.price);
      setClientSecret(res.clientSecret);
      setShowCheckoutForm(true);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div>
      <button
        // variant="secondary"
        disabled={subscription.price == 0}
        onClick={getClientSecret}
        className={`${
          isSelected
            ? "bg-indigo-500 text-white"
            : "bg-gray-900 hover:bg-gray-950"
        } w-full disabled:cursor-not-allowed disabled:opacity-50 py-3 hover:scale-[1.015] translate-y-0 font-semibold transition-all text-white rounded-lg uppercase`}
      >
        {loading ? "Please wait..." : "Buy Now"}
      </button>
      {clientSecret && showCheckoutForm && (
        <Elements
          stripe={stripePromise}
          options={{ clientSecret: clientSecret }}
        >
          <CheckoutForm
            subscription={subscription}
            showCheckoutForm={showCheckoutForm}
            setShowCheckoutForm={setShowCheckoutForm}
          />
        </Elements>
      )}
    </div>
  );
}
