import React, { useState } from "react";

const initialAssets = [
  {
    id: "a1",
    name: "Cyberpunk Cityscape",
    owner: "user@example.com",
    prompt: "Futuristic skyline with neon lights and a flying car in a dystopian city.",
    date: "2025-05-24",
    image:
      "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=facearea&w=80&h=80",
  },
  {
    id: "a2",
    name: "Glitching Android Portrait",
    owner: "admin@example.com",
    prompt: "Close-up portrait of a glitching android, with high-contrast light, neon lines, and fragmented data effects.",
    date: "2025-05-25",
    image:
      "https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=facearea&w=80&h=80",
  },
];

export default function AssetTable() {
  const [assets, setAssets] = useState(initialAssets);
  const [search, setSearch] = useState("");
  const [filterDate, setFilterDate] = useState("");

  const filteredAssets = assets.filter((asset) => {
    const matchesSearch =
      asset.name.toLowerCase().includes(search.toLowerCase()) ||
      asset.owner.toLowerCase().includes(search.toLowerCase()) ||
      asset.prompt.toLowerCase().includes(search.toLowerCase());
    const matchesDate = filterDate ? asset.date === filterDate : true;
    return matchesSearch && matchesDate;
  });

  const handleRemove = (id) => {
    const confirm = window.confirm("Are you sure you want to remove this poster?");
    if (confirm) {
      setAssets((prev) => prev.filter((asset) => asset.id !== id));
    }
  };

  return (
    <div className="w-full bg-cyber-bg-darker border border-cyber-border rounded-xl shadow-lg p-6 space-y-6">
      {/* Filters */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <input
          type="text"
          placeholder="Search by name, owner, or prompt..."
          className="w-full sm:w-80 px-4 py-2 rounded border border-cyber-border bg-cyber-bg text-neon-pink font-mono text-sm focus:outline-none focus:ring-2 focus:ring-neon-pink transition"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <input
          type="date"
          className="w-full sm:w-60 px-4 py-2 rounded border border-cyber-border bg-cyber-bg text-neon-blue font-mono text-sm focus:outline-none focus:ring-2 focus:ring-neon-blue transition"
          value={filterDate}
          onChange={(e) => setFilterDate(e.target.value)}
        />
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full min-w-[1100px] bg-cyber-bg-darker text-sm table-fixed">
          <thead>
            <tr className="text-neon-pink font-cyber text-middle border-b border-cyber-border text-sm">
              <th className="py-3 px-3 w-12">ID</th>
              <th className="py-3 px-3 w-20">Thumbnail</th>
              <th className="py-3 px-3 w-48">Poster Name</th>
              <th className="py-3 px-3 w-48">Owner</th>
              <th className="py-3 px-3 w-[30rem]">Prompt</th>
              <th className="py-3 px-3 w-32">Date</th>
              <th className="py-3 px-3 w-28">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredAssets.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center text-gray-400 py-8 font-mono">
                  No posters found.
                </td>
              </tr>
            ) : (
              filteredAssets.map((asset, index) => (
                <tr
                  key={asset.id}
                  className="text-gray-300 font-mono hover:bg-cyber-bg transition border-b border-cyber-border"
                >
                  <td className="py-4 px-3 text-center">{index + 1}</td>
                  <td className="py-4 px-3">
                    <img
                      src={asset.image}
                      alt={asset.name}
                      className="w-12 h-12 object-cover rounded shadow border border-cyber-border"
                    />
                  </td>
                  <td className="py-4 px-3 break-words">{asset.name}</td>
                  <td className="py-4 px-3 break-words">{asset.owner}</td>
                  <td className="py-4 px-3 break-words">{asset.prompt}</td>
                  <td className="py-4 px-3 whitespace-nowrap">{asset.date}</td>
                  <td className="py-4 px-3">
                    <button
                      onClick={() => handleRemove(asset.id)}
                      className="px-3 py-1 bg-neon-pink text-white rounded text-xs font-bold hover:bg-neon-blue transition-colors duration-200"
                    >
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
