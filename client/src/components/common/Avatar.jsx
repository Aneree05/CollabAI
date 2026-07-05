import React from "react";
import { cn } from "../../utils/cn";

export default function Avatar({
  user,
  size = "md",
  showPresence = false,
  isOnline = false,
  className,
}) {
  const getInitials = (name = "") => {
    return name
      .split(" ")
      .map((n) => n[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();
  };

  const sizes = {
    sm: "h-8 w-8 text-xs",
    md: "h-10 w-10 text-sm",
    lg: "h-14 w-14 text-lg",
    xl: "h-20 w-20 text-2xl",
  };

  const ringColors = "bg-gradient-to-tr from-primary to-secondary p-[1.5px]";

  return (
    <div className={cn("relative flex-shrink-0 rounded-full", ringColors, sizes[size], className)}>
      <div className="flex h-full w-full items-center justify-center rounded-full bg-bg-surface overflow-hidden">
        {user?.profileImage ? (
          <img
            src={user.profileImage}
            alt={user.name}
            className="h-full w-full object-cover"
          />
        ) : (
          <span className="font-bold text-gray-300 tracking-wider">
            {getInitials(user?.name)}
          </span>
        )}
      </div>

      {showPresence && (
        <span
          className={cn(
            "absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border border-bg-base ring-1",
            isOnline 
              ? "bg-emerald-500 ring-emerald-500/30" 
              : "bg-gray-500 ring-gray-500/30"
          )}
        />
      )}
    </div>
  );
}
