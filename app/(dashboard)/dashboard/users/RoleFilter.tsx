"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Filter } from "lucide-react";
import { UserRole } from "@prisma/client";

const roles = [
  { label: "User", value: UserRole.USER },
  { label: "Agent", value: UserRole.AGENT },
  { label: "Agency", value: UserRole.AGENCY },
  { label: "Admin", value: UserRole.ADMIN },
  { label: "Support", value: UserRole.SUPPORT },
];

export default function RoleFilter({ roleFilter }: { roleFilter?: UserRole }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const createQueryString = (name: string, value: string | null) => {
    const params = new URLSearchParams(searchParams.toString());

    if (value === null) {
      params.delete(name);
    } else {
      params.set(name, value);
    }

    // Reset to page 1 when filter changes
    params.delete("page");

    return params.toString();
  };

  const handleRoleFilter = (role: UserRole | null) => {
    router.push(`${pathname}?${createQueryString("role", role)}`);
  };

  const getRoleLabel = (role?: UserRole) => {
    if (!role) return "All Roles";
    const foundRole = roles.find((r) => r.value === role);
    return foundRole ? foundRole.label : "All Roles";
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2">
          <Filter className="h-4 w-4" />
          {getRoleLabel(roleFilter)}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[200px]">
        <DropdownMenuLabel>Filter by role</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => handleRoleFilter(null)}>
          All Roles
        </DropdownMenuItem>
        {roles.map((role) => (
          <DropdownMenuItem
            key={role.value}
            onClick={() => handleRoleFilter(role.value)}
            className="capitalize"
          >
            {role.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
