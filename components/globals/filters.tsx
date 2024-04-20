"use client";
import { propertyStatuses, properyTypes } from "@/constants";
import { Button, Form, Input, InputNumber, Modal, Select, Tag } from "antd";
import { usePathname, useRouter } from "next/navigation";
import React, { useState } from "react";

export default function Filters({ searchParams }: { searchParams: any }) {
  const [showFiltersModal, setShowFiltersModal] = useState(false);
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

  const pathname = usePathname();
  const router = useRouter();

  const onSubmit = (values: any) => {
    // remove undefined/null values
    const formattedData: any = {};
    Object.keys(values).forEach((key) => {
      // Check if the value is a number (int or float)
      if (!isNaN(parseFloat(values[key]))) {
        formattedData[key] = parseFloat(values[key]);
      } else if (values[key]) {
        formattedData[key] = values[key];
      }
    });

    // Query string
    const queryString = new URLSearchParams(formattedData).toString();
    router.push(`${pathname}?${queryString}`);
    setShowFiltersModal(false);
  };
  return (
    <>
      <div className="flex flex-col lg:flex-row lg:items-center gap-y-7 justify-between p-3 mb-5 border rounded-sm border-solid border-gray-100">
        <div>
          {Object?.keys(searchParams).length === 0 ? (
            <span className="text-sm text-gray-700">No filters applied</span>
          ) : (
            <div className="flex flex-wrap gap-5">
              {Object.keys(searchParams).map((key) => {
                return (
                  <div key={key} className="capitalize flex flex-col gap-2">
                    <span className="text-gray-500 text-sm">{key}</span>
                    <Tag
                      onClose={() => {
                        const newSearchParams = { ...searchParams };
                        delete newSearchParams[
                          key as keyof typeof searchParams
                        ];

                        const queryString = new URLSearchParams(
                          newSearchParams
                        ).toString();
                        router.push(`${pathname}?${queryString}`);
                      }}
                      closeIcon
                      closable
                      className="flex items-center text-blue-400"
                    >
                      {searchParams[key]}
                    </Tag>
                  </div>
                );
              })}
            </div>
          )}
        </div>
        <div className="flex gap-5">
          <button
            type="submit"
            onClick={() => {
              setShowFiltersModal(true);
            }}
            className="cursor-pointer items-center rounded-md bg-blue-300 hover:bg-blue-400 transition-colors px-6 py-2 text-center font-semibold text-white"
          >
            show Filters
          </button>
          <Button
            onClick={() => {
              router.push(pathname);
            }}
          >
            Clear
          </Button>
          {/* <Button
            type="primary"
            onClick={() => {
              setShowFiltersModal(true);
            }}
          >
            Show Filters
          </Button> */}
        </div>
      </div>

      {showFiltersModal && (
        <Modal
          title={
            <h2 className="text-xl font-semibold text-gray-600 text-center">
              Apply Filters
            </h2>
          }
          open={showFiltersModal}
          onCancel={() => {
            setShowFiltersModal(false);
          }}
          centered
          width={800}
          footer={null}
        >
          <Form
            onFinish={onSubmit}
            layout="vertical"
            initialValues={searchParams}
          >
            <section className="grid grid-cols-1 lg:grid-cols-3 gap-x-5 gap-y-2">
              <Form.Item name="propertyType" label="Property Type">
                <Select
                  options={properyTypes}
                  placeholder="Select Property Type"
                  onChange={handlePropertyTypeChange}
                />
              </Form.Item>
              <Form.Item name="propertyDetails" label="Property Details">
                <Select
                  options={propertyDetailsOptions}
                  placeholder="Property Details"
                  disabled={propertyDetailsDisabled}
                />
              </Form.Item>
              <Form.Item label="Sale / Let" name="status">
                <Select options={propertyStatuses} placeholder="Status" />
              </Form.Item>

              <Form.Item label="County" name="county">
                <Input placeholder="County" />
              </Form.Item>

              <Form.Item label="Bedrooms" name="bedrooms">
                <InputNumber placeholder="e.g. 3" className="w-full" />
              </Form.Item>
              <Form.Item label="Bathrooms" name="bathrooms">
                <InputNumber placeholder="e.g. 2" className="w-full" />
              </Form.Item>
            </section>
            <section className="mt-7 flex justify-end gap-5">
              <Button
                onClick={() => {
                  setShowFiltersModal(false);
                }}
              >
                Cancel
              </Button>
              <button
                type="submit"
                className="cursor-pointer items-center rounded-md bg-blue-300 hover:bg-blue-400 transition-colors px-6 py-2 text-center font-semibold text-white"
              >
                Apply
              </button>
              {/* <Button type="primary" htmlType="submit">
                Apply
              </Button> */}
            </section>
          </Form>
        </Modal>
      )}
    </>
  );
}
