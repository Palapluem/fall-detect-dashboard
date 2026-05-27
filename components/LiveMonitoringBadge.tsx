"use client";

import { motion } from "framer-motion";

export function LiveMonitoringBadge() {
  return (
    <div className="inline-flex items-center gap-2 rounded-full border border-emerald-300 bg-emerald-50 px-3 py-1.5 text-xs font-medium text-emerald-700">
      <motion.span
        className="h-2 w-2 rounded-full bg-emerald-300"
        animate={{ scale: [1, 1.7, 1], opacity: [1, 0.35, 1] }}
        transition={{ duration: 1.4, repeat: Infinity }}
      />
      กำลังติดตาม
    </div>
  );
}
