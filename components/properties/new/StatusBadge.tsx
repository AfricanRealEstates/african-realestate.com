import React from "react";

export interface StatusBadgeProps {
  className?: string;
  status: string;
}

export default function StatusBadge({
  className = "",
  status,
}: StatusBadgeProps) {
  return (
    <div
      className={`flex items-center justify-center text-xs py-0.5 px-3 bg-rose-500 font-medium text-red-50 rounded-full ${className}`}
    >
      For {status}
    </div>
  );
}
