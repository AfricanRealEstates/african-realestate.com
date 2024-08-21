"use client";
import { PersonStanding } from "lucide-react";
import Image from "next/image";
import React from "react";
import {
  RadialBarChart,
  RadialBar,
  Legend,
  ResponsiveContainer,
} from "recharts";

const data = [
  {
    name: "Total",
    count: 57,
    fill: "white",
  },
  {
    name: "Active",
    count: 31,
    fill: "#82ca9d",
  },
  {
    name: "Inactive",
    count: 26,
    fill: "#fae27c",
  },
  //   {
  //     name: "30-34",
  //     uv: 15.69,
  //     pv: 1398,
  //     fill: "#8dd1e1",
  //   },
  //   {
  //     name: "35-39",
  //     uv: 8.22,
  //     pv: 9800,
  //     fill: "#82ca9d",
  //   },
  //   {
  //     name: "40-49",
  //     uv: 8.63,
  //     pv: 3908,
  //     fill: "#a4de6c",
  //   },
  //   {
  //     name: "50+",
  //     uv: 2.63,
  //     pv: 4800,
  //     fill: "#d0ed57",
  //   },
  //   {
  //     name: "unknow",
  //     uv: 6.67,
  //     pv: 4800,
  //     fill: "#ffc658",
  //   },
];

const style = {
  top: "50%",
  right: 0,
  transform: "translate(0, -50%)",
  lineHeight: "24px",
};

const CountChart = () => {
  return (
    <div className="bg-white rounded-2xl shadow-2xl shadow-gray-600/10  w-full h-full p-4">
      {/* TITLE */}
      <div className="flex justify-between items-center">
        <h1 className="text-lg font-semibold">Agents</h1>
        <Image src="/assets/moreDark.png" alt="" width={20} height={20} />
      </div>
      <div className="relative w-full h-[75%]">
        <ResponsiveContainer>
          <RadialBarChart
            cx="50%"
            cy="50%"
            innerRadius="40%"
            outerRadius="100%"
            barSize={32}
            data={data}
          >
            <RadialBar background dataKey="count" />
          </RadialBarChart>
        </ResponsiveContainer>
        <PersonStanding
          size={32}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
        />
      </div>
      <div className="flex justify-center gap-16">
        <div className="flex flex-col gap-1">
          <div className="size-5 bg-ken-green rounded-full" />
          <h1 className="font-bold">12</h1>
          <h2 className="text-xs text-gray-400">Active (55%)</h2>
        </div>
        <div className="flex flex-col gap-1">
          <div className="size-5 bg-ken-yellow rounded-full" />
          <h1 className="font-bold">12</h1>
          <h2 className="text-xs text-gray-400">Inactive (45%)</h2>
        </div>
      </div>
    </div>
  );
};

export default CountChart;
