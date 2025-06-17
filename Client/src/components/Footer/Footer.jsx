import React from "react";
import { motion } from "framer-motion";
import { playClickSound } from "../../utils/soundUtils";

const footerVariants = {
  offscreen: { opacity: 0, y: 30 },
  onscreen: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 80, delay: 0.2 },
  },
};

const Footer = () => (
  <footer className="w-full bg-gradient-to-t from-cyber-bg-darker via-cyber-bg/90 to-cyber-bg/60 border-t-2 border-neon-blue/40 shadow-inner backdrop-blur-md mt-auto relative z-10">
    {/* Neon accent bar */}
    <div className="h-1 w-full bg-gradient-to-r from-neon-pink via-neon-blue to-neon-green mb-2" />
    <motion.div
      variants={footerVariants}
      initial="offscreen"
      whileInView="onscreen"
      viewport={{ once: true, amount: 0.15 }}
      className="max-w-4xl mx-auto py-6 px-4 flex flex-col items-center"
    >
      {/* Status */}
      <div className="flex items-center gap-2 mb-2">
        <span className="h-2 w-2 rounded-full bg-neon-green animate-pulse"></span>
        <span className="font-cyber text-neon-green text-sm sm:text-base tracking-widest">
          SYSTEM STATUS: ONLINE
        </span>
      </div>
      {/* Brand & Copyright */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4 mb-1">
        <span className="font-cyber text-neon-blue text-base sm:text-lg tracking-wider">
          DesignCrafter<span className="text-neon-pink">.AI</span>
        </span>
        <span className="hidden sm:inline text-cyber-border">|</span>
        <span className="font-mono text-xs sm:text-sm text-cyber-border">
          &copy; {new Date().getFullYear()} DesignCrafter.AI Systems. All rights
          reserved.
        </span>
      </div>
      {/* Version & Attribution */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4">
        <span className="font-mono text-xs sm:text-sm text-neon-green">
          DESIGN CORE <span className="text-neon-pink font-bold">v2.1</span>
        </span>
        <span className="hidden sm:inline text-cyber-border">|</span>
        <span className="font-mono text-xs sm:text-sm text-gray-400">
          Initiated by{" "}
          <a
            href="https://www.createlo.in"
            target="_blank"
            rel="noopener noreferrer"
            className="text-neon-yellow hover:text-neon-pink underline transition-colors duration-200"
            onClick={playClickSound}
          >
            Createlo
          </a>
        </span>
      </div>
    </motion.div>
  </footer>
);

export default Footer;
