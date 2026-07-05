import React from "react";
import { motion } from "framer-motion";
import { cn } from "../../utils/cn";

export default function GlassCard({
  children,
  className,
  hoverGlow = false,
  interactive = false,
  onClick,
  ...props
}) {
  const Component = interactive ? motion.div : "div";
  
  const motionProps = interactive
    ? {
        whileHover: { y: -3, scale: 1.01 },
        whileTap: { scale: 0.99 },
        transition: { duration: 0.2, ease: "easeOut" },
        onClick,
      }
    : {};

  return (
    <Component
      className={cn(
        "glass-panel rounded-xl overflow-hidden p-6 transition-all duration-300",
        hoverGlow && "hover-glow",
        interactive && "cursor-pointer",
        className
      )}
      {...motionProps}
      {...props}
    >
      {children}
    </Component>
  );
}

export function GlassCardHeader({ children, className, ...props }) {
  return (
    <div className={cn("flex flex-col space-y-1.5 mb-4", className)} {...props}>
      {children}
    </div>
  );
}

export function GlassCardTitle({ children, className, ...props }) {
  return (
    <h3
      className={cn("text-lg font-bold leading-none tracking-tight text-white", className)}
      {...props}
    >
      {children}
    </h3>
  );
}

export function GlassCardDescription({ children, className, ...props }) {
  return (
    <p className={cn("text-sm text-gray-400 font-light", className)} {...props}>
      {children}
    </p>
  );
}

export function GlassCardContent({ children, className, ...props }) {
  return (
    <div className={cn("", className)} {...props}>
      {children}
    </div>
  );
}

export function GlassCardFooter({ children, className, ...props }) {
  return (
    <div className={cn("flex items-center pt-4 mt-4 border-t border-border-glass", className)} {...props}>
      {children}
    </div>
  );
}
