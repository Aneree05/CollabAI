import React from "react";
import { cn } from "../../utils/cn";

export default function Table({ children, className }) {
  return (
    <div className="w-full overflow-x-auto rounded-lg border border-border-glass bg-white/3">
      <table className={cn("w-full border-collapse text-left text-sm text-gray-300", className)}>
        {children}
      </table>
    </div>
  );
}

export function TableHeader({ children, className }) {
  return (
    <thead className={cn("bg-white/5 border-b border-border-glass text-xs font-semibold uppercase tracking-wider text-gray-400", className)}>
      {children}
    </thead>
  );
}

export function TableBody({ children, className }) {
  return (
    <tbody className={cn("divide-y divide-border-glass/40", className)}>
      {children}
    </tbody>
  );
}

export function TableRow({ children, className, interactive = true }) {
  return (
    <tr
      className={cn(
        "transition-colors duration-150",
        interactive && "hover:bg-white/3 cursor-pointer",
        className
      )}
    >
      {children}
    </tr>
  );
}

export function TableHead({ children, className }) {
  return (
    <th className={cn("px-6 py-4 font-semibold text-gray-300", className)}>
      {children}
    </th>
  );
}

export function TableCell({ children, className }) {
  return (
    <td className={cn("px-6 py-4 font-light text-gray-300 whitespace-nowrap", className)}>
      {children}
    </td>
  );
}
