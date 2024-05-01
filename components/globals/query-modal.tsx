"use client";
import { addQuery } from "@/actions/queries";
import { Button, Form, Input, InputNumber, Modal } from "antd";
import React, { useState } from "react";
import toast from "react-hot-toast";

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
        block
        onClick={() => setShowQueryModal(true)}
        className="border-[hsla(0, 0%, 100%, .2)] w-full text-lg flex h-12 cursor-pointer gap-2 items-center justify-center rounded-lg px-[10px] font-medium leading-6 tracking-tight bg-[rgb(64,64,64)] hover:bg-black text-white transition-all ease-out delay-150 border-[1px] hover:bg-[hsla(0, 0%, 100%, .2)]"
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
                htmlType="button"
                disabled={loading}
                onClick={() => setShowQueryModal(false)}
              >
                Cancel
              </Button>
              <Button
                loading={loading}
                type="primary"
                htmlType="submit"
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
