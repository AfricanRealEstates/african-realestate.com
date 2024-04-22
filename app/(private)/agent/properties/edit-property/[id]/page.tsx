import PageTitle from "@/components/globals/page-title";
import PropertiesForm from "@/components/properties/properties-form";
import { authOptions } from "@/lib/auth-options";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import React from "react";

interface EditPropertyProps {
  params: {
    id: string;
  };
}

export default async function EditProperty({ params }: EditPropertyProps) {
  const property = await prisma.property.findUnique({
    where: { id: params.id },
  });
  const user = await getServerSession(authOptions);
  if (!user) redirect("/login");
  return (
    <div className="w-[95%] lg:max-w-7xl mx-auto py-[90px] lg:py-[120px]">
      <PageTitle title="Edit Property" />
      <PropertiesForm initialValues={property} isEdit={true} />
    </div>
  );
}
