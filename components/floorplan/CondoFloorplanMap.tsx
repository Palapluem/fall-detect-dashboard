"use client";

import { motion } from "framer-motion";
import { useMemo, useState } from "react";
import { Bath, BedDouble, ChefHat, DoorOpen, Sofa, Trees, Waves } from "lucide-react";
import { HeatmapOverlay } from "@/components/floorplan/HeatmapOverlay";
import { NearFallMarker } from "@/components/floorplan/NearFallMarker";
import { riskZones, rooms } from "@/data/floorplan";
import { RoomName } from "@/lib/types";
import { clamp, cn, riskColor } from "@/lib/utils";
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
  const { readings, heatPoints, livePosition, roomRisks, nightMode } =
    useMonitoringStore();
  const [hoveredRoom, setHoveredRoom] = useState<RoomName | null>(null);
  const activeReading =
    typeof playbackIndex === "number"
      ? readings[Math.min(playbackIndex, readings.length - 1)] ?? livePosition
      : livePosition;
  const nearFalls = readings.filter((reading) => reading.near_fall).slice(compact ? -2 : -4);
  const activePoint = {
    x: clamp(activeReading.x, 58, 688),
    y: clamp(activeReading.y, 62, 426),
  };
  const visibleHeatPoints = useMemo(
    () =>
      [...riskZones, ...heatPoints]
        .filter((point) => point.intensity >= 62)
        .filter((point, index, all) => index === all.findIndex((item) => item.id === point.id))
        .slice(compact ? -12 : -20),
    [compact, heatPoints],
  );

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-2xl border border-slate-300 bg-white p-3 shadow-[0_18px_60px_rgba(15,23,42,0.14)]",
        nightMode && "bg-slate-50",
        className,
      )}
    >
      <svg
        viewBox="0 0 724 488"
        className="h-full min-h-[inherit] w-full"
        role="img"
        aria-label="แผนที่บ้านพร้อม heatmap ความเสี่ยงการล้ม"
      >
        <defs>
          <filter id="soft-shadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="8" stdDeviation="8" floodColor="#64748b" floodOpacity=".16" />
          </filter>
          <pattern id="floor-grid" width="18" height="18" patternUnits="userSpaceOnUse">
            <path d="M18 0 H0 V18" fill="none" stroke="rgba(100,116,139,.10)" />
          </pattern>
          <pattern id="balcony-lines" width="14" height="14" patternUnits="userSpaceOnUse">
            <path d="M0 14 L14 0" stroke="rgba(71,85,105,.16)" />
          </pattern>
        </defs>

        <rect x="28" y="30" width="674" height="430" rx="18" fill="#ffffff" filter="url(#soft-shadow)" />
        <rect x="58" y="62" width="512" height="364" rx="2" fill="#86ef2e" opacity=".72" />
        <rect x="58" y="62" width="512" height="364" rx="2" fill="url(#floor-grid)" opacity=".6" />
        <rect x="570" y="112" width="118" height="288" rx="2" fill="#b8ff7a" opacity=".72" />
        <rect x="570" y="112" width="118" height="288" rx="2" fill="url(#balcony-lines)" opacity=".65" />

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
              animate={{ opacity: active ? 1 : 0.92 }}
            >
              <motion.path
                d={room.d}
                fill={room.name === "Balcony" ? "rgba(255,255,255,.24)" : "rgba(255,255,255,.18)"}
                stroke={active ? riskColor(risk) : "rgba(15,23,42,.46)"}
                strokeWidth={active ? 2.8 : 1.25}
              />
              <motion.path
                d={room.d}
                fill={riskColor(risk)}
                initial={false}
                animate={{ opacity: active ? roomHeatOpacity(risk) + 0.04 : roomHeatOpacity(risk) }}
              />
              <foreignObject x={room.label.x} y={room.label.y - 18} width="168" height="42">
                <div className="flex items-center gap-2 rounded-md bg-white/70 px-2 py-1 text-xs font-bold text-slate-950 shadow-sm">
                  <Icon className="h-4 w-4 text-slate-700" />
                  <span>{roomThai[room.name]}</span>
                </div>
              </foreignObject>
              {detailed && (
                <text x={room.label.x} y={room.label.y + 22} className="fill-slate-800 text-[10px] font-semibold">
                  เสี่ยง {Math.round(risk)}% - ความหนาแน่น{" "}
                  {roomRisks.find((item) => item.room === room.name)?.activity ?? 30}%
                </text>
              )}
            </motion.g>
          );
        })}

        <HeatmapOverlay points={visibleHeatPoints} />
        <ArchitecturalDetails />

        {nearFalls.map((reading) => (
          <NearFallMarker key={reading.timestamp} reading={reading} />
        ))}

        <motion.g
          animate={{ x: activePoint.x, y: activePoint.y }}
          transition={{ duration: 3.2, ease: "easeInOut" }}
        >
          <motion.circle
            r="18"
            fill="rgba(8,145,178,.14)"
            animate={{ scale: [1, 1.35, 1], opacity: [0.42, 0.12, 0.42] }}
            transition={{ repeat: Infinity, duration: 2.2 }}
          />
          <circle r="8" fill="#0891b2" stroke="#ffffff" strokeWidth="3" />
          <foreignObject x="12" y="-30" width="108" height="30">
            <div className="inline-flex rounded-full border border-cyan-200 bg-white px-3 py-1 text-[11px] font-bold text-cyan-900 shadow-sm">
              คุณสมชาย
            </div>
          </foreignObject>
        </motion.g>

        <RiskLegend />
      </svg>

      {hoveredRoom && (
        <div className="pointer-events-none absolute left-4 top-4 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-lg">
          <span className="font-bold">{roomThai[hoveredRoom]}</span>
          <span className="ml-2 text-slate-600">
            เสี่ยง {roomRisks.find((room) => room.room === hoveredRoom)?.risk}%
          </span>
        </div>
      )}
    </div>
  );
}

function roomHeatOpacity(risk: number) {
  if (risk >= 82) return 0.2;
  if (risk >= 62) return 0.16;
  if (risk >= 42) return 0.12;
  return 0.06;
}

function ArchitecturalDetails() {
  return (
    <g>
      <path d="M58 62 H570 V112 H688 V400 H570 V426 H58 Z" fill="none" stroke="#334155" strokeOpacity=".82" strokeWidth="5" />
      <path d="M282 62 V218 H250 M250 260 H58" fill="none" stroke="#334155" strokeOpacity=".78" strokeWidth="4.5" />
      <path d="M220 260 V426 M356 218 V426 M356 250 H570" fill="none" stroke="#334155" strokeOpacity=".78" strokeWidth="4.5" />
      <path d="M570 112 V400 M570 202 H688 M570 292 H688" fill="none" stroke="#64748b" strokeOpacity=".55" strokeWidth="2.5" />

      <path d="M250 218 A48 48 0 0 1 298 266" fill="none" stroke="#334155" strokeOpacity=".65" strokeWidth="2" />
      <path d="M220 304 A44 44 0 0 0 264 260" fill="none" stroke="#334155" strokeOpacity=".65" strokeWidth="2" />
      <path d="M356 334 A46 46 0 0 1 310 288" fill="none" stroke="#334155" strokeOpacity=".65" strokeWidth="2" />
      <path d="M570 258 A46 46 0 0 0 524 212" fill="none" stroke="#334155" strokeOpacity=".65" strokeWidth="2" />

      <rect x="88" y="104" width="120" height="78" rx="12" fill="none" stroke="#475569" strokeOpacity=".62" />
      <rect x="104" y="118" width="88" height="30" rx="6" fill="none" stroke="#64748b" strokeOpacity=".55" />
      <rect x="224" y="92" width="44" height="128" rx="8" fill="none" stroke="#475569" strokeOpacity=".55" />
      <rect x="90" y="304" width="84" height="36" rx="7" fill="none" stroke="#475569" strokeOpacity=".55" />
      <rect x="88" y="362" width="78" height="52" rx="26" fill="none" stroke="#475569" strokeOpacity=".55" />
      <circle cx="184" cy="404" r="20" fill="none" stroke="#475569" strokeOpacity=".55" />
      <rect x="386" y="314" width="160" height="34" rx="6" fill="none" stroke="#475569" strokeOpacity=".55" />
      <rect x="516" y="356" width="32" height="54" rx="7" fill="none" stroke="#475569" strokeOpacity=".55" />
      <circle cx="420" cy="334" r="11" fill="none" stroke="#475569" strokeOpacity=".55" />
      <rect x="390" y="124" width="106" height="62" rx="14" fill="none" stroke="#475569" strokeOpacity=".55" />
      <rect x="500" y="142" width="54" height="84" rx="13" fill="none" stroke="#475569" strokeOpacity=".55" />
      <rect x="428" y="212" width="86" height="30" rx="8" fill="none" stroke="#475569" strokeOpacity=".55" />
      <foreignObject x="622" y="352" width="44" height="34">
        <div className="text-slate-700"><Waves className="h-6 w-6" /></div>
      </foreignObject>
    </g>
  );
}

function RiskLegend() {
  return (
    <foreignObject x="510" y="8" width="178" height="54">
      <div className="rounded-lg border border-slate-300 bg-white/95 p-2 text-[10px] text-slate-700 shadow-sm backdrop-blur">
        <div className="mb-1 font-bold text-slate-950">แผนที่ความเสี่ยงสูง</div>
        <div className="grid grid-cols-3 gap-1">
          <span className="rounded bg-lime-400 px-1 text-slate-950">ปกติ</span>
          <span className="rounded bg-yellow-300 px-1 text-slate-950">กลาง</span>
          <span className="rounded bg-red-500 px-1 text-white">สูง</span>
        </div>
      </div>
    </foreignObject>
  );
}
