import { Input } from "@/components/ui/input";
import Image from "next/image";
import React from "react";

export default function Navbar() {
  return (
    <div className="flex items-center justify-between p-4">
      <div className="hidden md:flex items-center gap-2 text-xs rounded-full px-2 ring-[1.5px] ring-gray-300">
        <Image src={"/assets/search.png"} alt="" width={14} height={14} />
        <input
          type="text"
          placeholder="Search..."
          className="focus:ring-0 w-[200px] p-2 bg-transparent outline-none ring-0 border-0 focus:outline-none"
        />
      </div>
      <div className="flex items-center gap-6 justify-end w-full">
        <div className="cursor-pointer bg-white rounded-full size-7 flex items-center justify-center">
          <Image src="/assets/message.png" width={20} height={20} alt="" />
        </div>
        <div className="relative cursor-pointer bg-white rounded-full size-7 flex items-center justify-center">
          <Image src="/assets/announcement.png" width={20} height={20} alt="" />
          <div className="absolute -top-2 -right-2 size-3 flex items-center justify-center bg-[#eb6753] text-white rounded-full text-xs">
            2
          </div>
        </div>
        <div className="flex flex-col">
          <span className="text-xs leading-3 font-medium">Ken Mwangi</span>
          <span className="text-[10px] text-gray-500 text-right">ADMIN</span>
        </div>
        <Image
          src="/assets/avatar.png"
          alt=""
          width={36}
          height={36}
          className="rounded-full"
        />
      </div>
    </div>
  );
}
