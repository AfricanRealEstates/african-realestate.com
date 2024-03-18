import React from "react";
import { PropertiesFormStepProps } from "./index";
import { Button, Form, Input } from "antd";

export default function LocationInfo({
  currentStep,
  setCurrentStep,
  finalValues,
  setFinalValues,
}: PropertiesFormStepProps) {
  const onSubmit = (values: any) => {
    setFinalValues({ ...finalValues, locationInfo: values });
    setCurrentStep(currentStep + 1);
  };
  return (
    <Form
      layout="vertical"
      onFinish={onSubmit}
      initialValues={finalValues.locationInfo}
    >
      {/* location, county, country, district, nearby_town, locality */}

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
          label="Disctrict"
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
          className="lg:col-span-2"
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
          className="col-span-full"
        >
          <Input placeholder="Location" />
        </Form.Item>
      </section>
      <div className="flex justify-end gap-5 mt">
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
