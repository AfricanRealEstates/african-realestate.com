import React, { useState } from "react";
import { PropertiesFormStepProps } from "./index";
import {
  Button,
  Checkbox,
  Form,
  Input,
  InputNumber,
  Radio,
  Select,
} from "antd";
import {
  currencyOptions,
  propertyStatuses,
  properyTypes,
  appliances,
  landUnits,
  countries,
} from "@/constants";

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
          label="Status"
          name="status"
          rules={[
            {
              required: true,
              message: "Status is required",
            },
          ]}
          className="col-span-full"
        >
          <Radio.Group>
            <Radio value="sale"> Sale </Radio>
            <Radio value="let"> Let </Radio>
          </Radio.Group>
        </Form.Item>

        {/* <Form.Item
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
        </Form.Item> */}
        <Form.Item
          name="title"
          label="Property Title"
          rules={[
            {
              required: true,
              message: "Propery title is required",
            },
          ]}
          className=""
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
          className=""
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
          className=""
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
            rows={5}
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
          className=""
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
          className=""
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
          className=""
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
      <section className="grid grid-cols-1 lg:grid-cols-4 gap-x-4 gap-y-3">
        <Form.Item
          name="country"
          label="Country"
          rules={[
            {
              required: true,
              message: "Country is required",
            },
          ]}
          className=""
        >
          <Select
            options={countries}
            className="w-full"
            placeholder="Select Country"
          />
        </Form.Item>
        {/* <Form.Item
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
        </Form.Item> */}

        <Form.Item
          name="county"
          label="County/State/Province"
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
      </section>
      <h2 className="text-lg font-medium my-4 text-blue-600">Amenities</h2>
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-x-4 gap-y-2">
        <Form.Item
          name="bedrooms"
          label="Bedrooms"
          rules={[
            {
              required: true,
              message: "Bedrooms is required",
            },
          ]}
          className=""
        >
          <InputNumber className="w-full" placeholder="eg. 3" />
        </Form.Item>
        <Form.Item
          name="bathrooms"
          label="Bathrooms"
          rules={[
            {
              required: true,
              message: "Bathrooms is required",
            },
          ]}
          className=""
        >
          <InputNumber className="w-full" placeholder="eg. 3" />
        </Form.Item>
        <Form.Item
          name="landSize"
          label="Land Size"
          rules={[
            {
              required: true,
              message: "Land Size is required",
            },
          ]}
          className=""
        >
          <InputNumber className="w-full" placeholder="eg.2" />
        </Form.Item>
        <Form.Item
          name="landUnits"
          label="Land Units"
          rules={[
            {
              required: true,
              message: "Land Units is required",
            },
          ]}
          className=""
        >
          <Select
            options={landUnits}
            className="w-full"
            placeholder="Select land units"
          />
        </Form.Item>
        <Form.Item
          name="plinthArea"
          label="Plinth Area"
          rules={[
            {
              required: true,
              message: "Plinth Area is required",
            },
          ]}
          className=""
        >
          <InputNumber className="w-full" placeholder="eg.100" />
        </Form.Item>
        <Form.Item
          name="videoLink"
          label="Property Video Description (Optional)"
          className="col-span-1"
        >
          <Input placeholder="Video link (optional)" />
        </Form.Item>
        <Form.Item
          name="appliances"
          label="Appliances"
          rules={[
            {
              required: true,
              message: "Appliances is required",
            },
          ]}
          className="flex w-full items-center justify-start col-span-full gap-5"
        >
          <Checkbox.Group options={appliances} className="w-full gap-5" />
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
