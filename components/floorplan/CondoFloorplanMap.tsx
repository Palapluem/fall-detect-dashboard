"use client";

import { motion } from "framer-motion";
import { useMemo, useState } from "react";
import { Bath, BedDouble, ChefHat, DoorOpen, Sofa, Trees, Waves } from "lucide-react";
import { HeatmapOverlay } from "@/components/floorplan/HeatmapOverlay";
import { NearFallMarker } from "@/components/floorplan/NearFallMarker";
import { WalkingTrailLayer } from "@/components/floorplan/WalkingTrailLayer";
import { baselinePath, riskZones, rooms } from "@/data/floorplan";
import { RoomName, SensorReading } from "@/lib/types";
import { cn, formatClock, riskColor } from "@/lib/utils";
import { useMonitoringStore } from "@/store/monitoring-store";

const roomIcons: Record<RoomName, typeof BedDouble> = {
  Bedroom: BedDouble,
  Bathroom: Bath,
  Kitchen: ChefHat,
  "Living Room": Sofa,
  Hallway: DoorOpen,
  Balcony: Trees,
};

const roomThai: Record<RoomName, string> = {
  Bedroom: "ห้องนอน",
  Bathroom: "ห้องน้ำ",
  Kitchen: "ห้องครัว",
  "Living Room": "ห้องนั่งเล่น",
  Hallway: "ทางเดิน",
  Balcony: "ระเบียง",
};

export function CondoFloorplanMap({
  className,
  detailed,
  compact,
  playbackIndex,
}: {
  className?: string;
  detailed?: boolean;
  compact?: boolean;
  playbackIndex?: number;
}) {
  const {
    readings,
    heatPoints,
    livePosition,
    roomRisks,
    nightMode,
  } = useMonitoringStore();
  const [hoveredRoom, setHoveredRoom] = useState<RoomName | null>(null);
  const activeReading =
    typeof playbackIndex === "number"
      ? readings[Math.min(playbackIndex, readings.length - 1)] ?? livePosition
      : livePosition;
  const recentReadings = useMemo(() => readings.slice(compact ? -10 : -18), [compact, readings]);
  const trail = useMemo(
    () =>
      recentReadings.length > 3
        ? buildDoorAlignedWalk(recentReadings)
        : baselinePath,
    [recentReadings],
  );
  const nearFalls = readings.filter((reading) => reading.near_fall).slice(compact ? -3 : -5);
  const activePoint = doorAlignedPoint(activeReading.room, readings.length);
  const visibleHeatPoints = useMemo(
    () =>
      [...riskZones, ...heatPoints]
        .filter((point, index, all) => index === all.findIndex((item) => item.id === point.id))
        .slice(compact ? -14 : -24),
    [compact, heatPoints],
  );

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-xl border border-slate-300 bg-white p-2 shadow-[0_18px_60px_rgba(15,23,42,0.16)]",
        nightMode && "bg-slate-50",
        className,
      )}
    >
      <svg
        viewBox="0 0 724 488"
        className="h-full min-h-[inherit] w-full"
        role="img"
        aria-label="Realistic condominium indoor floorplan monitoring map"
      >
        <defs>
          <filter id="soft-shadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="8" stdDeviation="8" floodColor="#64748b" floodOpacity=".18" />
          </filter>
          <pattern id="wood" width="24" height="24" patternUnits="userSpaceOnUse">
            <path d="M0 8 H24 M0 16 H24" stroke="rgba(100,116,139,.16)" />
            <path d="M12 0 V24" stroke="rgba(100,116,139,.08)" />
          </pattern>
          <pattern id="tile" width="20" height="20" patternUnits="userSpaceOnUse">
            <path d="M20 0 H0 V20" fill="none" stroke="rgba(71,85,105,.16)" />
          </pattern>
          <pattern id="balcony-lines" width="14" height="14" patternUnits="userSpaceOnUse">
            <path d="M0 14 L14 0" stroke="rgba(71,85,105,.14)" />
          </pattern>
        </defs>

        <rect x="20" y="24" width="684" height="432" rx="18" fill="#ffffff" filter="url(#soft-shadow)" />
        <rect x="42" y="44" width="518" height="386" rx="4" fill="#7cff00" opacity=".72" />
        <rect x="42" y="44" width="518" height="386" rx="4" fill="url(#wood)" opacity=".65" />
        <rect x="560" y="88" width="122" height="320" rx="3" fill="#95ff1a" opacity=".58" />
        <rect x="560" y="88" width="122" height="320" rx="3" fill="url(#balcony-lines)" opacity=".7" />

        {rooms.map((room) => {
          const Icon = roomIcons[room.name];
          const risk = roomRisks.find((item) => item.room === room.name)?.risk ?? 35;
          const active = hoveredRoom === room.name || activeReading.room === room.name;

          return (
            <motion.g
              key={room.name}
              onMouseEnter={() => setHoveredRoom(room.name)}
              onMouseLeave={() => setHoveredRoom(null)}
              initial={false}
              animate={{ opacity: active ? 1 : 0.88 }}
            >
              <motion.path
                d={room.d}
                fill={
                  room.name === "Bathroom"
                    ? "url(#tile)"
                    : room.name === "Balcony"
                      ? "rgba(255,255,255,.38)"
                      : "rgba(255,255,255,.24)"
                }
                stroke={active ? riskColor(risk) : "rgba(15,23,42,.42)"}
                strokeWidth={active ? 2.4 : 1.2}
                animate={{
                  filter: active ? "drop-shadow(0 0 10px rgba(15,23,42,.22))" : "none",
                }}
              />
              <motion.path
                d={room.d}
                fill={riskColor(risk)}
                initial={false}
                animate={{
                  opacity: active ? roomHeatOpacity(risk) + 0.05 : roomHeatOpacity(risk),
                }}
              />
              <foreignObject x={room.label.x} y={room.label.y - 18} width="168" height="40">
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-900">
                  <Icon className="h-4 w-4 text-slate-700" />
                  <span>{roomThai[room.name]}</span>
                </div>
              </foreignObject>
              {detailed && (
                <text x={room.label.x} y={room.label.y + 18} className="fill-slate-700 text-[10px]">
                  เสี่ยง {Math.round(risk)}% - ความหนาแน่น{" "}
                  {roomRisks.find((item) => item.room === room.name)?.activity ?? 30}%
                </text>
              )}
            </motion.g>
          );
        })}

        <HeatmapOverlay points={visibleHeatPoints} />
        <ArchitecturalDetails />
        <WalkingTrailLayer points={trail} compact={compact} />

        {nearFalls.map((reading) => (
          <NearFallMarker key={reading.timestamp} reading={reading} />
        ))}

        <motion.g
          animate={{ x: activePoint.x, y: activePoint.y }}
          transition={{ type: "spring", stiffness: 70, damping: 18 }}
        >
          <motion.circle
            r="17"
            fill="rgba(8,145,178,.16)"
            animate={{ scale: [1, 1.38, 1], opacity: [0.4, 0.12, 0.4] }}
            transition={{ repeat: Infinity, duration: 1.8 }}
          />
          <circle r="8" fill="#0891b2" stroke="#ffffff" strokeWidth="3" />
          <foreignObject x="12" y="-28" width="96" height="28">
            <div className="inline-flex rounded-full border border-cyan-200 bg-white px-2.5 py-1 text-[11px] font-bold text-cyan-900 shadow-sm">
              คุณสมชาย
            </div>
          </foreignObject>
        </motion.g>

        <RiskLegend />
      </svg>

      {hoveredRoom && (
        <div className="pointer-events-none absolute left-4 top-4 rounded-lg border border-white/10 bg-slate-950/80 px-3 py-2 text-sm shadow-glow backdrop-blur">
          <span className="font-medium">{roomThai[hoveredRoom]}</span>
          <span className="ml-2 text-slate-400">
            เสี่ยง {roomRisks.find((room) => room.room === hoveredRoom)?.risk}%
          </span>
        </div>
      )}
    </div>
  );
}

function buildDoorAlignedWalk(readings: SensorReading[]) {
  return readings.map((reading, index) => {
    const roomPoint = doorAlignedPoint(reading.room, index);
    return {
      x: roomPoint.x,
      y: roomPoint.y,
      at: formatClock(reading.timestamp),
      risk: reading.fall_risk,
    };
  });
}

function doorAlignedPoint(room: RoomName, index: number) {
  const points: Record<RoomName, Array<{ x: number; y: number }>> = {
    Bedroom: [
      { x: 250, y: 222 },
      { x: 294, y: 244 },
    ],
    Bathroom: [
      { x: 178, y: 330 },
      { x: 124, y: 358 },
    ],
    Hallway: [
      { x: 234, y: 290 },
      { x: 286, y: 334 },
      { x: 326, y: 392 },
    ],
    Kitchen: [
      { x: 350, y: 330 },
      { x: 430, y: 342 },
      { x: 510, y: 360 },
    ],
    "Living Room": [
      { x: 382, y: 226 },
      { x: 470, y: 206 },
      { x: 530, y: 236 },
    ],
    Balcony: [
      { x: 566, y: 258 },
      { x: 612, y: 304 },
    ],
  };

  const roomPoints = points[room];
  return roomPoints[index % roomPoints.length];
}

function roomHeatOpacity(risk: number) {
  if (risk >= 82) return 0.22;
  if (risk >= 62) return 0.18;
  if (risk >= 42) return 0.14;
  return 0.08;
}

function ArchitecturalDetails() {
  return (
    <g>
      <path d="M42 44 H560 V88 H682 V408 H560 V430 H42 Z" fill="none" stroke="#475569" strokeOpacity=".82" strokeWidth="5" />
      <path d="M298 44 V210 H330 V430" stroke="#475569" strokeOpacity=".76" strokeWidth="4.5" />
      <path d="M42 256 H188 M188 256 H330 M330 256 H560" stroke="#475569" strokeOpacity=".76" strokeWidth="4.5" />
      <path d="M188 256 V430" stroke="#475569" strokeOpacity=".76" strokeWidth="4.5" />
      <path d="M560 128 H682 M560 196 H682 M560 264 H682 M560 332 H682" stroke="#64748b" strokeOpacity=".45" strokeWidth="2" />

      <path d="M188 292 A42 42 0 0 0 230 250" fill="none" stroke="#334155" strokeOpacity=".6" strokeWidth="2" />
      <path d="M330 304 A48 48 0 0 1 282 256" fill="none" stroke="#334155" strokeOpacity=".6" strokeWidth="2" />
      <path d="M560 254 A52 52 0 0 0 508 202" fill="none" stroke="#334155" strokeOpacity=".6" strokeWidth="2" />
      <path d="M298 210 A48 48 0 0 1 250 258" fill="none" stroke="#334155" strokeOpacity=".6" strokeWidth="2" />

      <rect x="66" y="74" width="108" height="76" rx="10" fill="none" stroke="#475569" strokeOpacity=".62" />
      <rect x="76" y="84" width="88" height="28" rx="6" fill="none" stroke="#64748b" strokeOpacity=".55" />
      <rect x="214" y="74" width="58" height="132" rx="7" fill="none" stroke="#475569" strokeOpacity=".55" />
      <rect x="68" y="330" width="72" height="48" rx="24" fill="none" stroke="#475569" strokeOpacity=".55" />
      <rect x="68" y="276" width="92" height="34" rx="8" fill="none" stroke="#475569" strokeOpacity=".55" />
      <circle cx="152" cy="396" r="18" fill="none" stroke="#475569" strokeOpacity=".55" />
      <rect x="356" y="286" width="164" height="28" rx="5" fill="none" stroke="#475569" strokeOpacity=".55" />
      <rect x="508" y="314" width="30" height="92" rx="5" fill="none" stroke="#475569" strokeOpacity=".55" />
      <circle cx="400" cy="302" r="10" fill="none" stroke="#475569" strokeOpacity=".55" />
      <rect x="374" y="110" width="92" height="54" rx="14" fill="none" stroke="#475569" strokeOpacity=".55" />
      <rect x="470" y="134" width="58" height="86" rx="14" fill="none" stroke="#475569" strokeOpacity=".55" />
      <rect x="394" y="210" width="70" height="32" rx="8" fill="none" stroke="#475569" strokeOpacity=".55" />
      <foreignObject x="610" y="372" width="44" height="34">
        <div className="text-slate-700"><Waves className="h-6 w-6" /></div>
      </foreignObject>
    </g>
  );
}

function RiskLegend() {
  return (
    <foreignObject x="466" y="32" width="220" height="54">
      <div className="rounded-lg border border-slate-300 bg-white/90 p-2 text-[10px] text-slate-700 shadow-sm backdrop-blur">
        <div className="mb-1 font-semibold text-slate-950">แผนที่ความเสี่ยง</div>
        <div className="grid grid-cols-5 gap-1">
          <span className="rounded bg-blue-600 px-1 text-white">ต่ำ</span>
          <span className="rounded bg-cyan-300 px-1 text-slate-950">น้อย</span>
          <span className="rounded bg-lime-400 px-1 text-slate-950">ปกติ</span>
          <span className="rounded bg-yellow-300 px-1 text-slate-950">กลาง</span>
          <span className="rounded bg-red-500 px-1 text-white">สูง</span>
        </div>
      </div>
    </foreignObject>
  );
}
