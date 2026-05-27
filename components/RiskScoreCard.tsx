"use client";

import { LucideIcon } from "lucide-react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const tones = {
  risk: "from-rose-100 to-rose-50 text-rose-700",
  safe: "from-emerald-100 to-emerald-50 text-emerald-700",
  warning: "from-amber-100 to-orange-50 text-amber-700",
  care: "from-cyan-100 to-sky-50 text-cyan-700",
};

export function RiskScoreCard({
  label,
  value,
  icon: Icon,
  detail,
  tone = "care",
  max = 100,
}: {
  label: string;
  value: number;
  icon: LucideIcon;
  detail: string;
  tone?: keyof typeof tones;
  max?: number;
}) {
  const pct = Math.min(100, Math.round((value / max) * 100));

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div className={cn("rounded-lg bg-gradient-to-br p-2", tones[tone])}>
            <Icon className="h-5 w-5" />
          </div>
          <span className="text-xs text-slate-500">{detail}</span>
        </div>
        <div className="mt-4 text-sm text-slate-400">{label}</div>
        <div className="mt-1 text-3xl font-semibold tracking-normal">{value}</div>
        <div className="mt-4 h-2 rounded-full bg-slate-100">
          <motion.div
            className="h-full rounded-full bg-gradient-to-r from-cyan-300 via-emerald-300 to-amber-300"
            initial={{ width: 0 }}
            animate={{ width: `${pct}%` }}
            transition={{ type: "spring", stiffness: 80, damping: 18 }}
          />
        </div>
      </CardContent>
    </Card>
  );
}
