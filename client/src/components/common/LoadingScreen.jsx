import React from "react";
import { motion } from "framer-motion";

export default function LoadingScreen({ message = "Loading CollabAI Workspace..." }) {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#050816] overflow-hidden">
      {/* Background radial aura glows */}
      <div className="absolute top-1/4 left-1/4 h-96 w-96 rounded-full bg-primary glow-circle opacity-20" />
      <div className="absolute bottom-1/4 right-1/4 h-96 w-96 rounded-full bg-secondary glow-circle opacity-20" />
      
      {/* Grid overlay */}
      <div className="absolute inset-0 grid-overlay opacity-30 pointer-events-none" />

      <div className="relative z-10 flex flex-col items-center text-center">
        {/* Animated Icon Ring */}
        <div className="relative mb-6 flex h-20 w-20 items-center justify-center">
          <motion.div
            className="absolute inset-0 rounded-full border-2 border-primary border-t-transparent shadow-neon-primary"
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 1.2, ease: "linear" }}
          />
          <motion.div
            className="absolute h-14 w-14 rounded-full border-2 border-dashed border-accent opacity-50"
            animate={{ rotate: -360 }}
            transition={{ repeat: Infinity, duration: 2.5, ease: "linear" }}
          />
          <span className="text-xl font-bold tracking-wider text-accent">AI</span>
        </div>

        {/* Text and progress */}
        <motion.h2 
          className="text-2xl font-bold tracking-tight text-white mb-2"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Collab<span className="text-primary">AI</span>
        </motion.h2>

        <motion.p
          className="text-sm text-gray-400 max-w-xs font-light"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          {message}
        </motion.p>

        {/* Premium linear loading bar */}
        <div className="mt-6 h-1 w-48 overflow-hidden rounded-full bg-gray-800">
          <motion.div
            className="h-full bg-gradient-to-r from-primary via-secondary to-accent"
            initial={{ left: "-100%", width: "0%" }}
            animate={{ 
              width: ["0%", "100%", "0%"],
              x: ["-100%", "200%", "-100%"]
            }}
            transition={{ 
              repeat: Infinity, 
              duration: 2.2, 
              ease: "easeInOut" 
            }}
          />
        </div>
      </div>
    </div>
  );
}
