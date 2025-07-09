import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  Cell
} from "recharts";
import React, { useEffect, useState } from "react";
import axios from "axios";
import API_BASE_URL from "../../utils/api";

export default function AdminStatsGraph() {
  const [userCount, setUserCount] = useState(0);
  const [assetCount, setAssetCount] = useState(0);

  useEffect(() => {
    axios
      .get(`${API_BASE_URL}/users/ttc`)
      .then((res) => {
        setUserCount(
          res.data && typeof res.data.totalUsers === "number"
            ? res.data.totalUsers
            : 0
        );
      })
      .catch(() => setUserCount(0));

    axios
      .get(`${API_BASE_URL}/posters/count/ttc`)
      .then((res) => {
        setAssetCount(
          res.data && typeof res.data.totalPosters === "number"
            ? res.data.totalPosters
            : 0
        );
      })
      .catch(() => setAssetCount(0));
  }, []);

  const data = [
    {
      name: "Users",
      count: userCount,
      fill: "#00eaff",
    },
    {
      name: "Assets",
      count: assetCount,
      fill: "#ff00aa",
    },
  ];

  return (
    <div className="bg-cyber-bg-darker p-6 rounded shadow-lg border border-cyber-border mb-8">
      <h3 className="font-cyber text-neon-green text-xl mb-4">
        Total Users & Assets
      </h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart
          data={data}
          margin={{ top: 10, right: 30, left: 0, bottom: 10 }}
          barCategoryGap={60}
        >
          <CartesianGrid stroke="#222a3f" strokeDasharray="3 3" />
          <XAxis
            dataKey="name"
            stroke="#00eaff"
            tick={{ fill: "#b2eaff", fontSize: 16 }}
          />
          <YAxis
            stroke="#00eaff"
            tick={{ fill: "#b2eaff", fontSize: 16 }}
            allowDecimals={false}
          />
          <Tooltip
            contentStyle={{
              background: "#232a34",
              border: "1px solid #00eaff",
              borderRadius: 8,
              color: "#fff",
            }}
            labelStyle={{ color: "#00eaff" }}
            itemStyle={{ fontWeight: "bold" }}
            formatter={(value, name) => [value, name]}
          />
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
          <Bar dataKey="count" name="Count" radius={[8, 8, 0, 0]}>
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.fill} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
      <div className="mt-2 text-xs text-gray-400 font-mono text-center">
        <span className="inline-block mr-4">
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
