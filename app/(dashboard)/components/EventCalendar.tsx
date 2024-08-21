"use client";
import Image from "next/image";
import React, { useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

type ValuePiece = Date | null;
type Value = ValuePiece | [ValuePiece, ValuePiece];

const events = [
  {
    id: 1,
    title: "New project announcement",
    time: "12:00 PM - 2:00 PM",
    description: "Announcing new housing project.",
  },
  {
    id: 2,
    title: "Subdiving Plots for sale",
    time: "12:00 PM - 2:00 PM",
    description: "Announcing new housing project.",
  },
  {
    id: 3,
    title: "Title Deeds Hand Over",
    time: "9:00 AM - 12:00 PM",
    description: "Announcing new housing project.",
  },
];
export default function EventCalendar() {
  const [value, onChange] = useState<Value>(new Date());
  return (
    <div className="bg-white p-4 rounded-2xl shadow-2xl shadow-gray-600/10">
      <Calendar onChange={onChange} value={value} />
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold my-4">Events</h1>
        <Image src="/assets/moreDark.png" width={20} height={20} alt="" />
      </div>
      <div className="flex flex-col gap-4">
        {events.map((event) => {
          return (
            <div
              className="p-5 rounded-md border-2 border-gray-100 border-t-4 odd:border-t-ken-purple even:border-t-ken-green"
              key={event.id}
            >
              <div className="flex items-center justify-between">
                <h1 className="font-semibold text-gray-600">{event.title}</h1>
                <span className="text-gray-400 text-xs">{event.time}</span>
              </div>
              <p className="mt-2 text-gray-400">{event.description}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
