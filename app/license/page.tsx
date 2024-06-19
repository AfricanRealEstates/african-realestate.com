import { Button } from "@/components/utils/Button";
import { getSEOTags } from "@/lib/seo";
import Link from "next/link";
import React from "react";

export const metadata = getSEOTags({
  title: `License | African Real Estate`,
  canonicalUrlRelative: "/license",
});

export default function TermOfService() {
  return (
    <section className="mx-auto w-[95%] max-w-4xl px-5 py-32 md:px-10 md:py-36 lg:py-40">
      <div className="p-5 shadow-sm border border-neutral-100">
        <Button
          href={"/"}
          variant="outline"
          className="flex gap-x-3 items-center"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            className="w-6 h-6"
          >
            <path
              fillRule="evenodd"
              d="M15 10a.75.75 0 01-.75.75H7.612l2.158 1.96a.75.75 0 11-1.04 1.08l-3.5-3.25a.75.75 0 010-1.08l3.5-3.25a.75.75 0 111.04 1.08L7.612 9.25h6.638A.75.75 0 0115 10z"
              clipRule="evenodd"
            />
          </svg>
          Back
        </Button>
        <h1 className="text-3xl mt-6 font-extrabold pb-6">License</h1>

        <pre
          className="leading-relaxed whitespace-pre-wrap text-gray-600 text-sm"
          style={{ fontFamily: "sans-serif" }}
        >
          {`


            `}
        </pre>
      </div>
    </section>
  );
}
