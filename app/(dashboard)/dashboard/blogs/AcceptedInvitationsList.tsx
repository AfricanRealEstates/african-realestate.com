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

      {/* Mobile card view (visible on small screens) */}
      <div className="md:hidden space-y-4">
        {localInvitations.map((invitation) => (
          <div key={invitation.id} className="border rounded-md p-4 space-y-2">
            <div className="grid grid-cols-2 gap-1">
              <span className="font-medium">Email:</span>
              <span>{invitation.email}</span>

              <span className="font-medium">Name:</span>
              <span>{invitation.user?.name || "N/A"}</span>

              <span className="font-medium">Accepted At:</span>
              <span>
                {invitation.acceptedAt
                  ? new Date(invitation.acceptedAt).toLocaleString()
                  : "Pending"}
              </span>
            </div>
            <Button
              variant="destructive"
              size="sm"
              className="w-full mt-2"
              onClick={() => handleRevoke(invitation.id)}
            >
              Revoke
            </Button>
          </div>
        ))}
      </div>

      {/* Table view (visible on medium screens and up) */}
      <div className="hidden md:block overflow-x-auto">
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

      {localInvitations.length === 0 && (
        <p className="text-center text-muted-foreground py-4">
          No accepted invitations found.
        </p>
      )}
    </div>
  );
}
