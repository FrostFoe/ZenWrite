
"use client";

import { motion, AnimatePresence } from "framer-motion";

export default function Template({ children }: { children: React.ReactNode }) {
  const variants = {
    hidden: { opacity: 0, y: 15 },
    enter: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -15 },
  };

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        initial="hidden"
        animate="enter"
        exit="exit"
        variants={variants}
        transition={{ duration: 0.3, type: "easeInOut" }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
