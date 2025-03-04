"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useRouter } from "next/navigation";

type SupportUser = {
  id: string;
  name: string | null;
  email: string | null;
  permissions: string[];
  isActive: boolean;
};

export function ViewSupportUserDetails({ user }: { user: SupportUser }) {
  const router = useRouter();

  return (
    <Card>
      <CardHeader>
        <CardTitle>{user.name}</CardTitle>
        <CardDescription>{user.email}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-2">
              Status
            </h3>
            <Badge variant={user.isActive ? "outline" : "destructive"}>
              {user.isActive ? "Active" : "Inactive"}
            </Badge>
          </div>

          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-2">
              Permissions
            </h3>
            <div className="flex flex-wrap gap-2">
              {user.permissions.map((permission) => (
                <Badge key={permission} variant="secondary">
                  {permission}
                </Badge>
              ))}
            </div>
          </div>
        </div>

        <Button
          variant="outline"
          onClick={() => router.push("/dashboard/support")}
          className="w-full"
        >
          Back to Support Dashboard
        </Button>
      </CardContent>
    </Card>
  );
}
