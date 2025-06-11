import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import CyberButtonGroup from "../components/Common/CyberButtonGroup";
import {
  playGenerateSound,
  playClickSound,
  playErrorSound,
  playSuccessSound,
  playToggleSound,
} from "../utils/soundUtils";
import Button from "../components/Common/Button";

// --- Spinner ---
const CyberSpinner = () => (
  <motion.div
    className="w-10 h-10 border-4 border-neon-blue border-t-transparent rounded-full"
    animate={{ rotate: 360 }}
    transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
  />
);

// --- Styled Input ---
const StyledInput = ({
  label,
  id,
  placeholder,
  value,
  onChange,
  type = "text",
  rows = 1,
  helpText = "",
  inputMode = "text",
  step = "any",
}) => (
  <div className="mb-6">
    <label
      htmlFor={id}
      className="block text-neon-green text-lg font-semibold mb-2 tracking-wide uppercase"
    >
      {label}
    </label>
    {type === "textarea" ? (
      <textarea
        id={id}
        rows={rows}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="font-mono w-full bg-cyber-bg-darker/80 border-2 border-cyber-border/50 focus:border-neon-pink focus:ring-1 focus:ring-neon-pink p-3 text-gray-200 rounded-sm shadow-inner transition-all duration-200 placeholder-gray-500 resize-none"
        // 'resize-none' disables resizing
      />
    ) : (
      <input
        type={type}
        id={id}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        inputMode={inputMode}
        step={step}
        className="font-mono w-full bg-cyber-bg-darker/80 border-2 border-cyber-border/50 focus:border-neon-pink focus:ring-1 focus:ring-neon-pink p-3 text-gray-200 rounded-sm shadow-inner transition-all duration-200 placeholder-gray-500"
      />
    )}
    {helpText && (
      <p className="text-xs text-cyber-border mt-1 font-mono">{helpText}</p>
    )}
  </div>
);

// --- Chevron Icon ---
const ChevronIcon = ({ isOpen }) => (
  <motion.svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={3}
    stroke="currentColor"
    className="w-4 h-4 ml-2 transition-transform duration-300"
    animate={{ rotate: isOpen ? 180 : 0 }}
    transition={{ type: "spring", stiffness: 300, damping: 20 }}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="m19.5 8.25-7.5 7.5-7.5-7.5"
    />
  </motion.svg>
);

// --- Main GeneratorPage ---
function GeneratorPage() {
  // --- Form State ---
  const [prompt, setPrompt] = useState("");
  const [negativePrompt, setNegativePrompt] = useState("");
  const [style, setStyle] = useState("Cyberpunk");
  const [aspectRatio, setAspectRatio] = useState("1:1");
  const [isAdvancedOpen, setIsAdvancedOpen] = useState(false);
  const [seed, setSeed] = useState("");
  const [steps, setSteps] = useState(50);
  const [cfgScale, setCfgScale] = useState(7.5);
  const [sampler, setSampler] = useState("EulerA");

  // --- Process State ---
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [posterResult, setPosterResult] = useState(null);
  const [loadingMessage, setLoadingMessage] = useState("");
  const [saveStatus, setSaveStatus] = useState(null);

  // --- Options ---
  const loadingMessages = [
    " Analyzing Directive...",
    " Routing To Neural Core...",
    " Calibrating Photonic Matrix...",
    " Engaging Quantum Entanglement...",
    " Compiling Visual Directives...",
    " SYNTHESIS ALGORITHM ENGAGED...",
    " Rendering Datastream...",
    " Upscaling Quantum Pixels...",
    " Final Integrity Check...",
  ];
  const availableStyles = [
    { value: "Cyberpunk", label: "Cyberpunk Dystopia" },
    { value: "Anime", label: "Neo-Tokyo Anime" },
    { value: "Photorealistic", label: "Hyper-Reality" },
    { value: "Fantasy", label: "Mythic Constructs" },
    { value: "Abstract", label: "Glitchwave Abstract" },
  ];
  const aspectRatios = [
    { value: "1:1", label: "1:1 Square" },
    { value: "16:9", label: "16:9 Wide" },
    { value: "9:16", label: "9:16 Tall" },
    { value: "4:3", label: "4:3 Standard" },
    { value: "3:2", label: "3:2 Landscape" },
  ];
  const availableSamplers = [
    { value: "EulerA", label: "Euler A" },
    { value: "DPM++2M", label: "DPM++ 2M Karras" },
    { value: "UniPC", label: "UniPC" },
    { value: "LCM", label: "LCM" },
  ];

  // --- Loading Message Animation ---
  useEffect(() => {
    let intervalId = null;
    if (loading) {
      let currentIndex = 0;
      setLoadingMessage(loadingMessages[currentIndex]);
      intervalId = setInterval(() => {
        currentIndex = (currentIndex + 1) % loadingMessages.length;
        setLoadingMessage(loadingMessages[currentIndex]);
      }, 1800);
    } else {
      setLoadingMessage("");
    }
    return () => intervalId && clearInterval(intervalId);
  }, [loading]);

  // --- Handlers ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    playGenerateSound();
    if (!prompt.trim()) {
      setError("Directive input cannot be empty, agent.");
      playErrorSound();
      return;
    }
    setLoading(true);
    setError(null);
    setPosterResult(null);
    setSaveStatus(null);

    const generationParams = {
      prompt,
      negativePrompt,
      style,
      aspectRatio,
      ...(seed.trim() !== "" && { seed: parseInt(seed, 10) }),
      steps: parseInt(steps, 10),
      cfgScale: parseFloat(cfgScale),
      sampler,
    };
    try {
      const result = await generatePoster(generationParams);
      if (result && (result.imageUrl || result.url)) {
        setPosterResult(result.imageUrl || result.url);
      } else {
        throw new Error("Received invalid data from image generation service.");
      }
    } catch (err) {
      playErrorSound();
      setError(err.message || "Unknown error during synthesis.");
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadAsset = useCallback(() => {
    playClickSound();
    if (!posterResult || typeof posterResult !== "string") return;
    try {
      const link = document.createElement("a");
      link.href = posterResult;
      let derivedFilename = "";
      try {
        const url = new URL(posterResult);
        const pathnameParts = url.pathname.split("/");
        derivedFilename = pathnameParts[pathnameParts.length - 1];
      } catch {
        const pathParts = posterResult.split("?")[0].split("/");
        derivedFilename = pathParts[pathParts.length - 1];
      }
      let finalFilename =
        derivedFilename && derivedFilename.trim() !== ""
          ? derivedFilename
          : `DesignCrafter_AI_${Date.now()}.png`;
      if (!/\.(png|jpg|jpeg|webp)$/i.test(finalFilename)) {
        finalFilename = `${finalFilename.split(".")[0]}.png`;
      }
      link.download = finalFilename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (e) {
      playErrorSound();
      alert(
        "Asset download failed. Please try right-clicking and saving the image."
      );
    }
  }, [posterResult]);

  const handleSaveToArchive = () => {
    playClickSound();
    setSaveStatus("saving");
    setTimeout(() => {
      const success = Math.random() > 0.1;
      if (success) {
        playSuccessSound();
        setSaveStatus("saved");
        setTimeout(() => setSaveStatus(null), 2500);
      } else {
        playErrorSound();
        setSaveStatus("save_error");
        setTimeout(() => setSaveStatus(null), 3000);
      }
    }, 1500);
  };

  const handleGenerateVariations = () => {
    playClickSound();
    alert("Generate Variations: Protocol initiated! (UI Placeholder)");
  };

  const toggleAdvanced = () => {
    playToggleSound();
    setIsAdvancedOpen(!isAdvancedOpen);
  };

  // --- Animation Variants ---
  const pageEntryVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };
  const columnVariants = {
    hidden: { opacity: 0 },
    visible: (customDelay) => ({
      opacity: 1,
      transition: { duration: 0.5, delay: customDelay },
    }),
  };
  const advancedOptionsVariants = {
    hidden: { opacity: 0, height: 0, marginTop: "0rem", overflow: "hidden" },
    visible: {
      opacity: 1,
      height: "auto",
      marginTop: "1.5rem",
      transition: { duration: 0.4, ease: [0.04, 0.62, 0.23, 0.98] },
    },
    exit: {
      opacity: 0,
      height: 0,
      marginTop: "0rem",
      transition: { duration: 0.3, ease: "easeOut" },
    },
  };
  const loadingTextVariants = {
    hidden: { opacity: 0, y: -10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
    exit: { opacity: 0, y: 10, transition: { duration: 0.2 } },
  };

  // --- Render ---
  return (
    <motion.div
      className="container mx-auto py-8 sm:py-12 md:py-20 px-2 sm:px-4 md:px-6"
      initial="hidden"
      animate="visible"
      variants={pageEntryVariants}
    >
      <motion.h1
        className="text-3xl sm:text-4xl md:text-5xl font-cyber text-neon-green mb-8 md:mb-12 text-center uppercase tracking-wider"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        Design Core Interface
      </motion.h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-12 items-start">
        {/* --- FORM COLUMN --- */}
        <motion.div
          className="bg-cyber-primary/70 backdrop-blur-md p-4 sm:p-6 md:p-8 rounded-lg shadow-xl border border-cyber-border/30 relative overflow-hidden bg-grid-pattern bg-repeat bg-[length:30px_30px]"
          custom={0.2}
          initial="hidden"
          animate="visible"
          variants={columnVariants}
        >
          <form onSubmit={handleSubmit} className="relative z-10">
            <StyledInput
              label="ENTER YOUR PROMPT"
              id="prompt"
              type="textarea"
              rows={5}
              placeholder="e.g., Bioluminescent flora in a derelict megastructure..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              helpText="Describe your vision. Detail enhances synthesis."
            />
            <StyledInput
              label="ELEMENTS TO AVOID"
              id="negativePrompt"
              type="textarea"
              rows={2}
              placeholder="e.g., blurry, watermark, text, human..."
              value={negativePrompt}
              onChange={(e) => setNegativePrompt(e.target.value)}
              helpText="Specify elements to avoid."
            />

            <div className="grid grid-cols-1 gap-0 mb-0">
              <CyberButtonGroup
                label="CHOOSE YOUR STYLE"
                id="style-selector"
                options={availableStyles}
                selectedValue={style}
                onChange={(value) => {
                  playClickSound();
                  setStyle(value);
                }}
              />
              <CyberButtonGroup
                label="SELECT ASPECT RATIO"
                id="aspect-ratio-selector"
                options={aspectRatios}
                selectedValue={aspectRatio}
                onChange={(value) => {
                  playClickSound();
                  setAspectRatio(value);
                }}
              />
            </div>

            <div className="mt-6 mb-2">
              <Button
                type="button"
                onClick={toggleAdvanced}
                variant="outline"
                size="medium"
                className="flex items-center justify-between w-full font-mono text-neon-yellow hover:text-white py-2 px-3 border-2 border-neon-yellow ounded-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-neon-yellow hover:bg-transparent"
              >
                <span className="text-sm uppercase tracking-wider">
                  Advanced Options
                </span>
                <ChevronIcon isOpen={isAdvancedOpen} />
              </Button>
            </div>

            <AnimatePresence initial={false}>
              {isAdvancedOpen && (
                <motion.div
                  key="advanced-options"
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  variants={advancedOptionsVariants}
                  className="bg-cyber-bg-darker/30 p-4 rounded-sm border border-cyber-border/20"
                >
                  <StyledInput
                    label="Seed Protocol"
                    id="seed"
                    type="text"
                    inputMode="numeric"
                    placeholder="Integer or blank for random"
                    value={seed}
                    onChange={(e) => setSeed(e.target.value)}
                    helpText="Numeric seed for reproducible patterns."
                  />
                  <StyledInput
                    label="Iteration Steps"
                    id="steps"
                    type="number"
                    inputMode="numeric"
                    placeholder="e.g., 50"
                    value={steps}
                    onChange={(e) => setSteps(Number(e.target.value))}
                    helpText="Synthesis depth (e.g., 20-150)."
                  />
                  <StyledInput
                    label="Prompt Adherence"
                    id="cfgScale"
                    type="number"
                    inputMode="decimal"
                    step="0.1"
                    placeholder="e.g., 7.5"
                    value={cfgScale}
                    onChange={(e) => setCfgScale(Number(e.target.value))}
                    helpText="Prompt conformity (e.g., 1.0-20.0)."
                  />
                  <CyberButtonGroup
                    label="Sampler Algorithm"
                    id="sampler-selector"
                    options={availableSamplers}
                    selectedValue={sampler}
                    onChange={(value) => {
                      playClickSound();
                      setSampler(value);
                    }}
                  />
                </motion.div>
              )}
            </AnimatePresence>

            <Button
              type="submit"
              disabled={loading}
              variant="primary"
              size="large"
              className={`w-full font-cyber text-lg mt-6 py-3 px-6 border-2 transition-all duration-300 ease-in-out rounded-sm flex items-center justify-center ${
                loading
                  ? "bg-gray-600 text-gray-400 border-gray-600 cursor-not-allowed animate-pulse"
                  : "bg-neon-green text-cyber-bg-darker border-neon-green hover:bg-transparent hover:text-neon-green hover:shadow-neon-lg-green"
              }`}
              style={{ transition: "transform 0.2s" }}
            >
              {loading ? (
                <>
                  <CyberSpinner />
                  <span className="ml-3">SYNTHESIZING...</span>
                </>
              ) : (
                "EXECUTE DIRECTIVE"
              )}
            </Button>
          </form>
        </motion.div>

        {/* --- RESULT COLUMN --- */}
        <motion.div
          className="bg-cyber-primary/70 backdrop-blur-md p-4 sm:p-6 md:p-8 rounded-lg shadow-xl border border-cyber-border/30 min-h-[400px] md:min-h-[500px] flex flex-col items-center justify-center relative overflow-hidden bg-circuit-pattern bg-repeat bg-[length:40px_40px]"
          custom={0.4}
          initial="hidden"
          animate="visible"
          variants={columnVariants}
        >
          <div className="relative z-10 w-full h-full flex flex-col items-center justify-center">
            <AnimatePresence mode="wait">
              {loading && (
                <motion.div
                  key="loading"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="text-center font-mono flex flex-col items-center"
                >
                  <CyberSpinner />
                  <div className="mt-4 h-5 overflow-hidden">
                    <AnimatePresence initial={false} mode="wait">
                      <motion.p
                        key={loadingMessage}
                        className="text-neon-blue text-sm"
                        variants={loadingTextVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                      >
                        {loadingMessage || "Processing directive..."}
                      </motion.p>
                    </AnimatePresence>
                  </div>
                  <p className="text-xs text-cyber-border mt-1">
                    (Estimated time: Variable)
                  </p>
                </motion.div>
              )}
              {error && !loading && (
                <motion.div
                  key="error"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="text-center font-mono p-4 bg-red-900/50 border border-red-500 rounded-sm w-full"
                >
                  <p className="text-red-300 font-bold mb-2 text-lg font-cyber">
                     TRANSMISSION ERROR 
                  </p>
                  <p className="text-red-400 text-sm">{error}</p>
                </motion.div>
              )}
              {posterResult && !loading && !error && (
                <motion.div
                  key="result"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="w-full flex flex-col items-center"
                >
                  <h3 className="font-cyber text-xl text-neon-green mb-4 text-center">
                    VISUAL OUTPUT ONLINE
                  </h3>
                  <div className="w-full aspect-square bg-cyber-bg-darker border-2 border-neon-green/50 rounded-sm overflow-hidden shadow-lg mb-6">
                    <img
                      src={posterResult}
                      alt="Generated Poster"
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <motion.div
                    className="flex flex-col sm:flex-row sm:space-x-3 space-y-3 sm:space-y-0 w-full max-w-md justify-center"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    <Button
                      onClick={handleDownloadAsset}
                      variant="outline"
                      size="small"
                      className="font-mono text-xs flex-1 bg-neon-blue/80 hover:bg-neon-blue text-cyber-bg-darker py-2 px-4 border border-neon-blue rounded-sm transition-all duration-200 shadow-md hover:shadow-neon-sm-blue"
                    >
                       DOWNLOAD ASSET 
                    </Button>
                    <Button
                      onClick={handleSaveToArchive}
                      disabled={
                        saveStatus === "saving" || saveStatus === "saved"
                      }
                      variant={
                        saveStatus === "save_error"
                          ? "danger"
                          : saveStatus === "saved"
                          ? "primary"
                          : "outline"
                      }
                      size="small"
                      className={`font-mono text-xs flex-1 py-2 px-4 border rounded-sm transition-all duration-200 shadow-md ${
                        saveStatus === "saving"
                          ? "bg-cyber-border/50 text-gray-400 border-cyber-border cursor-wait animate-pulse"
                          : saveStatus === "saved"
                          ? "bg-neon-green/80 text-cyber-bg-darker border-neon-green cursor-default"
                          : saveStatus === "save_error"
                          ? "bg-red-500/80 text-white border-red-500"
                          : "bg-cyber-border/70 hover:bg-neon-green hover:text-cyber-bg-darker text-gray-200 border-cyber-border"
                      }`}
                    >
                      {saveStatus === "saving" && " SAVING... "}
                      {saveStatus === "saved" && " ARCHIVED "}
                      {saveStatus === "save_error" && " SAVE ERROR "}
                      {!saveStatus && " SAVE TO ARCHIVE "}
                    </Button>
                    <Button
                      onClick={handleGenerateVariations}
                      variant="secondary"
                      size="small"
                      className="font-mono text-xs flex-1 bg-cyber-border/70 hover:bg-neon-pink hover:text-cyber-bg-darker text-gray-200 py-2 px-4 border border-cyber-border rounded-sm transition-all duration-200 shadow-md"
                    >
                       GENERATE VARIATIONS 
                    </Button>
                  </motion.div>
                </motion.div>
              )}
              {!loading && !error && !posterResult && (
                <motion.div
                  key="placeholder"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center font-mono text-cyber-border"
                >
                  <p className="text-lg mb-2">OUTPUT CHANNEL - IDLE</p>
                  <p className="text-sm">
                    Awaiting synthesis directive from operative.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}

export default GeneratorPage;
