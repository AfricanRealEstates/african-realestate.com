import { HomeIcon } from "lucide-react";
import Link from "next/link";
import React from "react";

export default function Logo() {
  return (
    <div>
      <Link
        href="/"
        className={`hidden md:flex items-center gap-2 navLink !mb-10 lg:hover:bg-transparent lg:!p-0`}
      >
        <span className="bg-[#eb6753] text-white py-1 px-2 rounded-lg">
          <HomeIcon />
        </span>
        <span className={`font-semibold  hidden lg:block`}>
          African Real Estate.
        </span>
      </Link>
    </div>
  );
}
