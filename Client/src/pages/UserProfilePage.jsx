import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import Modal from "../components/Common/Modal";
import Card from "../components/Common/Card";
import Button from "../components/Common/Button";
import API_BASE_URL from "../utils/api";
import axios from "axios";

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

// --- Main UserProfilePage ---
function UserProfilePage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  // User data state
  const [userData, setUserData] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [editFields, setEditFields] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // User's generated posts
  const [userPosts, setUserPosts] = useState([]);
  const [postsLoading, setPostsLoading] = useState(true);

  // Fetch user data and posters from backend on mount
  useEffect(() => {
    const fetchData = async () => {
      const user = JSON.parse(localStorage.getItem("user"));
      if (!user || !user.id) {
        setError("User not found.");
        setLoading(false);
        return;
      }
      try {
        // Fetch user data
        const userRes = await axios.get(`${API_BASE_URL}/users/${user.id}`);
        setUserData(userRes.data);
        setEditFields({
          email: userRes.data.email || "",
          displayName: userRes.data.displayName || "",
          avatarUrl: userRes.data.avatarUrl || "",
        });
        setLoading(false);

        // Fetch all posters generated by this user
        setPostsLoading(true);
        const postersRes = await axios.get(
          `${API_BASE_URL}/posters/user/${user.id}`
        );
        setUserPosts(Array.isArray(postersRes.data) ? postersRes.data : []);
        setPostsLoading(false);
      } catch (err) {
        setError("Failed to fetch user data or posters.");
        setLoading(false);
        setPostsLoading(false);
      }
    };
    fetchData();
  }, []);

  const openModal = (image) => {
    setSelectedImage(image);
    setIsModalOpen(true);
  };
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedImage(null);
  };
  const navigate = useNavigate();

  // Handle edit field changes
  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditFields((prev) => ({ ...prev, [name]: value }));
  };

  // Save profile changes
  const handleSaveProfile = async () => {
    setError("");
    setSuccess("");
    setLoading(true);
    try {
      let avatarUrl = editFields.avatarUrl;
      const user = JSON.parse(localStorage.getItem("user"));
      const patchData = {
        ...editFields,
        avatarUrl,
      };

      const response = await axios.patch(
        `${API_BASE_URL}/users/${user.id}`,
        patchData,
        { headers: { "Content-Type": "application/json" } }
      );
      setUserData(response.data);
      setEditMode(false);
      setSuccess("Profile updated successfully!");
      localStorage.setItem(
        "user",
        JSON.stringify({ ...user, ...response.data })
      );
    } catch (err) {
      setError(
        err?.response?.data?.error ||
          err?.message ||
          "Failed to update profile."
      );
    }
    setLoading(false);
  };

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

  if (loading) {
    return (
      <div className="text-center font-mono text-neon-blue p-10">
        Loading profile...
      </div>
    );
  }

  if (error || !userData) {
    return (
      <div className="text-center font-mono text-red-500 p-10">
        Error: {error || "No user data available. Access denied."}
      </div>
    );
  }

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
          <div className="flex flex-col items-center gap-4">
            {/* Avatar */}
            <div className="flex flex-col items-center">
              <img
                src={
                  editMode
                    ? editFields.avatarUrl ||
                      "https://ui-avatars.com/api/?name=User"
                    : userData.avatarUrl ||
                      "https://ui-avatars.com/api/?name=User"
                }
                alt="Avatar"
                className="w-24 h-24 rounded-full border-4 border-neon-blue shadow-lg object-cover mb-2"
                style={{ background: "#181c2f" }}
              />
              {editMode && (
                <input
                  type="text"
                  name="avatarUrl"
                  value={editFields.avatarUrl}
                  onChange={handleEditChange}
                  placeholder="Paste image URL here"
                  className="block mt-2 text-xs bg-cyber-bg/30 border border-cyber-border px-2 py-1 rounded text-white w-64 sm:w-80 md:w-96"
                />
              )}
            </div>
            {/* Editable fields */}
            <div className="font-mono text-gray-300 space-y-3 text-sm md:text-base text-left w-full max-w-lg">
              <div className="flex flex-col sm:flex-row sm:items-center">
                <span className="text-neon-blue/80 w-40 min-w-[9rem] font-semibold">
                  Email ID
                </span>
                {editMode ? (
                  <input
                    type="email"
                    name="email"
                    value={editFields.email}
                    onChange={handleEditChange}
                    className="bg-cyber-bg/30 border border-cyber-border px-2 py-1 rounded text-white w-full"
                  />
                ) : (
                  <span className="break-all">
                    {userData.email || (
                      <span className="text-cyber-border">Not set</span>
                    )}
                  </span>
                )}
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center">
                <span className="text-neon-blue/80 w-40 min-w-[9rem] font-semibold">
                  Display Name
                </span>
                {editMode ? (
                  <input
                    type="text"
                    name="displayName"
                    value={editFields.displayName}
                    onChange={handleEditChange}
                    className="bg-cyber-bg/30 border border-cyber-border px-2 py-1 rounded text-white w-full"
                  />
                ) : (
                  <span className="break-all">
                    {userData.displayName || (
                      <span className="text-cyber-border">Not set</span>
                    )}
                  </span>
                )}
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center">
                <span className="text-neon-blue/80 w-40 min-w-[9rem] font-semibold">
                  Status
                </span>
                <span className="text-neon-green animate-pulse">
                  {userData.status || "ACTIVE"}
                </span>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center">
                <span className="text-neon-blue/80 w-40 min-w-[9rem] font-semibold">
                  Clearance Level
                </span>
                <span>
                  {userData.role ? userData.role.toUpperCase() : "USER"}
                </span>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center">
                <span className="text-neon-blue/80 w-40 min-w-[9rem] font-semibold">
                  Assigned UID
                </span>
                <span className="break-all">
                  {userData.id ? (
                    userData.id.substring(0, 12) + "..."
                  ) : (
                    <span className="text-cyber-border">Not set</span>
                  )}
                </span>
              </div>
            </div>
            {/* Edit/Save/Cancel Buttons */}
            <div className="flex gap-3 mt-4">
              {!editMode ? (
                <Button
                  onClick={() => setEditMode(true)}
                  variant="outline"
                  size="medium"
                  className="border-neon-blue text-neon-blue"
                >
                  Edit Profile
                </Button>
              ) : (
                <>
                  <Button
                    onClick={handleSaveProfile}
                    variant="outline"
                    size="medium"
                    className="border-cyber-border text-cyber-border"
                    disabled={loading}
                  >
                    {loading ? "Saving..." : "Save"}
                  </Button>
                  <Button
                    onClick={() => {
                      setEditMode(false);
                      setEditFields({
                        email: userData.email || "",
                        displayName: userData.displayName || "",
                        avatarUrl: userData.avatarUrl || "",
                      });
                    }}
                    variant="outline"
                    size="medium"
                    className="border-cyber-border text-cyber-border"
                  >
                    Cancel
                  </Button>
                </>
              )}
            </div>
            {error && <div className="text-red-500 text-sm mt-2">{error}</div>}
            {success && (
              <div className="text-green-500 text-sm mt-2">{success}</div>
            )}
          </div>
        </ProfilePanel>

        {/* --- User Generated Posts --- */}
        <ProfilePanel
          title="Your Generated Posters"
          icon={<ArchiveIcon />}
          colorClass="neon-pink"
          delay={0.2}
        >
          {postsLoading ? (
            <div className="text-center font-mono text-neon-blue py-8">
              Loading your posters...
            </div>
          ) : userPosts.length > 0 ? (
            <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              <AnimatePresence>
                {userPosts.map((asset) => (
                  <motion.div
                    key={asset.id || asset.imageUrl}
                    variants={gridItemVariants}
                    initial="hidden"
                    animate="visible"
                    exit="hidden"
                    layout
                    className="group relative"
                    onClick={() => openModal(asset)}
                    whileHover={{ y: -3, scale: 1.04 }}
                  >
                    <Card
                      image={asset.imageUrl}
                      title={asset.prompt}
                      className="w-full h-56 sm:h-64 md:h-72 aspect-square cursor-pointer"
                    />
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          ) : (
            <div className="text-center font-mono text-cyber-border py-8">
              <p className="mb-4">NO GENERATED POSTERS FOUND</p>
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
                    INITIATE FIRST SYNTHESIS
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
              onClick={() => navigate("/reset-password")}
              variant="outline"
              size="medium"
            >
              RESET PASSWORD
            </Button>
          </div>
        </ProfilePanel>
      </motion.div>

      {/* --- Asset Modal --- */}
      <AnimatePresence>
        {isModalOpen && selectedImage && (
          <Modal isOpen={isModalOpen} onClose={closeModal}>
            <Card
              image={selectedImage.imageUrl}
              title={
                <span className="text-lg sm:text-xl font-cyber text-neon-pink uppercase tracking-wide">
                  {selectedImage.prompt}
                </span>
              }
              className="w-full max-w-md mx-auto bg-cyber-bg/40 p-0 border border-cyber-border/30 h-auto"
            >
              <div className="font-mono text-xs sm:text-sm text-gray-300 space-y-3 p-3">
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
            </Card>
          </Modal>
        )}
      </AnimatePresence>
    </>
  );
}

export default UserProfilePage;
