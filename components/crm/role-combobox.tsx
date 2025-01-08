import React from "react";

export default function RoleCombobox() {
  return <div>RoleCombobox</div>;
}

// "use client";
// import * as React from "react";
// import { Button } from "@/components/ui/button";
// import {
//   Command,
//   CommandEmpty,
//   CommandGroup,
//   CommandInput,
//   CommandItem,
//   CommandList,
// } from "@/components/ui/command";
// import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
// import {
//   Popover,
//   PopoverContent,
//   PopoverTrigger,
// } from "@/components/ui/popover";
// import { useMediaQuery } from "@/hooks/use-media-query";
// import { UserRole } from "@prisma/client";
// import { updateUserRole } from "@/app/onboarding/_actions/userRole";
// import { toast } from "sonner";
// import { useMutation, useQuery } from "@tanstack/react-query";
// import SkeletonWrapper from "../globals/skeleton-wrapper";

// export function RoleComboBox() {
//   const [open, setOpen] = React.useState(false);
//   const isDesktop = useMediaQuery("(min-width: 768px)");
//   const [selectedRole, setSelectedRole] = React.useState<UserRole | null>(null);

//   const userRole = useQuery<UserRole>({
//     queryKey: ["userRole"],
//     queryFn: () => fetch("/api/role-settings").then((res) => res.json()),
//   });

//   React.useEffect(() => {
//     if (!userRole.data) return;
//     setSelectedRole(userRole.data as UserRole);
//   }, [userRole]);

//   const mutation = useMutation({
//     mutationFn: updateUserRole,
//   });

//   const selectRole = React.useCallback(
//     (role: UserRole | null) => {
//       if (!role) {
//         toast.error("Please select an Agent Role");
//         return;
//       }
//       toast.loading("Updating Agent Role...", {
//         id: "update-currency",
//       });

//       mutation.mutate(UserRole.AGENT);
//     },
//     [mutation]
//   );

//   if (isDesktop) {
//     return (
//       <SkeletonWrapper isLoading={userRole.isFetching}>
//         <Popover open={open} onOpenChange={setOpen}>
//           <PopoverTrigger asChild>
//             <Button
//               variant="outline"
//               className="w-full justify-start"
//               disabled={mutation.isPending}
//             >
//               {selectedRole ? selectedRole : <>+ Set role</>}
//             </Button>
//           </PopoverTrigger>
//           <PopoverContent className="w-[200px] p-0" align="start">
//             <StatusList setOpen={setOpen} setSelectedRole={selectRole} />
//           </PopoverContent>
//         </Popover>
//       </SkeletonWrapper>
//     );
//   }

//   return (
//     <SkeletonWrapper isLoading={userRole.isFetching}>
//       <Drawer open={open} onOpenChange={setOpen}>
//         <DrawerTrigger asChild>
//           <Button
//             variant="outline"
//             className="w-[150px] justify-start"
//             disabled={mutation.isPending}
//           >
//             {selectedRole ? selectedRole : <>+ Set role</>}
//           </Button>
//         </DrawerTrigger>
//         <DrawerContent>
//           <div className="mt-4 border-t">
//             <StatusList setOpen={setOpen} setSelectedRole={selectRole} />
//           </div>
//         </DrawerContent>
//       </Drawer>
//     </SkeletonWrapper>
//   );
// }

// function StatusList({
//   setOpen,
//   setSelectedRole,
// }: {
//   setOpen: (open: boolean) => void;
//   setSelectedRole: (status: UserRole | null) => void;
// }) {
//   return (
//     <Command>
//       <CommandInput placeholder="Filter agent..." />
//       <CommandList>
//         <CommandEmpty>No results found.</CommandEmpty>
//         <CommandGroup>
//           {Object.values(UserRole).map((role) => (
//             <CommandItem
//               key={role}
//               value={role}
//               onSelect={(value) => {
//                 setSelectedRole(value as UserRole);
//                 setOpen(false);
//               }}
//             >
//               {role}
//             </CommandItem>
//           ))}
//         </CommandGroup>
//       </CommandList>
//     </Command>
//   );
// }
