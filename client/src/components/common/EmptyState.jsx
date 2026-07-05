import React from "react";
import { Inbox } from "lucide-react";
import Button from "../ui/Button";

export default function EmptyState({
  title = "No data found",
  description = "Get started by creating a new entry or adjust your filter constraints.",
  actionText,
  onAction,
  icon: Icon = Inbox,
}) {
  return (
    <div className="flex flex-col items-center justify-center p-8 rounded-xl border border-dashed border-border-glass bg-white/2 text-center max-w-sm mx-auto">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/5 border border-border-glass text-gray-500 mb-4 shadow-inner">
        <Icon size={20} className="text-primary animate-pulse-slow" />
      </div>
      
      <h3 className="text-sm font-bold text-white mb-1.5">{title}</h3>
      <p className="text-xs text-gray-400 font-light max-w-[260px] leading-relaxed mb-5">
        {description}
      </p>

      {actionText && onAction && (
        <Button variant="secondary" size="sm" onClick={onAction}>
          {actionText}
        </Button>
      )}
    </div>
  );
}
