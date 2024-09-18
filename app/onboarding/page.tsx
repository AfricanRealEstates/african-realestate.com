"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { InfoIcon } from "lucide-react";
import { Label } from "@/components/ui/label";
import { upgradeUserRole } from "@/actions/users";
import { useSession } from "next-auth/react";
import { toast } from "sonner";

export default function Onboarding() {
  const [selectedRole, setSelectedRole] = useState<"AGENT" | "AGENCY" | "">("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { data: session } = useSession();
  const user = session?.user;

  const handleUpgrade = async () => {
    if (selectedRole) {
      setIsLoading(true);
      const result = await upgradeUserRole(selectedRole);
      setIsLoading(false);
      if (result.success) {
        toast.success(`Your role has been upgraded to ${selectedRole}`);
        router.push("/dashboard/profile");
      } else {
        toast.error("An error occurred while upgrading your role");
      }
    }
  };

  if (user?.role !== "USER") {
    return (
      <div className="flex items-center justify-center min-h-full">
        <Card className="w-[350px]">
          <CardContent className="pt-6">
            <p className="text-center text-muted-foreground">
              You are already upgraded!
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-full w-[95%] lg:max-w-7xl mx-auto py-32 lg:py-64">
      <Card className="w-[450px]">
        <CardHeader>
          {/* Onboarding welcome and personalized message */}
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold">
              Hello, {user?.name || "User"}!
            </h2>
            <p>Welcome to African Real Estate!</p>

            <div className="bg-muted p-4 rounded-lg text-sm text-muted-foreground mt-4">
              <p>
                <strong>Note:</strong> Choose who you are carefully as it will
                determine your experience on our platform.
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <RadioGroup
            onValueChange={(value) =>
              setSelectedRole(value as "AGENT" | "AGENCY")
            }
            className="space-y-4"
          >
            <TooltipProvider>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="AGENT" id="agent" />
                <Label htmlFor="agent">Agent</Label>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <InfoIcon className="h-4 w-4 text-muted-foreground hover:cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Choose this if you&apos;re an individual agent</p>
                  </TooltipContent>
                </Tooltip>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="AGENCY" id="agency" />
                <Label htmlFor="agency">Agency</Label>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <InfoIcon className="h-4 w-4 text-muted-foreground hover:cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>
                      Choose this if you represent a company or have multiple
                      properties
                    </p>
                  </TooltipContent>
                </Tooltip>
              </div>
            </TooltipProvider>
          </RadioGroup>
          <Button
            onClick={handleUpgrade}
            className="w-full mt-6"
            disabled={!selectedRole || isLoading}
          >
            {isLoading ? "Upgrading..." : "Upgrade"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
