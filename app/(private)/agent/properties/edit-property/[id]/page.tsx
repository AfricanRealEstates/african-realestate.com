import { auth } from "@/auth";
import PageTitle from "@/components/globals/page-title";
import PropertiesForm from "@/components/properties/properties-form";
import prisma from "@/lib/prisma";
import { getSEOTags } from "@/lib/seo";
import { getCurrentUser } from "@/lib/session";
import { redirect } from "next/navigation";
import React from "react";

interface EditPropertyProps {
  params: {
    id: string;
  };
}

export const metadata = getSEOTags({
  title: "Edit Property | African Real Estate",
  canonicalUrlRelative: `/agent/edit-property`,
});

export default async function EditProperty({ params }: EditPropertyProps) {
  const property = await prisma.property.findUnique({
    where: { id: params.id },
  });
  const session = await auth();
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  return (
    <div className="w-[95%] lg:max-w-7xl mx-auto py-[90px] lg:py-[120px]">
      <PageTitle title="Edit Property" />
      <PropertiesForm initialValues={property} isEdit={true} />
    </div>
  );
}
