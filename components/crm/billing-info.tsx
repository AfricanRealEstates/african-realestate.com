import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import prisma from "@/lib/prisma";
import { auth } from "@/auth";
import { Button, buttonVariants } from "../ui/button";
import Link from "next/link";
import { cn } from "@/lib/utils";

export default async function BillingInfo() {
  const session = await auth();

  const user = session?.user;

  const userSubscription = (await prisma.subscription.findFirst({
    where: {
      userId: user?.id,
    },
    orderBy: {
      createdAt: "desc",
    },
  })) as any;

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Your Subscription Plan</CardTitle>

          <CardDescription className="flex items-center gap-x-0.5"></CardDescription>
        </CardHeader>
        <CardContent>
          You are currently on the{" "}
          <strong className="text-indigo-600 font-bold mr-1">
            {userSubscription?.plan.name || "Free"}
          </strong>
          plan
        </CardContent>
        <CardFooter className="flex flex-col items-start">
          <Link
            href="/agent/subscriptions"
            className={cn(
              buttonVariants({ variant: "ghost" }),
              "bg-indigo-500 text-white hover:bg-indigo-600 hover:text-white transition-colors ease-linear"
            )}
          >
            {userSubscription?.plan ? "Manage Subscription" : "Upgrade now"}
          </Link>
        </CardFooter>
      </Card>
    </>
  );
}
