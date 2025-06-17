import React from "react";

export default function AdminTips() {
  return (
    <div className="bg-gradient-to-r from-neon-blue/20 via-cyber-bg-darker to-neon-pink/20 rounded-xl p-6 shadow flex flex-col md:flex-row md:items-center gap-4 hover:shadow-xl transition-shadow duration-200">
      <div className="flex-1">
        <h4 className="font-cyber text-neon-pink text-lg mb-2">Admin Tips</h4>
        <ul className="list-disc list-inside text-gray-300 font-mono text-sm space-y-1">
          <li>Use the sidebar to quickly switch between management panels.</li>
          <li>Monitor platform stats and trends in real time.</li>
          <li>All actions are logged for security and transparency.</li>
        </ul>
      </div>
      <div className="flex-shrink-0 flex items-center gap-2">
        <span className="inline-block w-3 h-3 rounded-full bg-neon-green animate-pulse"></span>
        <span className="text-xs text-neon-green font-bold">
          System Healthy
        </span>
      </div>
    </div>
  );
}
