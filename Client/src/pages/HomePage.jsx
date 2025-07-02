import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { playClickSound } from "../utils/soundUtils";
import Button from "../components/Common/Button";

// --- Animation Variants ---
const variants = [
  {
    offscreen: { y: 30, opacity: 0 },
    onscreen: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 80, delay: 0.2 },
    },
  },
  {
    offscreen: { y: 30, opacity: 0 },
    onscreen: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 80, delay: 0.4 },
    },
  },
  {
    offscreen: { y: 30, opacity: 0 },
    onscreen: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 80, delay: 0.6 },
    },
  },
];

// --- Prompt Data ---
const PROMPTS = [
  "Neon-drenched alleyway, rain, holographic ads...",
  "Glitching android portrait, circuit board tattoos...",
  "Vast cyberpunk cityscape, flying vehicles, endless night...",
  "Retro-futuristic data terminal, glowing green text...",
  "Bio-enhanced warrior, neon katana, dystopian backdrop...",
];

// --- SVG Icons ---
const IconAiChip = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className="w-10 h-10 mb-3 text-neon-pink"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M8.25 3v1.5M4.5 8.25H3m18 0h-1.5M4.5 12H3m18 0h-1.5m-15 3.75H3m18 0h-1.5M8.25 19.5V21M12 3v1.5m0 15V21m3.75-18v1.5m0 15V21m-9-7.5h12V12H6v2.25Z"
    />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M15 6.75h1.5V3H15v3.75Zm0 13.5h1.5v-3.75H15v3.75Zm-4.5-5.25v5.25H15v-5.25H10.5ZM7.5 9.75h1.5V3H7.5v6.75Zm0 10.5h1.5V15H7.5v5.25ZM4.5 6.75H6V3H4.5v3.75Zm0 10.5H6v-3.75H4.5v3.75ZM19.5 9.75h-1.5V3h1.5v6.75Zm0 10.5h-1.5V15h1.5v5.25Z"
    />
  </svg>
);
const IconPalette = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className="w-10 h-10 mb-3 text-neon-blue"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M15.042 21.672L13.684 16.6m0 0l-2.51 2.225.569-9.47 5.227 7.917-3.286-.672Zm-7.518-.267A8.25 8.25 0 1 1 20.25 10.5M8.288 14.212A5.25 5.25 0 1 1 17.25 10.5"
    />
  </svg>
);
const IconLockSecure = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className="w-10 h-10 mb-3 text-neon-green"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z"
    />
  </svg>
);

// --- Section Wrapper ---
const SectionWrapper = ({ children, id, className = "" }) => (
  <motion.section
    id={id}
    className={`py-12 md:py-20 container mx-auto px-3 sm:px-4 md:px-6 ${className} overflow-x-hidden`}
    initial="offscreen"
    whileInView="onscreen"
    viewport={{ once: true, amount: 0.15 }}
    variants={{
      offscreen: { y: 50, opacity: 0 },
      onscreen: {
        y: 0,
        opacity: 1,
        transition: { type: "spring", bounce: 0.4, duration: 1 },
      },
    }}
  >
    {children}
  </motion.section>
);

// --- Animated Prompt Console ---
const AnimatedPromptConsole = () => {
  const [currentPromptIndex, setCurrentPromptIndex] = useState(0);
  const [displayedPrompt, setDisplayedPrompt] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [loopNum, setLoopNum] = useState(0);

  useEffect(() => {
    const currentFullPrompt = PROMPTS[currentPromptIndex];
    let charIndex = isDeleting
      ? displayedPrompt.length - 1
      : displayedPrompt.length + 1;

    const timer = setTimeout(
      () => {
        setDisplayedPrompt(currentFullPrompt.substring(0, charIndex));
        if (!isDeleting && displayedPrompt === currentFullPrompt) {
          setTimeout(() => setIsDeleting(true), 2000);
        } else if (isDeleting && displayedPrompt === "") {
          setIsDeleting(false);
          setCurrentPromptIndex((prev) => (prev + 1) % PROMPTS.length);
          setLoopNum((prev) => prev + 1);
        }
      },
      isDeleting ? 50 : 100
    );

    return () => clearTimeout(timer);
  }, [displayedPrompt, isDeleting, currentPromptIndex, loopNum]);

  return (
    <div className="font-mono text-sm md:text-base bg-cyber-bg-darker/70 border border-neon-blue/50 p-3 md:p-4 rounded-sm shadow-lg min-h-[40px] md:min-h-[50px] w-full max-w-xl mx-auto flex items-center">
      <span className="text-neon-green mr-2">{">"}</span>
      <span className="text-gray-300">{displayedPrompt}</span>
      <span className="animate-pulse text-neon-green">_</span>
    </div>
  );
};

// --- Main HomePage ---
function HomePage() {
  // Removed useAuth and currentUser
  const currentUser = null;

  // --- Navigation Links ---
  const navLinks = [
    { href: "#showcase", label: "Showcase" },
    { href: "#features", label: "Features" },
    { href: "#how-it-works", label: "Process" },
  ];

  // --- Features Data ---
  const features = [
    {
      icon: <IconAiChip />,
      title: " Advanced AI Core ",
      color: "neon-pink",
      desc: "Utilizes state-of-the-art diffusion models for unparalleled image quality and prompt adherence.",
    },
    {
      icon: <IconPalette />,
      title: " Dynamic Styling Matrix ",
      color: "neon-blue",
      desc: "Access predefined style protocols or define custom parameters for unique visual outputs.",
    },
    {
      icon: <IconLockSecure />,
      title: " Secure Asset Ledger ",
      color: "neon-green",
      desc: "User authentication via secure protocols. Save and manage your generated assets directly in your designated datastore.",
    },
  ];

  // --- Process Steps Data ---
  const processSteps = [
    {
      color: "neon-pink",
      title: "Input Directive",
      text: "Formulate your visual concept. Specify style, aspect ratio, and negative prompts for refinement.",
    },
    {
      color: "neon-blue",
      title: "AI Synthesis",
      text: "The Design Core processes your directive, interfacing with the selected neural network protocol for image generation.",
    },
    {
      color: "neon-green",
      title: "Output & Refine",
      text: "Receive generated visual assets. Options for upscaling, variations, or saving to your authorized datastore become available.",
    },
  ];

  return (
    <div>
      {/* === HERO SECTION === */}
      <SectionWrapper
        id="hero"
        className="text-center pt-20 md:pt-28 min-h-[calc(100vh-120px)] flex flex-col justify-center items-center"
      >
        <motion.div variants={variants[0]}>
          <motion.h1
            className="text-[7.2vw] xs:text-4xl sm:text-4xl md:text-5xl font-cyber text-neon-pink mb-6 tracking-wider uppercase break-words"
            variants={variants[0]}
            whileHover={{
              animation: "glitch 0.4s steps(2, jump-none) infinite alternate",
              scale: 1.02,
            }}
            transition={{ duration: 0.1 }}
          >
            DesignCrafter<span className="text-neon-blue">.AI</span> Createlo
          </motion.h1>
          <motion.p
            variants={variants[1]}
            className="text-base sm:text-lg md:text-xl text-gray-300 font-mono max-w-2xl mx-auto mb-8 px-1"
          >
            Interface with the Design Core <br />
            Synthesize high-fidelity visual posters & graphics from simple text
            directives using advanced neural network protocols.
          </motion.p>
        </motion.div>
        <motion.div
          variants={variants[1]}
          className="w-full max-w-xl mb-10 px-1"
        >
          <AnimatedPromptConsole />
        </motion.div>
        <motion.div variants={variants[2]} className="mb-12 w-full px-1">
          {currentUser ? (
            <Link to="/generate">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  onClick={playClickSound}
                  variant="outline"
                  size="large"
                  className="w-full sm:w-auto"
                >
                  GET STARTED
                </Button>
              </motion.div>
            </Link>
          ) : (
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full">
              <Link to="/login" className="w-full sm:w-auto">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    onClick={playClickSound}
                    variant="secondary"
                    size="large"
                    className="w-full"
                  >
                    LOGIN
                  </Button>
                </motion.div>
              </Link>
              <Link to="/signup" className="w-full sm:w-auto">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    onClick={playClickSound}
                    variant="primary"
                    size="large"
                    className="w-full"
                  >
                    REGISTER
                  </Button>
                </motion.div>
              </Link>
            </div>
          )}
        </motion.div>
        <motion.nav
          variants={variants[2]}
          className="font-mono text-xs sm:text-sm space-x-4 sm:space-x-6 w-full flex flex-wrap justify-center overflow-x-auto px-1"
        >
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={playClickSound}
              className="text-white hover:text-neon-green transition-colors duration-200"
            >
              {link.label}
            </a>
          ))}
        </motion.nav>
      </SectionWrapper>

      {/* === SHOWCASE SECTION === */}
      <SectionWrapper
        id="showcase"
        className="bg-cyber-bg-darker/50 backdrop-blur-sm border-y-2 border-cyber-border/20 rounded-lg shadow-xl my-12 md:my-16"
      >
        <h2 className="text-3xl md:text-4xl font-cyber text-neon-blue mb-10 md:mb-12 text-center">
          Visual Synthetics - Output Examples
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {[1, 2, 3].map((item) => (
            <motion.div
              key={item}
              variants={variants[0]}
              className="aspect-square bg-cyber-primary border-2 border-neon-blue/30 rounded-sm shadow-lg overflow-hidden group relative cursor-pointer hover:border-neon-blue transition-all duration-300"
              whileHover={{
                y: -5,
                boxShadow: "0 10px 20px rgba(0, 255, 255, 0.2)",
              }}
            >
              <div className="w-full h-full flex items-center justify-center text-cyber-border font-mono bg-cyber-bg/30">
                [ Showcase Image {item} ]
              </div>
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <p className="text-neon-pink font-cyber text-lg">View Detail</p>
              </div>
            </motion.div>
          ))}
        </div>
        <motion.div variants={variants[1]} className="text-center mt-12">
          <Link to="/gallery">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-block"
            >
              <Button
                onClick={playClickSound}
                variant="outline"
                size="medium"
                className="font-mono"
              >
                Access Full Archive &gt;&gt;
              </Button>
            </motion.div>
          </Link>
        </motion.div>
      </SectionWrapper>

      {/* === FEATURES SECTION === */}
      <SectionWrapper
        id="features"
        className="bg-cyber-primary/80 backdrop-blur-md border-y-2 border-cyber-border/30 rounded-lg shadow-xl my-12 md:my-16"
      >
        <h2 className="text-3xl md:text-4xl font-cyber text-neon-green mb-10 md:mb-12 text-center">
          System Capabilities
        </h2>
        <div className="grid md:grid-cols-3 gap-8 text-center font-mono">
          {features.map((feature, idx) => (
            <motion.div
              key={feature.title}
              variants={variants[idx]}
              className={`flex flex-col items-center border border-${feature.color}/40 p-6 shadow-neon-sm-blue bg-cyber-bg/60 rounded-sm transition-all duration-300`}
              whileHover={{
                scale: 1.06,
                boxShadow: "0 0 32px 0 rgba(0,255,255,0.18)",
                borderColor: "var(--tw-color-" + feature.color + ")",
              }}
              whileTap={{ scale: 0.98 }}
            >
              {feature.icon}
              <h3
                className={`font-bold text-xl text-${feature.color} mb-3 uppercase tracking-wide`}
              >
                {feature.title}
              </h3>
              <p className="text-sm text-gray-300 flex-grow">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
        <motion.div variants={variants[0]} className="text-center mt-12">
          <Link to="/features">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-block"
            >
              <Button
                onClick={playClickSound}
                variant="outline"
                size="medium"
                className="font-mono"
              >
                View Features &gt;&gt;
              </Button>
            </motion.div>
          </Link>
        </motion.div>
      </SectionWrapper>

      {/* === PROCESS SECTION === */}
      <SectionWrapper
        id="how-it-works"
        className="bg-cyber-bg-darker/70 backdrop-blur-sm border-y-2 border-cyber-border/20 rounded-lg shadow-xl my-12 md:my-16"
      >
        <h2 className="text-3xl md:text-4xl font-cyber text-neon-blue mb-10 md:mb-12 text-center">
          Generation Protocol
        </h2>
        <div className="max-w-3xl mx-auto font-mono text-gray-300 space-y-8 text-left text-sm md:text-base">
          {processSteps.map((step, idx) => (
            <motion.div
              key={step.title}
              variants={variants[idx]}
              className={`flex items-start space-x-4 p-4 md:p-6 border border-${step.color}/30 rounded-sm bg-cyber-primary/40 hover:border-${step.color} transition-all duration-300`}
              whileHover={{
                scale: 1.03,
                boxShadow: "0 0 24px 0 rgba(0,255,255,0.13)",
                borderColor: "var(--tw-color-" + step.color + ")",
              }}
              whileTap={{ scale: 0.98 }}
            >
              <span
                className={`font-cyber text-2xl md:text-3xl text-${step.color} mt-0 leading-none`}
              >
                0{idx + 1}
              </span>
              <div>
                <h4
                  className={`font-bold text-lg text-${step.color} mb-1 uppercase tracking-wide`}
                >
                  // {step.title} //
                </h4>
                <p>{step.text}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </SectionWrapper>
    </div>
  );
}

export default HomePage;
