"use client";

import { ConfigProvider } from "antd";
import React from "react";

interface Props {
  children: React.ReactNode;
}
export default function ThemeProvider({ children }: Props) {
  return (
    <div>
      <ConfigProvider
        theme={{
          token: {
            colorPrimary: "#1890ff",
            borderRadius: 3,
          },
          components: {
            Button: {
              controlHeight: 40,
              boxShadow: "none",
              controlOutline: "none",
              colorBorder: "rgba(0,0,0,0.15)",
              colorText: "rgba(0,0,0,0.65)",
            },
            Input: {
              controlHeight: 45,
            },
            Select: {
              controlHeight: 45,
              boxShadow: "none",
            },
            InputNumber: {
              controlHeight: 45,
            },
          },
        }}
      >
        {children}
      </ConfigProvider>
    </div>
  );
}
