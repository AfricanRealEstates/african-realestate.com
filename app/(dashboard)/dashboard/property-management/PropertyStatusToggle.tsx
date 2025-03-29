"use client";
import { Button } from "@/components/ui/button";
import { togglePropertyStatus } from "./actions";
import { Eye, EyeOff } from "lucide-react";

// Client component for the status toggle button
export default function PropertyStatusToggle({
  propertyId,
  isActive,
}: {
  propertyId: string;
  isActive: boolean;
}) {
  return (
    <form
      action={async () => {
        await togglePropertyStatus(propertyId);
      }}
    >
      <Button
        type="submit"
        size="icon"
        variant="ghost"
        className={isActive ? "text-green-500" : "text-red-500"}
      >
        {isActive ? (
          <Eye className="h-4 w-4" />
        ) : (
          <EyeOff className="h-4 w-4" />
        )}
      </Button>
    </form>
  );
}
