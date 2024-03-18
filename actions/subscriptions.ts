"use server";
import prisma from "@/lib/prisma";
import { getCurrentUser } from "./users";

export const saveSubscription = async ({
  paymentId,
  plan,
}: {
  paymentId: string;
  plan: any;
}) => {
  try {
    const user = await getCurrentUser();
    const payload: any = {
      paymentId,
      plan,
      userId: user.data?.id,
    };
    await prisma.subscription.create({ data: payload });
    return {
      message: "Subscription saved successfully",
      data: payload,
    };
  } catch (error: any) {
    return {
      error: error.message,
    };
  }
};
