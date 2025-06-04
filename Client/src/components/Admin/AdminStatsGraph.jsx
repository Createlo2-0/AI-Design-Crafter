import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import React, { useState } from "react";

const chartData = {
  "5m": [
    { name: "Jan", users: 10, assets: 20 },
    { name: "Feb", users: 15, assets: 30 },
    { name: "Mar", users: 20, assets: 40 },
    { name: "Apr", users: 25, assets: 50 },
    { name: "May", users: 30, assets: 60 },
  ],
  "1y": [
    { name: "Jun", users: 40, assets: 80 },
    { name: "Jul", users: 45, assets: 90 },
    { name: "Aug", users: 50, assets: 100 },
    { name: "Sep", users: 60, assets: 110 },
    { name: "Oct", users: 70, assets: 120 },
    { name: "Nov", users: 80, assets: 130 },
    { name: "Dec", users: 90, assets: 140 },
    { name: "Jan", users: 100, assets: 150 },
    { name: "Feb", users: 110, assets: 160 },
    { name: "Mar", users: 120, assets: 170 },
    { name: "Apr", users: 130, assets: 180 },
    { name: "May", users: 140, assets: 190 },
  ],
  all: [
    { name: "2021", users: 200, assets: 400 },
    { name: "2022", users: 350, assets: 600 },
    { name: "2023", users: 500, assets: 900 },
    { name: "2024", users: 700, assets: 1200 },
  ],
};

const timeOptions = [
  { label: "Last 5 Months", value: "5m" },
  { label: "Last 1 Year", value: "1y" },
  { label: "All Time", value: "all" },
];

export default function AdminStatsGraph() {
  const [range, setRange] = useState("5m");

  return (
    <div className="bg-cyber-bg-darker p-6 rounded shadow-lg border border-cyber-border mb-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-2">
        <h3 className="font-cyber text-neon-green text-xl">
          Platform Growth ({timeOptions.find((t) => t.value === range).label})
        </h3>
        <div className="flex gap-2">
          {timeOptions.map((opt) => (
            <button
              key={opt.value}
              className={`px-3 py-1 rounded font-mono text-xs border transition-colors duration-200
                ${
                  range === opt.value
                    ? "bg-neon-blue text-cyber-bg border-neon-blue"
                    : "bg-cyber-bg text-neon-blue border-cyber-border hover:bg-neon-blue/20"
                }
              `}
              onClick={() => setRange(opt.value)}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart
          data={chartData[range]}
          margin={{ top: 10, right: 30, left: 0, bottom: 10 }}
        >
          <CartesianGrid stroke="#222a3f" strokeDasharray="3 3" />
          <XAxis
            dataKey="name"
            stroke="#00eaff"
            tick={{ fill: "#b2eaff", fontSize: 14 }}
            label={{
              value: range === "all" ? "Year" : "Month",
              position: "insideBottom",
              fill: "#b2eaff",
              offset: -5,
            }}
          />
          <YAxis
            stroke="#00eaff"
            tick={{ fill: "#b2eaff", fontSize: 14 }}
            label={{
              value: "Count",
              angle: -90,
              position: "insideLeft",
              fill: "#b2eaff",
              offset: 10,
            }}
          />
          // ...existing code...
<Tooltip
  contentStyle={{
    background: "#232a34",
    border: "1px solid #00eaff",
    borderRadius: 8,
    color: "#fff",
  }}
  labelStyle={{ color: "#00eaff" }}
  itemStyle={{ fontWeight: "bold" }}
  formatter={(value, name) => [
    value,
    name === "users" ? "Users" : name === "assets" ? "Assets" : name,
  ]}
/>
// ...existing code...
          <Legend
            verticalAlign="top"
            align="right"
            iconType="circle"
            wrapperStyle={{
              color: "#fff",
              fontFamily: "monospace",
              fontSize: 14,
            }}
          />
          <Line
            type="monotone"
            dataKey="users"
            stroke="#00eaff"
            strokeWidth={3}
            name="Users"
            dot={{ r: 5, fill: "#00eaff", stroke: "#fff", strokeWidth: 2 }}
            activeDot={{
              r: 8,
              fill: "#00eaff",
              stroke: "#fff",
              strokeWidth: 2,
            }}
          />
          <Line
            type="monotone"
            dataKey="assets"
            stroke="#ff00aa"
            strokeWidth={3}
            name="Assets"
            dot={{ r: 5, fill: "#ff00aa", stroke: "#fff", strokeWidth: 2 }}
            activeDot={{
              r: 8,
              fill: "#ff00aa",
              stroke: "#fff",
              strokeWidth: 2,
            }}
          />
        </LineChart>
      </ResponsiveContainer>
      <div className="mt-2 text-xs text-gray-400 font-mono text-center">
        <span className="inline-block mr-2">
          <span className="inline-block w-3 h-3 rounded-full bg-[#00eaff] mr-1"></span>
          Users
        </span>
        <span className="inline-block">
          <span className="inline-block w-3 h-3 rounded-full bg-[#ff00aa] mr-1"></span>
          Assets
        </span>
      </div>
    </div>
  );
}
