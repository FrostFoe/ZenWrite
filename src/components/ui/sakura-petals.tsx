
"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const Petal = () => {
  const duration = Math.random() * 5 + 10; // 10 to 15 seconds
  const delay = Math.random() * 5;
  const swayDuration = Math.random() * 3 + 4; // 4 to 7 seconds
  const swayDelay = Math.random() * 2;
  const left = Math.random() * 100;
  const size = Math.random() * 10 + 8; // 8px to 18px
  const opacity = Math.random() * 0.5 + 0.3; // 0.3 to 0.8

  return (
    <div
      className="petal"
      style={
        {
          left: `${left}vw`,
          width: `${size}px`,
          height: `${size}px`,
          opacity: opacity,
          "--animation-duration": `${duration}s`,
          "--animation-delay": `${delay}s`,
          "--sway-duration": `${swayDuration}s`,
          "--sway-delay": `${swayDelay}s`,
          animation: `fall var(--animation-duration) var(--animation-delay) linear infinite, sway var(--sway-duration) var(--sway-delay) ease-in-out infinite alternate`,
        } as React.CSSProperties
      }
    >
      🌸
    </div>
  );
};

const SakuraPetals = ({ count = 20 }) => {
  const [petals, setPetals] = useState<React.ReactNode[]>([]);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    setPetals(Array.from({ length: count }, (_, i) => <Petal key={i} />));
  }, [count]);

  return (
    <AnimatePresence>
      {isMounted && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1 }}
          className="fixed top-0 left-0 w-full h-full pointer-events-none z-[9999] overflow-hidden"
        >
          {petals}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SakuraPetals;
