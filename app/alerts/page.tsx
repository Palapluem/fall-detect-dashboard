"use client";

import { AlertTriangle, CheckCircle2 } from "lucide-react";
import { RealtimeAlertPanel } from "@/components/RealtimeAlertPanel";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useMonitoringStore } from "@/store/monitoring-store";
import { severityTone } from "@/lib/utils";

export default function AlertsPage() {
  const { alerts, acknowledgeAlert } = useMonitoringStore();
  const emergencyCount = alerts.filter((alert) => alert.severity === "emergency").length;
  const openCount = alerts.filter((alert) => !alert.acknowledged).length;

  return (
    <div className="grid gap-5 xl:grid-cols-[.75fr_1.25fr]">
      <div className="space-y-4">
        <RealtimeAlertPanel alerts={alerts.slice(0, 6)} />
        <Card>
          <CardHeader>
            <CardTitle>สรุปแจ้งเตือน</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3">
            <SummaryItem icon={AlertTriangle} label="ยังไม่รับทราบ" value={openCount} />
            <SummaryItem icon={AlertTriangle} label="ฉุกเฉิน" value={emergencyCount} />
            <SummaryItem icon={CheckCircle2} label="เวลาตอบสนอง" value="02:00 นาที" />
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>รายการแจ้งเตือน</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {alerts.map((alert) => (
            <div key={alert.id} className={`rounded-lg border p-4 ${severityTone(alert.severity)}`}>
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <Badge variant={alert.severity === "emergency" ? "danger" : "soft"}>
                      {severityThai(alert.severity)}
                    </Badge>
                    <span className="text-xs text-slate-500">{alert.timestamp}</span>
                  </div>
                  <div className="mt-2 font-semibold">{alertMessageThai(alert.message)}</div>
                  <div className="mt-1 text-sm opacity-80">{roomThai(alert.room)}</div>
                </div>
                <button
                  onClick={() => acknowledgeAlert(alert.id)}
                  className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm transition hover:bg-slate-50 disabled:opacity-50"
                  disabled={alert.acknowledged}
                >
                  {alert.acknowledged ? "รับทราบแล้ว" : "รับทราบ"}
                </button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}

function SummaryItem({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof AlertTriangle;
  label: string;
  value: string | number;
}) {
  return (
    <div className="flex items-center justify-between rounded-lg border border-slate-200 bg-slate-50 p-3">
      <div className="flex items-center gap-3 text-slate-700">
        <Icon className="h-4 w-4 text-cyan-600" />
        <span>{label}</span>
      </div>
      <span className="font-semibold">{value}</span>
    </div>
  );
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
