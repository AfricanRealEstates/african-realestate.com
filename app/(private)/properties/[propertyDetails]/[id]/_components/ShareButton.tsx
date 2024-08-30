"use client";

import { Link, Send, Share } from "lucide-react";
import { toast } from "sonner";
import ActionIcon from "./ActionIcon";
import { PropertyWithExtras } from "@/lib/types";

function ShareButton({
  propertyId,
  property,
}: {
  propertyId: string;
  property: PropertyWithExtras;
}) {
  return (
    <ActionIcon
      onClick={() => {
        navigator.clipboard.writeText(
          `${window.location.origin}/properties/${property.propertyDetails}/${propertyId}`
        );
        toast.success("Link copied to clipboard. Share now!", {
          icon: <Link className={"h-5 w-5"} />,
        });
      }}
    >
      <Share className={"size-5 text-gray-400"} />
    </ActionIcon>
  );
}

export default ShareButton;
