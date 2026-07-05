import React from "react";
import { motion } from "framer-motion";
import { cn } from "../../utils/cn";

export default function Tabs({
  tabs = [],
  activeTab,
  onChange,
  className,
  variant = "pill",
}) {
  return (
    <div
      className={cn(
        "flex space-x-1 p-1 rounded-lg bg-white/5 border border-border-glass max-w-max",
        className
      )}
    >
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        
        return (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className={cn(
              "relative px-4 py-2 text-xs font-semibold uppercase tracking-wider rounded-md transition-colors cursor-pointer",
              "focus:outline-none focus-visible:ring-2 focus-visible:ring-primary",
              isActive ? "text-white" : "text-gray-400 hover:text-gray-200"
            )}
          >
            {/* Sliding background indicator */}
            {isActive && (
              <motion.div
                layoutId="active-tab-indicator"
                className="absolute inset-0 rounded-md bg-gradient-to-r from-primary/30 to-secondary/30 border border-primary/20 shadow-neon-primary"
                transition={{ type: "spring", stiffness: 380, damping: 30 }}
              />
            )}
            
            <span className="relative z-10 flex items-center gap-2">
              {tab.icon && <tab.icon size={14} />}
              {tab.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}
