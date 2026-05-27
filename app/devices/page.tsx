"use client";

import { BatteryCharging, Cpu, Router, Smartphone, Wifi } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const devices = [
  { name: "สายรัดตรวจจับการเดิน", icon: Smartphone, battery: 86, latency: "18 ms", status: "กำลังส่งข้อมูล" },
  { name: "เซนเซอร์ห้องน้ำ", icon: Wifi, battery: 100, latency: "24 ms", status: "ออนไลน์" },
  { name: "เกตเวย์ทางเดิน", icon: Router, battery: 100, latency: "12 ms", status: "ออนไลน์" },
  { name: "ระบบวิเคราะห์ความเสี่ยง", icon: Cpu, battery: 100, latency: "31 ms", status: "ทำงาน" },
];

export default function DeviceStatusPage() {
  return (
    <div className="space-y-5">
      <section className="grid gap-4 md:grid-cols-4">
        {devices.map((device) => (
          <Card key={device.name}>
            <CardContent className="p-4">
              <div className="flex items-start justify-between gap-3">
                <device.icon className="h-5 w-5 text-cyan-600" />
                <Badge variant="safe">{device.status}</Badge>
              </div>
              <div className="mt-5 font-semibold">{device.name}</div>
              <div className="mt-3 flex items-center justify-between text-sm text-slate-500">
                <span className="flex items-center gap-1"><BatteryCharging className="h-4 w-4" /> {device.battery}%</span>
                <span>{device.latency}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </section>
    </div>
  );
}
