import React, { useState } from "react";

const assets = [
  {
    id: "a1",
    name: "Cyberpunk Cityscape",
    owner: "user@example.com",
    image:
      "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=facearea&w=80&h=80",
  },
  {
    id: "a2",
    name: "Glitching Android Portrait",
    owner: "admin@example.com",
    image:
      "https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=facearea&w=80&h=80",
  },
];

export default function AssetTable() {
  const [search, setSearch] = useState("");

  const filteredAssets = assets.filter(
    (asset) =>
      asset.name.toLowerCase().includes(search.toLowerCase()) ||
      asset.owner.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="w-full bg-cyber-bg-darker border border-cyber-border rounded-xl shadow-lg p-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
        <input
          type="text"
          placeholder="Search by name or owner..."
          className="w-full sm:w-64 px-3 py-2 rounded border border-cyber-border bg-cyber-bg text-neon-pink font-mono focus:outline-none focus:ring-2 focus:ring-neon-pink transition"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[400px] bg-cyber-bg-darker rounded text-sm">
          <thead>
            <tr className="text-neon-pink font-cyber text-left">
              <th className="p-3 border-b border-cyber-border">Image</th>
              <th className="p-3 border-b border-cyber-border">Asset Name</th>
              <th className="p-3 border-b border-cyber-border">Owner</th>
              <th className="p-3 border-b border-cyber-border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredAssets.length === 0 ? (
              <tr>
                <td
                  colSpan={4}
                  className="text-center text-gray-400 py-6 font-mono"
                >
                  No assets found.
                </td>
              </tr>
            ) : (
              filteredAssets.map((asset) => (
                <tr
                  key={asset.id}
                  className="text-gray-300 font-mono hover:bg-cyber-bg transition"
                >
                  <td className="p-3 border-b border-cyber-border">
                    <img
                      src={asset.image}
                      alt={asset.name}
                      className="w-10 h-10 sm:w-12 sm:h-12 object-cover rounded shadow border border-cyber-border"
                    />
                  </td>
                  <td className="p-3 border-b border-cyber-border break-all">
                    {asset.name}
                  </td>
                  <td className="p-3 border-b border-cyber-border break-all">
                    {asset.owner}
                  </td>
                  <td className="p-3 border-b border-cyber-border">
                    <button className="px-2 py-1 bg-neon-blue text-cyber-bg rounded text-xs font-bold hover:bg-neon-pink transition-colors duration-200 mr-2">
                      Edit
                    </button>
                    <button className="px-2 py-1 bg-neon-pink text-white rounded text-xs font-bold hover:bg-neon-blue transition-colors duration-200">
                      Remove
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
