"use client";
import { deleteProduct, togglePublished } from "@/actions/blog";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { useRouter } from "next/navigation";
import { startTransition, useTransition } from "react";

export function ActiveToggleDropdownItem({
  id,
  published,
}: {
  id: string;
  published?: boolean;
}) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  return (
    <DropdownMenuItem
      disabled={isPending}
      onClick={() => {
        startTransition(async () => {
          await togglePublished(id, !published);
          router.refresh();
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
  const router = useRouter();
  return (
    <DropdownMenuItem
      variant="destructive"
      disabled={disabled || isPending}
      onClick={() => {
        startTransition(async () => {
          await deleteProduct(id);
          router.refresh();
        });
      }}
    >
      Delete
    </DropdownMenuItem>
  );
}

// Disabled
