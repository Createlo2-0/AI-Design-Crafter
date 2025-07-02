import React, { useState, useEffect, Fragment } from "react";
import axios from "axios";
import API_BASE_URL from "../../utils/api";

const ROLES = ["user", "admin"];
const STATUSES = ["Active", "Inactive"];

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

  // Fetch users from backend API
  useEffect(() => {
    axios
      .get(`${API_BASE_URL}/users`)
      .then((res) => setCurrentUsers(res.data))
      .catch(() => setCurrentUsers([]));
  }, []);

  // DELETE user
  const handleRemoveUser = async (userId) => {
      try {
        await axios.delete(`${API_BASE_URL}/users/${userId}`);
        setCurrentUsers((prevUsers) =>
          prevUsers.filter((user) => user.id !== userId)
        );
        alert(`User has been removed.`);
      } catch (err) {
        console.log(err);
        alert("Failed to delete user.");
      }
  };

  const filteredUsers = currentUsers.filter(
    (user) =>
      user.email.toLowerCase().includes(search.toLowerCase()) ||
      user.role.toLowerCase().includes(search.toLowerCase()) ||
      user.status.toLowerCase().includes(search.toLowerCase()) ||
      user.id.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="w-full bg-cyber-bg-darker border border-cyber-border rounded-xl shadow-lg p-4">
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
        <table className="w-full min-w-[700px] bg-cyber-bg-darker rounded">
          <thead>
            <tr className="text-neon-blue font-cyber text-left">
              <th className="p-3 border-b border-cyber-border">#</th>
              <th className="p-3 border-b border-cyber-border">Email</th>
              <th className="p-3 border-b border-cyber-border">Role</th>
              <th className="p-3 border-b border-cyber-border">Status</th>
              <th className="p-3 border-b border-cyber-border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.length === 0 ? (
              <tr>
                <td
                  colSpan={6}
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
                      {user.email}
                    </td>
                    <td className="p-3 border-b border-cyber-border capitalize">
                      {user.role}
                    </td>
                    <td className="p-3 border-b border-cyber-border">
                      <span
                        className={`px-2 py-1 rounded text-xs font-bold ${
                          user.status === "Active"
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
                  {editingUserId === user.id && (
                    <tr className="bg-cyber-bg-lighter text-gray-300 font-mono">
                      <td className="p-3 border-b border-cyber-border">
                        {idx + 1}
                      </td>
                      <td className="p-3 border-b border-cyber-border">
                        <input
                          type="email"
                          value={editedEmail}
                          onChange={(e) => setEditedEmail(e.target.value)}
                          className="w-full px-2 py-1 rounded border border-cyber-border bg-cyber-bg-dark text-neon-blue font-mono focus:outline-none focus:ring-2 focus:ring-neon-blue"
                        />
                      </td>
                      <td className="p-3 border-b border-cyber-border">
                        <select
                          value={editedRole}
                          onChange={(e) => setEditedRole(e.target.value)}
                          className="w-full px-2 py-1 rounded border border-cyber-border bg-neon-blue text-cyber-bg font-mono focus:outline-none focus:ring-2 focus:ring-neon-blue capitalize"
                        >
                          {ROLES.map((roleOption) => (
                            <option
                              key={roleOption}
                              value={roleOption}
                              className="capitalize bg-white text-gray-800"
                            >
                              {roleOption}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="p-3 border-b border-cyber-border">
                        <select
                          value={editedStatus}
                          onChange={(e) => setEditedStatus(e.target.value)}
                          className="w-full px-2 py-1 rounded border border-cyber-border bg-neon-blue text-cyber-bg font-mono focus:outline-none focus:ring-2 focus:ring-neon-blue capitalize"
                        >
                          {STATUSES.map((statusOption) => (
                            <option
                              key={statusOption}
                              value={statusOption}
                              className="capitalize bg-white text-gray-800"
                            >
                              {statusOption}
                            </option>
                          ))}
                        </select>
                      </td>
                  
                      <td className="p-3 border-b border-cyber-border">
                        <button
                          onClick={() => handleSaveEdit(user.id)}
                          className="px-2 py-1 bg-neon-green text-cyber-bg-dark rounded text-xs font-bold hover:bg-green-400 transition-colors duration-200 mr-2"
                        >
                          Save
                        </button>
                        <button
                          onClick={handleCancelEdit}
                          className="px-2 py-1 bg-gray-500 text-white rounded text-xs font-bold hover:bg-gray-600 transition-colors duration-200"
                        >
                          Cancel
                        </button>
                      </td>
                    </tr>
                  )}
                </Fragment>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
