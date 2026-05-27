"use client";

import { BellRing } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CareAlert } from "@/lib/types";
import { severityTone } from "@/lib/utils";

export function RealtimeAlertPanel({ alerts }: { alerts: CareAlert[] }) {
  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between">
        <CardTitle>แจ้งเตือนล่าสุด</CardTitle>
        <BellRing className="h-4 w-4 text-cyan-600" />
      </CardHeader>
      <CardContent className="space-y-3">
        <AnimatePresence initial={false}>
          {alerts.map((alert) => (
            <motion.div
              key={alert.id}
              layout
              initial={{ opacity: 0, x: 18 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -18 }}
              className={`rounded-lg border p-3 ${severityTone(alert.severity)}`}
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="font-medium">{alertMessageThai(alert.message)}</div>
                  <div className="mt-1 text-xs opacity-75">
                    {roomThai(alert.room)} - {alert.timestamp}
                  </div>
                </div>
                <Badge variant={alert.severity === "emergency" ? "danger" : "soft"}>
                  {severityThai(alert.severity)}
                </Badge>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </CardContent>
    </Card>
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
