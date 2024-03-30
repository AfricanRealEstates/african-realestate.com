"use client";
import { Spin } from "antd";
import React from "react";
export default function Loader() {
  return (
    <div className="flex justify-center items-center h-[65vh] mt-20">
      <Spin />
    </div>
  );
}
