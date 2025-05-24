import React, { useState } from "react";

// Example users data (replace with real data/fetch as needed)
const users = [
  {
    id: "1",
    email: "admin@example.com",
    role: "admin",
    status: "Active",
    joined: "2023-01-10",
  },
  {
    id: "2",
    email: "user@example.com",
    role: "user",
    status: "Inactive",
    joined: "2023-03-22",
  },
  {
    id: "3",
    email: "manager@example.com",
    role: "manager",
    status: "Active",
    joined: "2022-11-05",
  },
];

export default function UserTable() {
  const [search, setSearch] = useState("");

  const filteredUsers = users.filter(
    (user) =>
      user.email.toLowerCase().includes(search.toLowerCase()) ||
      user.role.toLowerCase().includes(search.toLowerCase()) ||
      user.status.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="w-full bg-cyber-bg-darker border border-cyber-border rounded-xl shadow-lg p-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
        <input
          type="text"
          placeholder="Search by email, role, status..."
          className="px-3 py-2 rounded border border-cyber-border bg-cyber-bg text-neon-blue font-mono focus:outline-none focus:ring-2 focus:ring-neon-blue transition"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[600px] bg-cyber-bg-darker rounded">
          <thead>
            <tr className="text-neon-blue font-cyber text-left">
              <th className="p-3 border-b border-cyber-border">Email</th>
              <th className="p-3 border-b border-cyber-border">Role</th>
              <th className="p-3 border-b border-cyber-border">Status</th>
              <th className="p-3 border-b border-cyber-border">Joined</th>
              <th className="p-3 border-b border-cyber-border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.length === 0 ? (
              <tr>
                <td
                  colSpan={5}
                  className="text-center text-gray-400 py-6 font-mono"
                >
                  No users found.
                </td>
              </tr>
            ) : (
              filteredUsers.map((user) => (
                <tr
                  key={user.id}
                  className="text-gray-300 font-mono hover:bg-cyber-bg transition"
                >
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
                    {user.joined}
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
