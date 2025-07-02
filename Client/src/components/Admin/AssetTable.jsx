import React, { useState, useEffect } from "react";
import axios from "axios";
import API_BASE_URL from "../../utils/api";

export default function AssetTable() {
  const [assets, setAssets] = useState([]);
  const [search, setSearch] = useState("");
  const [filterDate, setFilterDate] = useState("");

  // Fetch assets from backend API
  useEffect(() => {
    axios
      .get(`${API_BASE_URL}/posters`)
      .then((res) => setAssets(res.data))
      .catch(() => setAssets([]));
  }, []);

  const filteredAssets = assets.filter((asset) => {
    // Defensive: check if fields exist before using toLowerCase
    const name = asset.name ? asset.name.toLowerCase() : "";
    const userId = asset.userId ? asset.userId.toLowerCase() : "";
    const prompt = asset.prompt ? asset.prompt.toLowerCase() : "";
    const searchTerm = search.toLowerCase();
    const matchesSearch =
      name.includes(searchTerm) ||
      userId.includes(searchTerm) ||
      prompt.includes(searchTerm);
    const matchesDate = filterDate ? asset.date === filterDate : true;
    return matchesSearch && matchesDate;
  });

  // DELETE asset
  const handleRemove = async (id) => {
    const confirm = window.confirm(
      "Are you sure you want to remove this poster?"
    );
    if (confirm) {
      try {
        await axios.delete(`${API_BASE_URL}/posters/${id}`);
        setAssets((prev) => prev.filter((asset) => asset.id !== id));
      } catch {
        alert("Failed to delete asset.");
      }
    }
  };

  return (
    <div className="w-full bg-cyber-bg-darker border border-cyber-border rounded-xl shadow-lg p-6 space-y-6">
      {/* Filters */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <input
          type="text"
          placeholder="Search by name, user ID, or prompt..."
          className="w-full sm:w-80 px-4 py-2 rounded border border-cyber-border bg-cyber-bg text-neon-pink font-mono text-sm focus:outline-none focus:ring-2 focus:ring-neon-pink transition"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full min-w-[1100px] bg-cyber-bg-darker text-sm table-fixed">
          <thead>
            <tr className="text-neon-pink font-cyber text-middle border-b border-cyber-border text-sm">
              <th className="py-3 px-3 w-12">#</th>
              <th className="py-3 px-3 w-20">Image</th>
              <th className="py-3 px-3 w-48">User ID</th>
              <th className="py-3 px-3 w-[30rem]">Prompt</th>
              <th className="py-3 px-3 w-28">Date</th>
              <th className="py-3 px-3 w-28">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredAssets.length === 0 ? (
              <tr>
                <td
                  colSpan={7}
                  className="text-center text-gray-400 py-8 font-mono"
                >
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
                      src={asset.imageUrl}
                      alt={asset.name || "Poster"}
                      className="w-12 h-12 object-cover rounded shadow border border-cyber-border"
                    />
                  </td>
                  <td className="py-4 px-3 break-words">
                    {asset.userId || "-"}
                  </td>
                  <td className="py-4 px-3 break-words">
                    {asset.prompt || "-"}
                  </td>
                  <td className="py-4 px-3 whitespace-nowrap">
                    {asset.date
                      ? new Date(asset.date).toLocaleDateString("en-GB", {
                          day: "2-digit",
                          month: "2-digit",
                          year: "numeric",
                        })
                      : ""}
                  </td>
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
