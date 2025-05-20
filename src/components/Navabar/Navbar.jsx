import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../../contexts/AuthContext";

const navLinks = [
  { to: "/", label: "Home", exact: true },
  { to: "/features", label: "Features" },
  { to: "/gallery", label: "Gallery" },
];

const authLinks = [
  { to: "/generate", label: "Generator" },
  { to: "/profile", label: "Profile", color: "text-neon-yellow" },
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

const Navbar = () => {
  const { currentUser, logout, loadingAuth } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  // Hamburger icon
  const Hamburger = ({ open, toggle }) => (
    <button
      className="sm:hidden flex flex-col justify-center items-center w-10 h-10 focus:outline-none"
      onClick={toggle}
      aria-label={open ? "Close menu" : "Open menu"}
    >
      <span
        className={`block w-7 h-1 bg-white rounded transition-all duration-300 ${
          open ? "rotate-45 translate-y-2" : ""
        }`}
      />
      <span
        className={`block w-7 h-1 bg-white rounded my-1 transition-all duration-300 ${
          open ? "opacity-0" : ""
        }`}
      />
      <span
        className={`block w-7 h-1 bg-white rounded transition-all duration-300 ${
          open ? "-rotate-45 -translate-y-2" : ""
        }`}
      />
    </button>
  );

  // Navigation links (for reuse)
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
        !loadingAuth &&
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
        <motion.button
          onClick={() => {
            handleLogout();
            if (onClick) onClick();
          }}
          className="ml-0 sm:ml-4 px-5 py-1 font-bold rounded-full border-2 border-neon-yellow text-neon-yellow bg-transparent transition-all duration-200 tracking-widest text-[18px]
            hover:bg-transparent hover:text-neon-yellow hover:shadow-[0_0_16px_2px_rgba(255,230,0,0.3)] focus:outline-none focus:ring-2 focus:ring-neon-yellow focus:ring-offset-2"
          whileHover={{ scale: 1.09 }}
          whileTap={{ scale: 0.97 }}
        >
          Logout
        </motion.button>
      )}
    </>
  );

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 120, damping: 15 }}
      className="bg-cyber-primary/80 backdrop-blur-sm p-3 sm:p-4 text-gray-300 shadow-lg border-b-2 border-neon-blue/70 sticky top-0 z-50"
    >
      <div className="container mx-auto flex justify-between items-center px-2 sm:px-4">
        {/* Logo */}
        <NavLink
          to="/"
          className="text-2xl font-cyber text-neon-pink hover:scale-105 hover:text-white transition-all duration-200"
          style={{ letterSpacing: "4px" }}
        >
          Design<span className="text-neon-blue">Crafter.AI</span>
        </NavLink>

        {/* Desktop Nav */}
        <div className="hidden sm:flex items-center gap-3 sm:gap-5 md:gap-8 ml-2">
          <NavLinks />
        </div>

        {/* Hamburger */}
        <Hamburger open={menuOpen} toggle={() => setMenuOpen((v) => !v)} />
      </div>

      {/* Mobile Dropdown */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="sm:hidden overflow-hidden w-full"
          >
            <div className="flex flex-col items-center gap-3 py-4 w-full">
              <NavLinks onClick={() => setMenuOpen(false)} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navbar;
