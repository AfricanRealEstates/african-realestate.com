import Image from "next/image";
import React from "react";

export default function Stories() {
  return (
    <section className="p-4 bg-white rounded-lg shadow-md overflow-scroll text-xs scrollbar-hide">
      <div className="flex gap-8 w-max">
        {Array.from({ length: 8 }).map((_, index) => (
          <div
            key={index}
            className="flex flex-col items-center gap-2 cursor-pointer"
          >
            <Image
              src="/assets/placeholder.jpg"
              alt="Stories"
              width={80}
              height={80}
              className="w-20 h-20 rounded-full ring-2"
            />
            <span className="font-medium">Ken</span>
          </div>
        ))}
      </div>
    </section>
  );
}
