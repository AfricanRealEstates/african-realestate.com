import React, { ReactNode } from "react";
interface DashboardHeaderProps {
  heading: string;
  text?: string;
  children?: ReactNode;
}
export default function DashboardHeader({
  heading,
  text,
  children,
}: DashboardHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <div className="grid gap-1">
        <h1 className="text-2xl font-semibold">{heading}</h1>
        {text && <p className="text-muted-foreground text-base">{text}</p>}
      </div>
      {children}
    </div>
  );
}