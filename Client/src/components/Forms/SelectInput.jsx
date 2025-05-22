import React from "react";

function SelectInput({
  value,
  onChange,
  options = [],
  label,
  id,
  name,
  disabled = false,
  error = "",
  className = "",
}) {
  const baseClasses = 
    "w-full px-3 py-2 text-sm sm:text-base font-mono rounded-sm shadow-inner focus:outline-none";

  let selectClasses = `${baseClasses} bg-cyber-bg border `;

  if (error) {
    selectClasses += "border-red-500 text-red-400 focus:ring-2 focus:ring-red-500";
  } else if (disabled) {
    selectClasses += "border-cyber-border opacity-50 cursor-not-allowed";
  } else {
    selectClasses += "border-cyber-border text-gray-200 focus:ring-2 focus:ring-neon-pink";
  }

  return (
    <div className={className}>
      {label && (
        <label
          htmlFor={id}
          className="block text-neon-green text-sm font-bold mb-1 tracking-wide"
        >
          {label}
        </label>
      )}
      <select
        id={id}
        name={name}
        value={value}
        onChange={onChange}
        disabled={disabled}
        className={selectClasses}
      >
        <option value="" disabled hidden>
          Select an option
        </option>
        {options.map(({ value: optValue, label: optLabel }) => (
          <option key={optValue} value={optValue}>
            {optLabel}
          </option>
        ))}
      </select>
      {typeof error === "string" && error && (
        <p className="text-xs text-red-500 mt-1 font-mono">{error}</p>
      )}
    </div>
  );
}

export default SelectInput;
