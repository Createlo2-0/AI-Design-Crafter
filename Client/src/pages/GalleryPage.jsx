import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Modal from "../components/Common/Modal";
import Card from "../components/Common/Card";
import { playClickSound, playModalOpenSound } from "../utils/soundUtils";
import Button from "../components/Common/Button";

const initialGalleryItems = [
  {
    id: "011",
    src: "/images/gallery/math_image1.png",
    alt: "Mandelbrot Set Fractal",
    prompt:
      "A deep zoom into the Mandelbrot set, revealing intricate and infinitely complex fractal patterns. Vibrant, psychedelic colors with a glowing, ethereal quality.",
    style: "Abstract",
    seed: 56789,
    dimensions: "1024x1024",
  },
  {
    id: "012",
    src: "/images/gallery/math_image2.jpg",
    alt: "Geometric Cyberpunk City",
    prompt:
      "A cyberpunk metropolis where skyscrapers are shaped like platonic solids and famous mathematical constants like π, e, and φ glow as holographic neon signs on the buildings.",
    style: "Cyberpunk",
    seed: 98765,
    dimensions: "1280x720",
  },
  {
    id: "013",
    src: "/images/gallery/math_image3.jpg",
    alt: "Portrait of a Mathematical Muse",
    prompt:
      "An elegant portrait of a woman whose face and hair are composed of intricate, flowing golden lines representing the Fibonacci sequence and the golden ratio.",
    style: "Portrait",
    seed: 11235,
    dimensions: "768x1024",
  },
  {
    id: "014",
    src: "/images/gallery/math_image4.jpg",
    alt: "Nautilus Shell Creature",
    prompt:
      "A bioluminescent deep-sea creature resembling a dragon, with a body structured like a nautilus shell, showcasing a perfect logarithmic spiral.",
    style: "Creature",
    seed: 45678,
    dimensions: "1024x1024",
  },
  {
    id: "015",
    src: "/images/gallery/math_image5.jpg",
    alt: "Golden Ratio Concept Vehicle",
    prompt:
      "A futuristic, aerodynamic concept car with sleek, flowing lines designed explicitly using the principles of the golden ratio for perfect proportions. Studio lighting.",
    style: "Vehicle",
    seed: 16180,
    dimensions: "1360x720",
  },
  {
    id: "016",
    src: "/images/gallery/math_image6.jpg",
    alt: "Euler's Identity Visualization",
    prompt:
      "An abstract, cosmic representation of Euler's identity, e^{iπ} + 1 = 0. The equation's components are visualized as celestial bodies and energy fields interacting in space.",
    style: "Abstract",
    seed: 27182,
    dimensions: "1024x1024",
  },
  {
    id: "017",
    src: "/images/gallery/math_image7.jpg",
    alt: "Calabi-Yau Manifold",
    prompt:
      "A scientific visualization of a Calabi-Yau manifold, a complex 3D shape from string theory, glowing with internal light and intricate geometric structures.",
    style: "Abstract",
    seed: 31415,
    dimensions: "1024x1024",
  },
  {
    id: "018",
    src: "/images/gallery/math_image8.jpg",
    alt: "Android Pondering a Tesseract",
    prompt:
      "A thoughtful android examining a holographic, rotating tesseract (a four-dimensional cube). The scene is set in a minimalist, futuristic lab.",
    style: "Portrait",
    seed: 60221,
    dimensions: "768x1024",
  },
  {
    id: "019",
    src: "/images/gallery/math_image9.jpg",
    alt: "Fractal Tree of Life",
    prompt:
      "A majestic, glowing tree whose branches and roots grow in a perfect fractal pattern, symbolizing mathematical growth and interconnectedness in nature.",
    style: "Creature",
    seed: 78539,
    dimensions: "1024x1024",
  },
  {
    id: "020",
    src: "/images/gallery/math_image10.jpg",
    alt: "Spaceship Blueprint with Orbital Mechanics",
    prompt:
      "A detailed, futuristic blueprint of a spaceship overlaid with glowing, handwritten annotations of complex orbital mechanics and trajectory calculation equations.",
    style: "Vehicle",
    seed: 29979,
    dimensions: "1360x720",
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
          Visual Datastream: Asset Archive
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
            FILTER BY STYLE:
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
                className="group cursor-pointer"
                whileHover={{ scale: 1.03 }}
                onClick={() => openModal(item)}
              >
                <Card
                  image={item.src}
                  title={
                    <span className="font-cyber text-xs sm:text-sm text-neon-pink truncate block">
                      {item.alt}
                    </span>
                  }
                  className="aspect-square bg-cyber-primary/50 border-2 border-cyber-border/30 rounded-sm overflow-hidden shadow-lg hover:border-neon-blue transition-colors duration-300 ease-in-out p-0"
                >
                  <div className="px-4 py-2">
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-mono text-[10px] sm:text-xs text-gray-300">
                        Style: {item.style}
                      </span>
                      <span className="font-mono text-[10px] sm:text-xs text-gray-400">
                        {item.dimensions}
                      </span>
                    </div>
                    <p className="font-mono text-[10px] sm:text-xs text-gray-400 truncate">
                      {item.prompt}
                    </p>
                  </div>
                </Card>
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
              No assets found matching filter: {activeFilter}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* --- Modal --- */}
      <AnimatePresence>
        {isModalOpen && selectedImage && (
          <Modal isOpen={isModalOpen} onClose={closeModal}>
            <Card
              image={selectedImage.src}
              title={
                <span className="text-lg sm:text-xl md:text-2xl font-cyber text-neon-pink uppercase tracking-wide">
                  {selectedImage.alt}
                </span>
              }
              className="w-full max-w-2xl mx-auto bg-cyber-bg/40 p-0 border border-cyber-border/30"
            >
              <div className="font-mono text-xs sm:text-sm text-gray-300 space-y-3 p-3 sm:p-4">
                <p>
                  <strong className="text-neon-green/80 w-24 sm:w-28 inline-block">
                    STYLE:
                  </strong>{" "}
                  {selectedImage.style}
                </p>
                <p>
                  <strong className="text-neon-green/80 w-24 sm:w-28 inline-block">
                    SEED:
                  </strong>{" "}
                  {selectedImage.seed || "N/A"}
                </p>
                <p>
                  <strong className="text-neon-green/80 w-24 sm:w-28 inline-block">
                    DIMENSIONS:
                  </strong>{" "}
                  {selectedImage.dimensions || "N/A"}
                </p>
                <div>
                  <strong className="text-neon-green/80 block mb-1">
                    PROMPT DIRECTIVE:
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
            </Card>
          </Modal>
        )}
      </AnimatePresence>
    </>
  );
}

export default GalleryPage;
