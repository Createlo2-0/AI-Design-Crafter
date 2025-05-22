import React, { useState, useEffect, useRef } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../../contexts/AuthContext";
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

const Navbar = () => {
  const { currentUser, logout, loadingAuth } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef();

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
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
        <motion.div
          whileHover={{ scale: 1.09 }}
          whileTap={{ scale: 0.97 }}
          className="ml-0 lg:ml-4"
        >
          <Button
            onClick={() => {
              handleLogout();
              if (onClick) onClick();
            }}
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
          className="text-2xl font-cyber text-neon-pink hover:scale-105 hover:text-white transition-all duration-200"
          style={{ letterSpacing: "4px" }}
        >
          Design<span className="text-neon-blue">Crafter.AI</span>
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
  );
};

export default Navbar;
