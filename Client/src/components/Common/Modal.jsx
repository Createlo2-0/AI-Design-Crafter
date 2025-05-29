import React from 'react';
import { motion } from 'framer-motion';
import { playModalCloseSound } from '../../utils/soundUtils';

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

  const handleClose = () => {
    playModalCloseSound();
    onClose();
  };

  return (
    <motion.div
      className="fixed inset-0 bg-cyber-bg/80 backdrop-blur-md flex items-center justify-center z-[100] p-4"
      variants={backdropVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      onClick={handleClose}
    >
      <motion.div
        className="bg-cyber-primary border-2 border-neon-blue/50 shadow-neon-lg-blue rounded-lg p-6 md:p-8 w-full max-w-2xl lg:max-w-3xl max-h-[90vh] overflow-y-auto relative"
        variants={modalVariants}
        onClick={(e) => e.stopPropagation()}
      >
      
        {children}
      </motion.div>
    </motion.div>
  );
};

export default Modal;