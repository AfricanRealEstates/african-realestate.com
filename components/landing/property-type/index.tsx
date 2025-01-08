import { prisma } from "@/lib/prisma";
import { Josefin_Sans } from "next/font/google";
import React from "react";

const josefin = Josefin_Sans({
  subsets: ["latin"],
  weight: ["600"],
});

export default async function PropertyType() {
  const properties = await prisma.property.findMany({
    orderBy: { createdAt: "desc" },
    take: 3,
  });
  return (
    <section className="py-20 bg-gray-900">
      <div className="mx-auto w-[95%] max-w-7xl px-2 py-16 md:px-2 md:py-24 lg:py-20">
        <div className="mb-10 text-center text-white">
          <h5
            className={`${josefin.className} text-[14px] font-semibold uppercase`}
          >
            property type
          </h5>
          <h6
            className={`mt-2 text-white capitalize font-semibold text-4xl ${josefin.className}`}
          >
            Try Searching for
          </h6>
        </div>

        <div className="flex items-center trasition-transform relative space-x-10"></div>
      </div>
    </section>
  );
}
