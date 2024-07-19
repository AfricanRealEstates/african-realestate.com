import { auth } from "@/auth";
import DeleteAccount from "@/components/crm/delete-account";
import UserUpdateForm from "@/components/crm/user-update-form";
import ProfileAccountForm from "@/components/crm/profile-account-form";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getSEOTags } from "@/lib/seo";
import { HeartCrackIcon } from "lucide-react";
import { redirect } from "next/navigation";
import React from "react";

export const metadata = getSEOTags({
  title: "Account - Dashboard | African Real Estate",
  canonicalUrlRelative: "/dashboard/account",
});

export default async function DashboardAccount() {
  const session = await auth();
  const user = session?.user;

  if (!user) {
    redirect("/login");
  }

  return (
    <section className="max-w-7xl mx-auto px-8 w-full mt-9">
      <div className="grid gap-1 mb-4">
        <h2 className="text-2xl md:text-3xl">Account</h2>
        <p className="text-base text-muted-foreground">
          Manage account and website settings.
        </p>
      </div>

      <section className="max-w-4xl">
        <Tabs defaultValue="individual" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="individual">Individual Account</TabsTrigger>
            <TabsTrigger value="agency">Agency Account</TabsTrigger>
          </TabsList>

          <TabsContent value="individual">
            <ProfileAccountForm />
          </TabsContent>
          <TabsContent value="agency">
            <UserUpdateForm
              user={{
                id: user?.id || "",
                agentName: user?.agentName || "",
                agentEmail: user.agentEmail || "",
                address: user.address || "",
                bio: user.bio || "",
                postalCode: user.postalCode || "",
                whatsappNumber: user.whatsappNumber || "",
                officeLine: user.officeLine || "",
              }}
            />
          </TabsContent>
        </Tabs>
      </section>

      {/* <div className="flex w-52 flex-col space-y-2 mt-6">
        <p>Delete account:</p>
        <DeleteAccount
          email={session.user.email!}
          trigger={
            <Button variant="destructive" size="sm">
              <HeartCrackIcon size={14} />
              <span>Delete Account</span>
            </Button>
          }
        />
      </div> */}
    </section>
  );
}
