"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from "recharts";
import {
  Mail,
  TrendingUp,
  Users,
  Building2,
  Calendar,
  Activity,
  Target,
  Loader2,
} from "lucide-react";
import { getEmailStatistics, getMarketingEmailHistory } from "./actions";

type EmailStats = {
  totalEmails: number;
  activePropertyEmails: number;
  inactivePropertyEmails: number;
  recentEmails: number;
};

type EmailHistory = {
  id: string;
  propertyId: string;
  userId: string;
  message: string;
  type: string;
  senderEmail: string | null;
  sentAt: Date;
  property: {
    title: string;
    propertyNumber: number;
  };
  user: {
    name: string | null;
    email: string | null;
    role: string;
  };
};

export function EmailStats() {
  const [stats, setStats] = useState<EmailStats | null>(null);
  const [emailHistory, setEmailHistory] = useState<EmailHistory[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [statsData, historyData] = await Promise.all([
          getEmailStatistics(),
          getMarketingEmailHistory(),
        ]);
        setStats(statsData);
        setEmailHistory(historyData);
      } catch (error) {
        console.error("Failed to fetch email analytics:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="text-center py-12">
        <Mail className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          No data available
        </h3>
        <p className="text-gray-600">
          Start sending emails to see analytics here.
        </p>
      </div>
    );
  }

  // Process data for charts
  const emailTypeData = [
    {
      name: "Active Properties",
      value: stats.activePropertyEmails,
      color: "#3b82f6",
    },
    {
      name: "Inactive Properties",
      value: stats.inactivePropertyEmails,
      color: "#f59e0b",
    },
  ];

  // Group emails by role
  const roleStats = emailHistory.reduce(
    (acc, email) => {
      const role = email.user.role;
      acc[role] = (acc[role] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );

  const roleData = Object.entries(roleStats).map(([role, count]) => ({
    name: role,
    value: count,
    color:
      role === "AGENT" ? "#3b82f6" : role === "AGENCY" ? "#8b5cf6" : "#6b7280",
  }));

  // Group emails by date for trend analysis
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - i);
    return date.toISOString().split("T")[0];
  }).reverse();

  const trendData = last7Days.map((date) => {
    const count = emailHistory.filter(
      (email) => email.sentAt.toString().split("T")[0] === date
    ).length;
    return {
      date: new Date(date).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      }),
      emails: count,
    };
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            Email Marketing Analytics
          </h2>
          <p className="text-gray-600">
            Track your email campaign performance and engagement
          </p>
        </div>
        <Badge variant="outline" className="flex items-center gap-1">
          <Activity className="h-3 w-3" />
          Last 7 days: {stats.recentEmails} emails
        </Badge>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Emails Sent
            </CardTitle>
            <Mail className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.totalEmails.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              All time email campaigns
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Active Property Emails
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.activePropertyEmails.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              Marketing campaigns sent
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Reactivation Emails
            </CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.inactivePropertyEmails.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              Reactivation campaigns sent
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Recent Activity
            </CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.recentEmails.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              Emails sent this week
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="trends">Trends</TabsTrigger>
          <TabsTrigger value="recipients">Recipients</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Email Types Distribution</CardTitle>
                <CardDescription>
                  Breakdown of active vs inactive property emails
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={emailTypeData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) =>
                        `${name} ${(percent * 100).toFixed(0)}%`
                      }
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {emailTypeData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recipient Roles</CardTitle>
                <CardDescription>
                  Email distribution by user roles
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={roleData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="value" fill="#3b82f6" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="trends" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Email Sending Trends</CardTitle>
              <CardDescription>
                Daily email volume over the last 7 days
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={trendData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="emails"
                    stroke="#3b82f6"
                    strokeWidth={2}
                    dot={{ fill: "#3b82f6" }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="recipients" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Recent Email Recipients</CardTitle>
              <CardDescription>
                Latest email campaigns and their recipients
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {emailHistory.slice(0, 20).map((email) => (
                  <div
                    key={email.id}
                    className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        {email.user.role === "AGENT" ? (
                          <Users className="h-4 w-4 text-blue-600" />
                        ) : email.user.role === "AGENCY" ? (
                          <Building2 className="h-4 w-4 text-purple-600" />
                        ) : (
                          <Users className="h-4 w-4 text-gray-600" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium">
                          {email.user.name || "Unknown User"}
                        </p>
                        <p className="text-sm text-gray-600">
                          {email.user.email || "No email"}
                        </p>
                        <p className="text-xs text-gray-500">
                          Property: {email.property.title} (#
                          {email.property.propertyNumber})
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge
                        variant="outline"
                        className={`mb-1 ${
                          email.type === "active-property"
                            ? "bg-blue-50 text-blue-700 border-blue-200"
                            : "bg-orange-50 text-orange-700 border-orange-200"
                        }`}
                      >
                        {email.type === "active-property"
                          ? "Marketing"
                          : "Reactivation"}
                      </Badge>
                      <p className="text-xs text-gray-500">
                        {new Date(email.sentAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
