"use client";
import { Undo2 } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";
export default function BackProperty() {
  const router = useRouter();
  return (
    <div
      onClick={() => router.push("/properties")}
      className="flex items-center gap-4 cursor-pointer py-2 mb-4 max-w-fit px-2 rounded-md text-white bg-[rgba(38,38,38,.8)] hover:bg-black transition-all ease-linear uppercase font-medium mt-8 lg:mt-0"
    >
      <Undo2 className="h-5 w-5" /> Back to properties
    </div>
  );
}
