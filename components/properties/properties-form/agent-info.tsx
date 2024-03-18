"use client";
import React from "react";
import { PropertiesFormStepProps } from "./index";
import { Button, Form, Input, Select } from "antd";
import { uploadFilesToFirebase } from "@/lib/utils/upload-media";
import { addProperty, editProperty } from "@/actions/properties";
import toast from "react-hot-toast";
import { useRouter, useParams } from "next/navigation";

export default function AgentInfo({
  currentStep,
  setCurrentStep,
  finalValues,
  setFinalValues,
  loading,
  setLoading,
  isEdit = false,
}: PropertiesFormStepProps) {
  const { id }: any = useParams();
  const router = useRouter();
  const onSubmit = async (values: any) => {
    try {
      setLoading(true);
      const tempFinalValues = { ...finalValues, agentInfo: values };

      // Handle images upload
      const tempMedia = tempFinalValues.media;
      const newImagesURLs = await uploadFilesToFirebase(
        tempMedia.newlyUploadFiles
      );

      tempMedia.images = [...tempMedia.images, ...newImagesURLs];

      tempFinalValues.media = tempMedia;
      const savedValues = {
        ...tempFinalValues.basicInfo,
        ...tempFinalValues.locationInfo,
        ...tempFinalValues.amenities,
        ...tempFinalValues.agentInfo,
        images: tempFinalValues.media.images,
      };
      let res = null;
      if (isEdit) {
        res = await editProperty(id, savedValues);
      } else {
        res = await addProperty(savedValues);
      }
      if (res.error) throw new Error(res.error);
      // Toast messages
      if (isEdit) {
        toast.success("Edit saved successfully");
      } else {
        toast.success("Property added successfully");
      }
      router.push(`/agent/properties`);
    } catch (error: any) {
      toast.error("Failed to create property");
      console.error(error.message);
    } finally {
      setLoading(false);
    }
  };
  return (
    <Form
      layout="vertical"
      onFinish={onSubmit}
      initialValues={finalValues.agentInfo}
    >
      {/* firstName, lastName, officeLine, whatsappNumber, companyName, email, telephone, address, officeLocation, postalCode, logo */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <Form.Item
          name="agentName"
          label="Agent Name"
          rules={[
            {
              required: true,
              message: "Agent Name is required",
            },
          ]}
        >
          <Input placeholder="Agent Name" />
        </Form.Item>
        <Form.Item
          name="email"
          label="Agent Email"
          rules={[
            {
              required: true,
              message: "Agent Email is required",
            },
          ]}
        >
          <Input placeholder="Agent Email" />
        </Form.Item>
        <Form.Item
          name="officeLine"
          label="Office Line"
          rules={[
            {
              required: true,
              message: "Office Line is required",
            },
          ]}
        >
          <Input placeholder="Office Line" />
        </Form.Item>
        <Form.Item
          name="whatsappNumber"
          label="Whatsapp Number"
          rules={[
            {
              required: true,
              message: "Whatsapp Number is required",
            },
          ]}
        >
          <Input placeholder="Whatsapp Number" />
        </Form.Item>
        <Form.Item
          name="address"
          label="Adress"
          rules={[
            {
              required: true,
              message: "Address is required",
            },
          ]}
        >
          <Input placeholder="Address" />
        </Form.Item>
        <Form.Item
          name="postalCode"
          label="Postal Code"
          rules={[
            {
              required: true,
              message: "Postal Code is required",
            },
          ]}
        >
          <Input placeholder="Postal Code" />
        </Form.Item>
        <Form.Item
          name="showAgentContact"
          label="Show Agent Contact"
          rules={[
            {
              required: true,
              message: "Show agent contacts?",
            },
          ]}
        >
          <Select
            options={[
              { label: "Yes", value: true },
              { label: "No", value: false },
            ]}
            className="w-full"
            placeholder="Show agent contacts?"
          />
        </Form.Item>
      </section>
      <div className="flex justify-end gap-5">
        <Button
          disabled={currentStep === 0}
          onClick={() => setCurrentStep(currentStep - 1)}
        >
          Back
        </Button>
        <Button type="primary" htmlType="submit" loading={loading}>
          {loading ? (
            <>{isEdit ? "Saving..." : "Submitting..."}</>
          ) : (
            <>{isEdit ? "Save Edited Property" : "Save Property"}</>
          )}
        </Button>
      </div>
    </Form>
  );
}
