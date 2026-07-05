import React, { useState } from "react";
import { Search, Moon, Sun, Keyboard, User, Settings, LogOut } from "lucide-react";
import Breadcrumb from "./Breadcrumb";
import NotificationDropdown from "../common/NotificationDropdown";
import Avatar from "../common/Avatar";
import Dropdown, { DropdownItem, DropdownDivider } from "../ui/Dropdown";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";
import CommandPalette from "../common/CommandPalette";

export default function Navbar() {
  const { user, logout, isAuthenticated } = useAuth();
  const { toggleTheme, isDark } = useTheme();
  const [isPaletteOpen, setIsPaletteOpen] = useState(false);

  return (
    <>
      <header className="sticky top-4 z-30 mx-4 rounded-xl glass-panel bg-[#050816]/75 px-4 py-3 flex items-center justify-between border border-white/8 shadow-lg min-h-[58px]">
        {/* Left: Breadcrumbs navigation */}
        <div className="flex items-center gap-4">
          <Breadcrumb />
        </div>

        {/* Right: Search, Notifications, Profile, Theme controls */}
        <div className="flex items-center gap-3">
          {/* Quick Search palette activator */}
          <button
            onClick={() => setIsPaletteOpen(true)}
            className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/3 border border-border-glass text-xs text-gray-400 hover:text-white hover:bg-white/5 transition-all cursor-pointer"
          >
            <Search size={14} />
            <span>Search actions...</span>
            <kbd className="inline-flex items-center gap-0.5 px-1 py-0.2 rounded border border-border-glass bg-white/5 text-[9px] text-gray-500 font-mono font-bold ml-2">
              ⌘K
            </kbd>
          </button>

          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg bg-white/5 border border-border-glass text-gray-400 hover:text-white hover:border-indigo-500/30 transition-all cursor-pointer"
            aria-label="Toggle Theme"
          >
            {isDark ? <Sun size={15} /> : <Moon size={15} />}
          </button>

          {/* Notifications Dropdown */}
          <NotificationDropdown />

          {/* Profile Menu Trigger */}
          {isAuthenticated && (
            <Dropdown
              align="right"
              trigger={
                <button className="flex items-center gap-2 rounded-full cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary/50">
                  <Avatar user={user} size="sm" />
                </button>
              }
            >
              <div className="px-3 py-2 text-left">
                <p className="text-xs font-bold text-white leading-normal truncate">
                  {user?.name || "Member User"}
                </p>
                <p className="text-[10px] text-gray-400 font-light truncate">
                  {user?.email || "user@collabai.com"}
                </p>
              </div>
              <DropdownDivider />
              
              <DropdownItem onClick={() => (window.location.href = "/profile")}>
                <User size={14} />
                <span>My Profile</span>
              </DropdownItem>
              
              <DropdownItem onClick={() => (window.location.href = "/settings")}>
                <Settings size={14} />
                <span>Account Settings</span>
              </DropdownItem>
              
              <DropdownDivider />
              
              <DropdownItem onClick={logout} danger>
                <LogOut size={14} />
                <span>Sign Out</span>
              </DropdownItem>
            </Dropdown>
          )}
        </div>
      </header>

      {/* Global Command Palette */}
      <CommandPalette isOpen={isPaletteOpen} onClose={() => setIsPaletteOpen(false)} />
    </>
  );
}
