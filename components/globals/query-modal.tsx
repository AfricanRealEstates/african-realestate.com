"use client";
import { addQuery } from "@/actions/queries";
import { Form, Input, InputNumber, Modal } from "antd";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { Button } from "../ui/button";

export default function QueryModal({ propertyId }: { propertyId: string }) {
  const [showQueryModal, setShowQueryModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (values: any) => {
    try {
      setLoading(true);
      const res = await addQuery({ ...values, propertyId });
      //   if (res.error) throw new Error(res.error);
      toast.success("Query sent successfully");
      console.log(res);
      setShowQueryModal(false);
    } catch (error: any) {
      toast.error("Failed to send query");
    } finally {
      setLoading(false);
    }
  };
  return (
    <div>
      <Button
        onClick={() => setShowQueryModal(true)}
        className="disabled:bg-opacity-70 bg-blue-600 hover:bg-blue-700 text-neutral-50 rounded-full w-full"
      >
        Query For More Info
      </Button>

      {showQueryModal && (
        <Modal
          open={showQueryModal}
          onCancel={() => setShowQueryModal(false)}
          title="Send a query to Agent"
          centered
          width={600}
          footer={null}
          className="rounded-2xl border border-neutral-200 shadow-xl"
        >
          <Form layout="vertical" name="query-form" onFinish={onSubmit}>
            <Form.Item
              name="name"
              label="Name"
              rules={[{ required: true, message: "Please enter your name" }]}
            >
              <Input placeholder="Your Name" />
            </Form.Item>
            <Form.Item
              name="email"
              label="Email"
              rules={[{ required: true, message: "Please enter your email" }]}
            >
              <Input placeholder="Your Email" />
            </Form.Item>
            <Form.Item
              name="phone"
              label="Phone Number"
              rules={[
                { required: true, message: "Please enter your telephone" },
              ]}
            >
              <Input placeholder="Phone Number" />
            </Form.Item>
            <Form.Item
              name="amount"
              label="Query Amount"
              rules={[{ required: true, message: "Enter your quote" }]}
            >
              <InputNumber className="w-full" placeholder="Amount" />
            </Form.Item>
            <Form.Item
              name="message"
              label="Message"
              rules={[{ required: true, message: "Please enter your message" }]}
            >
              <Input.TextArea rows={4} placeholder="Your message..." />
            </Form.Item>
            <div className="flex justify-end gap-6">
              <Button
                disabled={loading}
                onClick={() => setShowQueryModal(false)}
                className="bg-neutral-100 text-gray-700 hover:bg-neutral-200 transition-colors"
              >
                Cancel
              </Button>
              <Button
                disabled={loading}
                className="flex items-center justify-center  cursor-pointer rounded-md bg-blue-300 hover:!bg-blue-400 transition-colors px-5 py-2.5 text-center font-semibold text-white"
              >
                {loading ? "Sending..." : "Send Quote"}
              </Button>
            </div>
          </Form>
        </Modal>
      )}
    </div>
  );
}
