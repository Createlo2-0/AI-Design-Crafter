// src/components/CyberButtonGroup.jsx
import React from 'react';
import { motion } from 'framer-motion';

const CyberButtonGroup = ({ label, id, options, selectedValue, onChange, helpText = "" }) => {
    return (
        <div className="mb-6">
            <label htmlFor={id} className="block text-neon-green text-sm font-bold mb-3 tracking-wide uppercase">
                // {label} //
            </label>
            <div id={id} className="flex flex-wrap gap-2">
                {options.map((option) => (
                    <motion.button
                        key={option.value}
                        type="button" // Important to prevent form submission if inside a form
                        onClick={() => onChange(option.value)}
                        className={`
                            font-mono text-xs sm:text-sm py-2 px-3 border-2 rounded-sm transition-all duration-200 ease-in-out
                            focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-cyber-primary
                            ${selectedValue === option.value
                                ? 'bg-neon-blue text-cyber-bg-darker border-neon-blue shadow-neon-sm-blue ring-2 ring-neon-blue/50' // Active style
                                : 'bg-cyber-bg-darker/50 border-cyber-border/70 text-cyber-border hover:border-neon-blue hover:text-neon-blue' // Inactive style
                            }
                        `}
                        whileHover={{ scale: selectedValue === option.value ? 1 : 1.05, y: selectedValue === option.value ? 0 : -2 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        {option.label}
                    </motion.button>
                ))}
            </div>
            {helpText && <p className="text-xs text-cyber-border mt-2 font-mono">{helpText}</p>}
        </div>
    );
};

export default CyberButtonGroup;