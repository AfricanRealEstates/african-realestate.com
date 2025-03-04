"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { updateUserPermissions } from "../../actions";
import { AVAILABLE_PERMISSIONS } from "../../permissions-config";

type SupportUser = {
  id: string;
  name: string | null;
  email: string | null;
  permissions: string[];
  isActive: boolean;
};

export function UserPermissionsForm({ user }: { user: SupportUser }) {
  const [permissions, setPermissions] = useState<string[]>(user.permissions);
  const [isSaving, setIsSaving] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const handlePermissionChange = (permission: string, checked: boolean) => {
    if (checked) {
      setPermissions([...permissions, permission]);
    } else {
      setPermissions(permissions.filter((p) => p !== permission));
    }
  };

  const handleSavePermissions = async () => {
    setIsSaving(true);
    try {
      await updateUserPermissions(user.id, permissions);

      toast({
        title: "Success",
        description: "Permissions updated successfully",
      });
      router.refresh();
      router.push("/dashboard/support");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update permissions",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>User Permissions</CardTitle>
        <CardDescription>Manage what this support user can do</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {AVAILABLE_PERMISSIONS.map((permission) => (
            <div
              key={permission.value}
              className="flex items-start space-x-3 space-y-0 rounded-md border p-4"
            >
              <Checkbox
                id={`permission-${permission.value}`}
                checked={permissions.includes(permission.value)}
                onCheckedChange={(checked) =>
                  handlePermissionChange(permission.value, checked === true)
                }
              />
              <div className="space-y-1 leading-none">
                <Label
                  htmlFor={`permission-${permission.value}`}
                  className="text-sm font-medium"
                >
                  {permission.label}
                </Label>
                <p className="text-xs text-muted-foreground">
                  {permission.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-between">
          <Button
            variant="outline"
            onClick={() => router.push("/dashboard/support")}
          >
            Cancel
          </Button>
          <Button onClick={handleSavePermissions} disabled={isSaving}>
            {isSaving ? "Saving..." : "Save Permissions"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
