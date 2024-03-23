import React from "react";
import { PropertiesFormStepProps } from "./index";
import { Button, Checkbox, Form, InputNumber, Select } from "antd";
import { appliances, landUnits } from "@/constants";

export default function Amenities({
  currentStep,
  setCurrentStep,
  finalValues,
  setFinalValues,
}: PropertiesFormStepProps) {
  const onSubmit = (values: any) => {
    setFinalValues({ ...finalValues, amenities: values });
    setCurrentStep(currentStep + 1);
  };
  return (
    <Form
      layout="vertical"
      onFinish={onSubmit}
      initialValues={finalValues.amenities}
    >
      {/* bedrooms, bathrooms, plinth_area, land_size, land_units */}
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
          className="col-span-full"
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
          className="col-span-full"
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
          className="col-span-1"
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
          className="col-span-1"
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
          className="col-span-1"
        >
          <InputNumber className="w-full" placeholder="eg.100" />
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
