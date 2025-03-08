import { getCurrentUser } from "@/lib/session";
import { redirect } from "next/navigation";
import { Separator } from "@/components/ui/separator";
import SessionsSettings from "./sessions-settings";
import ConnectedAccountsSettings from "./connected-accounts-settings";
import DangerZoneSettings from "./danger-zone-settings";
import RegionSelector from "./RegionSelector";
import type { User } from "@prisma/client";

export default async function Settings() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

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

      <div className="col-span-full space-y-12">
        <div className="space-y-6">
          <ConnectedAccountsSettings user={user as User} />
          <Separator />
        </div>

        {/* Sessions Section */}
        <div className="space-y-6">
          <SessionsSettings user={user as User} />
          <Separator />
        </div>

        {/* Connected Accounts Section */}

        <div className="space-y-6">
          <RegionSelector />
          <Separator />
        </div>

        {/* Danger Zone Section */}
        <div className="space-y-6">
          <DangerZoneSettings user={user as User} />
        </div>
      </div>
    </section>
  );
}
