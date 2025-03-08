"use client";

import { useState } from "react";
import type { User } from "@prisma/client";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Loader2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";

interface DangerZoneSettingsProps {
  user: User;
}

export default function DangerZoneSettings({ user }: DangerZoneSettingsProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [confirmation, setConfirmation] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  const handleDeleteAccount = async () => {
    if (confirmation !== user.email) {
      toast({
        title: "Error",
        description: "Email confirmation doesn't match",
        variant: "destructive",
      });
      return;
    }

    setIsDeleting(true);
    try {
      const response = await fetch("/api/user/delete-account", {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to delete account");

      toast({
        title: "Account deleted",
        description: "Your account has been successfully deleted",
      });

      // Sign out and redirect to home page
      router.push("/api/auth/signout?callbackUrl=/");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete account",
        variant: "destructive",
      });
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold">Danger Zone</h2>
        <p className="text-sm text-muted-foreground">
          Irreversible and destructive actions for your account.
        </p>
      </div>

      <Card className="border-destructive/50 shadow-none">
        <CardHeader className="pb-2 border-b border-destructive/20">
          <CardTitle className="text-base text-destructive flex items-center">
            <AlertTriangle className="h-5 w-5 mr-2" />
            Delete Account
          </CardTitle>
          <CardDescription>
            Permanently delete your account and all associated data.
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-4">
          <p className="text-sm text-muted-foreground">
            This action cannot be undone. This will permanently delete your
            account and remove all your data from our servers, including:
          </p>
          <ul className="list-disc list-inside mt-2 text-sm text-muted-foreground">
            <li>Your profile information</li>
            <li>All properties you&apos;ve created</li>
            <li>Comments, likes, and other interactions</li>
            <li>Saved properties and preferences</li>
          </ul>
        </CardContent>
        <CardFooter className="pt-2">
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="destructive">Delete Account</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle className="text-destructive flex items-center">
                  <AlertTriangle className="h-5 w-5 mr-2" />
                  Delete Account
                </DialogTitle>
                <DialogDescription>
                  This action cannot be undone. Your account and all associated
                  data will be permanently deleted.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-2">
                <div className="space-y-2">
                  <Label htmlFor="confirmation">
                    Please type{" "}
                    <span className="font-semibold">{user.email}</span> to
                    confirm:
                  </Label>
                  <Input
                    id="confirmation"
                    value={confirmation}
                    onChange={(e) => setConfirmation(e.target.value)}
                    placeholder={user.email!}
                    className="border-destructive/50 focus-visible:ring-destructive/30"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setIsDialogOpen(false)}
                  disabled={isDeleting}
                >
                  Cancel
                </Button>
                <Button
                  variant="destructive"
                  onClick={handleDeleteAccount}
                  disabled={confirmation !== user.email || isDeleting}
                >
                  {isDeleting ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Deleting...
                    </>
                  ) : (
                    "Delete Account"
                  )}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </CardFooter>
      </Card>
    </div>
  );
}
