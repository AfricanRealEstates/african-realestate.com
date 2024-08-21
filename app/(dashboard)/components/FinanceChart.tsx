"use client";
import Image from "next/image";
import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const data = [
  {
    name: "Jan",
    fulfilled: 4000,
    unfulfilled: 2400,
    amt: 2400,
  },
  {
    name: "Feb",
    fulfilled: 3000,
    unfulfilled: 1398,
    amt: 2210,
  },
  {
    name: "Mar",
    fulfilled: 2000,
    unfulfilled: 9800,
    amt: 2290,
  },
  {
    name: "Apr",
    fulfilled: 2780,
    unfulfilled: 3908,
    amt: 2000,
  },
  {
    name: "May",
    fulfilled: 1890,
    unfulfilled: 4800,
    amt: 2181,
  },
  {
    name: "Jun",
    fulfilled: 2390,
    unfulfilled: 3800,
    amt: 2500,
  },
  {
    name: "Jul",
    fulfilled: 3490,
    unfulfilled: 4300,
    amt: 2100,
  },
];
export default function FinanceChart() {
  return (
    <div className="bg-white w-full h-full p-4 rounded-2xl shadow-2xl shadow-gray-600/10 ">
      <div className="flex justify-between items-center">
        <h1 className="text-lg font-semibold">Finance</h1>
        <Image src="/assets/moreDark.png" alt="" width={20} height={20} />
      </div>
      <ResponsiveContainer width="100%" height="90%">
        <LineChart
          width={500}
          height={300}
          data={data}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#ddd" />
          <XAxis
            dataKey="name"
            axisLine={false}
            tick={{ fill: "#d1d5db" }}
            tickLine={false}
            tickMargin={10}
          />
          <YAxis axisLine={false} tick={{ fill: "#d1d5db" }} tickLine={false} />
          <Tooltip />
          <Legend
            align="center"
            verticalAlign="top"
            wrapperStyle={{ paddingTop: "10px", paddingBottom: "30px" }}
          />
          <Line
            type="monotone"
            dataKey="fulfilled"
            stroke="#8884d8"
            strokeWidth={5}
          />
          <Line
            type="monotone"
            dataKey="unfulfilled"
            stroke="#82ca9d"
            strokeWidth={5}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
