import Link from "next/link";
import React, { Fragment } from "react";

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
        <div className="flex flex-col items-start space-y-1">
          {company.map((link) => {
            const { name, href, description } = link;
            return (
              <Fragment key={name}>
                <Link
                  href={href}
                  className="flex items-center gap-x-2 w-full p-1 text-gray-600 rounded-lg hover:bg-gray-100 focus:ring-2 focus:ring-blue-500"
                >
                  <div className="space-y-1 p-1">
                    <p className="font-medium text-neutral-500 group-hover:text-blue-400 transition-colors">
                      {name}
                    </p>
                    <p className="text-xs w-64 leading-relaxed text-gray-400">
                      {description}
                    </p>
                  </div>
                </Link>
                <div className="my-2 border-t border-gray-100"></div>
              </Fragment>
            );
          })}
        </div>
      </div>
    </section>
  );
}
