import React from "react";
import { motion } from "framer-motion";
import { AlertCircle, RefreshCw } from "lucide-react";
import Button from "../ui/Button";

export default function ErrorState({
  title = "Something went wrong",
  message = "An error occurred while loading this section. Please try again.",
  actionText = "Retry Connection",
  onAction,
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="glass-panel max-w-md w-full p-8 rounded-xl text-center border-red-500/20 shadow-neon-secondary"
    >
      <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-red-500/10 border border-red-500/20 text-red-500">
        <AlertCircle size={28} className="animate-pulse" />
      </div>

      <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
      <p className="text-sm text-gray-400 font-light mb-6 leading-relaxed">
        {message}
      </p>

      {onAction && (
        <Button
          variant="outline"
          className="border-red-500/20 hover:bg-red-500/10 text-red-400 hover:text-white"
          onClick={onAction}
        >
          <RefreshCw size={15} className="mr-2" />
          {actionText}
        </Button>
      )}
    </motion.div>
  );
}
