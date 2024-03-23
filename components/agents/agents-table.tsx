"use client";
import { User } from "@prisma/client";
import { Button, Table, Tag, Tooltip } from "antd";
import dayjs from "dayjs";
import { Ban } from "lucide-react";
import Image from "next/image";
import React from "react";

export default function AgentsTable({ users }: { users: User[] }) {
  const columns = [
    {
      title: "Profile Pic",
      dataIndex: "image",
      render(profilePic: string) {
        return (
          <Image
            width={50}
            height={50}
            src={profilePic || "/assets/placeholder.jpg"}
            alt="Profile Pic"
            className="rounded-full"
          />
        );
      },
    },
    {
      title: "Name",
      dataIndex: "name",
    },
    {
      title: "Email",
      dataIndex: "email",
    },
    {
      title: "Registered On",
      dataIndex: "createdAt",
      render(createdAt: string) {
        return dayjs(createdAt).format("MMM DD YYYY HH:mm A");
      },
    },
    {
      title: "Status",
      dataIndex: "status",
      render(status: string, record: User) {
        if (record.isActive) {
          return "Active";
        }
        return "Inactive";
      },
    },
    {
      title: "Is Admin",
      dataIndex: "isAdmin",
      render(isAdmin: string) {
        if (isAdmin) {
          return <Tag color="cyan">Yes</Tag>;
        }
        return <Tag>No</Tag>;
      },
    },
    {
      title: "Actions",
      dataIndex: "actions",
      render(actions: any, record: User) {
        if (record.isActive && !record.role) {
          return (
            <div className="flex items-center gap-2">
              <Tooltip
                placement="top"
                title="Block user"
                className="border border-gray-100"
              >
                <Button size="small" className="flex items-center">
                  <Ban className="h-4 w-4" />
                </Button>
              </Tooltip>
              <Tooltip title="Make Admin">
                <Button size="small">Make Admin</Button>
              </Tooltip>
            </div>
          );
        }
      },
    },
  ];
  return (
    <div>
      <Table dataSource={users} columns={columns} />
    </div>
  );
}
