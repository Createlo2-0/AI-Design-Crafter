import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../contexts/AuthContext";
import { Link } from "react-router-dom";
import Modal from "../components/Modal";
import { useUserAssets } from "../contexts/UserAssetsContext";
import { useNavigate } from "react-router-dom";

import {
  playClickSound,
  playModalOpenSound,
  playErrorSound,
} from "../utils/soundUtils";
import Button from "../components/Common/Button";

// --- SVG Icons ---
const UserCircleIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className="w-9 h-9"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
    />
  </svg>
);
const ArchiveIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className="w-9 h-9"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="m20.25 7.5-.625 10.632a2.25 2.25 0 0 1-2.247 2.118H6.622a2.25 2.25 0 0 1-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125Z"
    />
  </svg>
);
const SettingsIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className="w-9 h-9"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M4.5 12a7.5 7.5 0 0 0 15 0m-15 0a7.5 7.5 0 1 1 15 0m-15 0H3m16.5 0H21m-1.5 0H5.625c-.621 0-1.125.504-1.125 1.125v1.125c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V13.125c0-.621-.504-1.125-1.125-1.125H18.75m-1.5 0H5.625m13.125 0H18.75m0 0H21m-1.5 0H5.625M3.75 6.75h16.5M3.75 9.75h16.5m-16.5 4.5h16.5m-16.5 4.5h16.5"
    />
  </svg>
);

// --- Panel Component ---
const ProfilePanel = ({
  title,
  icon,
  children,
  colorClass = "neon-blue",
  delay = 0.2,
}) => {
  const panelVariants = {
    offscreen: { opacity: 0, y: 40, scale: 0.98 },
    onscreen: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { type: "spring", stiffness: 80, delay, damping: 14 },
    },
  };
  const titleColor = colorClass.startsWith("text-")
    ? colorClass
    : `text-${colorClass}`;
  const borderColorClass = colorClass.startsWith("text-")
    ? colorClass.replace("text-", "border-")
    : `border-${colorClass}`;
  return (
    <motion.div
      variants={panelVariants}
      initial="offscreen"
      whileInView="onscreen"
      viewport={{ once: true, amount: 0.15 }}
      className={`w-full max-w-3xl mx-auto bg-gradient-to-br from-cyber-primary/90 to-cyber-bg-darker/80 backdrop-blur-md p-4 sm:p-6 md:p-8 rounded-2xl shadow-2xl border-t-4 ${borderColorClass} relative overflow-hidden mb-10`}
    >
      <div className="relative z-10">
        <div
          className={`flex items-center gap-4 mb-6 border-b pb-3 border-${colorClass}/30`}
        >
          <span className="flex items-center h-10">
            {React.cloneElement(icon, {
              className: `${titleColor} flex-shrink-0 drop-shadow-neon w-9 h-9`,
            })}
          </span>
          <h2
            className={`text-xl sm:text-2xl md:text-3xl font-cyber mt-3 ${titleColor} uppercase tracking-wide flex-grow text-left leading-tight flex items-center`}
          >
            {title}
          </h2>
        </div>
        {children}
      </div>
    </motion.div>
  );
};

// --- Placeholder Asset Data ---
const placeholderUserAssets = [
  {
    id: "001",
    src: "/images/gallery/image1.png",
    alt: "Cyberpunk Cityscape",
    prompt:
      "Expansive neon-drenched cyberpunk metropolis at twilight, flying vehicles, towering skyscrapers, cinematic lighting, volumetric fog, reflection on wet streets.",
    style: "Cyberpunk",
    seed: 12345,
    dimensions: "1024x1024",
  },
  {
    id: "002",
    src: "/images/gallery/image2.png",
    alt: "Glitching Android Portrait",
    prompt:
      "Close-up portrait of a melancholic android, subtle glitch effects, intricate circuit tattoos, moody atmosphere, shallow depth of field.",
    style: "Portrait",
    seed: 67890,
    dimensions: "768x1024",
  },
  {
    id: "003",
    src: "/images/gallery/image3.png",
    alt: "Abstract Data Stream",
    prompt:
      "Flowing abstract representation of a digital data stream, vibrant neon colors, complex geometric patterns, sense of motion, particles.",
    style: "Abstract",
    seed: 11223,
    dimensions: "1024x768",
  },
];

// --- Main UserProfilePage ---
function UserProfilePage() {
  const { currentUser } = useAuth();
  const { userAssets } = useUserAssets();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  const openModal = (image) => {
    playModalOpenSound();
    setSelectedImage(image);
    setIsModalOpen(true);
  };
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedImage(null);
  };
  const navigate = useNavigate();
  

  const handleChangePasswordClick = () => {
  playClickSound();
  navigate("/reset-password");
  };

  const handleDeleteAccountClick = () => {
    playClickSound();
    if (
      window.confirm(
        "Are you sure you want to request data purge? This action is irreversible."
      )
    ) {
      playErrorSound();
      alert("Account deletion protocol not implemented in demo.");
    }
  };

  if (!currentUser) {
    return (
      <div className="text-center font-mono text-red-500 p-10">
        Error: No user data available. Access denied.
      </div>
    );
  }

  // Animation Variants
  const pageVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { duration: 0.5, staggerChildren: 0.15 },
    },
  };
  const gridItemVariants = {
    hidden: { opacity: 0, scale: 0.92, y: 20 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: { type: "spring", stiffness: 120 },
    },
  };

  // Use assets from context, or fallback to placeholder
  const assetsToDisplay =
    userAssets.length > 0 ? userAssets : placeholderUserAssets;

  return (
    <>
      <motion.div
        className="w-full min-h-screen bg-gradient-to-br from-cyber-bg-darker/90 via-cyber-bg/80 to-cyber-bg/60 py-8 px-2 sm:px-4 md:px-8 flex flex-col items-center"
        initial="hidden"
        animate="visible"
        variants={pageVariants}
      >
        <motion.h1
          className="text-2xl sm:text-3xl md:text-4xl font-cyber text-neon-green mb-8 md:mb-12 text-center uppercase tracking-wider w-full max-w-3xl drop-shadow-neon"
          variants={{
            hidden: { opacity: 0, y: -20 },
            visible: { opacity: 1, y: 0, transition: { delay: 0.1 } },
          }}
        >
          <span className="inline-block animate-fade-in-up">User Profile</span>
        </motion.h1>

        {/* --- Agent Info --- */}
        <ProfilePanel
          title="User Data"
          icon={<UserCircleIcon />}
          colorClass="neon-blue"
          delay={0.1}
        >
          <div className="font-mono text-gray-300 space-y-3 text-sm md:text-base text-left">
            <div className="flex flex-col sm:flex-row sm:items-center">
              <span className="text-neon-blue/80 w-40 min-w-[9rem] font-semibold">
                Email ID
              </span>
              <span className="break-all">{currentUser.email}</span>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center">
              <span className="text-neon-blue/80 w-40 min-w-[9rem] font-semibold">
                Status
              </span>
              <span className="text-neon-green animate-pulse">ACTIVE</span>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center">
              <span className="text-neon-blue/80 w-40 min-w-[9rem] font-semibold">
                Registration Date
              </span>
              <span>
                {new Date(
                  currentUser.metadata.creationTime
                ).toLocaleDateString()}
              </span>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center">
              <span className="text-neon-blue/80 w-40 min-w-[9rem] font-semibold">
                Last Active
              </span>
              <span>
                {new Date(
                  currentUser.metadata.lastSignInTime
                ).toLocaleTimeString()}{" "}
                {new Date(
                  currentUser.metadata.lastSignInTime
                ).toLocaleDateString()}
              </span>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center">
              <span className="text-neon-blue/80 w-40 min-w-[9rem] font-semibold">
                Clearance Level
              </span>
              <span>GAMMA (Simulated)</span>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center">
              <span className="text-neon-blue/80 w-40 min-w-[9rem] font-semibold">
                Assigned UID
              </span>
              <span className="break-all">
                {currentUser.uid.substring(0, 12)}... (Internal)
              </span>
            </div>
          </div>
        </ProfilePanel>

        {/* --- Asset Archive --- */}
        <ProfilePanel
          title="Personal Asset Archive"
          icon={<ArchiveIcon />}
          colorClass="neon-pink"
          delay={0.2}
        >
          {assetsToDisplay.length > 0 ? (
            <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              <AnimatePresence>
                {assetsToDisplay.map((asset, i) => (
                  <motion.div
                    key={asset.id || asset.src}
                    variants={gridItemVariants}
                    initial="hidden"
                    animate="visible"
                    exit="hidden"
                    layout
                    className="group relative aspect-square bg-cyber-bg/60 border border-cyber-border/50 rounded-xl overflow-hidden hover:border-neon-pink transition-all cursor-pointer shadow-md hover:shadow-neon-sm-pink"
                    onClick={() => openModal(asset)}
                    whileHover={{ y: -3, scale: 1.04 }}
                  >
                    <img
                      src={asset.src}
                      alt={asset.alt}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      whileHover={{ opacity: 1, y: 0 }}
                      className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 flex items-end p-2 transition-opacity"
                    >
                      <p className="text-xs text-neon-pink font-mono truncate">
                        {asset.alt}
                      </p>
                    </motion.div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          ) : (
            <div className="text-center font-mono text-cyber-border py-8">
              <p className="mb-4">ARCHIVE EMPTY - NO ASSETS LOGGED</p>
              <Link to="/generate">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    variant="secondary"
                    size="medium"
                    className="bg-neon-pink text-cyber-bg-darker font-bold py-2 px-6 border-2 border-neon-pink hover:bg-transparent hover:text-neon-pink transition-all duration-300 ease-in-out hover:shadow-neon-md-pink rounded-sm text-sm"
                  >
                    INITIATE FIRST SYNTHESIS //
                  </Button>
                </motion.div>
              </Link>
            </div>
          )}
        </ProfilePanel>

        {/* --- System Access & Protocols --- */}
        <ProfilePanel
          title="System Access & Protocols"
          icon={<SettingsIcon />}
          colorClass="neon-green"
          delay={0.3}
        >
          <div className="space-y-4 font-mono flex items-center justify-start sm:flex-row sm:space-x-4 sm:space-y-0">
            <Button
              onClick={handleChangePasswordClick}
              variant="outline"
              size="medium"
            >
              RESET PASSWORD
            </Button>
            <Button
              onClick={handleDeleteAccountClick}
              variant="danger"
              size="medium"
            >
              DELETE ACCOUNT
            </Button>
          </div>
        </ProfilePanel>
      </motion.div>

      {/* --- Asset Modal --- */}
      <AnimatePresence>
        {isModalOpen && selectedImage && (
          <Modal isOpen={isModalOpen} onClose={closeModal}>
            <div className="flex flex-col text-left max-w-xs sm:max-w-md md:max-w-lg mx-auto">
              <div className="w-full mb-4 border-2 border-neon-pink/50 rounded-xl overflow-hidden shadow-lg">
                <img
                  src={selectedImage.src}
                  alt={selectedImage.alt}
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="font-mono text-xs sm:text-sm text-gray-300 space-y-3 bg-cyber-bg/40 p-3 rounded-md border border-cyber-border/30">
                <h2 className="text-lg sm:text-xl font-cyber text-neon-pink mb-2 uppercase tracking-wide">
                  {selectedImage.alt}
                </h2>
                <p>
                  <strong className="text-neon-green/80 w-24 inline-block">
                    STYLE:
                  </strong>{" "}
                  {selectedImage.style}
                </p>
                <p>
                  <strong className="text-neon-green/80 w-24 inline-block">
                    SEED:
                  </strong>{" "}
                  {selectedImage.seed || "N/A"}
                </p>
                <p>
                  <strong className="text-neon-green/80 w-24 inline-block">
                    DIMENSIONS:
                  </strong>{" "}
                  {selectedImage.dimensions || "N/A"}
                </p>
                <div>
                  <strong className="text-neon-green/80 block mb-1">
                    PROMPT DIRECTIVE:
                  </strong>
                  <p className="text-[10px] sm:text-xs text-gray-400 italic leading-relaxed bg-cyber-bg-darker/50 p-2 border border-cyber-border/20 rounded-md">
                    {selectedImage.prompt}
                  </p>
                </div>
              </div>
              <Button
                onClick={closeModal}
                variant="outline"
                size="small"
                className="mt-4 self-center font-mono text-neon-yellow hover:text-cyber-bg border-2 border-neon-yellow hover:bg-neon-yellow px-4 py-2 text-xs sm:text-sm transition-all duration-200 rounded-md hover:shadow-neon-lg-green"
              >
                CLOSE DATAVIEW
              </Button>
            </div>
          </Modal>
        )}
      </AnimatePresence>
    </>
  );
}

export default UserProfilePage;
