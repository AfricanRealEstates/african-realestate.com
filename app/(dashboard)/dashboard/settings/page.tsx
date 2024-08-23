import { getCurrentUser } from "@/lib/session";
import Image from "next/image";
import { redirect } from "next/navigation";
import React from "react";
import RegionSelector from "./RegionSelector";
import SocialMediaConnect from "./SocialMediaConnect";
import GeneralInformation from "./GeneralInformation";

export default async function Settings() {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/login");
  }
  console.log(user);
  return (
    <section className="grid grid-cols-1 px-4 pt-6 xl:grid-cols-3 xl:gap-4">
      <div className="mb-4 col-span-full xl:mb-2">
        <h1 className="text-2xl font-semibold text-blue-600 sm:text-2xl">
          User settings
        </h1>
        <p className="text-base text-muted-foreground mt-1">
          Manage account and website settings.
        </p>
      </div>

      <article className="col-span-full xl:col-auto">
        {/* <SocialMediaConnect /> */}
        <RegionSelector />
      </article>
      <article className="col-span-2">{/* <GeneralInformation /> */}</article>
    </section>
  );
}
