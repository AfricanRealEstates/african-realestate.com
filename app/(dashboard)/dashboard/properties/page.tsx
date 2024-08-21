import React from "react";
import TableSearch from "../../components/TableSearch";
import Image from "next/image";

export default function Properties() {
  return (
    <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
      <div className="flex items-center justify-between">
        <h1 className="hidden sm:block text-lg font-semibold">
          All properties
        </h1>
        <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
          <TableSearch />
          <div className="flex items-center gap-4 self-end">
            <button className="size-8 flex items-center justify-center rounded-full bg-ken-yellow">
              <Image src="/assets/filter.png" width={14} height={14} alt="" />
            </button>
            <button className="size-8 flex items-center justify-center rounded-full bg-ken-yellow">
              <Image src="/assets/sort.png" width={14} height={14} alt="" />
            </button>
            <button className="size-8 flex items-center justify-center rounded-full bg-ken-yellow">
              <Image src="/assets/plus.png" width={14} height={14} alt="" />
            </button>
          </div>
        </div>
      </div>
      <div className=""></div>
      <div className=""></div>
    </div>
  );
}
