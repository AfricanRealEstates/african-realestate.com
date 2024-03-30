"use client";
import { deleteProduct, togglePublished } from "@/actions/blog";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { startTransition, useTransition } from "react";

export function ActiveToggleDropdownItem({
  id,
  published,
}: {
  id: string;
  published?: boolean;
}) {
  const [isPending, startTransition] = useTransition();
  return (
    <DropdownMenuItem
      disabled={isPending}
      onClick={() => {
        startTransition(async () => {
          await togglePublished(id, !published);
        });
      }}
    >
      {published ? "Unpublish" : "Publish"}
    </DropdownMenuItem>
  );
}
export function DeleteDropdownItem({
  id,
  disabled,
}: {
  id: string;
  disabled?: boolean;
}) {
  const [isPending, startTransition] = useTransition();
  return (
    <DropdownMenuItem
      disabled={disabled || isPending}
      onClick={() => {
        startTransition(async () => {
          await deleteProduct(id);
        });
      }}
    >
      Delete
    </DropdownMenuItem>
  );
}

// Disabled
