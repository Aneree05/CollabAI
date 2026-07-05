import React from "react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

// Custom Tooltip component to match design theme
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="glass-panel-dark p-3 rounded-lg border border-border-glass shadow-lg">
        <p className="text-xs text-gray-400 mb-1">{label}</p>
        {payload.map((item, idx) => (
          <p key={idx} className="text-sm font-bold" style={{ color: item.color || "#8b5cf6" }}>
            {item.name}: {item.value}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export default function ChartWrapper({
  data = [],
  xKey = "name",
  yKey = "value",
  chartTitle = "Performance Analysis",
  strokeColor = "#6366F1",
  fillGradientId = "colorValue",
  height = 300,
}) {
  return (
    <div className="w-full h-full min-h-[250px]">
      <ResponsiveContainer width="100%" height={height}>
        <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id={fillGradientId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={strokeColor} stopOpacity={0.3} />
              <stop offset="95%" stopColor={strokeColor} stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.02)" />
          <XAxis
            dataKey={xKey}
            stroke="rgba(255,255,255,0.3)"
            fontSize={11}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            stroke="rgba(255,255,255,0.3)"
            fontSize={11}
            tickLine={false}
            axisLine={false}
          />
          <Tooltip content={<CustomTooltip />} />
          <Area
            type="monotone"
            dataKey={yKey}
            name={chartTitle}
            stroke={strokeColor}
            strokeWidth={2}
            fillOpacity={1}
            fill={`url(#${fillGradientId})`}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
