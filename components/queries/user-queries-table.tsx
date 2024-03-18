"use client";
import { Property, Query } from "@prisma/client";
import { Table } from "antd";
import dayjs from "dayjs";
import Link from "next/link";
import React from "react";

export default function UserQueriesTable({ queries }: { queries: Query[] }) {
  const columns = [
    {
      title: "Property Title",
      dataIndex: "property",
      key: "property",
      render: (property: Property) => {
        return (
          <Link href={`/properties/${property.id}`}>{property.title}</Link>
        );
      },
      // property.title.slice(0, 100) +
      // (property.title.length > 100 ? "..." : ""),
    },
    {
      title: "Currency",
      dataIndex: "property",
      key: "currency",
      render: (property: Property) => property.currency,
    },
    {
      title: "Quote Amount",
      dataIndex: "amount",
      key: "amount",
      render: (amount: number) => amount.toLocaleString(),
    },
    {
      title: "Message",
      dataIndex: "message",
      key: "message",
      render: (message: string) =>
        message.slice(0, 100) + (message.length > 100 ? "..." : ""),
    },

    {
      title: "Date & Time",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (createdAt: Date) =>
        dayjs(createdAt).format("DD MMM YYYY hh:mm A"),
    },
  ];
  return (
    <div>
      <Table columns={columns} dataSource={queries} />
    </div>
  );
}
