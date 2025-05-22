import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Modal from "../components/Common/Modal";
import { playClickSound, playModalOpenSound } from "../utils/soundUtils";
import Button from "../components/Common/Button";

// --- Gallery Data ---
const initialGalleryItems = [
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
  {
    id: "004",
    src: "/images/gallery/image4.png",
    alt: "Futuristic Vehicle Concept",
    prompt:
      "Sleek, aerodynamic hovercraft concept art, cyberpunk aesthetic, detailed mechanical parts, dynamic pose, motion blur background.",
    style: "Vehicle",
    seed: 44556,
    dimensions: "1280x720",
  },
  {
    id: "005",
    src: "/images/gallery/image5.png",
    alt: "Bio-mechanical Organism",
    prompt:
      "Intricate bio-mechanical creature design, fusion of organic and robotic elements, dark moody background, glowing eyes, detailed textures.",
    style: "Creature",
    seed: 77889,
    dimensions: "1024x1024",
  },
  {
    id: "006",
    src: "/images/gallery/image6.png",
    alt: "Holographic Interface",
    prompt:
      "User interacting with a complex holographic user interface, floating data panels, neon glow, futuristic setting, depth perception.",
    style: "UI/UX",
    seed: 99001,
    dimensions: "1024x576",
  },
];

const filterOptions = [
  "All Styles",
  "Cyberpunk",
  "Portrait",
  "Abstract",
  "Vehicle",
  "Creature",
  "UI/UX",
];

// --- Animation Variants ---
const pageVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.5, staggerChildren: 0.05 } },
};
const itemVariants = {
  hidden: { y: 30, opacity: 0, scale: 0.9 },
  visible: {
    y: 0,
    opacity: 1,
    scale: 1,
    transition: { type: "spring", stiffness: 90 },
  },
  exit: { y: 30, opacity: 0, scale: 0.9, transition: { duration: 0.2 } },
};
const overlayVariants = {
  hidden: { opacity: 0, y: "100%" },
  hover: { opacity: 1, y: 0, transition: { duration: 0.3, ease: "easeOut" } },
};
const overlayTextVariants = {
  hidden: { opacity: 0, y: 10 },
  hover: { opacity: 1, y: 0, transition: { delay: 0.1, duration: 0.3 } },
};
const titleEntryVariant = {
  hidden: { opacity: 0, y: -20 },
  visible: { opacity: 1, y: 0, transition: { delay: 0.1 } },
};
const paragraphEntryVariant = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { delay: 0.2 } },
};
const filterSectionVariant = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { delay: 0.3 } },
};

function GalleryPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [activeFilter, setActiveFilter] = useState("All Styles");
  const [displayedItems, setDisplayedItems] = useState(initialGalleryItems);

  // --- Filtering Logic ---
  const handleFilterClick = (filter) => {
    playClickSound();
    setActiveFilter(filter);
    setDisplayedItems(
      filter === "All Styles"
        ? initialGalleryItems
        : initialGalleryItems.filter((item) => item.style === filter)
    );
  };

  // --- Modal Logic ---
  const openModal = (image) => {
    playModalOpenSound();
    setSelectedImage(image);
    setIsModalOpen(true);
  };
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedImage(null);
  };

  return (
    <>
      <motion.div
        className="container mx-auto py-8 sm:py-12 md:py-20 px-2 sm:px-4 md:px-6"
        initial="hidden"
        animate="visible"
        variants={pageVariants}
      >
        {/* --- Title & Description --- */}
        <motion.h1
          className="text-3xl sm:text-4xl md:text-6xl font-cyber text-neon-pink mb-4 sm:mb-6 md:mb-10 text-center uppercase tracking-wider"
          variants={titleEntryVariant}
          whileHover={{
            animation: "glitch 0.4s steps(2, jump-none) infinite alternate",
            scale: 1.02,
          }}
          transition={{ duration: 0.1 }}
        >
          // Visual Datastream: Asset Archive //
        </motion.h1>
        <motion.p
          className="font-mono text-center text-gray-400 max-w-2xl mx-auto mb-6 sm:mb-10 md:mb-12 text-xs sm:text-sm md:text-base"
          variants={paragraphEntryVariant}
        >
          A curated selection of synthesized visuals from the DesignCrafter.AI
          Core. Each asset represents a unique directive executed by the neural
          network.
        </motion.p>

        {/* --- Filter Buttons --- */}
        <motion.div
          className="mb-6 sm:mb-8 md:mb-12 flex flex-wrap justify-center gap-2 md:gap-3 font-mono text-xs"
          variants={filterSectionVariant}
        >
          <span className="text-neon-green mr-2 self-center whitespace-nowrap">
            // FILTER BY STYLE:
          </span>
          {filterOptions.map((filter) => (
            <motion.button
              key={filter}
              onClick={() => handleFilterClick(filter)}
              className={`py-1 px-3 border-2 rounded-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-cyber-bg
                ${
                  activeFilter === filter
                    ? "bg-neon-blue text-cyber-bg-darker border-neon-blue shadow-neon-sm-blue"
                    : "bg-cyber-bg-darker/50 border-cyber-border/70 text-cyber-border hover:border-neon-blue hover:text-neon-blue"
                }
              `}
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              {filter}
            </motion.button>
          ))}
        </motion.div>

        {/* --- Gallery Grid --- */}
        <motion.div
          layout
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6"
        >
          <AnimatePresence>
            {displayedItems.map((item) => (
              <motion.div
                key={item.id}
                variants={itemVariants}
                layout
                initial="hidden"
                animate="visible"
                exit="exit"
                className="group relative aspect-square bg-cyber-primary/50 border-2 border-cyber-border/30 rounded-sm overflow-hidden shadow-lg hover:border-neon-blue transition-colors duration-300 ease-in-out cursor-pointer"
                whileHover="hover"
                onClick={() => openModal(item)}
              >
                <img
                  src={item.src}
                  alt={item.alt}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                  loading="lazy"
                />
                {/* --- Hover Overlay --- */}
                <motion.div
                  className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-cyber-bg/95 via-cyber-bg/70 to-transparent p-2 sm:p-3 md:p-4 overflow-hidden"
                  variants={overlayVariants}
                  initial="hidden"
                >
                  <motion.h3
                    variants={overlayTextVariants}
                    className="font-cyber text-xs sm:text-sm text-neon-pink mb-1 truncate"
                  >
                    {item.alt}
                  </motion.h3>
                  <motion.p
                    variants={overlayTextVariants}
                    className="font-mono text-[10px] sm:text-xs text-gray-300 truncate hidden sm:block"
                  >
                    Style: {item.style}
                  </motion.p>
                </motion.div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* --- No Results Message --- */}
        <AnimatePresence>
          {displayedItems.length === 0 && activeFilter !== "All Styles" && (
            <motion.div
              key="no-results-message"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="text-center font-mono text-neon-yellow col-span-full mt-8 sm:mt-10 py-8 sm:py-10 border border-dashed border-cyber-border/50 rounded-sm text-xs sm:text-base"
            >
              // No assets found matching filter: {activeFilter} //
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* --- Modal --- */}
      <AnimatePresence>
        {isModalOpen && selectedImage && (
          <Modal isOpen={isModalOpen} onClose={closeModal}>
            <div className="flex flex-col text-left max-h-[80vh] overflow-y-auto p-2 sm:p-4">
              <div className="w-full mb-4 sm:mb-6 border-2 border-neon-blue/50 rounded-sm overflow-hidden shadow-lg max-h-[40vh] sm:max-h-[65vh]">
                <img
                  src={selectedImage.src}
                  alt={selectedImage.alt}
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="font-mono text-xs sm:text-sm text-gray-300 space-y-3 bg-cyber-bg/40 p-3 sm:p-4 rounded-sm border border-cyber-border/30">
                <h2 className="text-lg sm:text-xl md:text-2xl font-cyber text-neon-pink mb-2 sm:mb-3 uppercase tracking-wide">
                  {selectedImage.alt}
                </h2>
                <p>
                  <strong className="text-neon-green/80 w-24 sm:w-28 inline-block">
                    // STYLE:
                  </strong>{" "}
                  {selectedImage.style}
                </p>
                <p>
                  <strong className="text-neon-green/80 w-24 sm:w-28 inline-block">
                    // SEED:
                  </strong>{" "}
                  {selectedImage.seed || "N/A"}
                </p>
                <p>
                  <strong className="text-neon-green/80 w-24 sm:w-28 inline-block">
                    // DIMENSIONS:
                  </strong>{" "}
                  {selectedImage.dimensions || "N/A"}
                </p>
                <div>
                  <strong className="text-neon-green/80 block mb-1">
                    // PROMPT DIRECTIVE:
                  </strong>
                  <p className="text-[10px] sm:text-xs md:text-sm text-gray-400 italic leading-relaxed bg-cyber-bg-darker/50 p-2 border border-cyber-border/20 rounded-sm">
                    {selectedImage.prompt}
                  </p>
                </div>
              </div>
              <Button
                onClick={closeModal}
                variant="outline"
                size="small"
                className="mt-4 sm:mt-6 self-center font-mono text-neon-yellow hover:text-cyber-bg border-2 border-neon-yellow hover:bg-neon-yellow px-4 sm:px-6 py-2 text-xs sm:text-sm transition-all duration-200 rounded-sm hover:shadow-neon-lg-green"
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

export default GalleryPage;
