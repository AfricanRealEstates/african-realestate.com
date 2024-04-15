import PageTitle from "@/components/globals/page-title";
import BuyButton from "@/components/subscriptions/buy-button";
import { subscriptionPlans } from "@/constants";
import { authOptions } from "@/lib/auth-options";
import prisma from "@/lib/prisma";
import { getSEOTags } from "@/lib/seo";
import { CircleCheckBig } from "lucide-react";
import { getServerSession } from "next-auth";
import React from "react";

export const metadata = getSEOTags({
  title: "Agent - Subscriptions | African Real Estate",
  canonicalUrlRelative: "/agent/subscriptions",
});

export default async function Subscriptions() {
  const user = await getServerSession(authOptions);
  const userSubscription: any = await prisma.subscription.findFirst({
    where: { userId: user?.user?.id },
    orderBy: { createdAt: "desc" },
  });
  return (
    <>
      <section className="w-full text-gray-900 bg-white px-4 lg:px-8 py-32 lg:py-40 relative overflow-hidden">
        <div className="mb-12 lg:mb-24 relative z">
          <h3 className="font-semibold text-indigo-500 text-5xl lg:text-7xl text-center mb-6">
            Pricing plans
          </h3>
          <p className="text-center mx-auto max-w-lg mb-8 text-lg opacity-90 leading-relaxed">
            Choose from a range of flexible plans that suits your business.
          </p>
          <div className="flex items-center justify-center gap-3 mb-16">
            <div className="relative">
              <button className="font-medium rounded-lg py-3 w-48 hover:bg-slate-200 bg-slate-100 transition-colors relative">
                One Time Payment
              </button>
              <div className="absolute -right-[100px] top-2 sm:top-0">
                <svg
                  width="95"
                  height="62"
                  viewBox="0 0 95 62"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="scale-50 sm:scale-75"
                >
                  <path
                    d="M14.7705 15.8619C33.2146 15.2843 72.0772 22.1597 79.9754 54.2825"
                    stroke="#7D7BE5"
                    stroke-width="3"
                  ></path>
                  <path
                    d="M17.7987 7.81217C18.0393 11.5987 16.4421 15.8467 15.5055 19.282C15.2179 20.3369 14.9203 21.3791 14.5871 22.4078C14.4728 22.7608 14.074 22.8153 13.9187 23.136C13.5641 23.8683 12.0906 22.7958 11.7114 22.5416C8.63713 20.4812 5.49156 18.3863 2.58664 15.9321C1.05261 14.6361 2.32549 14.1125 3.42136 13.0646C4.37585 12.152 5.13317 11.3811 6.22467 10.7447C8.97946 9.13838 12.7454 8.32946 15.8379 8.01289"
                    stroke="#7D7BE5"
                    stroke-width="3"
                    stroke-linecap="round"
                  ></path>
                </svg>
                <span className="block text-xs w-fit bg-indigo-500 text-white shadow px-1.5 py-0.5 rounded -mt-1 ml-8 -rotate-2 font-light italic">
                  Save $$$
                </span>
              </div>
            </div>
          </div>
          <div className="mt-9 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 max-w-7xl mx-auto">
            {subscriptionPlans.map((subscription) => {
              const {
                name,
                price,
                sell,
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
                  className={`flex flex-col gap-8 justify-center p-5 border rounded-xl border-solid ${
                    isSelected
                      ? "border-indigo-200 border-px shadow-[0_35px_60px_-15px_rgba(0,0,0,0.3)]"
                      : "border-gray-200"
                  }`}
                >
                  <div className="flex flex-col gap-3 flex-1">
                    <h2 className="text-4xl font-bold text-gray-900">{name}</h2>
                    <p className="text-lg opacity-60">{sell}</p>
                    <h3 className="text-indigo-500 text-6xl font-bold">
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
                            <CircleCheckBig className="h-4 w-4 text-indigo-500" />
                            {feature}
                          </span>
                        );
                      })}
                    </div>
                  </div>
                  <BuyButton subscription={subscription} isSelected />
                </div>
              );
            })}
          </div>
        </div>
      </section>
      {/* 
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
                isSelected ? "border-indigo-500 border-2" : "border-gray-200"
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
      */}
    </>
  );
}
