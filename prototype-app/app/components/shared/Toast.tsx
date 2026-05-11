import React from "react";
import { motion, AnimatePresence } from "framer-motion";

interface ToastProps {
  show: boolean;
  msg: string;
}

export function Toast({ show, msg }: ToastProps) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-white border border-emerald-200 text-emerald-700 px-6 py-3 rounded-lg shadow-xl font-mono text-sm pointer-events-none"
        >
          ⚡ {msg}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
