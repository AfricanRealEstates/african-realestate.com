import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { getSEOTags } from "@/lib/seo";
import { Property } from "@prisma/client";
import { redirect } from "next/navigation";
import React from "react";
import { getCurrentUser } from "@/lib/session";
import CreatePropertyClient from "./CreatePropertyClient";

export const metadata = getSEOTags({
  title: "Create Property | African Real Estate",
  canonicalUrlRelative: "/agent/create-property",
});

export default async function CreateProperty({
  searchParams,
}: {
  searchParams: any;
}) {
  const session = await auth();
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  if (
    user.role !== "AGENT" &&
    user.role !== "AGENCY" &&
    user.role !== "ADMIN"
  ) {
    redirect("/onboarding");
  }
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
        userId: user.id,
      },
      orderBy: {
        createdAt: "desc",
      },
    }),
    prisma.property.count({
      where: {
        userId: user.id,
      },
    }),
  ])) as any;

  let showForm = true;
  let errorMessage = "";

  if (userSubscription?.plan.propertiesCount <= propertiesCount) {
    showForm = false;
    errorMessage = `You have reached the maximum number of properties (${userSubscription?.plan.propertiesCount}).`;
  }

  if (user.role === "AGENT" && propertiesCount >= 3) {
    showForm = false;
    errorMessage =
      "You have reached the maximum number of properties (3) for an Agent. Please upgrade to Agency to post more properties.";
  }

  return (
    <div className="w-full px-1 md:px-4 lg:px-16 lg:max-w-7xl mx-auto py-[90px] lg:py-[120px]">
      <h2 className={` text-2xl capitalize font-medium my-6 text-blue-400`}>
        Add your listing
      </h2>
      <CreatePropertyClient
        showForm={showForm}
        errorMessage={errorMessage}
        userRole={user.role}
        initialValues={property ? property : {}}
      />
    </div>
  );
}
