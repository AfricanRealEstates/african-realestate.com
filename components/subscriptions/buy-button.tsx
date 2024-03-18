"use client";
import { Button } from "antd";
import React, { useState } from "react";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { getStripeClientSecret } from "@/actions/payments";
import toast from "react-hot-toast";
import CheckoutForm from "./checkout-form";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
);
export default function BuyButton({ subscription }: { subscription: any }) {
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
      <Button
        block
        disabled={subscription.price == 0}
        onClick={getClientSecret}
        loading={loading}
      >
        Buy Now
      </Button>
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
