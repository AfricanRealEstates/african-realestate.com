"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Icons } from "@/components/globals/icons";
import { upgradeUserRole } from "@/actions/users";
import { signOut } from "next-auth/react";

interface RoleUpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function RoleUpgradeModal({
  isOpen,
  onClose,
}: RoleUpgradeModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [upgradeComplete, setUpgradeComplete] = useState(false);
  const router = useRouter();

  const handleUpgrade = async () => {
    setIsLoading(true);
    const result = await upgradeUserRole("AGENCY");
    setIsLoading(false);
    if (result.success) {
      setUpgradeComplete(true);
      toast.success("Your role has been upgraded to AGENCY");
    } else {
      toast.error("An error occurred while upgrading your role");
    }
  };

  const handleLogout = async () => {
    await signOut({ redirect: false });
    router.push("/login?upgraded=true");
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {upgradeComplete ? "Upgrade Complete" : "Upgrade to Agency"}
          </DialogTitle>
          <DialogDescription>
            {upgradeComplete
              ? "Your account has been upgraded. Please log out and log back in to apply the changes."
              : "Upgrade your role to post more properties"}
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          {upgradeComplete ? (
            <p>
              Click the button below to log out. After logging back in,
              you&apos;ll have access to all Agency features.
            </p>
          ) : (
            <p>
              As an Agency, you&apos;ll be able to post unlimited properties and
              access additional features.
            </p>
          )}
        </div>
        <DialogFooter>
          {upgradeComplete ? (
            <Button onClick={handleLogout} className="w-full">
              Log Out and Continue
            </Button>
          ) : (
            <>
              <Button variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button onClick={handleUpgrade} disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                    Upgrading...
                  </>
                ) : (
                  "Confirm & Upgrade"
                )}
              </Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
