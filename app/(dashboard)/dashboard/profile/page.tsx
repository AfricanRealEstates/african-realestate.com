import { auth } from "@/auth";
import { getSEOTags } from "@/lib/seo";
import { notFound, redirect } from "next/navigation";
import React, { cache } from "react";
import { getUserDataSelect, UserData } from "@/lib/types";
import UserAvatar from "@/components/crm/user-avatar";
import { prisma } from "@/lib/prisma";
import { formatDate } from "date-fns";
import { formatNumber } from "@/lib/formatter";
import { getCurrentUser } from "@/lib/session";
import EditProfileButton from "./EditProfileButton";
import GeneralInformation from "../settings/GeneralInformation";
import SocialMediaConnect from "../settings/SocialMediaConnect";

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

export default async function DashboardProfile() {
  const session = await auth();
  const loggedInUser = await getCurrentUser();

  if (!loggedInUser || !loggedInUser.id || !loggedInUser.name) {
    redirect("/login");
  }

  const user = await getUser(loggedInUser.name, loggedInUser.id);

  return (
    <section className="grid grid-cols-1 px-4 pt-6 xl:grid-cols-3 xl:gap-4 gap-y-4">
      <div className="mb-4 col-span-full xl:mb-2">
        <h1 className="text-2xl font-semibold text-blue-600 sm:text-2xl">
          Profile information
        </h1>
        <p className="text-base text-muted-foreground mt-1">
          Manage your profile
        </p>
      </div>
      <article className="col-span-full xl:col-auto">
        <UserProfile user={user} loggedInUserId={user.id} />
        {loggedInUser.role !== "USER" && <SocialMediaConnect />}
      </article>

      <article className="col-span-2">
        <GeneralInformation />
      </article>
    </section>
  );
}

interface UserProfileProps {
  user: UserData;
  loggedInUserId: string;
}
function UserProfile({ user, loggedInUserId }: UserProfileProps) {
  return (
    <article className="p-4 mb-4 bg-white border border-gray-200 rounded-lg shadow-sm 2xl:col-span-2 sm:p-6 space-y-4">
      <UserAvatar
        avatarUrl={user.image}
        size={240}
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

      {user.bio ? (
        <>
          <hr />
          <div className="line-clamp-2 overflow-hidden whitespace-pre-line break-words mb-2 leading-relaxed tracking-wide text-gray-400">
            {user.bio}
          </div>
        </>
      ) : (
        <>
          <hr />
          <p className="line-clamp-2 overflow-hidden whitespace-pre-line break-words mb-2 leading-relaxed tracking-wide text-gray-400">
            No bio yet.
          </p>
        </>
      )}

      {user.role && (
        <p className="mb-3">
          Role: <span className="text-rose-500 font-bold">{user.role}</span>
        </p>
      )}
    </article>
  );
}
