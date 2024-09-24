"use client";

import React, { useState, useEffect, useRef } from "react";
import { Form, Select } from "antd";
import { countries } from "@/constants";

export default function ImprovedCountrySelect() {
  const [filteredCountries, setFilteredCountries] = useState(countries);
  const [searchText, setSearchText] = useState("");
  const selectRef = useRef(null);

  useEffect(() => {
    if (searchText) {
      const filtered = countries.filter((country) =>
        country.label.toLowerCase().startsWith(searchText.toLowerCase())
      );
      setFilteredCountries(filtered);
    } else {
      setFilteredCountries(countries);
    }
  }, [searchText]);

  const handleSearch = (value: string) => {
    setSearchText(value);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key.length === 1 && e.key.match(/[a-z]/i)) {
      setSearchText(e.key);
      if (selectRef.current) {
        (selectRef.current as any).focus();
      }
    }
  };

  return (
    <div onKeyDown={handleKeyDown} tabIndex={0}>
      <Form.Item
        name="country"
        label="Country"
        rules={[
          {
            required: true,
            message: "Country is required",
          },
        ]}
      >
        <Select
          ref={selectRef}
          showSearch
          options={filteredCountries}
          className="w-full focus:outline-none focus:ring-0 border-none" // Tailwind classes to remove active border/outline
          placeholder="Select Country"
          filterOption={false}
          onSearch={handleSearch}
          notFoundContent={null}
        />
      </Form.Item>
    </div>
  );
}
