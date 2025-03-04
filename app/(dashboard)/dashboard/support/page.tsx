import { Suspense } from "react";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { SupportUsersList } from "./components/support-users-list";
import { CreateSupportUserForm } from "./components/create-support-user-form";
import { PermissionManagement } from "./components/permission-management";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { hasPermission } from "./permissions-config";
import { auth } from "@/auth";
import { SupportDashboard } from "./components/support-dashboard";

export default async function Support() {
  const session = await auth();

  if (!session || !session.user) {
    redirect("/auth/login");
  }

  // Get the current user with their role and permissions
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      role: true,
      permissions: true,
      name: true,
      email: true,
    },
  });

  if (!user) {
    redirect("/auth/login");
  }

  // If user is neither ADMIN nor SUPPORT, redirect to dashboard
  if (user.role !== "ADMIN" && user.role !== "SUPPORT") {
    redirect("/dashboard");
  }

  const isAdmin = user.role === "ADMIN";

  // For SUPPORT users, check if they have any management permissions
  const canManageUsers =
    isAdmin || hasPermission(user.permissions, "user:manage");
  const canWriteBlogs =
    isAdmin || hasPermission(user.permissions, "blog:write");
  const canRespondToSupport =
    isAdmin || hasPermission(user.permissions, "support:respond");

  return (
    <section className="px-4 pt-6 space-y-6">
      <div className="mb-4 col-span-full xl:mb-2">
        <h1 className="text-2xl font-semibold text-blue-600 sm:text-2xl">
          {isAdmin ? "Support Management" : "Support Dashboard"}
        </h1>
        <p className="text-base text-muted-foreground mt-1">
          {isAdmin
            ? "Manage support users, their permissions, and related functionalities."
            : `Welcome, ${user.name}. Manage your support activities based on your permissions.`}
        </p>
      </div>

      <Separator />

      {isAdmin ? (
        // Admin view with full management capabilities
        <Tabs defaultValue="users" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="users">Support Users</TabsTrigger>
            <TabsTrigger value="create">Create User</TabsTrigger>
            <TabsTrigger value="permissions">Manage Permissions</TabsTrigger>
          </TabsList>

          <TabsContent value="users" className="space-y-4">
            <Suspense fallback={<UsersListSkeleton />}>
              <SupportUsersList isAdmin={true} />
            </Suspense>
          </TabsContent>

          <TabsContent value="create" className="space-y-4">
            <CreateSupportUserForm />
          </TabsContent>

          <TabsContent value="permissions" className="space-y-4">
            <Suspense fallback={<PermissionsSkeleton />}>
              <PermissionManagement />
            </Suspense>
          </TabsContent>
        </Tabs>
      ) : (
        // Support user view with limited capabilities based on permissions
        <SupportDashboard
          user={user}
          canManageUsers={canManageUsers}
          canWriteBlogs={canWriteBlogs}
          canRespondToSupport={canRespondToSupport}
        />
      )}
    </section>
  );
}

function UsersListSkeleton() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-10 w-full" />
      <div className="space-y-2">
        {Array(5)
          .fill(0)
          .map((_, i) => (
            <Skeleton key={i} className="h-16 w-full" />
          ))}
      </div>
    </div>
  );
}

function PermissionsSkeleton() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-10 w-full" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {Array(6)
          .fill(0)
          .map((_, i) => (
            <Skeleton key={i} className="h-24 w-full" />
          ))}
      </div>
    </div>
  );
}
