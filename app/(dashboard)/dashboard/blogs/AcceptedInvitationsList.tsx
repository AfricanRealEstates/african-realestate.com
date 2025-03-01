"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { revokeInvitation } from "./actions";
import { toast } from "sonner";

type Invitation = {
  id: string;
  email: string;
  acceptedAt: Date | undefined | null;
  user: {
    name: string | null;
  } | null;
};

export function AcceptedInvitationsList({
  invitations,
}: {
  invitations: Invitation[];
}) {
  const [localInvitations, setLocalInvitations] = useState(invitations);

  const handleRevoke = async (id: string) => {
    try {
      await revokeInvitation(id);
      setLocalInvitations((prev) =>
        prev.filter((invitation) => invitation.id !== id)
      );
      toast.success("Invitation revoked successfully");
    } catch (error) {
      console.error("Failed to revoke invitation:", error);
      toast.error("Failed to revoke invitation");
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Accepted Invitations</h2>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Email</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Accepted At</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {localInvitations.map((invitation) => (
            <TableRow key={invitation.id}>
              <TableCell>{invitation.email}</TableCell>
              <TableCell>{invitation.user?.name || "N/A"}</TableCell>
              <TableCell>
                {invitation.acceptedAt
                  ? new Date(invitation.acceptedAt).toLocaleString()
                  : "Pending"}
              </TableCell>
              <TableCell>
                <Button
                  variant="destructive"
                  onClick={() => handleRevoke(invitation.id)}
                >
                  Revoke
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
