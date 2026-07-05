import React from "react";
import { motion } from "framer-motion";
import { cn } from "../../utils/cn";

export default function Timeline({ items = [], className }) {
  return (
    <div className={cn("relative border-l border-border-glass pl-6 space-y-6 ml-3", className)}>
      {items.map((item, idx) => (
        <motion.div
          key={item.id || idx}
          initial={{ opacity: 0, x: -10 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.3, delay: idx * 0.1 }}
          className="relative"
        >
          {/* Active timeline pulse dot */}
          <div className="absolute -left-[31px] top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-bg-base border border-border-glass">
            <span
              className={cn(
                "h-2 w-2 rounded-full",
                item.active ? "bg-accent shadow-neon-accent" : "bg-gray-700"
              )}
            />
          </div>

          <div className="flex flex-col gap-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs text-gray-500 font-medium">
                {item.date}
              </span>
              {item.badge && (
                <span className="text-[10px] uppercase font-semibold text-accent border border-accent/20 px-1.5 py-0.5 rounded bg-accent/5">
                  {item.badge}
                </span>
              )}
            </div>
            <h4 className="text-sm font-bold text-white leading-relaxed">
              {item.title}
            </h4>
            <p className="text-xs text-gray-400 font-light leading-relaxed">
              {item.description}
            </p>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
