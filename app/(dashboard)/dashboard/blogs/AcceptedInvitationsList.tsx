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
      <h2 className="text-xl sm:text-2xl font-bold mb-4">
        Accepted Invitations
      </h2>

      {/* Mobile card view (visible on small screens) */}
      <div className="md:hidden space-y-4">
        {localInvitations.map((invitation) => (
          <div key={invitation.id} className="border rounded-md p-4 space-y-2">
            <div className="grid grid-cols-2 gap-1">
              <span className="font-medium">Email:</span>
              <span className="break-words overflow-hidden">
                {invitation.email}
              </span>

              <span className="font-medium">Name:</span>
              <span className="break-words overflow-hidden">
                {invitation.user?.name || "N/A"}
              </span>

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
              <TableHead className="w-[40%]">Email</TableHead>
              <TableHead className="w-[25%]">Name</TableHead>
              <TableHead className="w-[25%]">Accepted At</TableHead>
              <TableHead className="w-[10%]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {localInvitations.map((invitation) => (
              <TableRow key={invitation.id}>
                <TableCell className="max-w-[250px] break-words">
                  <div className="truncate" title={invitation.email}>
                    {invitation.email}
                  </div>
                </TableCell>
                <TableCell className="max-w-[150px] break-words">
                  <div
                    className="truncate"
                    title={invitation.user?.name || "N/A"}
                  >
                    {invitation.user?.name || "N/A"}
                  </div>
                </TableCell>
                <TableCell>
                  {invitation.acceptedAt
                    ? new Date(invitation.acceptedAt).toLocaleString()
                    : "Pending"}
                </TableCell>
                <TableCell>
                  <Button
                    variant="destructive"
                    size="sm"
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
