import React from "react";
import { cn } from "../../utils/cn";

export default function Badge({
  children,
  className,
  variant = "primary",
  size = "md",
  ...props
}) {
  const baseStyles =
    "inline-flex items-center font-medium tracking-wide uppercase rounded-full border transition-colors";

  const variants = {
    primary: "bg-primary/10 border-primary/20 text-primary shadow-neon-primary/20",
    secondary: "bg-secondary/10 border-secondary/20 text-secondary shadow-neon-secondary/20",
    accent: "bg-accent/10 border-accent/20 text-accent",
    highlight: "bg-highlight/10 border-highlight/20 text-highlight",
    success: "bg-emerald-500/10 border-emerald-500/20 text-emerald-400",
    warning: "bg-amber-500/10 border-amber-500/20 text-amber-400",
    danger: "bg-rose-500/10 border-rose-500/20 text-rose-400",
    outline: "bg-transparent border-border-glass text-gray-300",
  };

  const sizes = {
    sm: "px-2 py-0.5 text-[10px] leading-tight",
    md: "px-2.5 py-1 text-xs",
  };

  return (
    <span
      className={cn(baseStyles, variants[variant], sizes[size], className)}
      {...props}
    >
      {children}
    </span>
  );
}
