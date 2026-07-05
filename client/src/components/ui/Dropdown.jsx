import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "../../utils/cn";

export default function Dropdown({
  trigger,
  children,
  align = "right",
  className,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const alignmentClasses = {
    left: "left-0 origin-top-left",
    right: "right-0 origin-top-right",
    center: "left-1/2 -translate-x-1/2 origin-top",
  };

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      {/* Trigger Area */}
      <div onClick={() => setIsOpen((prev) => !prev)}>
        {trigger}
      </div>

      {/* Animated Dropdown Menu List */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -5 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -5 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className={cn(
              "absolute mt-2 w-56 glass-panel-dark border border-border-glass rounded-lg shadow-xl z-50 p-1.5 focus:outline-none",
              alignmentClasses[align],
              className
            )}
            onClick={() => setIsOpen(false)}
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function DropdownItem({ children, onClick, className, active = false, danger = false }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex w-full items-center gap-2.5 px-3 py-2 text-sm rounded-md transition-colors text-left font-light cursor-pointer",
        active ? "bg-primary/20 text-white font-medium" : "text-gray-300 hover:bg-white/5 hover:text-white",
        danger && "text-red-400 hover:bg-red-500/10 hover:text-red-200",
        className
      )}
    >
      {children}
    </button>
  );
}

export function DropdownDivider() {
  return <div className="h-px bg-border-glass my-1.5" />;
}
