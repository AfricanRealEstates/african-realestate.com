"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Optionally log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="text-center space-y-4 max-w-md">
        <AlertCircle className="mx-auto h-12 w-12 text-destructive" />
        <h1 className="text-2xl font-bold tracking-tight">
          Something went wrong!
        </h1>
        <p className="text-muted-foreground">
          We apologize for the inconvenience. Our team has been notified and is
          working to fix the issue.
        </p>
        <div className="flex justify-center gap-4">
          <Button onClick={() => reset()}>Try again</Button>
          <Button
            variant="outline"
            onClick={() => (window.location.href = "/")}
          >
            Return home
          </Button>
        </div>
      </div>
    </div>
  );
}
