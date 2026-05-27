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

const fallTypeCodes = [
  { code: "F01", meaning: "Forward slip fall", thai: "ลื่นล้มไปข้างหน้า" },
  { code: "F02", meaning: "Backward slip fall", thai: "ลื่นล้มไปข้างหลัง" },
  { code: "F03", meaning: "Side slip fall", thai: "ลื่นล้มด้านข้าง" },
  { code: "F04", meaning: "Forward trip fall", thai: "สะดุดล้มไปข้างหน้า" },
  { code: "F05", meaning: "Jogging trip fall", thai: "สะดุดล้มขณะเดินเร็ว" },
  { code: "F06", meaning: "Vertical fainting fall", thai: "เป็นลมทรุดลงแนวดิ่ง" },
  { code: "F07", meaning: "Fall with hand support", thai: "ล้มโดยใช้มือพยุง" },
  { code: "F08", meaning: "Fall while standing up", thai: "ล้มขณะลุกขึ้นยืน" },
  { code: "F09", meaning: "Side fall while standing up", thai: "ล้มด้านข้างขณะลุกขึ้นยืน" },
  { code: "F10", meaning: "Fall while sitting", thai: "ล้มขณะนั่ง" },
  { code: "F11", meaning: "Backward sit fall", thai: "นั่งแล้วหงายล้มไปข้างหลัง" },
  { code: "F12", meaning: "Side sit fall", thai: "นั่งแล้วล้มด้านข้าง" },
  { code: "F13", meaning: "Forward faint while sitting", thai: "เป็นลมโน้มไปข้างหน้าขณะนั่ง" },
  { code: "F14", meaning: "Backward faint while sitting", thai: "เป็นลมหงายหลังขณะนั่ง" },
  { code: "F15", meaning: "Side faint while sitting", thai: "เป็นลมล้มด้านข้างขณะนั่ง" },
];

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

      <Card>
        <CardHeader>
          <CardTitle>รหัสประเภทการล้มที่ระบบรู้จัก</CardTitle>
          <p className="mt-1 text-sm font-medium text-slate-700">
            ใช้เป็นข้อมูลอ้างอิงเมื่อระบบแจ้งเตือนเหตุการณ์ล้มจริง
          </p>
        </CardHeader>
        <CardContent>
          <div className="overflow-hidden rounded-xl border border-slate-200">
            <div className="grid grid-cols-[82px_1fr_1.1fr] bg-slate-50 px-4 py-3 text-sm font-bold text-slate-950">
              <div>Code</div>
              <div>Meaning</div>
              <div>คำอธิบาย</div>
            </div>
            <div className="divide-y divide-slate-100">
              {fallTypeCodes.map((item) => (
                <div
                  key={item.code}
                  className="grid grid-cols-[82px_1fr_1.1fr] px-4 py-3 text-sm text-slate-800"
                >
                  <div className="font-bold text-cyan-700">{item.code}</div>
                  <div className="font-semibold text-slate-950">{item.meaning}</div>
                  <div className="font-medium text-slate-700">{item.thai}</div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

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
