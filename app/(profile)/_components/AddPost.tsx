import Image from "next/image";
import React from "react";

export default function AddPost() {
  return (
    <section className="p-4 bg-white rounded-lg flex gap-4 justify-between text-sm">
      {/* Avatar */}
      <Image
        src="/assets/placeholder.jpg"
        alt="Avatar"
        height={48}
        width={48}
        className="w-12 h-12 rounded-full object-cover"
      />
      {/* POST */}
      <div className="flex-1">
        {/* TEXT INPUT */}
        <div className="flex gap-4">
          <textarea
            placeholder="What's on your mind?"
            className="bg-slate-100 rounded-lg border-none p-2 flex-1"
          ></textarea>
          <Image
            src="/assets/placeholder.jpg"
            alt="Avatar"
            height={20}
            width={20}
            className="w-5 h-5 cursor-pointer self-end"
          />
        </div>
        {/* POST OPTIONS */}
        <div className="flex items-center gap-4 mt-4 text-gray-400 flex-wrap">
          <div className="flex items-center gap-2 cursor-pointer">
            <Image
              src="/assets/add-picture.svg"
              alt="Avatar"
              height={20}
              width={20}
              className=""
            />
            Photo
          </div>
          <div className="flex items-center gap-2 cursor-pointer">
            <Image
              src="/assets/add-picture.svg"
              alt="Avatar"
              height={20}
              width={20}
              className=""
            />
            Video
          </div>
          <div className="flex items-center gap-2 cursor-pointer">
            <Image
              src="/assets/add-picture.svg"
              alt="Avatar"
              height={20}
              width={20}
              className=""
            />
            Poll
          </div>
        </div>
      </div>
    </section>
  );
}
