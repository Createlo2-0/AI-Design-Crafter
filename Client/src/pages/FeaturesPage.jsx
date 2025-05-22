import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import Button from "../components/Common/Button";

// --- SVG ICONS ---
const IconAiChip = (props) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
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
const IconPalette = (props) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M15.042 21.672L13.684 16.6m0 0l-2.51 2.225.569-9.47 5.227 7.917-3.286-.672Zm-7.518-.267A8.25 8.25 0 1 1 20.25 10.5M8.288 14.212A5.25 5.25 0 1 1 17.25 10.5"
    />
  </svg>
);
const IconLockSecure = (props) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z"
    />
  </svg>
);
const IconGear = (props) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.646.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.431l-1.003.827c-.293.24-.438.613-.43.992a6.759 6.759 0 0 1 0 1.25c.008.379.137.752.43.992l1.004.827a1.125 1.125 0 0 1 .26 1.431l-1.296 2.247a1.125 1.125 0 0 1-1.37.49l-1.217-.456c-.355-.133-.75-.072-1.075.124a6.607 6.607 0 0 1-.22.128c-.333.183-.582.495-.646.869l-.213 1.28c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.646-.87a6.607 6.607 0 0 1-.22-.127c-.324-.196-.72-.257-1.075-.124l-1.217.456a1.125 1.125 0 0 1-1.37-.49l-1.296-2.247a1.125 1.125 0 0 1 .26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.759 6.759 0 0 1 0-1.25c-.007-.379-.137-.752-.43-.992l-1.004-.827a1.125 1.125 0 0 1-.26-1.431l1.296-2.247a1.125 1.125 0 0 1 1.37-.49l1.217.456c.355.133.75.072 1.075-.124a6.607 6.607 0 0 1 .22-.128c.333-.184.582-.496.646-.87l.213-1.281Z"
    />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
    />
  </svg>
);

// --- FEATURE CARD ---
const FeatureCard = ({ icon, title, description, details, color, delay }) => {
  const cardVariants = {
    offscreen: { y: 50, opacity: 0 },
    onscreen: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 50, delay },
    },
  };
  return (
    <motion.div
      variants={cardVariants}
      className={`bg-cyber-primary/70 backdrop-blur-md p-5 sm:p-6 md:p-8 border-t-4 border-${color} shadow-xl rounded-md flex flex-col items-center text-center hover:shadow-${color}/50 transition-shadow duration-300`}
      whileHover={{
        scale: 1.04,
        boxShadow: "0 0 32px 0 rgba(0,255,255,0.13)",
        borderColor: `var(--tw-color-${color})`,
      }}
      whileTap={{ scale: 0.98 }}
    >
      {React.cloneElement(icon, {
        className: `w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16 mb-4 text-${color}`,
      })}
      <h3
        className={`font-cyber text-xl sm:text-2xl md:text-3xl text-${color} mb-3 sm:mb-4 uppercase tracking-wide`}
      >
        {title}
      </h3>
      <p className="font-mono text-gray-300 mb-3 sm:mb-4 text-xs sm:text-sm md:text-base flex-grow">
        {description}
      </p>
      {details && details.length > 0 && (
        <ul className="list-none text-left space-y-1 font-mono text-xs sm:text-sm text-gray-400 mt-auto w-full max-w-xs mx-auto">
          {details.map((detail, i) => (
            <li key={i} className="flex items-start">
              <span className={`mr-2 mt-1 text-${color}`}>{">"}</span>
              <span>{detail}</span>
            </li>
          ))}
        </ul>
      )}
    </motion.div>
  );
};

// --- MAIN PAGE ---
function FeaturesPage() {
  const features = [
    {
      icon: <IconAiChip />,
      title: "AI Core X-1",
      description:
        "Harnessing quantum-entangled diffusion matrices, the AI Core X-1 translates abstract directives into hyper-realistic visual outputs. It comprehends nuanced semantics and complex compositional requests with unprecedented accuracy.",
      details: [
        "Hyper-Resolution Synthesis (Up to 16K equivalent)",
        "Semantic Coherence Engine v3.2",
        "Multi-Vector Prompt Analysis",
        "Real-time Anomaly Detection & Correction",
      ],
      color: "neon-pink",
    },
    {
      icon: <IconPalette />,
      title: "Stylistic Matrix",
      description:
        "Interface with a vast library of pre-calibrated stylistic codecs or sculpt your own unique visual language. From neo-noir cityscapes to bio-luminescent flora, the matrix adapts.",
      details: [
        "Cyberpunk, GlitchCore, Solarpunk, Bio-Mechanical Presets",
        "Fine-grained Artistic Control (Lens, Film Stock, Lighting)",
        "Cross-Style Hybridization Protocols",
        "User-Generated Style Codec Repository (Tier II Access)",
      ],
      color: "neon-blue",
    },
    {
      icon: <IconGear />,
      title: "Parameter Control Deck",
      description:
        "Assume direct command over the generation parameters. Modulate CFG scale, step counts, sampler algorithms, and inject negative directives to refine outputs to exacting specifications.",
      details: [
        "Real-time Parameter Feedback Loop",
        "Advanced Noise Scheduling & Karras Sigmas",
        "Seed Iteration & Batch Processing",
        "Custom LoRA / Textual Inversion Uplink",
      ],
      color: "neon-yellow",
    },
    {
      icon: <IconLockSecure />,
      title: "Secure Asset Ledger",
      description:
        "All synthesized assets are logged within your encrypted datastore, accessible only via authenticated protocols. Manage, version, and export your creations with robust security.",
      details: [
        "End-to-End AES-256 Encryption",
        "Immutable Generation Metadata Logging",
        "Multi-Factor Authentication Required for Export",
        "Decentralized Storage Node Options (Alpha)",
      ],
      color: "neon-green",
    },
  ];

  return (
    <motion.div
      className="container mx-auto py-8 sm:py-12 md:py-20 px-2 sm:px-4 md:px-6"
      initial="hidden"
      animate="visible"
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: {
          opacity: 1,
          y: 0,
          transition: { duration: 0.5, staggerChildren: 0.2 },
        },
      }}
    >
      <motion.h1
        className="text-3xl sm:text-4xl md:text-6xl font-cyber text-neon-blue mb-5 sm:mb-6 md:mb-10 text-center uppercase tracking-wider"
        variants={{
          hidden: { opacity: 0, y: -20 },
          visible: { opacity: 1, y: 0, transition: { delay: 0.1 } },
        }}
      >
        System Specifications
      </motion.h1>
      <motion.p
        className="font-mono text-center text-gray-400 max-w-3xl mx-auto mb-8 sm:mb-12 md:mb-16 text-xs sm:text-sm md:text-base"
        variants={{
          hidden: { opacity: 0 },
          visible: { opacity: 1, transition: { delay: 0.3 } },
        }}
      >
        Accessing detailed operational parameters and capability matrix for
        DesignCrafter.AI Protocol. All systems nominal. Augment your reality.
      </motion.p>
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-2 gap-6 sm:gap-8 md:gap-12">
        {features.map((feature, i) => (
          <FeatureCard key={feature.title} {...feature} delay={0.2 + i * 0.2} />
        ))}
      </div>
      <motion.div
        className="text-center mt-12 sm:mt-16 md:mt-20"
        variants={{
          hidden: { opacity: 0 },
          visible: {
            opacity: 1,
            transition: { delay: 0.5 + features.length * 0.2 },
          },
        }}
      >
        <Link to="/generate">
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button className="bg-neon-green text-cyber-bg-darker font-bold py-3 px-8 sm:px-10 border-2 border-neon-green hover:bg-transparent hover:text-neon-green transition-all duration-300 ease-in-out hover:shadow-neon-lg-green rounded-sm text-base sm:text-lg">
              INITIATE DESIGN PROTOCOL
            </Button>
          </motion.div>
        </Link>
      </motion.div>
    </motion.div>
  );
}

export default FeaturesPage;
