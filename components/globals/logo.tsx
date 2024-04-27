import { HomeIcon } from "lucide-react";
import Link from "next/link";
import React from "react";

export default function Logo() {
  return (
    <Link href="/" className={`flex flex-shrink-0 items-center gap-2 `}>
      <span className="bg-[#eb6753] text-white py-1 px-2 rounded-lg">
        <HomeIcon />
      </span>
      <span
        className={`
        text-xl tracking-tight font-semibold text-gray-600`}
      >
        {/* ${stickyMenu || !isHomePage ? "text-gray-700" : "text-white"} */}
        African Real Estate.
      </span>
    </Link>
  );
}
