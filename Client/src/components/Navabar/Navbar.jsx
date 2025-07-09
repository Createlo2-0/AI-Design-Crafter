import React, { useState, useEffect, useRef } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Button from "../Common/Button.jsx";

const navLinks = [
  { to: "/", label: "Home", exact: true },
  { to: "/features", label: "Features" },
  { to: "/gallery", label: "Gallery" },
];

const authLinks = [
  { to: "/generate", label: "Generator" },
  { to: "/profile", label: "Profile" },
];

const guestLinks = [
  { to: "/login", label: "Login" },
  { to: "/signup", label: "Sign Up" },
];

const navLinkClass = ({ isActive }) =>
  `relative px-3 py-1 rounded font-medium text-[18px] tracking-widest transition-colors duration-200
  ${
    isActive
      ? "text-white after:absolute after:left-1/2 after:-translate-x-1/2 after:-bottom-1 after:w-7 after:h-1 after:bg-white after:rounded-full after:content-['']"
      : "text-neon-green"
  }
  hover:text-neon-blue
  `;

// --- Modal Component ---
const ConfirmLogoutModal = ({ open, onConfirm, onCancel }) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        className="bg-cyber-primary border-2 border-neon-blue rounded-xl shadow-2xl p-6 w-[90vw] max-w-xs sm:max-w-sm md:max-w-md text-center"
      >
        <h2 className="text-xl font-bold text-neon-blue mb-2">
          Confirm Logout
        </h2>
        <p className="mb-6 text-gray-300">Are you sure you want to logout?</p>
        <div className="flex justify-center gap-4">
          <button
            onClick={onCancel}
            className="px-5 py-1 rounded-full border-2 border-gray-400 text-gray-300 hover:bg-gray-700 transition"
          >
            No
          </button>
          <button
            onClick={onConfirm}
            className="px-5 py-1 rounded-full border-2 border-neon-yellow text-neon-yellow hover:bg-neon-yellow hover:text-cyber-primary transition font-bold"
          >
            Yes
          </button>
        </div>
      </motion.div>
    </div>
  );
};
// --- End Modal Component ---

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef();
  const navigate = useNavigate();

  // Modal state
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  // Check login status from localStorage
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("user"));
    } catch {
      return null;
    }
  });

  // Listen for login/logout changes in localStorage
  useEffect(() => {
    const syncUser = () => {
      try {
        setCurrentUser(JSON.parse(localStorage.getItem("user")));
      } catch {
        setCurrentUser(null);
      }
    };
    window.addEventListener("storage", syncUser);
    return () => window.removeEventListener("storage", syncUser);
  }, []);

  const handleLogout = async () => {
    localStorage.removeItem("user");
    localStorage.removeItem("role");
    setCurrentUser(null);
    navigate("/login");
  };

  const Hamburger = ({ open, toggle }) => (
    <button
      className="lg:hidden flex flex-col justify-center items-center w-10 h-10 focus:outline-none"
      onClick={toggle}
      aria-label={open ? "Close menu" : "Open menu"}
      aria-expanded={open}
    >
      <span
        className={`w-7 h-1 bg-white rounded transition-all duration-300 ${
          open ? "rotate-45 translate-y-2" : ""
        }`}
      />
      <span
        className={`w-7 h-1 bg-white rounded my-1 transition-all duration-300 ${
          open ? "opacity-0" : ""
        }`}
      />
      <span
        className={`w-7 h-1 bg-white rounded transition-all duration-300 ${
          open ? "-rotate-45 -translate-y-2" : ""
        }`}
      />
    </button>
  );

  const NavLinks = ({ onClick }) => (
    <>
      {navLinks.map((link) => (
        <NavLink
          key={link.to}
          to={link.to}
          end={link.exact}
          className={navLinkClass}
          onClick={onClick}
        >
          {link.label}
        </NavLink>
      ))}
      {currentUser &&
        authLinks.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) =>
              navLinkClass({ isActive }) + " " + (link.color || "")
            }
            onClick={onClick}
          >
            {link.label}
          </NavLink>
        ))}
      {!currentUser &&
        guestLinks.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={navLinkClass}
            onClick={onClick}
          >
            {link.label}
          </NavLink>
        ))}
      {currentUser && (
        <motion.div
          whileHover={{ scale: 1.09 }}
          whileTap={{ scale: 0.97 }}
          className="ml-0 lg:ml-4"
        >
          <Button
            onClick={() => setShowLogoutModal(true)}
            className="px-5 py-1 font-bold rounded-full border-2  border-neon-yellow text-neon-yellow bg-transparent transition-all duration-200 tracking-widest text-[18px]
              hover:bg-transparent hover:text-neon-yellow hover:shadow-[0_0_16px_2px_rgba(255,230,0,0.3)] focus:outline-none focus:ring-2 focus:ring-neon-yellow focus:ring-offset-2"
          >
            Logout
          </Button>
        </motion.div>
      )}
    </>
  );

  // Close menu on outside click or Esc key
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (menuOpen && menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    const handleEsc = (e) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    document.addEventListener("mousedown", handleOutsideClick);
    document.addEventListener("keydown", handleEsc);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
      document.removeEventListener("keydown", handleEsc);
    };
  }, [menuOpen]);

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 120, damping: 15 }}
        className="bg-cyber-primary/80 sticky backdrop-blur-sm p-3 sm:p-4 text-gray-300 shadow-lg border-b-2 border-neon-blue/70 top-0 z-50"
      >
        <div className="container mx-auto flex justify-between items-center px-2 sm:px-4">
          {/* Logo */}
          <NavLink
            to="/"
            className="flex items-center gap-2 hover:scale-105 transition-all duration-200"
            style={{ letterSpacing: "4px" }}
          >
            <img
              src="/lg.png"
              alt="DesignCrafter.AI Logo"
              className="h-[62px] w-auto object-cover"
            />
          </NavLink>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-3 sm:gap-5 md:gap-8 ml-2">
            <NavLinks />
          </div>

          {/* Hamburger */}
          <Hamburger open={menuOpen} toggle={() => setMenuOpen((v) => !v)} />
        </div>

        {/* Mobile/Tablet Dropdown */}
        <AnimatePresence>
          {menuOpen && (
            <motion.div
              ref={menuRef}
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="lg:hidden w-full bg-cyber-primary/90 backdrop-blur-md shadow-inner z-40"
            >
              <div className="flex flex-col items-center gap-4 py-6 px-4 max-h-[90vh] overflow-y-auto">
                <NavLinks onClick={() => setMenuOpen(false)} />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>
      <ConfirmLogoutModal
        open={showLogoutModal}
        onConfirm={() => {
          setShowLogoutModal(false);
          handleLogout();
        }}
        onCancel={() => setShowLogoutModal(false)}
      />
    </>
  );
};

export default Navbar;
