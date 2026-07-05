import React from "react";
import { motion } from "framer-motion";
import { cn } from "../../utils/cn";

export default function Button({
  children,
  className,
  variant = "primary",
  size = "md",
  loading = false,
  disabled = false,
  type = "button",
  onClick,
  ...props
}) {
  const baseStyles =
    "inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary/50 disabled:opacity-50 disabled:pointer-events-none cursor-pointer";

  const variants = {
    primary:
      "bg-gradient-to-r from-primary to-secondary text-white shadow-neon-primary hover:brightness-110 border border-indigo-400/20",
    secondary:
      "bg-white/5 border border-border-glass text-gray-200 hover:bg-white/10 hover:text-white hover:border-indigo-500/30",
    accent:
      "bg-accent text-bg-base hover:opacity-90 shadow-neon-accent font-semibold",
    outline:
      "bg-transparent border border-border-glass text-gray-300 hover:bg-white/5 hover:text-white hover:border-white/20",
    ghost:
      "bg-transparent text-gray-400 hover:bg-white/5 hover:text-gray-100",
  };

  const sizes = {
    sm: "px-3 py-1.5 text-xs",
    md: "px-4 py-2.5 text-sm",
    lg: "px-6 py-3.5 text-base",
  };

  const Component = motion.button;

  return (
    <Component
      type={type}
      disabled={disabled || loading}
      onClick={onClick}
      whileHover={!disabled && !loading ? { scale: 1.02, y: -1 } : {}}
      whileTap={!disabled && !loading ? { scale: 0.98 } : {}}
      className={cn(baseStyles, variants[variant], sizes[size], className)}
      {...props}
    >
      {loading && (
        <svg
          className="animate-spin -ml-1 mr-2 h-4 w-4 text-current"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      )}
      {children}
    </Component>
  );
}
