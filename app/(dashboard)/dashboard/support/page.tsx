import React from "react";
import EventCalendar from "../../components/EventCalendar";
import Announcements from "../../components/Announcements";

export default function Support() {
  return (
    <div className="p-4 flex gap-4 flex-col xl:flex-row">
      {/* LEFT */}
      <div className="w-full xl:w-2/3">
        <div className="h-full bg-white p-4 rounded-md shadow-2xl shadow-gray-600/10 ">
          <h1 className="text-xl font-semibold">Schedule</h1>
          <p className="text-gray-400">
            Under construction to show support functions.
          </p>
        </div>
      </div>
      {/* RIGHT */}
      <div className="w-full xl:w-1/3 flex flex-col gap-8">
        {/* <EventCalendar /> */}
        <Announcements />
      </div>
    </div>
  );
}
