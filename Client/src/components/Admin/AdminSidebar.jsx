import { Link, NavLink, useLocation } from "react-router-dom";
import { useState } from "react";

const links = [
  { to: "/admin", label: "Dashboard" },
  { to: "/admin/users", label: "User Management" },
  { to: "/admin/assets", label: "Asset Management" },
];

export default function AdminSidebar() {
  const location = useLocation();
  const [open, setOpen] = useState(false);

  const sidebarBg = "backdrop-blur-xl bg-cyber-bg/80";
  const activeLink =
    "bg-gradient-to-r from-[#2563eb] to-[#1e293b] text-white font-bold shadow-md border-l-4 border-[#2563eb]";
  const inactiveLink =
    "text-[#a5b4fc] hover:bg-gradient-to-r hover:from-[#1e293b]/60 hover:to-[#2563eb]/10 hover:text-white border-l-4 border-transparent";

  return (
    <>
      {/* Toggle button for mobile */}
      <button
        className="sm:hidden fixed top-2 left-2 z-50 bg-cyber-bg/80 text-neon-blue p-2 rounded-full shadow-lg focus:outline-none border border-[#2563eb]/30"
        onClick={() => setOpen((v) => !v)}
        aria-label="Toggle sidebar"
      >
        {open ? (
          <svg width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M6 6l16 16M6 22L22 6" />
          </svg>
        ) : (
          <svg width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M4 8h20M4 16h20" />
          </svg>
        )}
      </button>

      {/* Sidebar */}
      <aside
        className={`
          fixed inset-y-0 left-0 z-40
          ${sidebarBg}
          w-72 flex flex-col
          shadow-2xl border-r-2 border-[#2563eb]/20
          transition-transform duration-300
          ${open ? "translate-x-0" : "-translate-x-full"}
          sm:translate-x-0 sm:static sm:w-64 sm:h-screen
          p-0
        `}
        style={{ minWidth: "220px" }}
      >
        <div className="flex flex-col h-full">
          <div className="pt-8 pb-2 px-5 sm:pt-7 sm:pb-2">
            <NavLink
              to="/admin/"
              className="text-xl font-cyber text-neon-pink hover:scale-105 hover:text-white transition-all duration-200"
              style={{ letterSpacing: "1.5px" }}
            >
              Design<span className="text-neon-blue">Crafter.AI</span>
            </NavLink>
          </div>

          <nav className="flex flex-col gap-3 mt-6 px-5">
            {links.map((link) => {
              const isActive =
                location.pathname === link.to ||
                (link.to !== "/admin" && location.pathname.startsWith(link.to));
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`font-mono px-5 py-2 rounded-lg transition-all duration-200 text-base border-l-4
                    ${isActive ? activeLink : inactiveLink}
                  `}
                  onClick={() => setOpen(false)}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          <div className="mt-auto pt-10 pb-4 px-5 text-xs text-[#a5b4fc]/70 text-center font-mono tracking-wide">
            <span className="text-[#60a5fa] font-bold">Welcome, Admin!</span>
            <br />
            &copy; {new Date().getFullYear()}{" "}
            <span className="text-[#2563eb]">Createlo</span>
          </div>
        </div>
      </aside>

      {/* Overlay for mobile when sidebar is open */}
      {open && (
        <div
          className="fixed inset-0 bg-black/40 z-30 sm:hidden"
          onClick={() => setOpen(false)}
        />
      )}
    </>
  );
}