import { auth } from "@/auth";
import PageTitle from "@/components/globals/page-title";
import PropertiesForm from "@/components/properties/properties-form";
import { Button } from "@/components/ui/button";
import prisma from "@/lib/prisma";
import { getSEOTags } from "@/lib/seo";
import { Property } from "@prisma/client";
import Link from "next/link";
import { redirect } from "next/navigation";
import React from "react";
import { Josefin_Sans } from "next/font/google";
import { getCurrentUser } from "@/lib/session";
const josefin = Josefin_Sans({
  subsets: ["latin"],
  weight: ["600"],
});

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

  // if (user.role !== "AGENT") {
  //   redirect("/onboarding");
  // }
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

  if (!userSubscription && propertiesCount >= 10) {
    showForm = false;
    errorMessage = `You have reached the maximum number of properties ${3}. Please upgrade your subscription plan.`;
  }

  if (userSubscription?.plan.propertiesCount >= propertiesCount) {
    showForm = false;
    errorMessage = `You have reached the maximum number of properties ${userSubscription?.plan.propertiesCount}. Please upgrade your subscription plan.`;
  }

  return (
    <div className="w-full px-1 md:px-4 lg:px-16 lg:max-w-7xl mx-auto pt-[90px] lg:pt-[120px]">
      {/* <PageTitle title="Add your listing" /> */}
      <h2
        className={`${josefin.className} text-2xl capitalize font-medium my-6 text-blue-400`}
      >
        Add your listing
      </h2>
      {showForm ? (
        <PropertiesForm initialValues={property ? property : {}} />
      ) : (
        <section className="flex flex-col justify-center items-center gap-6 h-[25vh]">
          <span className="text-lg text-gray-600">{errorMessage}</span>
          <Button
            variant={"ghost"}
            asChild
            className="border-indigo-400 bg-indigo-500 hover:bg-indigo-600 text-white transition-colors ease-linear hover:text-white"
          >
            <Link href="/agent/subscriptions">Upgrade you plan</Link>
          </Button>
        </section>
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
