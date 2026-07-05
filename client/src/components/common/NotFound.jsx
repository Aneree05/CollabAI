import React from "react";
import { motion } from "framer-motion";
import { MoveLeft, HelpCircle } from "lucide-react";
import Button from "../ui/Button";

export default function NotFound() {
  return (
    <div className="relative flex min-h-screen w-screen flex-col items-center justify-center bg-[#050816] px-6 overflow-hidden">
      {/* Aurora visual glow rings */}
      <div className="absolute top-1/3 left-1/4 h-96 w-96 rounded-full bg-secondary glow-circle opacity-15" />
      <div className="absolute bottom-1/3 right-1/4 h-96 w-96 rounded-full bg-accent glow-circle opacity-15" />
      
      {/* Grid structure overlay */}
      <div className="absolute inset-0 grid-overlay opacity-30 pointer-events-none" />

      <div className="relative z-10 flex flex-col items-center text-center max-w-md">
        {/* Animated Visual Box */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="mb-8 flex h-24 w-24 items-center justify-center rounded-2xl bg-white/5 border border-border-glass text-accent shadow-neon-accent"
        >
          <HelpCircle size={44} className="animate-bounce" />
        </motion.div>

        {/* Huge code number */}
        <h1 className="text-8xl font-extrabold tracking-tight text-white mb-2 select-none">
          404
        </h1>

        <h2 className="text-xl font-bold text-white mb-3">
          Lost in Cosmic Space
        </h2>

        <p className="text-sm text-gray-400 font-light leading-relaxed mb-8">
          The coordinate grid path you are trying to resolve does not exist. It may have moved or was never registered.
        </p>

        <Button
          variant="primary"
          onClick={() => (window.location.href = "/")}
        >
          <MoveLeft size={16} className="mr-2" />
          Back to Safety
        </Button>
      </div>
    </div>
  );
}
