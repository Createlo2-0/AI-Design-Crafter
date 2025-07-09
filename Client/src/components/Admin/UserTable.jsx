import React, { useState, useEffect, Fragment } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import API_BASE_URL from "../../utils/api";

const ROLES = ["user", "admin"];
const STATUSES = ["Active", "Inactive"];

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
          Confirm User Removal
        </h2>
        <p className="mb-6 text-gray-300 font-mono">
          Are you sure you want to remove this user? This action cannot be
          undone.
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

export default function UserTable() {
  const [search, setSearch] = useState("");
  const [currentUsers, setCurrentUsers] = useState([]);
  const [editingUserId, setEditingUserId] = useState(null);
  const [editedEmail, setEditedEmail] = useState("");
  const [editedRole, setEditedRole] = useState(ROLES[0]);
  const [editedStatus, setEditedStatus] = useState(STATUSES[0]);
  const [isAddingUser, setIsAddingUser] = useState(false);
  const [newUserEmail, setNewUserEmail] = useState("");
  const [newUserRole, setNewUserRole] = useState(ROLES[0]);
  const [showConfirm, setShowConfirm] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [alertMsg, setAlertMsg] = useState(null);

  // Fetch users from backend API
  useEffect(() => {
    axios
      .get(`${API_BASE_URL}/users`)
      .then((res) => setCurrentUsers(res.data))
      .catch(() => setCurrentUsers([]));
  }, []);

  // Show modal
  const handleRemoveUser = (userId) => {
    setDeleteId(userId);
    setShowConfirm(true);
  };

  // Confirm delete
  const confirmRemove = async () => {
    if (!deleteId) return;
    try {
      await axios.delete(`${API_BASE_URL}/users/${deleteId}`);
      setCurrentUsers((prevUsers) =>
        prevUsers.filter((user) => user.id !== deleteId)
      );
      setAlertMsg("User has been removed.");
      setTimeout(() => setAlertMsg(null), 2500);
    } catch (err) {
      setAlertMsg("Failed to delete user.");
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

  const filteredUsers = currentUsers.filter(
    (user) =>
      (user.email && user.email.toLowerCase().includes(search.toLowerCase())) ||
      (user.role && user.role.toLowerCase().includes(search.toLowerCase())) ||
      (user.status &&
        user.status.toLowerCase().includes(search.toLowerCase())) ||
      (user.id && user.id.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="w-full bg-cyber-bg-darker border border-cyber-border rounded-xl shadow-lg p-4">
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

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
        <input
          type="text"
          placeholder="Search by ID, email, role, status..."
          className="px-3 py-2 rounded border border-cyber-border bg-cyber-bg text-neon-blue font-mono focus:outline-none focus:ring-2 focus:ring-neon-blue transition"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          disabled={isAddingUser}
        />
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[1200px] bg-cyber-bg-darker rounded">
          <thead>
            <tr className="text-neon-blue font-cyber text-left">
              <th className="p-3 border-b border-cyber-border">#</th>
              <th className="p-3 border-b border-cyber-border">Avatar</th>
              <th className="p-3 border-b border-cyber-border">Display Name</th>
              <th className="p-3 border-b border-cyber-border">Email</th>
              <th className="p-3 border-b border-cyber-border">Phone</th>
              <th className="p-3 border-b border-cyber-border">Provider</th>
              <th className="p-3 border-b border-cyber-border">Role</th>
              <th className="p-3 border-b border-cyber-border">Status</th>
              <th className="p-3 border-b border-cyber-border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.length === 0 ? (
              <tr>
                <td
                  colSpan={12}
                  className="text-center text-gray-400 py-6 font-mono"
                >
                  No users found.
                </td>
              </tr>
            ) : (
              filteredUsers.map((user, idx) => (
                <Fragment key={user.id}>
                  <tr
                    className={`text-gray-300 font-mono hover:bg-cyber-bg transition ${
                      editingUserId === user.id ? "hidden" : ""
                    }`}
                  >
                    <td className="p-3 border-b border-cyber-border">
                      {idx + 1}
                    </td>
                    <td className="p-3 border-b border-cyber-border">
                      {user.avatarUrl ? (
                        <img
                          src={user.avatarUrl}
                          alt={user.displayName || user.email}
                          className="w-10 h-10 rounded-full object-cover border border-cyber-border"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full flex items-center justify-center bg-cyber-bg border border-cyber-border text-neon-blue font-bold text-lg">
                          {(
                            user.displayName?.[0] ||
                            user.email?.[0] ||
                            "U"
                          ).toUpperCase()}
                        </div>
                      )}
                    </td>
                    <td className="p-3 border-b border-cyber-border">
                      {user.displayName || (
                        <span className="text-cyber-border">N/A</span>
                      )}
                    </td>
                    <td className="p-3 border-b border-cyber-border">
                      {user.email}
                    </td>
                    <td className="p-3 border-b border-cyber-border">
                      {user.phoneNumber || (
                        <span className="text-cyber-border">N/A</span>
                      )}
                    </td>
                    <td className="p-3 border-b border-cyber-border">
                      {user.provider || (
                        <span className="text-cyber-border">N/A</span>
                      )}
                    </td>
                    <td className="p-3 border-b border-cyber-border capitalize">
                      {user.role}
                    </td>
                    <td className="p-3 border-b border-cyber-border">
                      <span
                        className={`px-2 py-1 rounded text-xs font-bold ${
                          user.status === "active"
                            ? "bg-neon-green/20 text-neon-green"
                            : "bg-neon-pink/20 text-neon-pink"
                        }`}
                      >
                        {user.status}
                      </span>
                    </td>
                    <td className="p-3 border-b border-cyber-border">
                      <button
                        onClick={() => handleRemoveUser(user.id)}
                        className="px-2 py-1 bg-neon-pink text-white rounded text-xs font-bold hover:bg-neon-blue transition-colors duration-200"
                        disabled={isAddingUser}
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                </Fragment>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
