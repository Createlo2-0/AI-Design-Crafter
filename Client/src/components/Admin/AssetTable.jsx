import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import API_BASE_URL from "../../utils/api";

// --- Modal Component ---
const ConfirmDeleteModal = ({ open, onConfirm, onCancel }) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        className="bg-cyber-primary border-2 border-neon-pink rounded-xl shadow-2xl p-6 w-[90vw] max-w-xs sm:max-w-sm md:max-w-md text-center"
      >
        <h2 className="text-xl font-bold text-neon-pink mb-2 font-cyber">
          Confirm Deletion
        </h2>
        <p className="mb-6 text-gray-300 font-mono">
          Are you sure you want to remove this poster? This action cannot be undone.
        </p>
        <div className="flex justify-center gap-4">
          <button
            onClick={onCancel}
            className="px-5 py-1 rounded-full border-2 border-gray-400 text-gray-300 hover:bg-gray-700 transition"
          >
            No
          </button>
          <button
            onClick={onConfirm}
            className="px-5 py-1 rounded-full border-2 border-neon-pink text-neon-pink hover:bg-neon-pink hover:text-cyber-primary transition font-bold"
          >
            Yes
          </button>
        </div>
      </motion.div>
    </div>
  );
};
// --- End Modal Component ---

export default function AssetTable() {
  const [assets, setAssets] = useState([]);
  const [search, setSearch] = useState("");
  const [filterDate, setFilterDate] = useState("");
  const [alertMsg, setAlertMsg] = useState(null);

  // Modal state
  const [showConfirm, setShowConfirm] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  // Fetch assets from backend API
  useEffect(() => {
    axios
      .get(`${API_BASE_URL}/posters`)
      .then((res) => setAssets(res.data))
      .catch(() => setAssets([]));
  }, []);

  const filteredAssets = assets.filter((asset) => {
    const prompt = asset.prompt ? asset.prompt.toLowerCase() : "";
    const style = asset.style ? asset.style.toLowerCase() : "";
    const aspectRatio = asset.aspectRatio
      ? asset.aspectRatio.toLowerCase()
      : "";
    const dimensions = asset.dimensions ? asset.dimensions.toLowerCase() : "";
    const searchTerm = search.toLowerCase();
    const matchesSearch =
      prompt.includes(searchTerm) ||
      style.includes(searchTerm) ||
      aspectRatio.includes(searchTerm) ||
      dimensions.includes(searchTerm);
    const matchesDate = filterDate
      ? asset.createdAt &&
        new Date(asset.createdAt).toLocaleDateString("en-GB") === filterDate
      : true;
    return matchesSearch && matchesDate;
  });

  // Show modal
  const handleRemove = (id) => {
    setDeleteId(id);
    setShowConfirm(true);
  };

  // Confirm delete
  const confirmRemove = async () => {
    if (!deleteId) return;
    try {
      await axios.delete(`${API_BASE_URL}/posters/${deleteId}`);
      setAssets((prev) => prev.filter((asset) => asset.id !== deleteId));
      setAlertMsg("Poster removed successfully.");
      setTimeout(() => setAlertMsg(null), 2500);
    } catch {
      setAlertMsg("Failed to delete asset.");
      setTimeout(() => setAlertMsg(null), 2500);
    }
    setShowConfirm(false);
    setDeleteId(null);
  };

  // Cancel delete
  const cancelRemove = () => {
    setShowConfirm(false);
    setDeleteId(null);
  };

  return (
    <div className="w-full bg-cyber-bg-darker border border-cyber-border rounded-xl shadow-lg p-6 space-y-6">
      {/* Alert Message */}
      {alertMsg && (
        <div className="mb-4 p-3 rounded bg-neon-pink/20 text-neon-pink font-mono text-center border border-neon-pink transition">
          {alertMsg}
        </div>
      )}

      {/* Custom Confirm Modal */}
      <AnimatePresence>
        {showConfirm && (
          <ConfirmDeleteModal
            open={showConfirm}
            onConfirm={confirmRemove}
            onCancel={cancelRemove}
          />
        )}
      </AnimatePresence>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <input
          type="text"
          placeholder="Search by prompt, style, aspect ratio, dimensions..."
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
        <table className="w-full min-w-[1400px] bg-cyber-bg-darker text-sm table-fixed">
          <thead>
            <tr className="text-neon-pink font-cyber border-b border-cyber-border text-sm">
              <th className="py-3 px-3 w-12 text-center">#</th>
              <th className="py-3 px-3 w-20 text-center">Image</th>
              <th className="py-3 px-3 w-32 text-left">Prompt</th>
              <th className="py-3 px-3 w-32 text-left">Negative Prompt</th>
              <th className="py-3 px-3 w-20 text-center">Style</th>
              <th className="py-3 px-3 w-20 text-center">Aspect Ratio</th>
              <th className="py-3 px-3 w-20 text-center">Dimensions</th>
              <th className="py-3 px-3 w-20 text-center">Seed</th>
              <th className="py-3 px-3 w-32 text-left">Campaign</th>
              <th className="py-3 px-3 w-20 text-center">Priority</th>
              <th className="py-3 px-3 w-28 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredAssets.length === 0 ? (
              <tr>
                <td
                  colSpan={12}
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
                  <td className="py-4 px-3 text-center align-top">
                    {index + 1}
                  </td>
                  <td className="py-4 px-3 text-center align-top">
                    <img
                      src={asset.imageUrl}
                      alt={asset.prompt || "Poster"}
                      className="w-12 h-12 object-cover rounded shadow border border-cyber-border mx-auto"
                    />
                  </td>
                  <td className="py-4 px-3 text-left align-top break-words">
                    {asset.prompt || "-"}
                  </td>
                  <td className="py-4 px-3 text-left align-top break-words">
                    {asset.negativePrompt ||
                      asset.metadata?.negativePrompt ||
                      "-"}
                  </td>
                  <td className="py-4 px-3 text-center align-top">
                    {asset.style || "-"}
                  </td>
                  <td className="py-4 px-3 text-center align-top">
                    {asset.aspectRatio || "-"}
                  </td>
                  <td className="py-4 px-3 text-center align-top">
                    {asset.dimensions || "-"}
                  </td>
                  <td className="py-4 px-3 text-center align-top">
                    {asset.seed ?? "-"}
                  </td>
                  <td className="py-4 px-3 text-left align-top">
                    {asset.metadata?.campaign || "-"}
                  </td>
                  <td className="py-4 px-3 text-center align-top">
                    {asset.metadata?.priority || "-"}
                  </td>
                  <td className="py-4 px-3 text-center align-top">
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