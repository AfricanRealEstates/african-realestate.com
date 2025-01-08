import React from "react";

interface PageTitleProps {
  title: string;
}

export default function PageTitle({ title }: PageTitleProps) {
  return <h2 className="text-xl font-bold text-blue-600 mb-8">{title}</h2>;
}
