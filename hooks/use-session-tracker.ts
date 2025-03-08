"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";

export function useSessionTracker() {
  const { status } = useSession();
  const pathname = usePathname();

  useEffect(() => {
    // Only track for authenticated users
    if (status !== "authenticated") return;

    // Update session metadata
    const updateSessionMetadata = async () => {
      try {
        await fetch("/api/user/session-update", {
          method: "POST",
        });
      } catch (error) {
        console.error("Failed to update session metadata:", error);
      }
    };

    // Update on important page changes
    updateSessionMetadata();

    // Set up interval to update periodically (e.g., every 5 minutes)
    const interval = setInterval(updateSessionMetadata, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, [status, pathname]);
}
