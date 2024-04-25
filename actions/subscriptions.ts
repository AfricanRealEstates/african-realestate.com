"use server";
import { auth } from "@/auth";
import prisma from "@/lib/prisma";

export const saveSubscription = async ({
  paymentId,
  plan,
}: {
  paymentId: string;
  plan: any;
}) => {
  try {
    const session = await auth()
    const payload: any = {
      paymentId,
      plan,
      userId: session?.user?.id,
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
