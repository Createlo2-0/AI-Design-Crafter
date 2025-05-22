// src/components/Modal.jsx
import React from 'react';
import { motion } from 'framer-motion'; // Removed AnimatePresence import as it's used in the parent
import { playModalCloseSound } from '../../utils/soundUtils'; // Import close sound utility

// Simple X icon for close button
const CloseIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
);

const Modal = ({ isOpen, onClose, children }) => {
    const backdropVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1 },
        exit: { opacity: 0 }
    };

    const modalVariants = {
        hidden: { opacity: 0, scale: 0.8, y: 50 },
        visible: { opacity: 1, scale: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 30, delay: 0.1 } },
        exit: { opacity: 0, scale: 0.8, y: 50, transition: { duration: 0.2 } }
    };

    // --- NEW: Wrapper for onClose to play sound ---
    const handleClose = () => {
        playModalCloseSound(); // Play sound first
        onClose(); // Then call the original onClose prop function
    };

    // No need to check isOpen here, AnimatePresence handles it in the parent component
    // if (!isOpen) return null;

    return (
        // The parent component (GalleryPage/UserProfilePage) should wrap this Modal call in <AnimatePresence>
        <motion.div
            className="fixed inset-0 bg-cyber-bg/80 backdrop-blur-md flex items-center justify-center z-[100] p-4" // High z-index, backdrop
            variants={backdropVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={handleClose} // Use new handler for backdrop click
        >
            <motion.div
                className="bg-cyber-primary border-2 border-neon-blue/50 shadow-neon-lg-blue rounded-lg p-6 md:p-8 w-full max-w-2xl lg:max-w-3xl max-h-[90vh] overflow-y-auto relative" // Modal panel styling
                variants={modalVariants}
                // No initial/animate/exit needed here as parent AnimatePresence controls it via key change usually
                onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside modal content
            >
                <motion.button
                    onClick={handleClose} // Use new handler for close button
                    className="absolute top-3 right-3 text-cyber-border hover:text-neon-pink transition-colors z-10 p-1 rounded-full hover:bg-cyber-border/20"
                    whileHover={{ scale: 1.1, rotate: 90 }}
                    whileTap={{ scale: 0.9 }}
                    aria-label="Close modal"
                >
                    <CloseIcon />
                </motion.button>
                {children}
            </motion.div>
        </motion.div>
    );
};

export default Modal;