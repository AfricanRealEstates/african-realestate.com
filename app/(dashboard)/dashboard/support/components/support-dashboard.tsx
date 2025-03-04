"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { InfoIcon, Users } from "lucide-react";
import Link from "next/link";
import { SupportUsersList } from "./support-users-list";
import { SupportTicketsList } from "./support-tickets-list";
import { BlogPostsList } from "./blog-posts-list";

type SupportDashboardProps = {
  user: {
    name: string | null;
    email: string | null;
    role: string;
    permissions: string[];
  };
  canManageUsers: boolean;
  canWriteBlogs: boolean;
  canRespondToSupport: boolean;
};

export function SupportDashboard({
  user,
  canManageUsers,
  canWriteBlogs,
  canRespondToSupport,
}: SupportDashboardProps) {
  const [activeTab, setActiveTab] = useState<string>(
    canRespondToSupport ? "support" : canWriteBlogs ? "blog" : "overview"
  );

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Support Agent Profile</CardTitle>
          <CardDescription>
            Your account information and permissions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">
                  Name
                </h3>
                <p className="text-base">{user.name}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">
                  Email
                </h3>
                <p className="text-base">{user.email}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">
                  Role
                </h3>
                <p className="text-base">
                  <Badge variant="outline" className="mt-1">
                    {user.role}
                  </Badge>
                </p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">
                  Permissions
                </h3>
                <div className="flex flex-wrap gap-1 mt-1">
                  {user.permissions.map((permission) => (
                    <Badge key={permission} variant="secondary">
                      {permission}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          {/* {canRespondToSupport && (
            <TabsTrigger value="support">Support Tickets</TabsTrigger>
          )} */}
          {canWriteBlogs && (
            <TabsTrigger value="blog">Blog Management</TabsTrigger>
          )}
          {canManageUsers && (
            <TabsTrigger value="users">User Management</TabsTrigger>
          )}
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* {canRespondToSupport && (
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Support Tickets</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <MessageSquare className="h-8 w-8 text-blue-500" />
                      <div className="text-2xl font-bold">12</div>
                    </div>
                    <Button size="sm" onClick={() => setActiveTab("support")}>
                      View Tickets
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )} */}

            {/* {canWriteBlogs && (
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Blog Posts</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <PenSquare className="h-8 w-8 text-green-500" />
                      <div className="text-2xl font-bold">8</div>
                    </div>
                    <Button size="sm" onClick={() => setActiveTab("blog")}>
                      Manage Posts
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )} */}

            {canManageUsers && (
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">User Management</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <Users className="h-8 w-8 text-purple-500" />
                      <div className="text-2xl font-bold">24</div>
                    </div>
                    <Button size="sm" onClick={() => setActiveTab("users")}>
                      Manage Users
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          <Alert>
            <InfoIcon className="h-4 w-4" />
            <AlertTitle>Support Agent Dashboard</AlertTitle>
            <AlertDescription>
              Your dashboard shows features based on your assigned permissions.
              Contact an administrator if you need additional access.
            </AlertDescription>
          </Alert>
        </TabsContent>

        {canRespondToSupport && (
          <TabsContent value="support" className="space-y-4">
            <SupportTicketsList />
          </TabsContent>
        )}

        {canWriteBlogs && (
          <TabsContent value="blog" className="space-y-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Blog Posts</h2>
              <Button asChild>
                <Link href="/dashboard/blog/create">Create New Post</Link>
              </Button>
            </div>
            <BlogPostsList />
          </TabsContent>
        )}

        {canManageUsers && (
          <TabsContent value="users" className="space-y-4">
            <SupportUsersList isAdmin={false} />
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
}
