import React, { forwardRef } from "react";
import { cn } from "../../utils/cn";

const Input = forwardRef(
  (
    {
      className,
      type = "text",
      error,
      label,
      leftIcon: LeftIcon,
      rightIcon: RightIcon,
      containerClassName,
      ...props
    },
    ref
  ) => {
    return (
      <div className={cn("w-full flex flex-col gap-1.5", containerClassName)}>
        {label && (
          <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider pl-1">
            {label}
          </label>
        )}
        <div className="relative w-full flex items-center">
          {LeftIcon && (
            <div className="absolute left-3.5 text-gray-500 pointer-events-none">
              <LeftIcon size={16} />
            </div>
          )}
          
          <input
            type={type}
            ref={ref}
            className={cn(
              "w-full px-4 py-2.5 rounded-lg bg-white/5 border border-border-glass text-sm text-white placeholder-gray-500",
              "focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/40",
              "transition-all duration-200 hover:bg-white/8 hover:border-white/15",
              LeftIcon && "pl-10",
              RightIcon && "pr-10",
              error && "border-red-500/50 focus:border-red-500 focus:ring-red-500/40 hover:border-red-500/40",
              className
            )}
            {...props}
          />

          {RightIcon && (
            <div className="absolute right-3.5 text-gray-500">
              <RightIcon size={16} />
            </div>
          )}
        </div>
        {error && (
          <span className="text-xs text-red-400 pl-1 font-light tracking-wide">
            {error}
          </span>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

export default Input;
