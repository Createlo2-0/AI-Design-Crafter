import React from "react";
import PropTypes from "prop-types";

// Tailwind-based style maps for variants and sizes
const VARIANT_STYLES = {
  primary:
    "bg-neon-blue text-cyber-bg-darker border-2 border-neon-blue hover:bg-transparent hover:text-neon-blue focus:ring-2 focus:ring-neon-blue",
  secondary:
    "bg-neon-pink text-cyber-bg-darker border-2 border-neon-pink hover:bg-transparent hover:text-neon-pink focus:ring-2 focus:ring-neon-pink",
  outline:
    "bg-transparent text-neon-green border-2 border-neon-green hover:bg-neon-green hover:text-cyber-bg focus:ring-2 focus:ring-neon-green",
  danger:
    "bg-transparent text-red-600 border-2 border-red-600 hover:bg-red-600 hover:text-white focus:ring-2 focus:ring-red-600"
};

const SIZE_STYLES = {
  small: "text-xs px-3 py-1.5",
  medium: "text-sm px-4 py-2",
  large: "text-base px-6 py-3",
};

const Button = ({
  children,
  onClick,
  type = "button",
  className = "",
  variant = "primary",
  size = "medium",
  disabled = false,
  ...props
}) => {
  return (
    <button
      type={type}
      className={`
        inline-flex items-center justify-center font-bold rounded-sm transition-all duration-200
        focus:outline-none
        ${VARIANT_STYLES[variant] || VARIANT_STYLES.primary}
        ${SIZE_STYLES[size] || SIZE_STYLES.medium}
        ${disabled ? "opacity-50 cursor-not-allowed pointer-events-none" : ""}
        ${className}
      `}
      onClick={onClick}
      disabled={disabled}
      aria-disabled={disabled}
      tabIndex={disabled ? -1 : 0}
      {...props}
    >
      {children}
    </button>
  );
};

Button.propTypes = {
  children: PropTypes.node.isRequired,
  onClick: PropTypes.func,
  type: PropTypes.oneOf(["button", "submit", "reset"]),
  className: PropTypes.string,
  variant: PropTypes.oneOf(["primary", "secondary", "outline"]),
  size: PropTypes.oneOf(["small", "medium", "large"]),
  disabled: PropTypes.bool,
};

export default Button;
