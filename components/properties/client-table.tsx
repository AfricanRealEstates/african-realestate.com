"use client";

import { deleteProperty } from "@/actions/properties";
import { Property } from "@prisma/client";
import { Table } from "antd";
import dayjs from "dayjs";
import { PencilLine, Save, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import toast from "react-hot-toast";
import PropertyQueries from "./property-queries";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

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
  const [deleteLoading, setDeleteLoading] = useState(false);
  const router = useRouter();
  const [deleteConfirmVisible, setDeleteConfirmVisible] = useState(false);
  const [propertyToDelete, setPropertyToDelete] = useState<string | null>(null);

  const onDelete = async () => {
    if (!propertyToDelete) return;
    try {
      setDeleteLoading(true);
      const res = await deleteProperty(propertyToDelete);
      if (res.error) throw new Error(res.error);
      toast.success("Property deleted successfully");
      setDeleteConfirmVisible(false);
      setPropertyToDelete(null);
    } catch (error) {
      toast.error("Failed to delete property");
    } finally {
      setDeleteLoading(false);
    }
  };

  const columns: any = [
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
      render: (title: string, record: Property) =>
        record.isActive ? (
          <Link href={`/properties/${record.propertyDetails}/${record.id}`}>
            {title}
          </Link>
        ) : (
          <span className="text-gray-400 cursor-not-allowed">{title}</span>
        ),
    },

    {
      title: "Status",
      dataIndex: "isActive",
      key: "status",
      render: (isActive: boolean) => (
        <span>{isActive ? "Published" : "Draft"}</span>
      ),
      responsive: ["md"],
    },
    {
      title: "Currency",
      dataIndex: "currency",
      key: "currency",
      responsive: ["md"],
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
      render: (price: number) => <span>{price.toLocaleString()}</span>,
    },
    {
      title: "Type",
      dataIndex: "propertyDetails",
      key: "type",
      responsive: ["lg"],
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      responsive: ["md"],
    },
    {
      title: "Updated At",
      dataIndex: "updatedAt",
      key: "updatedAt",
      render: (updatedAt: Date) =>
        dayjs(updatedAt).format("DD MMM YYYY HH:mm A"),
      responsive: ["lg"],
    },
    {
      title: "Actions",
      dataIndex: "actions",
      key: "actions",
      render: (value: any, record: Property) => (
        <div className="flex flex-wrap gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => {
              setSelectedProperty(record);
              setShowQueries(true);
            }}
          >
            Queries
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => {
              setPropertyToDelete(record.id);
              setDeleteConfirmVisible(true);
            }}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() =>
              router.push(
                `/agent/properties/create-property/?cloneFrom=${record.id}`
              )
            }
          >
            <Save className="h-4 w-4" />
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() =>
              router.push(`/agent/properties/edit-property/${record.id}`)
            }
          >
            <PencilLine className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ];

  if (fromAdmin) {
    columns.unshift({
      title: "Agent",
      dataIndex: "agent",
      key: "agent",
      render: (value: any, record: any) => (
        <div className="flex gap-5">{record.user.agentName}</div>
      ),
      responsive: ["md"],
    });
  }

  return (
    <>
      <div className="overflow-x-auto">
        <Table
          dataSource={properties}
          columns={columns}
          loading={loading}
          rowKey="id"
          scroll={{ x: true }}
          pagination={{
            responsive: true,
            showSizeChanger: true,
            showQuickJumper: true,
          }}
        />
      </div>

      {showQueries && (
        <PropertyQueries
          selectedProperty={selectedProperty}
          showQueriesModal={showQueries}
          setShowQueriesModal={setShowQueries}
        />
      )}
      <Dialog
        open={deleteConfirmVisible}
        onOpenChange={setDeleteConfirmVisible}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Delete</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this property? This action cannot
              be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setDeleteConfirmVisible(false);
                setPropertyToDelete(null);
              }}
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={onDelete} disabled={deleteLoading}>
              {deleteLoading ? "Deleting..." : "Yes, delete"}
            </Button>

          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
