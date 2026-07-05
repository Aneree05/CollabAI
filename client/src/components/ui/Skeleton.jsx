import React from "react";
import { cn } from "../../utils/cn";

export default function Skeleton({ className, variant = "rect", ...props }) {
  return (
    <div
      className={cn(
        "animate-pulse bg-white/5 rounded",
        variant === "circle" && "rounded-full",
        variant === "text" && "h-4 w-3/4 rounded-sm",
        className
      )}
      {...props}
    />
  );
}
