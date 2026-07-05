import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Menu,
  ChevronLeft,
  LayoutDashboard,
  FolderKanban,
  MessageSquare,
  FileCode,
  Bell,
  Settings,
  User,
  Activity,
  Cpu,
} from "lucide-react";
import { cn } from "../../utils/cn";

export default function Sidebar({ isCollapsed, onToggle }) {
  const location = useLocation();

  // Navigation Items
  const menuItems = [
    { name: "Playground Showcase", path: "/", icon: Cpu },
    { name: "Services Catalog", path: "/services", icon: FileCode },
    { name: "Active Projects", path: "/projects", icon: FolderKanban },
    { name: "Inbox Messages", path: "/messages", icon: MessageSquare },
    { name: "Activity Logs", path: "/activity", icon: Activity },
    { name: "Profile Summary", path: "/profile", icon: User },
    { name: "Control Center", path: "/settings", icon: Settings },
  ];

  return (
    <motion.div
      animate={{ width: isCollapsed ? 76 : 250 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className={cn(
        "fixed left-4 top-4 bottom-4 z-40 rounded-xl glass-panel flex flex-col justify-between overflow-hidden",
        "border border-white/8 shadow-2xl bg-[#050816]/75"
      )}
    >
      {/* Upper Brand Section */}
      <div>
        <div className="p-4 flex items-center justify-between border-b border-border-glass min-h-[64px]">
          <Link to="/" className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-tr from-primary to-secondary text-white shadow-neon-primary flex-shrink-0">
              <span className="font-bold text-sm tracking-widest uppercase">C</span>
            </div>
            {!isCollapsed && (
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="font-bold text-sm tracking-wider uppercase text-white"
              >
                Collab<span className="text-primary">AI</span>
              </motion.span>
            )}
          </Link>

          {!isCollapsed && (
            <button
              onClick={() => onToggle(!isCollapsed)}
              className="p-1 rounded bg-white/5 border border-border-glass text-gray-400 hover:text-white transition-colors cursor-pointer"
            >
              <ChevronLeft size={14} />
            </button>
          )}
        </div>

        {/* Navigation Link Menu List */}
        <nav className="p-3 space-y-1.5 mt-4">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;

            return (
              <Link
                key={item.name}
                to={item.path}
                className={cn(
                  "relative flex items-center gap-3.5 px-3 py-2.5 rounded-lg text-sm transition-all duration-200 group cursor-pointer",
                  isActive
                    ? "bg-gradient-to-r from-primary/15 to-secondary/15 border-l-2 border-primary text-white shadow-neon-primary"
                    : "text-gray-400 hover:bg-white/5 hover:text-gray-200"
                )}
              >
                <Icon
                  size={16}
                  className={cn(
                    "flex-shrink-0 transition-transform duration-200 group-hover:scale-105",
                    isActive ? "text-primary" : "text-gray-400 group-hover:text-white"
                  )}
                />
                {!isCollapsed && (
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="font-light tracking-wide text-xs"
                  >
                    {item.name}
                  </motion.span>
                )}
                
                {/* Collapsed Tooltip helper */}
                {isCollapsed && (
                  <div className="absolute left-full ml-4 px-2 py-1 bg-[#090f1e] border border-border-glass rounded text-[10px] text-white opacity-0 pointer-events-none group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-150 whitespace-nowrap z-50 shadow-lg">
                    {item.name}
                  </div>
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Lower Toggle Button (when collapsed) */}
      {isCollapsed && (
        <div className="p-4 border-t border-border-glass flex justify-center">
          <button
            onClick={() => onToggle(false)}
            className="p-2 rounded-lg bg-white/5 border border-border-glass text-gray-400 hover:text-white transition-colors cursor-pointer"
          >
            <ChevronLeft size={14} className="rotate-180" />
          </button>
        </div>
      )}
    </motion.div>
  );
}
