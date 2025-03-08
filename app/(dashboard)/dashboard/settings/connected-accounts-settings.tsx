"use client";

import { useState, useEffect } from "react";
import type { User } from "@prisma/client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertCircle, Check, ExternalLink, Loader2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { signIn } from "next-auth/react";
import Image from "next/image";

interface ConnectedAccount {
  id: string;
  provider: string;
  providerAccountId: string;
  createdAt?: Date;
}

interface ConnectedAccountsSettingsProps {
  user: User;
}

export default function ConnectedAccountsSettings({
  user,
}: ConnectedAccountsSettingsProps) {
  const [accounts, setAccounts] = useState<ConnectedAccount[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLinking, setIsLinking] = useState(false);
  const [isUnlinking, setIsUnlinking] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        const response = await fetch("/api/user/connected-accounts");
        const data = await response.json();
        setAccounts(data.accounts);
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load connected accounts",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchAccounts();
  }, [toast]);

  const handleUnlinkAccount = async (accountId: string) => {
    if (!user.password && accounts.length <= 1) {
      toast({
        title: "Cannot unlink account",
        description:
          "You need to set a password first before unlinking your only social login.",
        variant: "destructive",
      });
      return;
    }

    setIsUnlinking(accountId);
    try {
      const response = await fetch(
        `/api/user/connected-accounts/${accountId}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) throw new Error("Failed to unlink account");

      setAccounts(accounts.filter((account) => account.id !== accountId));
      toast({
        title: "Success",
        description: "Account unlinked successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to unlink account",
        variant: "destructive",
      });
    } finally {
      setIsUnlinking(null);
    }
  };

  const handleConnectAccount = async (provider: string) => {
    setIsLinking(true);
    try {
      await signIn(provider, {
        callbackUrl: `/dashboard/settings`,
        redirect: true,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: `Failed to connect ${provider} account`,
        variant: "destructive",
      });
      setIsLinking(false);
    }
  };

  const getProviderIcon = (provider: string) => {
    switch (provider.toLowerCase()) {
      case "google":
        return (
          <div className="h-6 w-6 relative">
            <Image
              src="/assets/google-logo.svg"
              alt="Google"
              width={24}
              height={24}
              className="absolute inset-0"
              unoptimized
            />
          </div>
        );
      case "github":
        return (
          <div className="h-6 w-6 relative">
            <Image
              src="/assets/github-logo.svg"
              alt="GitHub"
              width={24}
              height={24}
              className="absolute inset-0"
              unoptimized
            />
          </div>
        );
      case "facebook":
        return (
          <div className="h-6 w-6 relative">
            <Image
              src="/assets/facebook-logo.svg"
              alt="Facebook"
              width={24}
              height={24}
              className="absolute inset-0"
              unoptimized
            />
          </div>
        );
      case "twitter":
      case "x":
        return (
          <div className="h-6 w-6 relative">
            <Image
              src="/assets/x-logo.svg"
              alt="X"
              width={24}
              height={24}
              className="absolute inset-0"
              unoptimized
            />
          </div>
        );
      default:
        return <ExternalLink className="h-5 w-5" />;
    }
  };

  const getProviderName = (provider: string) => {
    if (provider.toLowerCase() === "x") return "X (Twitter)";
    return provider.charAt(0).toUpperCase() + provider.slice(1);
  };

  const hasPassword = !!user.password;
  const needsPasswordWarning = !hasPassword && accounts.length > 0;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold">Connected Accounts</h2>
        <p className="text-sm text-muted-foreground">
          Manage your connected social accounts for easy login.
        </p>
      </div>

      {needsPasswordWarning && (
        <Alert className="bg-yellow-50 border-yellow-200">
          <AlertCircle className="h-4 w-4 text-yellow-600" />
          <AlertTitle className="text-yellow-800">No password set</AlertTitle>
          <AlertDescription className="text-yellow-700">
            You&apos;re currently using social logins without a password.
            Consider setting a password for additional security.
          </AlertDescription>
        </Alert>
      )}

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
        <div className="space-y-4">
          {accounts.map((account) => (
            <Card key={account.id} className="shadow-none">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-2">
                    {getProviderIcon(account.provider)}
                    <div>
                      <CardTitle className="text-base">
                        {getProviderName(account.provider)}
                        <span className="ml-2 text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full">
                          Connected
                        </span>
                      </CardTitle>
                      <CardDescription className="text-xs">
                        Connected on{" "}
                        {account.createdAt
                          ? new Date(account.createdAt).toLocaleDateString()
                          : "unknown date"}
                      </CardDescription>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleUnlinkAccount(account.id)}
                    disabled={
                      isUnlinking === account.id ||
                      (!hasPassword && accounts.length <= 1)
                    }
                    className="text-destructive hover:text-destructive/90 hover:bg-destructive/10"
                  >
                    {isUnlinking === account.id ? (
                      <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                    ) : (
                      "Disconnect"
                    )}
                  </Button>
                </div>
              </CardHeader>
            </Card>
          ))}

          {/* Available providers to connect */}
          <Card className="shadow-none">
            <CardHeader>
              <CardTitle className="text-base">
                Connect additional accounts
              </CardTitle>
              <CardDescription>
                Link your social accounts for easier login
              </CardDescription>
            </CardHeader>
            <CardContent className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {["google", "github", "facebook", "x"].map((provider) => {
                const isConnected = accounts.some(
                  (a) => a.provider.toLowerCase() === provider
                );
                return (
                  <Button
                    key={provider}
                    variant={isConnected ? "outline" : "secondary"}
                    size="sm"
                    onClick={() =>
                      !isConnected && handleConnectAccount(provider)
                    }
                    disabled={isLinking || isConnected}
                    className={`${isConnected ? "cursor-default" : ""} flex items-center gap-2`}
                  >
                    {getProviderIcon(provider)}
                    <span>
                      {isConnected ? (
                        <span className="flex items-center">
                          <Check className="h-3 w-3 mr-1" />
                          Connected
                        </span>
                      ) : (
                        `Connect with ${getProviderName(provider)}`
                      )}
                    </span>
                  </Button>
                );
              })}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
