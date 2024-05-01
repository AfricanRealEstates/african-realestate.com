"use client";
import React, { useState } from "react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { deleteProfile } from "@/actions/delete-profile";

interface DeleteAccountProps {
  trigger: React.ReactNode;
  email: string | null | undefined;
}

export default function DeleteAccount({ trigger, email }: DeleteAccountProps) {
  const [confirmEmail, setConfirmEmail] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const handleDeleteAccount = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (confirmEmail !== email) {
      toast.error("Email does not match.");
      return;
    }

    setLoading(true);
    toast.promise(deleteProfile, {
      loading: "Deleting account...",
      description: "Your account is being deleted.",
      success: () => {
        setLoading(false);
        return "Your account has been deleted.";
      },
      error: "Failed to delete account. Please try again or contact us.",
    });
  };
  return (
    <Dialog>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Account</DialogTitle>
          <DialogDescription>
            <span className="text-red-500">This action cannot be undone</span>
            This will permanenly delete your account and remove all links from
            our servers.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleDeleteAccount}>
          <div className="flex flex-col space-y-3">
            <p className="text-sm">
              To confirm, please type your email address
            </p>
            <span className="font-mono">{email}</span>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
