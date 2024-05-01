"use client";
import { deleteProperty } from "@/actions/properties";
import { Property } from "@prisma/client";
import { Button, Table } from "antd";
import dayjs from "dayjs";
import { PencilLine, Save, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import toast from "react-hot-toast";
import PropertyQueries from "./property-queries";
import Link from "next/link";

interface ClientTableProps {
  properties: Property[];
  fromAdmin?: boolean;
}
export default function ClientTable({
  properties,
  fromAdmin,
}: ClientTableProps) {
  const [showQueries, setShowQueries] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(
    null
  );
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const onDelete = async (id: string) => {
    try {
      setLoading(true);
      const res = await deleteProperty(id);
      if (res.error) throw new Error(res.error);
      toast.success("Property deleted successfully");
    } catch (error) {
      toast.error("Failed to delete property");
    } finally {
      setLoading(false);
    }
  };
  const columns: any = [
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
      render(title: string, record: Property) {
        return <Link href={`/properties/${record.id}`}>{title}</Link>;
      },
    },
    {
      title: "Currency",
      dataIndex: "currency",
      key: "currency",
    },
    {
      title: "Price",
      dataIndex: `price`,
      key: "price",
      render(price: number) {
        return <span>{price.toLocaleString()}</span>;
      },
    },
    {
      title: "Type",
      dataIndex: "propertyDetails",
      key: "type",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
    },
    {
      title: "Updated At",
      dataIndex: "updatedAt",
      render(updatedAt: Date) {
        return dayjs(updatedAt).format("DD MMM YYYY HH:mm: A");
      },
    },
    {
      title: "Actions",
      dataIndex: "actions",
      render(value: any, record: Property) {
        return (
          <div className="flex gap-5">
            <Button
              size="small"
              className="flex items-center"
              onClick={() => {
                setSelectedProperty(record);
                setShowQueries(true);
              }}
            >
              Queries
            </Button>
            <Button
              size="small"
              className="flex items-center"
              onClick={() => onDelete(record.id)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
            <Button
              size="small"
              className="flex items-center"
              onClick={() =>
                router.push(
                  `/agent/properties/create-property/?cloneFrom=${record.id}`
                )
              }
            >
              <Save className="h-4 w-4" />
            </Button>
            <Button
              size="small"
              className="flex items-center"
              onClick={() =>
                router.push(`/agent/properties/edit-property/${record.id}`)
              }
            >
              <PencilLine className="h-4 w-4" />
            </Button>
          </div>
        );
      },
    },
  ];

  if (fromAdmin) {
    columns.unshift({
      title: "Agent",
      dataIndex: "agent",
      key: "agent",
      render(value: any, record: any) {
        return <div className="flex gap-5">{record.user.agentName}</div>;
      },
    });
  }
  return (
    <>
      <Table
        dataSource={properties}
        columns={columns}
        loading={loading}
        rowKey="id"
      />

      {showQueries && (
        <PropertyQueries
          selectedProperty={selectedProperty}
          showQueriesModal={showQueries}
          setShowQueriesModal={setShowQueries}
        />
      )}
    </>
  );
}
