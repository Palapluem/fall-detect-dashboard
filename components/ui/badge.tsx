import * as React from "react";
import { cn } from "@/lib/utils";

type BadgeVariant = "soft" | "safe" | "warning" | "danger" | "care";

const variants: Record<BadgeVariant, string> = {
  soft: "border-slate-200 bg-slate-50 text-slate-700",
  safe: "border-emerald-300 bg-emerald-50 text-emerald-800",
  warning: "border-amber-300 bg-amber-50 text-amber-900",
  danger: "border-rose-300 bg-rose-50 text-rose-800",
  care: "border-cyan-300 bg-cyan-50 text-cyan-800",
};

export function Badge({
  className,
  variant = "soft",
  ...props
}: React.HTMLAttributes<HTMLSpanElement> & { variant?: BadgeVariant }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium capitalize",
        variants[variant],
        className,
      )}
      {...props}
    />
  );
}
