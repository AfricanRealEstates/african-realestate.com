import React from "react";

export default function Announcements() {
  return (
    <div className="bg-white p-4 rounded-md">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Announcements</h1>
        <span className="text-xs text-gray-400">View all</span>
      </div>
      <div className="flex flex-col gap-4 mt-4">
        <div className="bg-ken-green-light rounded-md p-4">
          <div className="flex items-center justify-between mb-1">
            <h2 className="font-medium">New Dashboard</h2>
            <span className="bg-white rounded-md text-xs px-1 py-1">
              2024-08-20
            </span>
          </div>
          <p className="text-sm text-gray-400">
            This will be the announcement displayed here for clients.
          </p>
        </div>
        <div className="bg-ken-purple-light rounded-md p-4">
          <div className="flex items-center justify-between mb-1">
            <h2 className="font-medium">Put all Roles</h2>
            <span className="bg-white rounded-md text-xs px-1 py-1">
              2024-08-20
            </span>
          </div>
          <p className="text-sm text-gray-400">
            This will be the announcement displayed here for clients.
          </p>
        </div>
        <div className="bg-ken-yellow-light rounded-md p-4">
          <div className="flex items-center justify-between mb-1">
            <h2 className="font-medium">Display different links</h2>
            <span className="bg-white rounded-md text-xs px-1 py-1">
              2024-08-20
            </span>
          </div>
          <p className="text-sm text-gray-400">
            This will be the announcement displayed here for clients.
          </p>
        </div>
      </div>
    </div>
  );
}
