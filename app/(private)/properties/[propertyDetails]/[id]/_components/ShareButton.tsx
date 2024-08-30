"use client";

import { Link, Send } from "lucide-react";
import { toast } from "sonner";
import ActionIcon from "./ActionIcon";
import { PropertyWithExtras } from "@/lib/types";

function ShareButton({
  propertyId,
  property,
}: {
  propertyId: string;
  property?: PropertyWithExtras;
}) {
  return (
    <ActionIcon
      onClick={() => {
        navigator.clipboard.writeText(
          `${window.location.origin}/properties/${property?.propertyDetails}/${propertyId}`
        );
        toast("Link copied to clipboard", {
          icon: <Link className={"h-5 w-5"} />,
        });
      }}
    >
      <Send className={"h-6 w-6"} />
    </ActionIcon>
  );
}

export default ShareButton;
