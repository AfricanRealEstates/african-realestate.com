import React from "react";

interface PageTitleProps {
  title: string;
}

export default function PageTitle({ title }: PageTitleProps) {
  return <h2 className="text-xl font-bold text-indigo-500 mb-5">{title}</h2>;
}
