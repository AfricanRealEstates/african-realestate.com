import { auth } from "@/auth";
import DeleteAccount from "@/components/crm/delete-account";
import UserUpdateForm from "@/components/crm/user-update-form";
import { Button } from "@/components/ui/button";
import { HeartCrackIcon } from "lucide-react";
import { redirect } from "next/navigation";
import React from "react";

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

      <section className="grid gap-10">
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
