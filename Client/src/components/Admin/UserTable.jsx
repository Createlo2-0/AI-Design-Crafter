// /Users/anjalikarki/Downloads/designcrafter/AI-Design-Crafter/Client/src/components/Admin/UserTable.jsx
import React, { useState, Fragment } from "react";

// Example users data (replace with real data/fetch as needed)
const initialUsers = [
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
];

// UPDATED: Define available roles
const ROLES = ["user", "admin"];
// NEW: Define available statuses
const STATUSES = ["Active", "Inactive"];

export default function UserTable() {
  const [search, setSearch] = useState("");
  const [currentUsers, setCurrentUsers] = useState(initialUsers);
  const [editingUserId, setEditingUserId] = useState(null);
  const [editedEmail, setEditedEmail] = useState("");
  const [editedRole, setEditedRole] = ROLES.length > 0 ? useState(ROLES[0]) : useState("");
  const [editedStatus, setEditedStatus] = STATUSES.length > 0 ? useState(STATUSES[0]) : useState("");

  const [isAddingUser, setIsAddingUser] = useState(false);
  const [newUserEmail, setNewUserEmail] = useState("");
  const [newUserRole, setNewUserRole] = ROLES.length > 0 ? useState(ROLES[0]) : useState("user");

  const handleCancelEdit = () => {
    setEditingUserId(null);
    setEditedEmail("");
    setEditedRole(ROLES.length > 0 ? ROLES[0] : "user");
    setEditedStatus(STATUSES.length > 0 ? STATUSES[0] : "Active");
    console.log("Edit cancelled.");
  };
  
  const handleCancelAddNewUser = () => {
    setIsAddingUser(false);
    setNewUserEmail("");
    setNewUserRole(ROLES.length > 0 ? ROLES[0] : "user");
  };

  const handleEditUser = (userId, userEmail, currentRole, currentStatus) => {
    if (isAddingUser) {
        handleCancelAddNewUser();
    }
    setEditingUserId(userId);
    setEditedEmail(userEmail);
    setEditedRole(currentRole);
    setEditedStatus(currentStatus);
    console.log(`Start editing User ID: ${userId}, Email: ${userEmail}, Role: ${currentRole}, Status: ${currentStatus}`);
  };

  const handleSaveEdit = (userIdToSave) => {
    setCurrentUsers((prevUsers) =>
      prevUsers.map((user) =>
        user.id === userIdToSave
          ? { ...user, email: editedEmail, role: editedRole, status: editedStatus }
          : user
      )
    );
    setEditingUserId(null);
    console.log(`Saved changes for User ID: ${userIdToSave}, New Email: ${editedEmail}, New Role: ${editedRole}, New Status: ${editedStatus}`);
    alert(`User ${userIdToSave} updated (simulated).`);
  };

  const handleRemoveUser = (userId, userEmail) => {
    if (editingUserId === userId) {
      handleCancelEdit();
    }
    if (window.confirm(`Are you sure you want to remove user: ${userEmail} (ID: ${userId})? This will remove them from the current view.`)) {
      setCurrentUsers(prevUsers => prevUsers.filter(user => user.id !== userId));
      console.log(`User ID: ${userId}, Email: ${userEmail} has been removed from the list (UI update).`);
      alert(`User ${userEmail} (ID: ${userId}) has been removed from the list.\n\n(In a real application, a backend call would permanently delete the user.)`);
    } else {
      console.log(`User ${userId} removal was cancelled.`);
    }
  };
  
  const handleShowAddUserForm = () => {
    if (editingUserId) {
        handleCancelEdit();
    }
    setIsAddingUser(true);
    setNewUserEmail("");
    setNewUserRole(ROLES.length > 0 ? ROLES[0] : "user");
  };

  const handleSubmitNewUser = (e) => {
    e.preventDefault();
    if (!newUserEmail.trim()) {
      alert("Email cannot be empty.");
      return;
    }
    if (!/\S+@\S+\.\S+/.test(newUserEmail)) {
        alert("Please enter a valid email address.");
        return;
    }
    if (currentUsers.some(user => user.email.toLowerCase() === newUserEmail.trim().toLowerCase())) {
        alert("A user with this email already exists.");
        return;
    }

    const maxId = currentUsers.length > 0 
        ? Math.max(...currentUsers.map(user => parseInt(user.id))) 
        : 0;
    const newUserId = (maxId + 1).toString();

    const newUser = {
      id: newUserId,
      email: newUserEmail.trim(),
      role: newUserRole,
      status: "Active",
      joined: new Date().toISOString().split("T")[0],
    };

    setCurrentUsers((prevUsers) => [...prevUsers, newUser]); 
    handleCancelAddNewUser(); 
    console.log("New user added:", newUser);
    alert(`User ${newUser.email} added successfully with ID: ${newUserId}!`);
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
          disabled={isAddingUser || editingUserId !== null}
        />
        <button
          onClick={handleShowAddUserForm}
          className="px-4 py-2 bg-neon-blue text-cyber-bg rounded font-bold hover:bg-neon-pink transition-colors duration-200 text-sm whitespace-nowrap"
          disabled={isAddingUser || editingUserId !== null}
        >
          Add New User
        </button>
      </div>

      {isAddingUser && (
        <form onSubmit={handleSubmitNewUser} className="mb-6 p-4 border border-cyber-border rounded-lg bg-cyber-bg-lighter">
          <h3 className="text-lg font-cyber text-neon-blue mb-3">Add New User</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label htmlFor="newUserEmail" className="block text-sm font-mono text-gray-400 mb-1">Email:</label>
              <input
                type="email"
                id="newUserEmail"
                value={newUserEmail}
                onChange={(e) => setNewUserEmail(e.target.value)}
                className="w-full px-3 py-2 rounded border border-cyber-border bg-cyber-bg-dark text-neon-blue font-mono focus:outline-none focus:ring-2 focus:ring-neon-blue"
                required
              />
            </div>
            <div>
              <label htmlFor="newUserRole" className="block text-sm font-mono text-gray-400 mb-1">Role:</label>
              <select
                id="newUserRole"
                value={newUserRole}
                onChange={(e) => setNewUserRole(e.target.value)}
                className="w-full px-3 py-2 rounded border border-cyber-border bg-neon-blue text-cyber-bg font-mono focus:outline-none focus:ring-2 focus:ring-neon-blue capitalize"
              >
                {ROLES.map(roleOption => (
                  <option
                    key={roleOption}
                    value={roleOption}
                    className="capitalize bg-white text-gray-800"
                  >
                    {roleOption}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <p className="text-sm font-mono text-gray-400 mb-4">
            Default Status: <span className="text-neon-green">Active</span> | Joined Date: <span className="text-neon-blue">Auto-generated</span>
          </p>
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={handleCancelAddNewUser}
              className="px-3 py-2 bg-gray-500 text-white rounded text-xs font-bold hover:bg-gray-600 transition-colors duration-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-3 py-2 bg-neon-blue text-cyber-bg rounded text-xs font-bold hover:bg-neon-pink transition-colors duration-200"
            >
              Save User
            </button>
          </div>
        </form>
      )}

      <div className="overflow-x-auto">
        <table className="w-full min-w-[700px] bg-cyber-bg-darker rounded">
          <thead>
            <tr className="text-neon-blue font-cyber text-left">
              <th className="p-3 border-b border-cyber-border">User ID</th>
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
                <td colSpan={6} className="text-center text-gray-400 py-6 font-mono">
                  No users found.
                </td>
              </tr>
            ) : (
              filteredUsers.map((user) => (
                <Fragment key={user.id}>
                  <tr
                    className={`text-gray-300 font-mono hover:bg-cyber-bg transition ${
                      editingUserId === user.id ? "hidden" : ""
                    }`}
                  >
                    <td className="p-3 border-b border-cyber-border">{user.id}</td>
                    <td className="p-3 border-b border-cyber-border">{user.email}</td>
                    <td className="p-3 border-b border-cyber-border capitalize">{user.role}</td>
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
                    <td className="p-3 border-b border-cyber-border">{user.joined}</td>
                    <td className="p-3 border-b border-cyber-border">
                      <button
                        onClick={() => handleEditUser(user.id, user.email, user.role, user.status)}
                        className="px-2 py-1 bg-neon-blue text-cyber-bg rounded text-xs font-bold hover:bg-neon-pink transition-colors duration-200 mr-2"
                        disabled={(editingUserId !== null && editingUserId !== user.id) || isAddingUser}
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleRemoveUser(user.id, user.email)}
                        className="px-2 py-1 bg-neon-pink text-white rounded text-xs font-bold hover:bg-neon-blue transition-colors duration-200"
                        disabled={editingUserId !== null || isAddingUser}
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                  {editingUserId === user.id && (
                    <tr className="bg-cyber-bg-lighter text-gray-300 font-mono">
                      <td className="p-3 border-b border-cyber-border">{user.id}</td>
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
                          {ROLES.map(roleOption => (
                            <option key={roleOption} value={roleOption} className="capitalize bg-white text-gray-800">
                              {roleOption}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="p-3 border-b border-cyber-border">
                        <select
                          value={editedStatus}
                          onChange={(e) => setEditedStatus(e.target.value)}
                          className="w-full px-2 py-1 rounded border border-cyber-border bg-neon-blue text-cyber-bg font-mono focus:outline-none focus:ring-2 focus:ring-neon-blue capitalize" // <-- MODIFIED STYLE HERE
                        >
                          {STATUSES.map(statusOption => (
                            <option key={statusOption} value={statusOption} className="capitalize bg-white text-gray-800">
                              {statusOption}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="p-3 border-b border-cyber-border">{user.joined}</td>
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