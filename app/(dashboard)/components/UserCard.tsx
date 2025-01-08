import Image from "next/image";
import React from "react";

export default function UserCard({ type }: { type: string }) {
  return (
    <div className="rounded-2xl odd:bg-ken-purple even:bg-ken-yellow p-4 flex-1 min-w-[130px]">
      <div className="flex justify-between items-center">
        <span className="text-[10px] bg-white px-2 py-1 rounded-full text-green-600">
          2023/24
        </span>
        <Image src="/assets/more.png" alt="" width={20} height={20} />
      </div>
      <h1 className="2xl font-semibold my-4">12</h1>
      <h2 className="capitalize text-sm font-medium text-gray-500">{type}</h2>
    </div>
  );
}
