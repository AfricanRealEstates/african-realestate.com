import React from "react";

interface PageTitleProps {
  title: string;
}

export default function PageTitle({ title }: PageTitleProps) {
  return <h2 className="text-xl font-bold text-[#1890ff] mb-5">{title}</h2>;
}
