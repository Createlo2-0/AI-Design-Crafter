import React from "react";

const Card = ({ title, image, actions, children, className = "" }) => (
  <div
    className={`bg-cyber-bg rounded-lg shadow-lg flex flex-col items-center ${className}`}
  >
    {image && (
      <img
        src={image}
        alt={typeof title === "string" ? title : ""}
        className="w-full h-40 object-cover rounded-t-md"
      />
    )}
    {title && (
      <div className="w-full px-4 pt-3 text-center font-cyber text-lg text-neon-pink">
        {title}
      </div>
    )}
    <div className="w-full px-4 py-2 flex-1 flex flex-col justify-center">
      {children}
    </div>
    {actions && <div className="w-full px-4 mt-3">{actions}</div>}
  </div>
);

export default Card;
