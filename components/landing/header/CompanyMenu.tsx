import Link from "next/link";
import React from "react";

const company = [
  {
    name: "About us",
    href: "/about",
    description: "Our Company Vision, Values and Mission.",
  },
  {
    name: "Careers",
    href: "/careers",
    description: "Explore all of our Open Positions.",
  },
  {
    name: "Partners",
    href: "/contact",
    description: "Get in touch with our dedicated Support Team.",
  },
  {
    name: "Blog",
    href: "/blog",
    description: "Read our latest announcements, guides and insights",
  },
];

export default function CompanyMenu() {
  return (
    <section className="border rounded-sm shadow-md bg-white absolute top-full text-gray-400">
      <div className="flex cursor-pointer p-3">
        <div className="flex flex-col items-start space-y-3">
          {company.map((link) => {
            const { name, href, description } = link;
            return (
              <Link
                href={href}
                key={name}
                className="group flex items-center gap-4"
              >
                <div className="space-y-2 p-2">
                  <p className="font-medium text-neutral-500 hover:text-blue-400 transition-colors">
                    {name}
                  </p>
                  <p className="text-xs w-64 leading-relaxed text-gray-400">
                    {description}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
