import { useAuth } from "../../contexts/AuthContext";

export default function AdminHeader() {
  const { currentUser, logout } = useAuth();

  return (
    <header className="flex items-center sm:flex-row sm:items-center sm:justify-between gap-4 px-4 py-2 border-b border-cyber-border/40 bg-cyber-bg/80">
      <h1 className="font-cyber pt-2 text-neon-blue text-2xl text-center sm:text-left">
        Admin Dashboard
      </h1>
      <div className="flex items-center justify-center sm:justify-end gap-4">
        <span className="font-mono text-neon-green break-all text-sm sm:text-base">
          {currentUser?.email}
        </span>
        <button
          onClick={logout}
          className="bg-neon-pink text-white font-mono px-3 py-1 rounded shadow hover:bg-neon-blue hover:text-cyber-bg transition-colors duration-200"
        >
          Logout
        </button>
      </div>
    </header>
  );
}
