import React from "react";

function CheckboxInput({
  checked,
  onChange,
  label,
  id,
  name,
  disabled = false,
  error = "",
  className = "",
}) {
  // Generate id if not provided
  const generatedId =
    id || `checkbox-${name || Math.random().toString(36).slice(2)}`;
  const baseClasses = "form-checkbox h-5 w-5 text-neon-pink rounded-sm";

  const checkboxClasses = disabled
    ? `${baseClasses} opacity-50 cursor-not-allowed`
    : baseClasses;

  return (
    <div className={`flex items-center ${className}`}>
      <input
        type="checkbox"
        id={generatedId}
        name={name}
        checked={checked}
        onChange={onChange}
        disabled={disabled}
        className={checkboxClasses}
      />
      {label && (
        <label
          htmlFor={generatedId}
          className="ml-2 text-neon-green text-sm font-bold tracking-wide select-none cursor-pointer"
        >
          {label}
        </label>
      )}
      {typeof error === "string" && error && (
        <p className="text-xs text-red-500 ml-2 mt-1 font-mono">{error}</p>
      )}
    </div>
  );
}

export default CheckboxInput;
