"use client";

import React, { useState, useEffect } from "react";
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
  commercialAppliances,
  landUnits,
  countries,
  industrialAppliances,
  vacationalAppliances,
  landAppliances,
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
  const [status, setStatus] = useState<string>("sale");
  const [appliancesOptions, setAppliancesOptions] = useState(appliances);
  const [propertyType, setPropertyType] = useState("Residential");
  const [tenureOptions, setTenureOptions] = useState([
    { label: "Freehold", value: "freehold" },
    { label: "Leasehold", value: "leasehold" },
    { label: "Sectional Titles", value: "sectionalTitles" },
  ]);

  useEffect(() => {
    const selectedPropertyType = properyTypes.find(
      (type) => type.value === propertyType
    );

    const subOptions = selectedPropertyType
      ? selectedPropertyType.subOptions
      : [];
    setPropertyDetailsOptions(subOptions);
    setPropertyDetailsDisabled(subOptions.length === 0);

    // Change appliances options if property type is Commercial or Industrial
    if (propertyType === "Commercial") {
      setAppliancesOptions(commercialAppliances);
    } else if (propertyType === "Industrial") {
      setAppliancesOptions(industrialAppliances);
    } else if (propertyType === "Vacational / Social") {
      setAppliancesOptions(vacationalAppliances);
    } else if (propertyType === "Land") {
      setAppliancesOptions(landAppliances);
    } else {
      setAppliancesOptions(appliances);
    }
  }, [propertyType]);

  const handlePropertyTypeChange = (value: string) => {
    setPropertyType(value);

    const selectedPropertyType = properyTypes.find(
      (type) => type.value === value
    );
    const subOptions = selectedPropertyType
      ? selectedPropertyType.subOptions
      : [];

    setPropertyDetailsOptions(subOptions);

    setPropertyDetailsDisabled(subOptions.length === 0);
  };

  const onStatusChange = (e: any) => {
    setStatus(e.target.value);
  };

  const onSubmit = (values: any) => {
    setFinalValues({ ...finalValues, basicInfo: values });
    setCurrentStep(currentStep + 1);
  };

  const getLabel = (type: string, field: string) => {
    if (type === "Vacational / Social") {
      return field === "price"
        ? status === "let"
          ? "Asking Rent/Day"
          : "Asking Price/Day"
        : status === "let"
        ? "Discounted Rent/Day"
        : "Discounted Price/Day";
    } else {
      return field === "price"
        ? status === "let"
          ? "Asking Rent"
          : "Asking Price"
        : status === "let"
        ? "Discounted Rent"
        : "Discounted Price";
    }
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
          <Radio.Group onChange={onStatusChange}>
            <Radio value="sale"> Sale </Radio>
            <Radio value="let"> Let </Radio>
          </Radio.Group>
        </Form.Item>

        <Form.Item
          name="title"
          label="Property Title"
          rules={[
            {
              required: true,
              message: "Property title is required",
            },
          ]}
          className=""
        >
          <Input
            placeholder="Property Title"
            className="border border-gray-300 rounded-md"
          />
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
            className="border border-gray-300 rounded-md"
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

        {propertyType === "Land" ? (
          <Form.Item
            name="tenure"
            label="Tenure"
            rules={[
              {
                required: true,
                message: "Tenure is required",
              },
            ]}
            className=""
          >
            <Select options={tenureOptions} placeholder="Select Tenure" />
          </Form.Item>
        ) : (
          <>
            <Form.Item
              label={
                propertyType === "Commercial" || propertyType === "Industrial"
                  ? "Parkings"
                  : "Bedrooms"
              }
              name="bedrooms"
              rules={[
                {
                  required: true,
                  message: `${
                    propertyType === "Commercial" ||
                    propertyType === "Industrial"
                      ? "Parkings"
                      : "Bedrooms"
                  } is required`,
                },
              ]}
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
              name="plinthArea"
              label="Plinth Area (sqm)"
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
          </>
        )}
      </section>
      <section>
        <Form.Item
          shouldUpdate={(prevValues, currentValues) =>
            prevValues.propertyType !== currentValues.propertyType
          }
        >
          {({ getFieldValue }) => {
            const propertyType = getFieldValue("propertyType");
            return (
              <section className="grid grid-cols-1 lg:grid-cols-2 gap-x-4 gap-y-2">
                <Form.Item
                  name="landSize"
                  label={`${
                    propertyType === "Commercial" ||
                    propertyType === "Industrial" ||
                    propertyType === "Vacational / Social"
                      ? "Land Size (optional)"
                      : "Land Size"
                  }`}
                  rules={[
                    {
                      required:
                        propertyType !== "Commercial" &&
                        propertyType !== "Industrial" &&
                        propertyType !== "Vacational / Social",
                      message: "Land Size is required",
                    },
                  ]}
                  className="col-span-1"
                >
                  <InputNumber className="w-full" placeholder="eg.2" />
                </Form.Item>
                <Form.Item
                  name="landUnits"
                  label={`${
                    propertyType !== "Commercial" &&
                    propertyType !== "Industrial" &&
                    propertyType !== "Vacational / Social"
                      ? "Land Units"
                      : "Land Units (optional)"
                  }`}
                  rules={[
                    {
                      required:
                        propertyType !== "Commercial" &&
                        propertyType !== "Industrial" &&
                        propertyType !== "Vacational / Social",
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
              </section>
            );
          }}
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
          <Input
            placeholder="County/State"
            className="border border-gray-300 rounded-md"
          />
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
          <Input
            placeholder="Nearby Town"
            className="border border-gray-300 rounded-md"
          />
        </Form.Item>
        <Form.Item
          name="locality"
          label="Locality name"
          rules={[
            {
              required: true,
              message: "Locality is required",
            },
          ]}
          className="lg:col-span-1"
        >
          <Input
            placeholder="Locality"
            className="border border-gray-300 rounded-md"
          />
        </Form.Item>
      </section>

      <h2 className="text-lg font-medium my-4 text-blue-600">Description</h2>
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-x-4 gap-y-2">
        <Form.Item
          name="description"
          label="Brief description"
          rules={[
            {
              required: true,
              message: "Property Description is required",
            },
          ]}
          className="col-span-full"
        >
          <Input.TextArea
            rows={5}
            placeholder="Brief description of your property"
          />
        </Form.Item>
      </section>
      <h2 className="text-lg font-medium my-4 text-blue-600">
        Amenities / Salient Features
      </h2>
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-x-4 gap-y-2">
        <Form.Item
          name="appliances"
          label=""
          rules={[
            {
              required: true,
              message: "Appliances is required",
            },
          ]}
          className="flex w-full items-center justify-start col-span-full gap-5"
        >
          <Checkbox.Group
            options={appliancesOptions}
            className="w-full gap-5"
          />
        </Form.Item>
      </section>
      <h2 className="text-lg font-medium my-4 text-blue-600"></h2>
      <section className="grid grid-cols-1 lg:grid-cols-4 gap-x-4 gap-y-2">
        <Form.Item
          name="price"
          label={getLabel(propertyType, "price")}
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
          label={getLabel(propertyType, "leastPrice")}
          rules={[
            {
              required: true,
              message: "Least price is required",
            },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || value < getFieldValue("price")) {
                  return Promise.resolve();
                }
                return Promise.reject(
                  new Error("Least price must be lower than asking price")
                );
              },
            }),
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
          name="serviceCharge"
          label="Service Charge (if applicable)"
          className=""
        >
          <InputNumber
            className="w-full"
            type="number"
            placeholder="Service charge"
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
      <section className="border-b border-neutral-200 w-full my-8"></section>
      <div className="flex items-center justify-end gap-5 mt-4">
        <Button
          disabled={currentStep === 0}
          onClick={() => setCurrentStep(currentStep - 1)}
          className="px-6 py-3 text-center rounded-md flex items-center justify-center"
        >
          Back
        </Button>
        <button
          type="submit"
          className="inline-block cursor-pointer items-center rounded-md bg-blue-300 hover:bg-blue-400 transition-colors px-5 py-2.5 text-center font-semibold text-white"
        >
          Next
        </button>
      </div>
    </Form>
  );
}
