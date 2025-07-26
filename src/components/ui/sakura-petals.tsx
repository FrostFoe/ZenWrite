
"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const Petal = () => {
  const duration = Math.random() * 5 + 10; // 10 to 15 seconds
  const delay = Math.random() * 10;
  const swayDuration = Math.random() * 3 + 4; // 4 to 7 seconds
  const swayDelay = Math.random() * 4;
  const left = Math.random() * 100;
  const size = Math.random() * 10 + 8; // 8px to 18px
  const opacity = Math.random() * 0.4 + 0.2; // 0.2 to 0.6 (Lower opacity)

  return (
    <div
      className="petal"
      style={
        {
          left: `${left}vw`,
          width: `${size}px`,
          height: `${size}px`,
          opacity: opacity,
          animationDuration: `${duration}s, ${swayDuration}s`,
          animationDelay: `${delay}s, ${swayDelay}s`,
        } as React.CSSProperties
      }
    >
      🌸
    </div>
  );
};

const SakuraPetals = ({ count = 40 }) => { // Increased count
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
          className="fixed top-0 left-0 w-full h-full pointer-events-none z-10 overflow-hidden"
        >
          {petals}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SakuraPetals;
