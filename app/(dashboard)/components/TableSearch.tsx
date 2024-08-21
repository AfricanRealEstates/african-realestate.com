import Image from "next/image";
import React from "react";

export default function TableSearch() {
  return (
    <div>
      <div className="w-full md:w-auto flex items-center gap-2 text-xs rounded-full px-2 ring-[1.5px] ring-gray-300">
        <Image src={"/assets/search.png"} alt="" width={14} height={14} />
        <input
          type="text"
          placeholder="Search..."
          className="w-[200px] p-2 bg-transparent outline-none ring-0 border-0 focus:outline-none focus:ring-0"
        />
      </div>
    </div>
  );
}
