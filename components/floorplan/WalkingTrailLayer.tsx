"use client";

import { motion } from "framer-motion";
import { PathPoint } from "@/lib/types";
import { riskColor } from "@/lib/utils";

export function WalkingTrailLayer({
  points,
  compact,
}: {
  points: PathPoint[];
  compact?: boolean;
}) {
  return (
    <g>
      <defs>
        <filter id="point-glow" x="-80%" y="-80%" width="260%" height="260%">
          <feGaussianBlur stdDeviation="5" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      {points.map((point, index) => {
        const latest = index === points.length - 1;
        const ageOpacity = 0.26 + ((index + 1) / points.length) * 0.58;

        return (
          <g key={`${point.at}-${index}`}>
            <motion.circle
              cx={point.x}
              cy={point.y}
              r={latest ? (compact ? 7 : 8) : compact ? 4 : 4.6}
              fill={riskColor(point.risk)}
              opacity={latest ? 0.95 : ageOpacity}
              filter="url(#point-glow)"
              initial={{ scale: 0.8 }}
              animate={latest ? { scale: [1, 1.35, 1] } : { scale: 1 }}
              transition={latest ? { duration: 1.5, repeat: Infinity } : { duration: 0.3 }}
              style={{ transformOrigin: `${point.x}px ${point.y}px` }}
            />
            <circle
              cx={point.x}
              cy={point.y}
              r={latest ? (compact ? 2.6 : 3) : 1.8}
              fill="#ffffff"
              opacity={latest ? 0.95 : 0.55}
            />
          </g>
        );
      })}
    </g>
  );
}
