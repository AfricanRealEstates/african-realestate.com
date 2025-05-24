// "use client";

// import { SessionProvider } from "next-auth/react";

// export default function Provider({
//   children,
//   session,
// }: {
//   children: React.ReactNode;
//   session: any;
// }): React.ReactNode {
//   return <SessionProvider session={session}>{children}</SessionProvider>;
// }

"use client";

import type React from "react";

import { SessionProvider as NextAuthSessionProvider } from "next-auth/react";
import { createContext, useContext, useEffect, useState } from "react";
import type { Session } from "next-auth";

interface SessionContextType {
  session: Session | null;
  updateSession: (updates: Partial<Session["user"]>) => Promise<void>;
  refreshSession: () => Promise<void>;
  isLoading: boolean;
}

const SessionContext = createContext<SessionContextType | undefined>(undefined);

export function useGlobalSession() {
  const context = useContext(SessionContext);
  if (!context) {
    throw new Error("useGlobalSession must be used within SessionProvider");
  }
  return context;
}

interface SessionProviderProps {
  children: React.ReactNode;
  session: Session | null;
}

export function SessionProvider({
  children,
  session: initialSession,
}: SessionProviderProps) {
  const [session, setSession] = useState<Session | null>(initialSession);
  const [isLoading, setIsLoading] = useState(false);

  // Listen for session updates from other tabs/windows
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "session-update") {
        refreshSession();
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const updateSession = async (updates: Partial<Session["user"]>) => {
    if (!session?.user) return;

    setIsLoading(true);
    try {
      // Update local state immediately for optimistic UI
      const updatedSession = {
        ...session,
        user: {
          ...session.user,
          ...updates,
        },
      };
      setSession(updatedSession);

      // Trigger storage event for other tabs
      localStorage.setItem("session-update", Date.now().toString());

      // Force a session refresh from the server
      await refreshSession();
    } catch (error) {
      console.error("Failed to update session:", error);
      // Revert optimistic update on error
      setSession(session);
    } finally {
      setIsLoading(false);
    }
  };

  const refreshSession = async () => {
    setIsLoading(true);
    try {
      // Fetch fresh session from the server
      const response = await fetch("/api/auth/session");
      if (response.ok) {
        const freshSession = await response.json();
        setSession(freshSession);
      }
    } catch (error) {
      console.error("Failed to refresh session:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <NextAuthSessionProvider session={session}>
      <SessionContext.Provider
        value={{
          session,
          updateSession,
          refreshSession,
          isLoading,
        }}
      >
        {children}
      </SessionContext.Provider>
    </NextAuthSessionProvider>
  );
}
