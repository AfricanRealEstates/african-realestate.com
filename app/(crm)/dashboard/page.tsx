import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Metadata } from "next";
import React from "react";
import prisma from "@/lib/prisma";
import { formatCurrency, formatNumber } from "@/lib/formatter";
import Login from "@/app/(auth)/login/page";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";

export const metadata: Metadata = {
  title: "Dashboard",
};

// Get sales data
async function getSalesData() {
  const data = await prisma.order.aggregate({
    _sum: { pricePaid: true },
    _count: true,
  });

  await wait(2000);

  return {
    amount: (data._sum.pricePaid || 0) / 100,
    numberOfSales: data._count,
  };
}

function wait(duration: number) {
  return new Promise((resolve) => setTimeout(resolve, duration));
}

// Get Users data
async function getUserData() {
  const [userCount, orderData] = await Promise.all([
    prisma.user.count(),
    prisma.order.aggregate({
      _sum: { pricePaid: true },
    }),
  ]);
  return {
    userCount,
    averageValuePerUser:
      userCount === 0 ? 0 : (orderData._sum.pricePaid || 0) / userCount / 100,
  };
}

async function getProductData() {
  const [activeCount, inactiveCount] = await Promise.all([
    prisma.property.count({ where: { isAvailableForPurchase: true } }),
    prisma.property.count({ where: { isAvailableForPurchase: false } }),
  ]);

  return {
    activeCount,
    inactiveCount,
  };
}

export default async function Dashboard() {
  const [salesData, userData, propertyData] = await Promise.all([
    getSalesData(),
    getUserData(),
    getProductData(),
  ]);

  return (
    <main className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <DashboardCard
        title="Sales"
        subtitle={`${formatNumber(salesData.numberOfSales)} Orders`}
        body={formatCurrency(salesData.amount)}
      />
      <DashboardCard
        title="Customer"
        subtitle={`${formatCurrency(
          userData.averageValuePerUser
        )} Average Value`}
        body={`${formatNumber(userData.userCount)} customers`}
      />
      <DashboardCard
        title="Active Properties"
        subtitle={`${formatNumber(propertyData.inactiveCount)} Inactive`}
        body={`${formatNumber(propertyData.activeCount)} Active `}
      />
    </main>
  );
}

interface DashboardCardProps {
  title: string;
  subtitle: string;
  body: string;
}
const DashboardCard = ({ title, subtitle, body }: DashboardCardProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{subtitle}</CardDescription>
      </CardHeader>
      <CardContent>
        <p>{body}</p>
      </CardContent>
    </Card>
  );
};
