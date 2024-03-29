import React from "react";

export default function DashboardTitle({ title }: { title: string }) {
  return (
    <div className="flex items-center">
      <h2 className="text-lg font-semibold md:text-2xl">{title}</h2>
    </div>
  );
}
