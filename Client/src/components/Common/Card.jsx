import React, { useState } from "react";

const fallbackImg =
  "/pbg.png";

const Card = ({ title, image, actions, children, className = "" }) => {
  const [imgSrc, setImgSrc] = useState(image || fallbackImg);

  return (
    <div
      className={`bg-cyber-bg rounded-xl shadow-lg flex flex-col items-stretch border border-cyber-border/30 transition-all duration-200 hover:shadow-neon-md-pink ${className}`}
      style={{
        minWidth: 0,
        minHeight: 0,
        width: "100%",
        height: "100%",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div className="w-full aspect-[4/3] bg-cyber-bg-darker flex items-center justify-center rounded-t-xl overflow-hidden">
        <img
          src={imgSrc}
          alt={typeof title === "string" ? title : ""}
          className="w-full h-full object-cover transition-all duration-200"
          onError={() => setImgSrc(fallbackImg)}
        />
      </div>
      {title && (
        <div
          className="w-full px-3 py-3 text-center font-cyber text-base sm:text-lg text-neon-blue bg-cyber-bg break-words"
          title={typeof title === "string" ? title : undefined}
          style={{
            wordBreak: "break-word",
            whiteSpace: "normal",
            minHeight: "3rem",
            maxHeight: "4.5rem",
            overflow: "hidden",
            textOverflow: "ellipsis",
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {title}
        </div>
      )}
      {children && (
        <div className="w-full px-4 py-2 flex-1 flex flex-col justify-center">
          {children}
        </div>
      )}
      {actions && <div className="w-full px-4 mt-3">{actions}</div>}
    </div>
  );
};

export default Card;
