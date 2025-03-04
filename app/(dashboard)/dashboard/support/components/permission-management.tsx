"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { getSupportUsers, updateUserPermissions } from "../actions";
import { AVAILABLE_PERMISSIONS } from "../permissions-config";

export function PermissionManagement() {
  const [users, setUsers] = useState<any[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<string>("");
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [permissions, setPermissions] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const supportUsers = await getSupportUsers();
        setUsers(supportUsers);
        setIsLoading(false);
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load support users",
          variant: "destructive",
        });
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, [toast]);

  useEffect(() => {
    if (selectedUserId) {
      const user = users.find((user) => user.id === selectedUserId);
      setSelectedUser(user);
      setPermissions(user?.permissions || []);
    } else {
      setSelectedUser(null);
      setPermissions([]);
    }
  }, [selectedUserId, users]);

  const handlePermissionChange = (permission: string, checked: boolean) => {
    if (checked) {
      setPermissions([...permissions, permission]);
    } else {
      setPermissions(permissions.filter((p) => p !== permission));
    }
  };

  const handleSavePermissions = async () => {
    if (!selectedUserId) return;

    setIsSaving(true);
    try {
      await updateUserPermissions(selectedUserId, permissions);

      // Update local state
      setUsers(
        users.map((user) =>
          user.id === selectedUserId ? { ...user, permissions } : user
        )
      );

      toast({
        title: "Success",
        description: "Permissions updated successfully",
      });
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
        <CardTitle>Manage Permissions</CardTitle>
        <CardDescription>
          Assign or revoke permissions for support users
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="user-select">Select Support User</Label>
          <Select
            value={selectedUserId}
            onValueChange={setSelectedUserId}
            disabled={isLoading}
          >
            <SelectTrigger id="user-select">
              <SelectValue placeholder="Select a user" />
            </SelectTrigger>
            <SelectContent>
              {users.map((user) => (
                <SelectItem key={user.id} value={user.id}>
                  {user.name} ({user.email})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {selectedUser && (
          <>
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

            <Button
              onClick={handleSavePermissions}
              disabled={isSaving}
              className="w-full"
            >
              {isSaving ? "Saving..." : "Save Permissions"}
            </Button>
          </>
        )}
      </CardContent>
    </Card>
  );
}
