"use client";

import { useState } from "react";
import { useTransition } from "react";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MoreVertical, SquarePen, Trash2, CalendarIcon } from "lucide-react";
import IconMenu from "@/components/globals/icon-menu";
import { toggleUserBlock, suspendUser, unsuspendUser } from "./user-management";
import { User, UserRole } from "@prisma/client";
import { updateUserRole } from "./updateUserRole";
import { toast } from "sonner";

interface UserActionsProps {
  user: {
    id: string;
    role: UserRole;
  };
}

export default function UserActions({ user }: { user: User }) {
  const [isPending, startTransition] = useTransition();
  const [showSuspendCalendar, setShowSuspendCalendar] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const handleRoleChange = async (newRole: UserRole) => {
    setIsUpdating(true);
    const result = await updateUserRole(user.id, newRole);
    setIsUpdating(false);

    if (result.success) {
      toast.success(`User role has been updated to ${newRole}`);
    } else {
      toast.error(result.error || "Failed to update user role");
    }
  };

  const handleToggleBlock = () => {
    startTransition(() => toggleUserBlock(user.id));
  };

  const handleSuspendUser = (date: Date) => {
    startTransition(() => suspendUser(user.id, date));
    setShowSuspendCalendar(false);
  };

  const handleUnsuspendUser = () => {
    startTransition(() => unsuspendUser(user.id));
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="flex size-8 p-0 data-[state=open]:bg-muted"
        >
          <MoreVertical className="size-4" />
          <span className="sr-only">Open menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[200px] z-50">
        <DropdownMenuItem className="cursor-pointer">
          <IconMenu text="Edit" icon={<SquarePen className="size-4" />} />
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <Select
            disabled={isUpdating}
            onValueChange={(value) => handleRoleChange(value as UserRole)}
            defaultValue={user.role}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="USER">User</SelectItem>
              <SelectItem value="AGENT">Agent</SelectItem>
              <SelectItem value="AGENCY">Agency</SelectItem>
              <SelectItem value="ADMIN">Admin</SelectItem>
              <SelectItem value="SUPPORT">Support</SelectItem>
            </SelectContent>
          </Select>
        </DropdownMenuItem>
        <DropdownMenuItem
          className="cursor-pointer text-red-500"
          onClick={handleToggleBlock}
        >
          <IconMenu
            text={user.isActive ? "Block user" : "Unblock user"}
            icon={<Trash2 className="size-4" />}
          />
        </DropdownMenuItem>
        {user.suspensionEndDate ? (
          <DropdownMenuItem
            className="cursor-pointer text-orange-500"
            onClick={handleUnsuspendUser}
          >
            <IconMenu
              text="Unsuspend user"
              icon={<CalendarIcon className="size-4" />}
            />
          </DropdownMenuItem>
        ) : (
          <DropdownMenuItem
            className="cursor-pointer text-orange-500"
            onClick={() => setShowSuspendCalendar(true)}
          >
            <IconMenu
              text="Suspend user"
              icon={<CalendarIcon className="size-4" />}
            />
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
      {showSuspendCalendar && (
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline">Select suspension end date</Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={new Date()}
              onSelect={(date) => date && handleSuspendUser(date)}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      )}
    </DropdownMenu>
  );
}
