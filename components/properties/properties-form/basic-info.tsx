import React, { useState } from "react";
import { PropertiesFormStepProps } from "./index";
import { Button, Form, Input, InputNumber, Select } from "antd";
import { currencyOptions, propertyStatuses, properyTypes } from "@/constants";

export default function BasicInfo({
  currentStep,
  setCurrentStep,
  finalValues,
  setFinalValues,
}: PropertiesFormStepProps) {
  const [propertyDetailsOptions, setPropertyDetailsOptions] = useState<
    { label: string; value: string }[]
  >([]);
  const [propertyDetailsDisabled, setPropertyDetailsDisabled] =
    useState<boolean>(false);

  const handlePropertyTypeChange = (value: string) => {
    // Find the selected property type and get its subOptions
    const selectedPropertyType = properyTypes.find(
      (type) => type.value === value
    );
    const subOptions = selectedPropertyType
      ? selectedPropertyType.subOptions
      : [];

    // Update the options for propertyDetails
    setPropertyDetailsOptions(subOptions);

    // Disable propertyDetails if there are no sub-options
    setPropertyDetailsDisabled(subOptions.length === 0);
  };

  const onSubmit = (values: any) => {
    setFinalValues({ ...finalValues, basicInfo: values });
    setCurrentStep(currentStep + 1);
  };
  return (
    <Form
      onFinish={onSubmit}
      layout="vertical"
      initialValues={finalValues.basicInfo}
    >
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-x-4 gap-y-2">
        <Form.Item
          name="status"
          label="Status"
          rules={[
            {
              required: true,
              message: "Status is required",
            },
          ]}
          className="col-span-full"
        >
          <Select options={propertyStatuses} placeholder="Select status" />
        </Form.Item>
        <Form.Item
          name="title"
          label="Property Title"
          rules={[
            {
              required: true,
              message: "Propery title is required",
            },
          ]}
          className="col-span-1 lg:col-span-full"
        >
          <Input placeholder="Property Title" />
        </Form.Item>
        <Form.Item
          name="propertyType"
          label="Property Type"
          rules={[
            {
              required: true,
              message: "Property type is required",
            },
          ]}
          className="col-span-full"
        >
          <Select
            options={properyTypes}
            placeholder="Select Property Type"
            onChange={handlePropertyTypeChange}
          />
        </Form.Item>

        <Form.Item
          name="propertyDetails"
          label="Property Details"
          rules={[
            {
              required: true,
              message: "Property details is required",
            },
          ]}
          className="col-span-full"
        >
          <Select
            options={propertyDetailsOptions}
            placeholder="Select Property Details"
            disabled={propertyDetailsDisabled}
          />
        </Form.Item>
        <Form.Item
          name="description"
          label="Description"
          rules={[
            {
              required: true,
              message: "Propery Description is required",
            },
          ]}
          className="col-span-1 lg:col-span-3"
        >
          <Input.TextArea
            rows={4}
            placeholder="Brief description of your property"
          />
        </Form.Item>
        <Form.Item
          name="price"
          label="Price"
          rules={[
            {
              required: true,
              message: "Price is required",
            },
          ]}
          className="col-span-1 "
        >
          <InputNumber className="w-full" type="number" placeholder="Price" />
        </Form.Item>
        <Form.Item
          name="leastPrice"
          label="Least Price"
          rules={[
            {
              required: true,
              message: "Least price is required",
            },
          ]}
          className="col-span-1"
        >
          <InputNumber
            className="w-full"
            type="number"
            placeholder="Least price"
          />
        </Form.Item>
        <Form.Item
          name="currency"
          label="Currency"
          rules={[
            {
              required: true,
              message: "Currency is required",
            },
          ]}
          className="col-span-1"
        >
          <Select
            options={currencyOptions}
            className="w-full"
            placeholder="Select currency"
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
        <Button htmlType="submit" type="primary">
          Next
        </Button>
      </div>
    </Form>
  );
}
