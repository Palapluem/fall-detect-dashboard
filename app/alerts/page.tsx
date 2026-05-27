"use client";

import { CheckCircle2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CareAlert } from "@/lib/types";
import { useMonitoringStore } from "@/store/monitoring-store";

export default function AlertsPage() {
  const { alerts, acknowledgeAlert } = useMonitoringStore();

  return (
    <div className="mx-auto max-w-5xl">
      <Card className="border-slate-200 bg-white shadow-[0_18px_50px_rgba(15,23,42,0.06)]">
        <CardHeader className="border-b border-slate-100">
          <CardTitle className="text-2xl font-bold text-slate-950">
            ประวัติการแจ้งเตือน
          </CardTitle>
          <p className="text-sm font-medium text-slate-700">
            แสดงเหตุการณ์ล่าสุดที่ผู้ดูแลควรรับทราบ เรียงจากใหม่ไปเก่า
          </p>
        </CardHeader>
        <CardContent className="space-y-3 p-5">
          {alerts.map((alert) => (
            <AlertHistoryItem
              key={alert.id}
              alert={alert}
              onAcknowledge={() => acknowledgeAlert(alert.id)}
            />
          ))}
        </CardContent>
      </Card>
    </div>
  );
}

function AlertHistoryItem({
  alert,
  onAcknowledge,
}: {
  alert: CareAlert;
  onAcknowledge: () => void;
}) {
  return (
    <div className={`rounded-xl border p-4 ${alertTone(alert.severity)}`}>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant={alert.severity === "emergency" ? "danger" : "soft"}>
              {severityThai(alert.severity)}
            </Badge>
            <span className="text-sm font-semibold text-slate-800">{alert.timestamp}</span>
            {alert.acknowledged && (
              <span className="inline-flex items-center gap-1 text-sm font-semibold text-emerald-700">
                <CheckCircle2 className="h-4 w-4" />
                รับทราบแล้ว
              </span>
            )}
          </div>
          <div className="mt-2 text-lg font-bold text-slate-950">
            {alertMessageThai(alert.message)}
          </div>
          <div className="mt-1 text-base font-semibold text-slate-800">
            {roomThai(alert.room)}
          </div>
        </div>

        {!alert.acknowledged && (
          <button
            onClick={onAcknowledge}
            className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-bold text-slate-950 shadow-sm transition hover:border-cyan-300 hover:bg-cyan-50 sm:w-auto"
          >
            รับทราบ
          </button>
        )}
      </div>
    </div>
  );
}

function alertTone(severity: string) {
  if (severity === "emergency") return "border-rose-300 bg-rose-50";
  if (severity === "high") return "border-orange-300 bg-orange-50";
  if (severity === "medium") return "border-amber-300 bg-amber-50";
  return "border-emerald-300 bg-emerald-50";
}

function alertMessageThai(message: string) {
  if (message.includes("Near-fall")) return "มีเหตุการณ์เกือบล้ม";
  if (message.includes("bathroom")) return "เสี่ยงสูงในห้องน้ำ";
  if (message.includes("gait")) return "เดินไม่มั่นคง";
  if (message.includes("No movement")) return "ไม่พบการเคลื่อนไหว";
  return message;
}

function roomThai(room: string) {
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

function severityThai(severity: string) {
  if (severity === "emergency") return "ฉุกเฉิน";
  if (severity === "high") return "สูง";
  if (severity === "medium") return "ปานกลาง";
  return "ต่ำ";
}
