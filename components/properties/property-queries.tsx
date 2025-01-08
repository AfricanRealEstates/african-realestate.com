import { getQueriesByPropertyId } from "@/actions/queries";
import { Property, Query } from "@prisma/client";
import { Modal, Table } from "antd";
import dayjs from "dayjs";
import React, { useEffect, useState } from "react";

interface PropertyQueriesProps {
  showQueriesModal: boolean;
  setShowQueriesModal: React.Dispatch<React.SetStateAction<boolean>>;
  selectedProperty: Property | null;
}
export default function PropertyQueries({
  showQueriesModal,
  setShowQueriesModal,
  selectedProperty,
}: PropertyQueriesProps) {
  const [queries, setQueries] = useState<Query[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchQueries = async () => {
      try {
        setLoading(true);
        const res: any = await getQueriesByPropertyId(
          selectedProperty?.id || ""
        );
        setQueries(res?.data);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    if (selectedProperty) fetchQueries();
  }, [selectedProperty]);

  const columns = [
    {
      title: "Customer",
      dataIndex: "name",
    },
    {
      title: "Customer's Mobile",
      dataIndex: "phone",
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
    <Modal
      title={`Queries for ${selectedProperty?.title}`}
      open={showQueriesModal}
      onCancel={() => setShowQueriesModal(false)}
      width={1000}
    >
      <Table columns={columns} dataSource={queries} loading={loading} />
    </Modal>
  );
}
