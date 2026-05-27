"use client";

import {
  AlertTriangle,
  CheckCircle2,
  HeartPulse,
  Home,
  MapPin,
  Phone,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CareAlert, RoomName } from "@/lib/types";
import { formatClock } from "@/lib/utils";
import { useMonitoringStore } from "@/store/monitoring-store";

const roomThai: Record<RoomName, string> = {
  Bedroom: "ห้องนอน",
  Bathroom: "ห้องน้ำ",
  Kitchen: "ห้องครัว",
  "Living Room": "ห้องนั่งเล่น",
  Hallway: "ทางเดิน",
  Balcony: "ระเบียง",
};

export default function CaregiverPage() {
  const { alerts, metrics, roomRisks, livePosition } = useMonitoringStore();
  const topRooms = [...roomRisks].sort((a, b) => b.risk - a.risk).slice(0, 3);
  const activeAlerts = alerts.filter((alert) => !alert.acknowledged).slice(0, 3);
  const status = getCareStatus(metrics.riskScore);

  return (
    <div className="space-y-5">
      <Card className={`border ${status.cardTone}`}>
        <CardContent className="grid gap-5 p-5 lg:grid-cols-[1fr_auto] lg:items-center">
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <status.icon className={`h-8 w-8 ${status.iconTone}`} />
              <div>
                <div className="text-sm text-slate-400">สรุปตอนนี้</div>
                <h2 className="mt-1 text-3xl font-semibold">{status.title}</h2>
              </div>
            </div>
            <p className="mt-4 max-w-3xl text-base leading-7 text-slate-200">
              {status.message}
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-3 lg:w-[430px]">
            <SimpleStat label="ความเสี่ยง" value={`${metrics.riskScore}%`} />
            <SimpleStat label="การเดิน" value={`${metrics.mobilityScore}%`} />
            <SimpleStat label="เกือบล้ม" value={`${metrics.nearFallCount} ครั้ง`} />
          </div>
        </CardContent>
      </Card>

      <section className="grid gap-4 xl:grid-cols-[.9fr_1.1fr]">
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-cyan-300" />
                อยู่ที่ไหนตอนนี้
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="rounded-xl border border-white/10 bg-white/[0.04] p-5">
                <div className="text-sm text-slate-400">ตำแหน่งล่าสุด</div>
                <div className="mt-2 text-3xl font-semibold">
                  {roomThai[livePosition.room]}
                </div>
                <div className="mt-3 text-sm text-slate-300">
                  อัปเดตล่าสุด {formatClock(livePosition.timestamp)}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Phone className="h-5 w-5 text-emerald-300" />
                ควรทำอะไร
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {status.actions.map((action, index) => (
                <div
                  key={action}
                  className="flex gap-3 rounded-xl border border-white/10 bg-white/[0.04] p-4 text-base text-slate-100"
                >
                  <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-cyan-300 text-sm font-bold text-slate-950">
                    {index + 1}
                  </span>
                  <span>{action}</span>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          <Card>
            <CardHeader className="flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-amber-300" />
                แจ้งเตือนล่าสุด
              </CardTitle>
              <Badge variant={activeAlerts.length > 0 ? "warning" : "safe"}>
                {activeAlerts.length > 0 ? `${activeAlerts.length} รายการ` : "ไม่มี"}
              </Badge>
            </CardHeader>
            <CardContent className="space-y-3">
              {activeAlerts.length > 0 ? (
                activeAlerts.map((alert) => (
                  <SimpleAlert key={alert.id} alert={alert} />
                ))
              ) : (
                <div className="rounded-xl border border-emerald-300/20 bg-emerald-400/10 p-4 text-emerald-100">
                  ตอนนี้ไม่มีแจ้งเตือนสำคัญ
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Home className="h-5 w-5 text-cyan-300" />
                ห้องที่ควรระวัง
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {topRooms.map((room) => (
                <div
                  key={room.room}
                  className="rounded-xl border border-white/10 bg-white/[0.04] p-4"
                >
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <div className="text-lg font-semibold">{roomThai[room.room]}</div>
                      <div className="mt-1 text-sm text-slate-400">
                        {room.risk >= 70
                          ? "ควรเข้าไปดูแลใกล้ ๆ"
                          : room.risk >= 50
                            ? "ควรคอยสังเกต"
                            : "ยังดูปลอดภัย"}
                      </div>
                    </div>
                    <Badge variant={room.risk >= 70 ? "danger" : room.risk >= 50 ? "warning" : "safe"}>
                      {room.risk}%
                    </Badge>
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
    </div>
  );
}

function SimpleStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.045] p-4 text-center">
      <div className="text-sm text-slate-400">{label}</div>
      <div className="mt-2 text-2xl font-semibold">{value}</div>
    </div>
  );
}

function SimpleAlert({ alert }: { alert: CareAlert }) {
  return (
    <div className={`rounded-xl border p-4 ${alertTone(alert.severity)}`}>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="text-lg font-semibold">{alertMessageThai(alert)}</div>
        <Badge variant={alert.severity === "emergency" || alert.severity === "high" ? "danger" : "warning"}>
          {alertSeverityThai(alert.severity)}
        </Badge>
      </div>
      <div className="mt-2 text-sm opacity-80">
        {roomThai[alert.room]} - {alert.timestamp}
      </div>
    </div>
  );
}

function getCareStatus(riskScore: number) {
  if (riskScore >= 75) {
    return {
      title: "ควรเข้าไปดูตอนนี้",
      message: "ระบบเห็นความเสี่ยงสูง ผู้ดูแลควรเช็กว่าปลอดภัยดีหรือไม่",
      icon: AlertTriangle,
      iconTone: "text-rose-200",
      cardTone: "border-rose-300/35 bg-rose-500/[0.08]",
      actions: [
        "โทรหา หรือเดินไปดูผู้สูงอายุ",
        "ดูว่าพื้นลื่น มีของเกะกะ หรือยืนไม่มั่นคงหรือไม่",
        "ถ้าติดต่อไม่ได้ ให้แจ้งคนใกล้บ้านหรือหน่วยช่วยเหลือ",
      ],
    };
  }

  if (riskScore >= 50) {
    return {
      title: "ควรคอยสังเกต",
      message: "ยังไม่ฉุกเฉิน แต่มีบางจุดที่เสี่ยง โดยเฉพาะห้องน้ำและทางเดิน",
      icon: HeartPulse,
      iconTone: "text-amber-200",
      cardTone: "border-amber-300/30 bg-amber-400/[0.08]",
      actions: [
        "คอยดูแจ้งเตือนบนหน้าจอนี้",
        "เช็กห้องน้ำและทางเดินให้เดินสะดวก",
        "ถ้ามีแจ้งเตือนซ้ำ ให้โทรถามทันที",
      ],
    };
  }

  return {
    title: "ตอนนี้ดูปลอดภัย",
    message: "การเคลื่อนไหวโดยรวมดูปกติ ระบบยังเฝ้าดูให้อยู่ตลอด",
    icon: CheckCircle2,
    iconTone: "text-emerald-200",
    cardTone: "border-emerald-300/30 bg-emerald-400/[0.08]",
    actions: [
      "ไม่ต้องทำอะไรตอนนี้",
      "เปิดหน้าจอนี้ไว้เพื่อดูสถานะ",
      "ถ้ามีแจ้งเตือนสีแดง ให้เข้าไปดูทันที",
    ],
  };
}

function alertTone(severity: CareAlert["severity"]) {
  if (severity === "emergency") return "border-rose-300/45 bg-rose-500/15 text-rose-100";
  if (severity === "high") return "border-orange-300/45 bg-orange-400/15 text-orange-100";
  return "border-amber-300/40 bg-amber-400/12 text-amber-100";
}

function alertSeverityThai(severity: CareAlert["severity"]) {
  if (severity === "emergency") return "ฉุกเฉิน";
  if (severity === "high") return "สูง";
  if (severity === "medium") return "ปานกลาง";
  return "ต่ำ";
}

function alertMessageThai(alert: CareAlert) {
  if (alert.message.includes("Near-fall")) return "มีเหตุการณ์เกือบล้ม";
  if (alert.message.includes("bathroom")) return "เสี่ยงสูงในห้องน้ำ";
  if (alert.message.includes("gait")) return "เดินไม่มั่นคง";
  if (alert.message.includes("No movement")) return "ไม่พบการเคลื่อนไหว";
  return alert.message;
}
