import React from "react";

export default function QuickStatsCards({ stats }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className={`flex items-center gap-4 rounded-xl ${stat.bg} shadow-lg p-5 min-w-0 hover:shadow-xl transition-shadow duration-200`}
        >
          <div className="flex-shrink-0">{stat.icon}</div>
          <div>
            <div className={`text-lg font-bold ${stat.color}`}>
              {stat.value}
            </div>
            <div className="text-xs text-gray-400 font-mono">{stat.label}</div>
          </div>
        </div>
      ))}
    </div>
  );
}
