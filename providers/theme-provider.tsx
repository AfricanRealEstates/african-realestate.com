"use client";

import { ConfigProvider } from "antd";
import React from "react";

import {
  QueryClient,
  QueryClientProvider,
  useQuery,
} from "@tanstack/react-query";

interface Props {
  children: React.ReactNode;
}
export default function ThemeProvider({ children }: Props) {
  const [queryClient] = React.useState(() => new QueryClient({}));
  return (
    <QueryClientProvider client={queryClient}>
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
              colorPrimaryBg: "#1890ff", // Updated token for button background
              colorBorder: "rgba(0,0,0,0.15)",
              colorText: "rgba(0,0,0,0.65)",
            },
            Input: {
              controlHeight: 45,
              boxShadow: "none",
              controlOutline: "none",
              colorBorder: "rgba(0,0,0,0.15)",
              colorText: "rgba(0,0,0,0.65)",
            },
            Select: {
              controlHeight: 40,
              boxShadow: "none",
              controlOutline: "none",
              colorBorder: "rgba(0,0,0,0.15)",
              colorText: "rgba(0,0,0,0.65)",
            },
            InputNumber: {
              controlHeight: 40,
            },
          },
        }}
      >
        {children}
      </ConfigProvider>
    </QueryClientProvider>
  );
}
