"use client";

import { motion } from "framer-motion";
import { HeatPoint } from "@/lib/types";

function hotColor(intensity: number) {
  if (intensity >= 82) return "#ef0000";
  if (intensity >= 64) return "#ff7a00";
  if (intensity >= 48) return "#ffee00";
  if (intensity >= 32) return "#00f6d2";
  return "#004bff";
}

export function HeatmapOverlay({ points }: { points: HeatPoint[] }) {
  return (
    <g style={{ mixBlendMode: "multiply" }}>
      <defs>
        {points.map((point) => (
          <radialGradient key={point.id} id={`heat-${point.id}`}>
            <stop offset="0%" stopColor={hotColor(point.intensity)} stopOpacity="0.78" />
            <stop offset="44%" stopColor={hotColor(point.intensity)} stopOpacity="0.38" />
            <stop offset="74%" stopColor="#78ff00" stopOpacity="0.22" />
            <stop offset="100%" stopColor="#78ff00" stopOpacity="0" />
          </radialGradient>
        ))}
      </defs>
      {points.map((point, index) => (
        <motion.circle
          key={point.id}
          cx={point.x}
          cy={point.y}
          r={point.radius * 1.18}
          fill={`url(#heat-${point.id})`}
          initial={{ opacity: 0.72, scale: 0.96 }}
          animate={{
            opacity: [0.62, 0.88, 0.62],
            scale: [0.98, 1.04, 0.98],
          }}
          transition={{
            duration: 3 + index * 0.2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          style={{ transformOrigin: `${point.x}px ${point.y}px` }}
        />
      ))}
    </g>
  );
}
