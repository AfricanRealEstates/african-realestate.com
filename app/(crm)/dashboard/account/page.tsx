import { auth } from "@/auth";
import DeleteAccount from "@/components/crm/delete-account";
import UserUpdateForm from "@/components/crm/user-update-form";
import ProfileAccountForm from "@/components/crm/profile-account-form";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getSEOTags } from "@/lib/seo";
import { HeartCrackIcon } from "lucide-react";
import { notFound, redirect } from "next/navigation";
import React, { cache } from "react";
import { getUserDataSelect, UserData } from "@/lib/types";
import UserAvatar from "@/components/crm/user-avatar";
import prisma from "@/lib/prisma";
import { formatDate } from "date-fns";
import { formatNumber } from "@/lib/formatter";
import EditProfileButton from "./EditProfileButton";
import { getCurrentUser } from "@/lib/session";

export const metadata = getSEOTags({
  title: "Account - Dashboard | African Real Estate",
  canonicalUrlRelative: "/dashboard/account",
});

const getUser = cache(async (name: string, loggedInUserId: string) => {
  const user = await prisma.user.findFirst({
    where: {
      name: {
        equals: name,
        mode: "insensitive",
      },
    },
    select: getUserDataSelect(loggedInUserId),
  });

  if (!user) notFound();

  return user;
});

export default async function DashboardAccount() {
  const session = await auth();
  const loggedInUser = await getCurrentUser();

  if (!loggedInUser || !loggedInUser.id || !loggedInUser.name) {
    redirect("/login");
  }

  const user = await getUser(loggedInUser.name, loggedInUser.id);

  return (
    <section className="max-w-7xl mx-auto px-8 w-full mt-9">
      <main className="flex w-full min-w-0 gap-5">
        <div className="w-full min-w-0 space-y-5">
          <UserProfile user={user} loggedInUserId={user.id} />
        </div>
      </main>
      {/*
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
            <ProfileAccountForm
              user={{
                id: user?.id || "",
                name: user?.name || "",
                email: user?.email || "",
                bio: user?.bio || "",
                whatsappNumber: user?.whatsappNumber || "",
                profilePhoto: user?.profilePhoto || "",
                phoneNumber: user?.phoneNumber || "",
                xLink: user?.xLink || "",
                tiktokLink: user?.tiktokLink || "",
                facebookLink: user?.facebookLink || "",
                linkedinLink: user?.linkedinLink || "",
                instagramLink: user?.instagramLink || "",
              }}
            />
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
    </section>
    */}
    </section>
  );
}

interface UserProfileProps {
  user: UserData;
  loggedInUserId: string;
}
function UserProfile({ user, loggedInUserId }: UserProfileProps) {
  return (
    <article className="h-fit w-full space-y-5 rounded-2xl bg-card p-5 shadow-sm">
      <UserAvatar
        avatarUrl={user.image}
        size={250}
        className="mx-auto size-full max-h-60 max-w-60 rounded-full"
      />

      <div className="flex flex-wrap gap-3 sm:flex-nowrap">
        <div className="me-auto space-y-3">
          <div>
            <h1 className="text-3xl font-bold">{user.name}</h1>
          </div>
          <p className="">
            Member since {formatDate(user.createdAt, "MMM d, yyyy")}
          </p>
          <div className="flex items-center gap-3">
            <span>
              Properties:{" "}
              <span className="font-semibold">
                {formatNumber(user._count.properties)}
              </span>
            </span>
          </div>
        </div>
        {user.id === loggedInUserId && <EditProfileButton user={user} />}
      </div>

      {user.bio && (
        <>
          <hr />
          <div className="overflow-hidden whitespace-pre-line break-words">
            {user.bio}
          </div>
        </>
      )}
    </article>
  );
}
