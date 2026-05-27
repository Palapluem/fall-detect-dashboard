"use client";

import { AlertTriangle, Footprints, ShieldAlert } from "lucide-react";
import { CondoFloorplanMap } from "@/components/floorplan/CondoFloorplanMap";
import { AIInsightCard } from "@/components/AIInsightCard";
import { LiveMonitoringBadge } from "@/components/LiveMonitoringBadge";
import { RealtimeAlertPanel } from "@/components/RealtimeAlertPanel";
import { RiskScoreCard } from "@/components/RiskScoreCard";
import { MobilityTrendChart } from "@/components/charts/MobilityTrendChart";
import { StabilityChart } from "@/components/charts/StabilityChart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useMonitoringStore } from "@/store/monitoring-store";

export default function MainDashboardPage() {
  const {
    alerts,
    insights,
    metrics,
    roomRisks,
    trendData,
  } = useMonitoringStore();

  const topRooms = [...roomRisks].sort((a, b) => b.risk - a.risk).slice(0, 3);
  const primaryInsight = insights[0];

  return (
    <div className="space-y-5">
      <Card>
        <CardContent className="grid gap-4 p-4 md:grid-cols-[1fr_auto] md:items-center">
          <div>
            <div className="text-sm text-slate-400">สรุปวันนี้</div>
            <h2 className="mt-1 text-2xl font-semibold">
              {metrics.riskScore >= 70
                ? "ควรให้ผู้ดูแลเข้าไปดู"
                : metrics.riskScore >= 50
                  ? "มีความเสี่ยงปานกลาง ควรคอยสังเกต"
                  : "ตอนนี้ค่อนข้างปลอดภัย"}
            </h2>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-300">
              ห้องที่ควรระวังคือ {topRooms.map((room) => roomLabelThai(room.room)).join(", ")}
              แผนที่แสดง heatmap ความเสี่ยงและจุดเคลื่อนไหวล่าสุดแบบ realtime
            </p>
          </div>
          <LiveMonitoringBadge />
        </CardContent>
      </Card>

      <section className="grid gap-4 xl:grid-cols-[1.45fr_.9fr]">
        <Card className="overflow-hidden">
          <CardHeader className="flex-row items-start justify-between gap-4">
            <div>
              <CardTitle>แผนที่คอนโดแบบ Heatmap</CardTitle>
              <p className="mt-1 text-sm text-slate-300">
                สีแดงคือเสี่ยงสูง สีเขียวคือปกติ และจุดคือการเคลื่อนไหวล่าสุด
              </p>
            </div>
          </CardHeader>
          <CardContent>
            <CondoFloorplanMap className="min-h-[520px]" compact />
          </CardContent>
        </Card>

        <div className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-3 xl:grid-cols-1">
            <RiskScoreCard
              label="ความเสี่ยงล้ม"
              value={metrics.riskScore}
              icon={ShieldAlert}
              tone="risk"
              detail="ประเมินล่าสุด"
            />
            <RiskScoreCard
              label="การเดิน"
              value={metrics.mobilityScore}
              icon={Footprints}
              tone="safe"
              detail="คะแนนการเคลื่อนไหว"
            />
            <RiskScoreCard
              label="เกือบล้ม"
              value={metrics.nearFallCount}
              icon={AlertTriangle}
              tone="warning"
              detail="ใน 24 ชม."
              max={10}
            />
          </div>

          <RealtimeAlertPanel alerts={alerts.slice(0, 3)} />

          <Card>
            <CardHeader>
              <CardTitle>ห้องที่เสี่ยงที่สุด</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {topRooms.map((room, index) => (
                <div
                  key={room.room}
                  className="rounded-lg border border-white/10 bg-white/[0.035] p-3"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Badge variant={index === 0 ? "danger" : "soft"}>
                        #{index + 1}
                      </Badge>
                      <span className="font-medium">{roomLabelThai(room.room)}</span>
                    </div>
                    <span className="text-sm text-slate-300">เสี่ยง {room.risk}%</span>
                  </div>
                  <div className="mt-3 h-2 rounded-full bg-slate-800">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-emerald-400 via-amber-300 to-rose-500"
                      style={{ width: `${room.risk}%` }}
                    />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="grid gap-4 xl:grid-cols-[.9fr_1.1fr]">
        {primaryInsight && <AIInsightCard insight={primaryInsight} />}
        <Card>
          <CardHeader>
            <CardTitle>สิ่งที่ควรดู</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3 text-sm text-slate-300 md:grid-cols-3">
            <div className="rounded-lg border border-white/10 bg-white/[0.035] p-3">
              ห้องน้ำและทางเดินเป็นจุดที่ต้องระวังมากที่สุด
            </div>
            <div className="rounded-lg border border-white/10 bg-white/[0.035] p-3">
              ช่วงกลางคืนมีโอกาสเดินไม่มั่นคงมากขึ้น
            </div>
            <div className="rounded-lg border border-white/10 bg-white/[0.035] p-3">
              ดูรายละเอียดเพิ่มเติมได้ในหน้าแจ้งเตือนและวิเคราะห์
            </div>
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-4 xl:grid-cols-2">
        <MobilityTrendChart data={trendData} />
        <StabilityChart data={trendData} />
      </section>
    </div>
  );
}

function roomLabelThai(room: string) {
  const labels: Record<string, string> = {
    Bedroom: "ห้องนอน",
    Bathroom: "ห้องน้ำ",
    Kitchen: "ห้องครัว",
    "Living Room": "ห้องนั่งเล่น",
    Hallway: "ทางเดิน",
    Balcony: "ระเบียง",
  };

  return labels[room] ?? room;
}
