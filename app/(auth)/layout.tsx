import React, { ReactNode } from "react";

interface AuthLayoutProps {
  children: ReactNode;
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="h-full bg-gray-50">
      <section className="h-full">{children}</section>
    </div>
  );
}
