import React from "react";
import { motion } from "framer-motion";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";
import { ResponsiveContainer, AreaChart, Area } from "recharts";
import GlassCard from "./GlassCard";
import { cn } from "../../utils/cn";

export default function MetricCard({
  title,
  value,
  trend,
  trendLabel = "vs last month",
  icon: Icon,
  sparklineData = [],
  className,
}) {
  const isPositive = trend >= 0;

  return (
    <GlassCard hoverGlow className={cn("p-6 flex flex-col justify-between h-40", className)}>
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
            {title}
          </p>
          <h3 className="text-2xl font-bold tracking-tight text-white">
            {value}
          </h3>
        </div>
        
        {Icon && (
          <div className="p-2.5 rounded-lg bg-white/5 border border-border-glass text-primary shadow-neon-primary">
            <Icon size={18} />
          </div>
        )}
      </div>

      <div className="flex items-end justify-between mt-4">
        <div className="flex items-center gap-1.5">
          <span
            className={cn(
              "inline-flex items-center text-xs font-medium px-2 py-0.5 rounded-full border",
              isPositive
                ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
                : "bg-rose-500/10 border-rose-500/20 text-rose-400"
            )}
          >
            {isPositive ? <ArrowUpRight size={12} className="mr-0.5" /> : <ArrowDownRight size={12} className="mr-0.5" />}
            {Math.abs(trend)}%
          </span>
          <span className="text-xs text-gray-500 font-light">
            {trendLabel}
          </span>
        </div>

        {/* Micro Sparkline Chart */}
        {sparklineData && sparklineData.length > 0 && (
          <div className="h-10 w-24 overflow-hidden opacity-85">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={sparklineData.map((val, idx) => ({ id: idx, value: val }))}>
                <defs>
                  <linearGradient id={`gradient-${title}`} x1="0" y1="0" x2="0" y2="1">
                    <stop
                      offset="5%"
                      stopColor={isPositive ? "#10b981" : "#f43f5e"}
                      stopOpacity={0.2}
                    />
                    <stop
                      offset="95%"
                      stopColor={isPositive ? "#10b981" : "#f43f5e"}
                      stopOpacity={0}
                    />
                  </linearGradient>
                </defs>
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke={isPositive ? "#10b981" : "#f43f5e"}
                  strokeWidth={1.5}
                  fill={`url(#gradient-${title})`}
                  dot={false}
                  isAnimationActive={true}
                  animationDuration={1500}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </GlassCard>
  );
}
