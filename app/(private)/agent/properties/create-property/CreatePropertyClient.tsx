"use client";

import { useState } from "react";
import { AlertCircle, ArrowRight } from "lucide-react";
import PropertiesForm from "@/components/properties/properties-form";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import RoleUpgradeModal from "./RoleUpgradeModal";

interface CreatePropertyClientProps {
  showForm: boolean;
  errorMessage: string;
  userRole: string;
  initialValues: any;
}

export default function CreatePropertyClient({
  showForm,
  errorMessage,
  userRole,
  initialValues,
}: CreatePropertyClientProps) {
  const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false);

  return (
    <>
      {showForm ? (
        <PropertiesForm initialValues={initialValues} />
      ) : (
        <Card className="w-full max-w-md mx-auto">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center">
              Property Limit Reached
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Attention</AlertTitle>
              <AlertDescription>{errorMessage}</AlertDescription>
            </Alert>
            <p className="text-center text-muted-foreground">
              To continue adding properties, you need to upgrade your account.
            </p>
          </CardContent>
          <CardFooter className="flex justify-center">
            {userRole === "AGENT" && (
              <Button
                onClick={() => setIsUpgradeModalOpen(true)}
                className="w-full"
              >
                Upgrade to Agency <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            )}
          </CardFooter>
        </Card>
      )}

      <RoleUpgradeModal
        isOpen={isUpgradeModalOpen}
        onClose={() => setIsUpgradeModalOpen(false)}
      />
    </>
  );
}
