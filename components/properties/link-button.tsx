"use client";
import { Button } from "antd";
import { useRouter } from "next/navigation";
import React from "react";

interface LinkButtonProps {
  title: string;
  path: string;
}

export default function LinkButton({ title, path }: LinkButtonProps) {
  const router = useRouter();
  return (
    <Button
      type="default"
      onClick={() => router.push(path)}
      className="text-[#1890ff] text-[17px] text-center"
    >
      {title}
    </Button>
  );
}
