"use client";

import { useState, useEffect } from "react";
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
import {
  Laptop,
  Smartphone,
  Globe,
  Clock,
  LogOut,
  MapPin,
  Calendar,
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { revokeSession } from "./actions";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface Session {
  id: string;
  sessionToken: string;
  expires: Date;
  userAgent?: string;
  deviceType?: string;
  browser?: string;
  os?: string;
  ipAddress?: string;
  lastActive?: Date;
  createdAt?: Date;
  isCurrentSession?: boolean;
  location?: {
    country?: string;
    city?: string;
    region?: string;
  };
  duration?: string;
  formattedLastActive?: string;
}

interface SessionsSettingsProps {
  user: User;
}

export default function SessionsSettings({ user }: SessionsSettingsProps) {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        const response = await fetch("/api/user/sessions");
        const data = await response.json();
        setSessions(data.sessions);
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load sessions",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchSessions();
  }, [toast]);

  const handleRevokeSession = async (sessionId: string) => {
    try {
      await revokeSession(sessionId);
      setSessions(sessions.filter((session) => session.id !== sessionId));
      toast({
        title: "Success",
        description: "Session revoked successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to revoke session",
        variant: "destructive",
      });
    }
  };

  const handleRevokeAllOtherSessions = async () => {
    try {
      await fetch("/api/user/sessions/revoke-all", {
        method: "POST",
      });
      setSessions(sessions.filter((session) => session.isCurrentSession));
      toast({
        title: "Success",
        description: "All other sessions revoked successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to revoke sessions",
        variant: "destructive",
      });
    }
  };

  const getDeviceIcon = (deviceType?: string) => {
    if (!deviceType || deviceType === "desktop") {
      return <Laptop className="h-5 w-5" />;
    }

    if (
      deviceType.toLowerCase().includes("mobile") ||
      deviceType === "mobile"
    ) {
      return <Smartphone className="h-5 w-5" />;
    }

    return <Globe className="h-5 w-5" />;
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold">Active Sessions</h2>
        <p className="text-sm text-muted-foreground">
          Manage your active sessions across devices. You can revoke access for
          any suspicious sessions.
        </p>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {[1, 2].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader className="bg-muted/40 h-20"></CardHeader>
              <CardContent className="bg-muted/20 h-16 mt-2"></CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <>
          <div className="grid gap-4">
            {sessions.map((session) => (
              <Card
                key={session.id}
                className={session.isCurrentSession ? "border-blue-500" : ""}
              >
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-2">
                      {getDeviceIcon(session.deviceType)}
                      <div>
                        <CardTitle className="text-base flex items-center gap-2">
                          {session.deviceType || "Unknown Device"}
                          {session.isCurrentSession && (
                            <Badge variant="default" className="bg-blue-500">
                              Current
                            </Badge>
                          )}
                        </CardTitle>
                        <CardDescription className="text-xs">
                          {session.browser || "Unknown"} on{" "}
                          {session.os || "Unknown OS"}
                        </CardDescription>
                      </div>
                    </div>
                    {!session.isCurrentSession && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRevokeSession(session.id)}
                        className="text-destructive hover:text-destructive/90 hover:bg-destructive/10"
                      >
                        <LogOut className="h-4 w-4 mr-1" />
                        Revoke
                      </Button>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Clock className="h-4 w-4 mr-1" />
                    <span>
                      {session.formattedLastActive
                        ? `Last active: ${session.formattedLastActive}`
                        : `Expires: ${new Date(session.expires).toLocaleString()}`}
                    </span>
                  </div>

                  {session.location && (
                    <div className="flex items-center text-sm text-muted-foreground">
                      <MapPin className="h-4 w-4 mr-1" />
                      <span>
                        {[
                          session.location.city,
                          session.location.region,
                          session.location.country,
                        ]
                          .filter(Boolean)
                          .join(", ")}
                      </span>
                    </div>
                  )}

                  {session.createdAt && (
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4 mr-1" />
                      <span>
                        Created:{" "}
                        {new Date(session.createdAt).toLocaleDateString()}
                        {session.duration && ` (${session.duration})`}
                      </span>
                    </div>
                  )}

                  {session.ipAddress && (
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div className="text-xs text-muted-foreground cursor-help underline decoration-dotted">
                            IP information available
                          </div>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>IP: {session.ipAddress}</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>

          <Card className="border-muted shadow-none">
            <CardHeader>
              <CardTitle className="text-base">
                Sign out of all other sessions
              </CardTitle>
              <CardDescription>
                This will sign you out from all devices except your current one.
              </CardDescription>
            </CardHeader>
            <CardFooter>
              <Button
                variant="destructive"
                onClick={handleRevokeAllOtherSessions}
                disabled={
                  sessions.filter((s) => !s.isCurrentSession).length === 0
                }
              >
                Sign out all other sessions
              </Button>
            </CardFooter>
          </Card>
        </>
      )}
    </div>
  );
}
