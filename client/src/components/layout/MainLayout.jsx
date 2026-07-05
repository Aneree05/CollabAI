import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import CommandPalette from "../common/CommandPalette";

export default function MainLayout({ children }) {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isPaletteOpen, setIsPaletteOpen] = useState(false);

  // Global hotkey listener for CMD/CTRL + K
  useEffect(() => {
    function handleGlobalKeyDown(e) {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setIsPaletteOpen((prev) => !prev);
      }
    }
    
    window.addEventListener("keydown", handleGlobalKeyDown);
    return () => window.removeEventListener("keydown", handleGlobalKeyDown);
  }, []);

  return (
    <div className="min-h-screen bg-bg-base text-gray-200 relative overflow-hidden flex flex-col">
      {/* Aurora visual glow spots */}
      <div className="absolute top-[-100px] right-[-100px] h-[500px] w-[500px] rounded-full bg-primary glow-circle opacity-15" />
      <div className="absolute bottom-[-100px] left-[-100px] h-[500px] w-[500px] rounded-full bg-secondary glow-circle opacity-15" />
      <div className="absolute top-[40%] left-[30%] h-[600px] w-[600px] rounded-full bg-accent glow-circle opacity-10" />

      {/* Grid overlay background */}
      <div className="absolute inset-0 grid-overlay opacity-30 pointer-events-none z-0" />

      {/* Left Sidebar */}
      <Sidebar isCollapsed={isSidebarCollapsed} onToggle={setIsSidebarCollapsed} />

      {/* Right Content Panel */}
      <div
        className="flex-1 flex flex-col min-w-0 transition-all duration-300 relative z-10"
        style={{
          marginLeft: isSidebarCollapsed ? "92px" : "266px",
        }}
      >
        {/* Top Navbar */}
        <Navbar />

        {/* Dynamic Page Canvas Container */}
        <main className="flex-1 p-6 relative overflow-hidden">
          {children}
        </main>
      </div>

      {/* Global Command Palette */}
      <CommandPalette isOpen={isPaletteOpen} onClose={() => setIsPaletteOpen(false)} />
    </div>
  );
}
