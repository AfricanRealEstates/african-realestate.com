import { getCurrentUser } from "@/actions/users";
import PageTitle from "@/components/globals/page-title";
import PropertiesForm from "@/components/properties/properties-form";
import prisma from "@/lib/prisma";
import { Property } from "@prisma/client";
import React from "react";

export default async function CreateProperty({
  searchParams,
}: {
  searchParams: any;
}) {
  const user = await getCurrentUser();
  const cloneFrom = searchParams?.cloneFrom || "";

  let property: Property | null = null;
  if (cloneFrom) {
    property = (await prisma.property.findUnique({
      where: {
        id: cloneFrom,
      },
    })) as Property;
  }

  // check user subscriptions and properties count

  const [userSubscription, propertiesCount] = (await Promise.all([
    prisma.subscription.findFirst({
      where: {
        userId: user.data?.id,
      },
      orderBy: {
        createdAt: "desc",
      },
    }),
    prisma.property.count({
      where: {
        userId: user.data?.id,
      },
    }),
  ])) as any;

  let showForm = true;
  let errorMessage = "";

  if (!userSubscription && propertiesCount >= 3) {
    showForm = false;
    errorMessage = `You have reached the maximum number of properties ${3}. Please upgrade your subscription plan.`;
  }

  if (userSubscription?.plan.propertiesCount >= propertiesCount) {
    showForm = false;
    errorMessage = `You have reached the maximum number of properties ${userSubscription?.plan.propertiesCount}. Please upgrade your subscription plan.`;
  }

  return (
    <div className="w-[95%] lg:max-w-7xl mx-auto py-[90px] lg:py-[120px]">
      <PageTitle title="Create Property" />
      {showForm ? (
        <PropertiesForm initialValues={property ? property : {}} />
      ) : (
        <span className="text-sm text-gray-600">{errorMessage}</span>
        // <div className="flex flex-col gap-5 justify-between p-5 border rounded border-solid border-gray-300">
        //   <h2 className="text-xl font-bold">Create property</h2>
        //   <p className="text-orange-700 text-2xl lg:text-5xl font-bold">
        //     {errorMessage}
        //   </p>
        // </div>
      )}
    </div>
  );
}
