import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Terminal, Moon, Sun, ArrowRight, User, Settings, LogOut, Code } from "lucide-react";
import { useTheme } from "../../context/ThemeContext";
import { useAuth } from "../../context/AuthContext";
import { cn } from "../../utils/cn";

export default function CommandPalette({ isOpen, onClose }) {
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const { toggleTheme, isDark } = useTheme();
  const { logout, user } = useAuth();
  const inputRef = useRef(null);

  // Command items matching design requirements and actions
  const commands = [
    {
      id: "theme",
      title: "Toggle Visual Theme",
      description: isDark ? "Switch to Light Aesthetic" : "Switch to Dark Space Mode",
      icon: isDark ? Sun : Moon,
      action: () => {
        toggleTheme();
        onClose();
      },
    },
    {
      id: "profile",
      title: "View User Profile",
      description: `Logged in as ${user?.name || "Guest"}`,
      icon: User,
      action: () => {
        window.location.href = "/profile";
        onClose();
      },
    },
    {
      id: "settings",
      title: "Account Settings",
      description: "Manage configurations & credentials",
      icon: Settings,
      action: () => {
        window.location.href = "/settings";
        onClose();
      },
    },
    {
      id: "playground",
      title: "Design System Showcase",
      description: "Explore layouts, buttons, and design tokens",
      icon: Code,
      action: () => {
        window.location.href = "/";
        onClose();
      },
    },
    {
      id: "logout",
      title: "Sign Out",
      description: "Clear active token and session",
      icon: LogOut,
      action: () => {
        logout();
        onClose();
      },
    },
  ];

  // Filter commands by input query
  const filtered = commands.filter((cmd) =>
    cmd.title.toLowerCase().includes(query.toLowerCase()) ||
    cmd.description.toLowerCase().includes(query.toLowerCase())
  );

  // Keep input focused
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
      setSelectedIndex(0);
      setQuery("");
    }
  }, [isOpen]);

  // Handle keyboard events
  useEffect(() => {
    function handleKeyDown(e) {
      if (!isOpen) return;

      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((prev) => (prev + 1) % filtered.length);
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex((prev) => (prev - 1 + filtered.length) % filtered.length);
      } else if (e.key === "Enter") {
        e.preventDefault();
        if (filtered[selectedIndex]) {
          filtered[selectedIndex].action();
        }
      } else if (e.key === "Escape") {
        e.preventDefault();
        onClose();
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, filtered, selectedIndex, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-24 px-4">
          {/* Blur Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-[#020308]/60 command-palette-backdrop"
          />

          {/* Search Box */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: -10 }}
            transition={{ duration: 0.2 }}
            className="relative w-full max-w-lg glass-panel-dark rounded-xl overflow-hidden shadow-2xl border border-white/10"
          >
            {/* Input Header */}
            <div className="flex items-center gap-3 px-4 py-3.5 border-b border-border-glass">
              <Search className="text-gray-400" size={18} />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setSelectedIndex(0);
                }}
                placeholder="Type a command or search action..."
                className="w-full bg-transparent text-sm text-white placeholder-gray-500 focus:outline-none"
              />
              <kbd className="hidden sm:inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded border border-border-glass bg-white/5 text-[10px] text-gray-500 font-mono">
                ESC
              </kbd>
            </div>

            {/* Results body */}
            <div className="max-h-72 overflow-y-auto p-2 space-y-0.5">
              {filtered.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-8 text-center text-gray-500">
                  <Terminal size={22} className="mb-2 text-gray-600" />
                  <p className="text-xs">No command matched your search</p>
                </div>
              ) : (
                filtered.map((cmd, idx) => {
                  const isSelected = idx === selectedIndex;
                  const Icon = cmd.icon;

                  return (
                    <button
                      key={cmd.id}
                      onClick={cmd.action}
                      onMouseEnter={() => setSelectedIndex(idx)}
                      className={cn(
                        "flex w-full items-center justify-between px-3 py-2.5 rounded-lg text-left transition-colors cursor-pointer",
                        isSelected
                          ? "bg-primary/20 text-white border border-primary/20"
                          : "text-gray-300 hover:bg-white/5 hover:text-white border border-transparent"
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={cn(
                            "p-2 rounded-md border",
                            isSelected
                              ? "bg-primary border-primary shadow-neon-primary text-white"
                              : "bg-white/5 border-border-glass text-gray-400"
                          )}
                        >
                          <Icon size={14} />
                        </div>
                        <div>
                          <p className="text-xs font-semibold">{cmd.title}</p>
                          <p className="text-[10px] text-gray-400 font-light mt-0.5">
                            {cmd.description}
                          </p>
                        </div>
                      </div>

                      {isSelected && (
                        <ArrowRight size={13} className="text-primary animate-pulse" />
                      )}
                    </button>
                  );
                })
              )}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between px-4 py-2 border-t border-border-glass bg-white/3 text-[10px] text-gray-500">
              <span className="font-light">Use ↑↓ keys to select, Enter to run</span>
              <span className="font-mono bg-white/5 border border-border-glass px-1 py-0.5 rounded">
                CollabAI OS v1.0
              </span>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
