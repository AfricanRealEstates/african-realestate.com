"use client";
import { saveSubscription } from "@/actions/subscriptions";
import {
  AddressElement,
  PaymentElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import { Button, Modal } from "antd";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { toast } from "sonner";

interface CheckoutFormProps {
  subscription: any;
  showCheckoutForm: boolean;
  setShowCheckoutForm: any;
}
export default function CheckoutForm({
  subscription,
  showCheckoutForm,
  setShowCheckoutForm,
}: CheckoutFormProps) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const stripe = useStripe();
  const elements = useElements();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    try {
      setLoading(true);
      event.preventDefault();

      if (!stripe || !elements) {
        return;
      }

      const result = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: "http://localhost:3000/agent/account",
        },
        redirect: "if_required",
      });

      if (result.error) {
        toast.error("Failed to process payment");
      } else {
        toast.success("Payment successful");
        await saveSubscription({
          paymentId: result.paymentIntent.id,
          plan: subscription,
        });
        router.push("/agent/account");
      }
      setShowCheckoutForm(false);
    } catch (error: any) {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };
  return (
    <Modal
      title="Complete your subscription purchase"
      open={showCheckoutForm}
      onCancel={() => setShowCheckoutForm(false)}
      footer={null}
      width={600}
    >
      <form onSubmit={handleSubmit} className="mt-5">
        <PaymentElement />
        <AddressElement options={{ mode: "shipping", allowedCountries: [] }} />
        <div className="flex justify-end gap-5 mt-5">
          <Button onClick={() => setShowCheckoutForm(false)} disabled={loading}>
            Cancel
          </Button>
          <Button
            type="primary"
            htmlType="submit"
            loading={loading}
            className="flex items-center justify-center  cursor-pointer rounded-md bg-blue-300 hover:!bg-blue-400 transition-colors px-5 py-2.5 text-center font-semibold text-white"
          >
            Pay
          </Button>
        </div>
      </form>
    </Modal>
  );
}
