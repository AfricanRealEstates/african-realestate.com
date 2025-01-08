"use client";
import Image from "next/image";
import React from "react";
import {
  BarChart,
  Bar,
  Rectangle,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const data = [
  {
    name: "Mon",
    active: 24,
    inactive: 10,
  },
  {
    name: "Tue",
    active: 14,
    inactive: 12,
  },
  {
    name: "Wen",
    active: 16,
    inactive: 15,
  },
  {
    name: "Thur",
    active: 13,
    inactive: 17,
  },
  {
    name: "Fri",
    active: 20,
    inactive: 17,
  },
];
export default function ActiveAgentChart() {
  return (
    <div className="bg-white w-full h-[450px] p-4 rounded-2xl shadow-2xl shadow-gray-600/10 ">
      <div className="flex justify-between items-center">
        <h1 className="text-lg font-semibold">Active Agents</h1>
        <Image src="/assets/moreDark.png" alt="" width={20} height={20} />
      </div>
      <ResponsiveContainer width="100%" height="90%">
        <BarChart width={500} height={300} data={data} barSize={20}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#ddd" />
          <XAxis
            dataKey="name"
            axisLine={false}
            tick={{ fill: "#d1d5db" }}
            tickLine={false}
          />
          <YAxis axisLine={false} />
          <Tooltip
            contentStyle={{ borderRadius: "10px", borderColor: "lightgray" }}
          />
          <Legend
            align="left"
            verticalAlign="top"
            wrapperStyle={{ paddingTop: "20px", paddingBottom: "40px" }}
          />
          <Bar
            dataKey="active"
            fill="#c3ebfa"
            legendType="circle"
            radius={[10, 10, 0, 0]}
          />
          <Bar
            dataKey="inactive"
            fill="#fae27c"
            legendType="circle"
            radius={[10, 10, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
