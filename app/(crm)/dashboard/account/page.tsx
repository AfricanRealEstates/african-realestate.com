import { auth } from "@/auth";
import { SignOut } from "@/components/auth/signout-button";
import UserButton from "@/components/auth/user-button";
import DashboardAccount from "@/components/dashboard/dashboard-account";
import SettingsUpdatedForm from "@/components/dashboard/settings-updated-form";
import getSession from "@/lib/getSession";
import { getSEOTags } from "@/lib/seo";
import { redirect } from "next/navigation";
import React from "react";

export const metadata = getSEOTags({
  title: "Dashboard - settings | African Real Estate",
  canonicalUrlRelative: "/dashboard/settings",
});

export default async function Settings() {
  const session = await getSession();
  const user = session?.user;
  if (!user) {
    redirect(`/api/auth/signin?callbackUrl=/dashboard/account`);
  }
  console.log(user);
  return (
    <div>
      {/* <DashboardAccount /> */}
      {/* <UserButton user={user} />
      <SignOut />
       */}
      <SettingsUpdatedForm user={user} />
    </div>
  );
}
