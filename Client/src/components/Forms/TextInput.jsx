import React from "react";

function TextInput({
  value,
  onChange,
  placeholder = "",
  label,
  id,
  name,
  type = "text",
  disabled = false,
  error = "",
  success = false,
  iconLeft = null,
  iconRight = null,
  className = "",
}) {
  const baseClasses =
    "w-full px-3 py-2 text-sm sm:text-base font-mono rounded-sm shadow-inner focus:outline-none placeholder-gray-500";

  let inputClasses = `${baseClasses} bg-cyber-bg border `;

  if (error) {
    inputClasses += "border-red-500 text-red-400 focus:ring-2 focus:ring-red-500";
  } else if (success) {
    inputClasses += "border-green-500 text-green-400 focus:ring-2 focus:ring-green-500";
  } else if (disabled) {
    inputClasses += "border-cyber-border opacity-50 cursor-not-allowed";
  } else {
    inputClasses += "border-cyber-border text-gray-200 focus:ring-2 focus:ring-neon-pink";
  }

  return (
    <div className={`relative ${className}`}>
      {label && (
        <label
          htmlFor={id}
          className="block text-neon-green text-sm font-bold mb-1 tracking-wide"
        >
          {label}
        </label>
      )}
      <div className="flex items-center">
        {iconLeft && <span className="mr-2">{iconLeft}</span>}
        <input
          type={type}
          id={id}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          className={inputClasses}
        />
        {iconRight && <span className="ml-2">{iconRight}</span>}
      </div>
      {typeof error === "string" && error && (
        <p className="text-xs text-red-500 mt-1 font-mono">{error}</p>
      )}
    </div>
  );
}

export default TextInput;
