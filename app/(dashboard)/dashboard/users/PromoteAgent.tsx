"use client";

import { promoteUsersToAgents } from "@/actions/promote-users-to-agents";
import { useSession } from "next-auth/react";
import React, { useState, useEffect } from "react";
import { toast } from "sonner";

export default function PromoteUsersWidget() {
  const [loading, setLoading] = useState(false);
  const [promoted, setPromoted] = useState(false);
  const { data: session } = useSession();
  const user = session?.user;

  useEffect(() => {
    // Optional: You can fetch whether a user is already an agent or not
    // and disable the button accordingly. Example:
    if (user?.role === "AGENT") {
      setPromoted(true);
    }
  }, [user]);

  const handlePromoteUsers = async () => {
    if (!user) {
      toast.error("You must be logged in to promote users.");
      return;
    }

    setLoading(true);

    try {
      const response = await promoteUsersToAgents();

      if (response.message === "Users promoted successfully") {
        setPromoted(true);
        toast.success("Users have been promoted to agents!");
      } else {
        toast.error(response.message || "Failed to promote users.");
      }
    } catch (error) {
      toast.error("An error occurred while promoting users.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <button
        onClick={handlePromoteUsers}
        disabled={loading || promoted}
        className="px-4 py-2 bg-blue-500 text-white rounded-md"
      >
        {loading
          ? "Promoting..."
          : promoted
          ? "Already Promoted"
          : "Promote Users to Agents"}
      </button>
    </div>
  );
}
