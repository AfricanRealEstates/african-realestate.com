"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useSession, signOut } from "next-auth/react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Icons } from "@/components/globals/icons";
import { upgradeUserRole } from "@/actions/users";
import { Building } from "lucide-react";

export default function Onboarding() {
  const [step, setStep] = useState(1);
  const [selectedRole, setSelectedRole] = useState<"AGENT" | "AGENCY" | "">("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSessionUpdating, setIsSessionUpdating] = useState(false);
  const router = useRouter();
  const { data: session, update } = useSession();
  const user = session?.user;

  useEffect(() => {
    if (user && user.role !== "USER") {
      router.push("/agent/properties/create-property");
    }
  }, [user, router]);

  const handleUpgrade = async () => {
    if (selectedRole) {
      setIsLoading(true);
      const result = await upgradeUserRole(selectedRole);
      setIsLoading(false);
      if (result.success) {
        toast.success(`Your role has been upgraded to ${selectedRole}`);
        setStep(4); // Move to the final step

        // Sign out the user after a short delay
        setTimeout(() => {
          signOut({ callbackUrl: "/login" });
        }, 3000); // 3 second delay
      } else {
        toast.error("An error occurred while upgrading your role");
      }
    }
  };

  if (!user || isLoading || isSessionUpdating) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white">
        <Card className="w-[350px] shadow-lg">
          <CardContent className="pt-6">
            <div className="text-center">
              <Icons.spinner className="inline-block h-8 w-8 animate-spin" />
              <p className="mt-2 text-muted-foreground">
                {isSessionUpdating ? "Updating your session..." : "Loading..."}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (user.role !== "USER") {
    return null; // This will prevent any flash of content before redirect
  }

  const steps = [
    {
      title: "Welcome",
      description: "Let's get you started on African Real Estate",
    },
    {
      title: "Choose Your Role",
      description: "Select the role that best describes you",
    },
    {
      title: "Confirm",
      description: "Review and confirm your selection",
    },
    {
      title: "Success",
      description: "Your role has been updated",
    },
  ];

  const getProgressColor = () => {
    if (step === 1) return "bg-red-500";
    if (step === 2) return "bg-yellow-500";
    return "bg-green-500";
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-white">
      <Card className="w-[500px] shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            {steps[step - 1].title}
          </CardTitle>
          <CardDescription className="text-center">
            {steps[step - 1].description}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-8">
            <div className="flex justify-between mb-2">
              {steps.map((s, index) => (
                <div
                  key={index}
                  className={`w-1/4 text-xs font-medium ${
                    step > index ? "text-blue-600" : "text-gray-400"
                  }`}
                >
                  Step {index + 1}
                </div>
              ))}
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <motion.div
                className={`h-2.5 rounded-full ${getProgressColor()}`}
                initial={{ width: "0%" }}
                animate={{
                  width: `${((step - 1) / (steps.length - 1)) * 100}%`,
                }}
                transition={{ duration: 0.5 }}
              />
            </div>
          </div>

          {step === 1 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-2xl font-semibold mb-4">
                Hello, {user?.name || "User"}!
              </h2>
              <p className="mb-6 text-gray-400">
                Welcome to African Real Estate! We&apos;re excited to have you
                on board. Let&apos;s set up your account to match your needs.
              </p>
              <Button
                onClick={() => setStep(2)}
                className="w-full bg-blue-500 hover:bg-blue-600 text-white"
              >
                Get Started
              </Button>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <RadioGroup
                onValueChange={(value) =>
                  setSelectedRole(value as "AGENT" | "AGENCY")
                }
                className="space-y-4"
              >
                <div
                  className={`flex items-center space-x-2 p-4 border rounded-lg transition-colors ${
                    selectedRole === "AGENT"
                      ? "bg-green-100 border-green-500"
                      : "hover:bg-gray-50"
                  }`}
                >
                  <RadioGroupItem value="AGENT" id="agent" />
                  <Label
                    htmlFor="agent"
                    className="flex-grow cursor-pointer space-y-1"
                  >
                    <div className="font-semibold text-emerald-500">Agent</div>
                    <div className="text-sm text-gray-400">
                      Choose this if you&apos;re an individual agent looking to
                      list and manage properties.
                    </div>
                  </Label>
                  <Icons.user className="h-6 w-6 text-blue-500" />
                </div>
                <div
                  className={`flex items-center space-x-2 p-4 border rounded-lg transition-colors ${
                    selectedRole === "AGENCY"
                      ? "bg-green-100 border-green-500"
                      : "hover:bg-gray-50"
                  }`}
                >
                  <RadioGroupItem value="AGENCY" id="agency" />
                  <Label
                    htmlFor="agency"
                    className="flex-grow cursor-pointer space-y-1"
                  >
                    <div className="font-semibold text-emerald-500">Agency</div>
                    <div className="text-sm text-gray-400">
                      Choose this if you represent a company or have multiple
                      properties under your company.
                    </div>
                  </Label>
                  <Building className="h-6 w-6 text-blue-500" />
                </div>
              </RadioGroup>
              <div className="mt-6 flex justify-between">
                <Button variant="outline" onClick={() => setStep(1)}>
                  Back
                </Button>
                <Button
                  onClick={() => setStep(3)}
                  disabled={!selectedRole}
                  className="bg-blue-500 hover:bg-blue-600 text-white"
                >
                  Next
                </Button>
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h3 className="text-lg font-semibold mb-4">
                Confirm Your Selection
              </h3>
              <p className="mb-6">
                You&apos;ve selected to join as an{" "}
                <strong className="text-emerald-500 bg-emerald-50">
                  {selectedRole}
                </strong>
                . Is this correct?
              </p>
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6">
                <p className="text-sm text-gray-800">
                  <strong>Note:</strong> Your role determines your experience on
                  our platform. You can change this later, but some features may
                  be affected.
                </p>
              </div>
              <div className="flex justify-between">
                <Button variant="outline" onClick={() => setStep(2)}>
                  Back
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
            </motion.div>
          )}

          {step === 4 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              {/* <h3 className="text-lg font-semibold mb-4">
                Role Updated Successfully
              </h3> */}
              <p className="mb-6">
                Congratulations for upgrade to
                <strong className="text-emerald-500 bg-emerald-50">
                  {selectedRole}. Welcome to African Real Estate team.
                </strong>
                Please log in again to continue.
              </p>
            </motion.div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
