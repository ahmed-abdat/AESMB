'use client';

import { motion } from "framer-motion";

export function LoadingScreen() {
  return (
    <div className="min-h-[calc(100vh-5rem)] pt-20 flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="space-y-4 text-center"
      >
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="w-12 h-12 rounded-full border-4 border-primary border-t-transparent animate-spin mx-auto"
        />
        <p className="text-muted-foreground">Chargement...</p>
      </motion.div>
    </div>
  );
} 