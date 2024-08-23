"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Breadcrumb() {
  const pathname = usePathname();
  const pathSegments = pathname.split("/").filter(Boolean);

  // Define breadcrumb items for dynamic pages
  const breadcrumbItems = [
    { name: "Properties", path: "properties" },
    { name: "Users", path: "users" },
    { name: "Agencies", path: "agencies" },
    { name: "Agents", path: "agents" },
    { name: "Support", path: "support" },
    { name: "Events", path: "events" },
    { name: "Messages", path: "messages" },
    { name: "Announcements", path: "announcements" },
    { name: "Profile", path: "profile" },
    { name: "Settings", path: "settings" },
  ];

  const currentPage = breadcrumbItems.find(
    (item) => pathSegments[1] === item.path
  );

  return (
    <nav className="lg:flex mb-5 hidden" aria-label="Breadcrumb">
      <ol className="inline-flex items-center space-x-1 text-sm font-medium md:space-x-2">
        {/* Home breadcrumb */}
        <li className="inline-flex items-center">
          <Link
            href="/dashboard"
            className="inline-flex items-center text-gray-700 hover:text-primary-600 dark:text-gray-300 dark:hover:text-white"
          >
            <svg
              className="w-5 h-5 mr-2.5"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"></path>
            </svg>
            Home
          </Link>
        </li>

        {/* Dynamic Breadcrumb */}
        {currentPage && (
          <li>
            <div className="flex items-center">
              <svg
                className="w-6 h-6 text-gray-400"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                  clipRule="evenodd"
                ></path>
              </svg>
              <Link
                href={`/dashboard/${currentPage.path}`}
                className="ml-1 text-gray-700 hover:text-primary-600 md:ml-2 dark:text-gray-300 dark:hover:text-white"
              >
                {currentPage.name}
              </Link>
            </div>
          </li>
        )}

        {/* List page breadcrumb (current page) */}
        <li>
          <div className="flex items-center">
            <svg
              className="w-6 h-6 text-gray-400"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                clipRule="evenodd"
              ></path>
            </svg>
            <span
              className="ml-1 text-gray-400 md:ml-2 dark:text-gray-500"
              aria-current="page"
            >
              List
            </span>
          </div>
        </li>
      </ol>
    </nav>
  );
}
