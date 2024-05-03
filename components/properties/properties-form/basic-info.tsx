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
      <section className="grid grid-cols-1 lg:grid-cols-4 gap-x-4 gap-y-2">
        <Form.Item
          name="status"
          label="Status"
          rules={[
            {
              required: true,
              message: "Status is required",
            },
          ]}
          className="col-span-2"
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
          className="col-span-2"
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
          className="col-span-2"
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
          className="col-span-2"
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
          className="col-span-full"
        >
          <Input.TextArea
            rows={8}
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
          className="w-full"
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
          className="w-full"
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
          className="col-span-2"
        >
          <Select
            options={currencyOptions}
            className="w-full"
            placeholder="Select currency"
          />
        </Form.Item>
      </section>
      <h2 className="text-lg font-medium my-4 text-blue-600">
        Location Details
      </h2>
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-x-4 gap-y-3">
        <Form.Item
          name="country"
          label="Country"
          rules={[
            {
              required: true,
              message: "Country is required",
            },
          ]}
          className="col-span-1"
        >
          <Input placeholder="Country" />
        </Form.Item>

        <Form.Item
          name="county"
          label="County/State"
          rules={[
            {
              required: true,
              message: "County or state is required",
            },
          ]}
          className="col-span-1"
        >
          <Input placeholder="County/State" />
        </Form.Item>
        <Form.Item
          name="district"
          label="District"
          rules={[
            {
              required: true,
              message: "District is required",
            },
          ]}
          className="col-span-1"
        >
          <Input placeholder="District" />
        </Form.Item>
        <Form.Item
          name="locality"
          label="Locality"
          rules={[
            {
              required: true,
              message: "Locality is required",
            },
          ]}
          className="lg:col-span-1"
        >
          <Input placeholder="Locality" />
        </Form.Item>
        <Form.Item
          name="nearbyTown"
          label="Nearby Town"
          rules={[
            {
              required: true,
              message: "Nearby Town is required",
            },
          ]}
          className="col-span-1"
        >
          <Input placeholder="Nearby Town" />
        </Form.Item>
        <Form.Item
          name="location"
          label="Location"
          rules={[
            {
              required: true,
              message: "Location is required",
            },
          ]}
          className="col-span-1"
        >
          <Input placeholder="Location" />
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
          Next
        </button>
      </div>
    </Form>
  );
}
