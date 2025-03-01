"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { getPendingInvitations, resendInvitation } from "./actions";
import { toast } from "sonner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatDistanceToNow } from "date-fns";

type Invitation = {
  id: string;
  email: string;
  createdAt: Date;
  expiresAt: Date;
};

export function PendingInvitationsList() {
  const [invitations, setInvitations] = useState<Invitation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [resendingId, setResendingId] = useState<string | null>(null);

  useEffect(() => {
    async function loadInvitations() {
      try {
        const data = await getPendingInvitations();
        setInvitations(data);
      } catch (error) {
        console.error("Failed to load invitations:", error);
        toast.error("Failed to load pending invitations");
      } finally {
        setIsLoading(false);
      }
    }

    loadInvitations();
  }, []);

  const handleResend = async (id: string, email: string) => {
    setResendingId(id);
    try {
      await resendInvitation(email);
      toast.success("Invitation resent successfully");
    } catch (error) {
      console.error("Failed to resend invitation:", error);
      toast.error("Failed to resend invitation");
    } finally {
      setResendingId(null);
    }
  };

  if (isLoading) {
    return (
      <div className="py-4 text-center">Loading pending invitations...</div>
    );
  }

  if (invitations.length === 0) {
    return <div className="py-4 text-center">No pending invitations</div>;
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Email</TableHead>
          <TableHead>Sent</TableHead>
          <TableHead>Expires</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {invitations.map((invitation) => (
          <TableRow key={invitation.id}>
            <TableCell>{invitation.email}</TableCell>
            <TableCell>
              {formatDistanceToNow(new Date(invitation.createdAt), {
                addSuffix: true,
              })}
            </TableCell>
            <TableCell>
              {formatDistanceToNow(new Date(invitation.expiresAt), {
                addSuffix: true,
              })}
            </TableCell>
            <TableCell className="text-right">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleResend(invitation.id, invitation.email)}
                disabled={resendingId === invitation.id}
              >
                {resendingId === invitation.id ? "Sending..." : "Resend"}
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
