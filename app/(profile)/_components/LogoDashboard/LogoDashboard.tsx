import Image from "next/image";
import Link from "next/link";
import React from "react";

export default function LogoDashboard() {
  return (
    <Link
      href="/"
      className="flex items-center h-20 gap-2 border-b cursor-pointer min-h-20"
    >
      <Image
        src="/assets/logo.png"
        alt="Logo"
        width={30}
        height={30}
        priority
      />
      <h1 className="text-xl font-bold">African Real Estate</h1>
    </Link>
  );
}
