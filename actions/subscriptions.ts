"use server";
import { authOptions } from "@/lib/auth-options";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";

export const saveSubscription = async ({
  paymentId,
  plan,
}: {
  paymentId: string;
  plan: any;
}) => {
  try {
    const user = await getServerSession(authOptions);
    const payload: any = {
      paymentId,
      plan,
      userId: user?.user?.id,
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
