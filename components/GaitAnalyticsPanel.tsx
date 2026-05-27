"use client";

import { Activity, Footprints, Gauge, RotateCcw, Waves } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SensorReading } from "@/lib/types";

export function GaitAnalyticsPanel({
  latest,
  expanded,
}: {
  latest?: SensorReading;
  expanded?: boolean;
}) {
  const values = [
    { label: "ความเร็วเดิน", value: `${latest?.gait_speed.toFixed(2) ?? "0.82"} m/s`, icon: Footprints },
    { label: "การโอนเอน", value: `${latest?.sway.toFixed(2) ?? "3.10"} deg`, icon: Waves },
    { label: "จังหวะก้าว", value: `${Math.round(latest?.cadence ?? 92)} spm`, icon: Activity },
    { label: "ความเร็วตอนเลี้ยว", value: `${latest?.turning_velocity.toFixed(1) ?? "68.0"} deg/s`, icon: RotateCcw },
    { label: "ไม่มั่นคง", value: `${Math.round(latest?.instability_score ?? 44)}%`, icon: Gauge },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>ข้อมูลการเดิน</CardTitle>
        <p className="text-sm text-slate-400">
          สรุปค่าการเดินจากเซนเซอร์และตำแหน่งในห้อง
        </p>
      </CardHeader>
      <CardContent>
        <div className={`grid gap-3 ${expanded ? "md:grid-cols-5" : "md:grid-cols-3 xl:grid-cols-5"}`}>
          {values.map((item) => (
            <div key={item.label} className="rounded-lg border border-white/10 bg-white/[0.035] p-4">
              <item.icon className="h-5 w-5 text-cyan-300" />
              <div className="mt-3 text-xs uppercase tracking-[0.18em] text-slate-500">{item.label}</div>
              <div className="mt-1 text-xl font-semibold">{item.value}</div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
