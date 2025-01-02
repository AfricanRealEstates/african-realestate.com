"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Icons } from "@/components/globals/icons";
import { upgradeUserRole } from "@/actions/users";

export default function UpgradeRole() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleUpgrade = async () => {
    setIsLoading(true);
    const result = await upgradeUserRole("AGENCY");
    setIsLoading(false);
    if (result.success) {
      toast.success("Your role has been upgraded to AGENCY");
      router.push("/agent/properties/create-property");
    } else {
      toast.error("An error occurred while upgrading your role");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-white">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ duration: 0.3 }}
      >
        <Card className="w-[500px] shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center">
              Upgrade to Agency
            </CardTitle>
            <CardDescription className="text-center">
              Upgrade your role to post more properties
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="mb-6">
              As an Agency, you&apos;ll be able to post unlimited properties and
              access additional features.
            </p>
            <div className="flex justify-between">
              <Button variant="outline" onClick={() => router.back()}>
                Cancel
              </Button>
              <Button
                onClick={handleUpgrade}
                disabled={isLoading}
                className="bg-blue-500 hover:bg-blue-600 text-white"
              >
                {isLoading ? (
                  <>
                    <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                    Upgrading...
                  </>
                ) : (
                  "Confirm & Upgrade"
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
