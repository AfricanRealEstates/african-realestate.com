import { auth } from "@/auth";
import SessionProvider from "@/providers/client-provider";
import React, { ReactNode } from "react";

interface AuthLayoutProps {
  children: ReactNode;
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();
  const user = session?.user;
  return (
    <div className="h-full bg-gray-50">
      <section className="h-full">{children}</section>
    </div>
  );
}
