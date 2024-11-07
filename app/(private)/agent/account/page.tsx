import PageTitle from "@/components/globals/page-title";
import dayjs from "dayjs";
import React from "react";
import { prisma } from "@/lib/prisma";
import { getSEOTags } from "@/lib/seo";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { getCurrentUser } from "@/lib/session";

export const metadata = getSEOTags({
  title: "Agent - Account | African Real Estate",
  canonicalUrlRelative: "/agent/account",
});

export default async function Account() {
  const session = await auth();
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const propertiesCount = await prisma.property.count({
    where: { userId: user.id },
  });

  const userSubsciption: any = await prisma.subscription.findFirst({
    where: {
      userId: user.id,
    },
    orderBy: { createdAt: "desc" },
  });
  // console.log(userSubsciption);

  const getSectionTitle = async (title: string) => {
    return (
      <div>
        <h2 className="text-xl font-bold text-gray-500 border-b border-gray-100 my-2">
          {title}
        </h2>
      </div>
    );
  };

  const getAttribute = (title: string, value: string) => {
    return (
      <div className="flex flex-col text-sm gap-2">
        <span className="text-gray-900 font-semibold">{title}</span>
        <span className="text-gray-500 capitalize">{value}</span>
      </div>
    );
  };
  return (
    <div className="w-[95%] lg:max-w-7xl mx-auto py-[90px] lg:py-[120px]">
      <PageTitle title="Account" />
      <section className="flex flex-col gap-5">
        {getSectionTitle("Basic Details")}

        <article className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-5 gap-y-6">
          {getAttribute("Name:", user.name || "")}
          {getAttribute("Email:", user.email || "")}
          {getAttribute("Loggedin User Id:", user.id as string)}
          {/* {getAttribute(
            "Registered On:",
            dayjs(user?.user.createdAt).format("DD MMM YYYY hh:mm A") || ""
          )}
          {getAttribute(
            "Last login",
            dayjs(clerkUser?.lastSignInAt).format("DD MMM YYYY hh:mm A") || ""
          )} */}
          {getAttribute("Properties Posted", propertiesCount.toString())}
        </article>
        <article className="flex flex-col gap-5 mt-12">
          {getSectionTitle("Subscription Details")}

          {userSubsciption ? (
            <div className="grid grid-cols-3 gap-5">
              {getAttribute("Plan", userSubsciption?.plan.name || "")}
              {getAttribute("Price", `$ ${userSubsciption?.plan.price} ` || "")}
              {getAttribute(
                "Purchased on",
                dayjs(userSubsciption.createdAt).format(
                  "DD MMM YYYY hh:mm A"
                ) || ""
              )}
              {getAttribute("Payment Id", userSubsciption?.paymentId || "")}
            </div>
          ) : (
            <div className=" text-gray-600">No subscription found</div>
          )}
        </article>
      </section>
    </div>
  );
}
