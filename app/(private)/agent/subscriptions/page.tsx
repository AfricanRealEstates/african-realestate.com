import { getCurrentUser } from "@/actions/users";
import PageTitle from "@/components/globals/page-title";
import BuyButton from "@/components/subscriptions/buy-button";
import { subscriptionPlans } from "@/constants";
import prisma from "@/lib/prisma";
import { CircleCheckBig } from "lucide-react";
import React from "react";

export default async function Subscriptions() {
  const user = await getCurrentUser();
  const userSubscription: any = await prisma.subscription.findFirst({
    where: { userId: user.data?.id },
    orderBy: { createdAt: "desc" },
  });
  return (
    <div className="w-[95%] lg:max-w-7xl mx-auto py-[90px] lg:py-[120px]">
      <PageTitle title="Subscriptions" />

      <section className="mt-9 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {subscriptionPlans.map((subscription) => {
          const {
            name,
            price,
            PropertiesLimit,
            imagesPropertiesLimit,
            features,
          } = subscription;
          let isSelected = userSubscription?.plan?.name === name;
          if (!userSubscription) {
            isSelected = subscription.name === "Standard";
          }
          return (
            <div
              key={name}
              className={`flex flex-col gap-8 justify-center p-5 border rounded border-solid ${
                isSelected ? "border-blue-400 border-2" : "border-gray-200"
              }`}
            >
              <div className="flex flex-col gap-3 flex-1">
                <h2 className="text-xl font-bold text-gray-800">{name}</h2>
                <h3 className="text-orange-500 lg:text-5xl text-2xl font-bold">
                  ${price}
                </h3>

                <hr className="bg-gray-200" />

                <div className="flex flex-col gap-3">
                  {features.map((feature) => {
                    return (
                      <span
                        key={feature}
                        className="text-gray-600  flex items-center gap-2"
                      >
                        <CircleCheckBig className="h-4 w-4 text-green-700" />
                        {feature}
                      </span>
                    );
                  })}
                </div>
              </div>
              <BuyButton subscription={subscription} />
            </div>
          );
        })}
      </section>
    </div>
  );
}
