"use client";
import React from "react";
import { PropertiesFormStepProps } from "./index";
import { Button, Form, Input, Select } from "antd";
import { uploadFilesToFirebase } from "@/lib/utils/upload-media";
import { addProperty, editProperty } from "@/actions/properties";
import { useRouter, useParams } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";
import { Loader2 } from "lucide-react";

export default function AgentInfo({
  currentStep,
  setCurrentStep,
  finalValues,
  setFinalValues,
  loading,
  setLoading,
  isEdit = false,
}: PropertiesFormStepProps) {
  const { toast } = useToast();
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
        toast({ description: "Edit saved successfully" });
      } else {
        toast({ description: "Property added successfully" });
      }
      router.push(`/agent/properties`);
    } catch (error: any) {
      toast({
        variant: "destructive",
        description: "Failed to create property",
      });
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
      <div className="flex items-center justify-end gap-5">
        <Button
          disabled={currentStep === 0}
          onClick={() => setCurrentStep(currentStep - 1)}
          className="px-6 py-3 text-center rounded-md flex items-center justify-center"
        >
          Back
        </Button>
        <button
          type="submit"
          className="inline-block  cursor-pointer items-center rounded-md bg-blue-300 hover:bg-blue-400 transition-colors px-5 py-2.5 text-center font-semibold text-white"
        >
          {loading ? (
            <>
              {!isEdit ? (
                <div className="flex items-center">
                  <Loader2 className="size-3 animate-spin mr-2" />
                  Saving...
                </div>
              ) : (
                <div className="flex items-center">
                  <Loader2 className="size-3 animate-spin mr-2" />
                  Submitting...
                </div>
              )}
            </>
          ) : (
            <>{isEdit ? "Save Edited Property" : "Save Property"}</>
          )}
        </button>
      </div>
    </Form>
  );
}
