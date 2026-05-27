"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import {
  AlertTriangle,
  BarChart3,
  Bell,
  BrainCircuit,
  Home,
  Router,
} from "lucide-react";
import { motion } from "framer-motion";
import { CaregiverNotificationDrawer } from "@/components/CaregiverNotificationDrawer";
import { LiveMonitoringBadge } from "@/components/LiveMonitoringBadge";
import { useMockWebSocket } from "@/hooks/useMockWebSocket";
import { useMonitoringStore } from "@/store/monitoring-store";
import { cn } from "@/lib/utils";

const nav = [
  { href: "/", label: "หน้าหลัก", icon: Home },
  { href: "/analytics", label: "วิเคราะห์", icon: BarChart3 },
  { href: "/alerts", label: "แจ้งเตือน", icon: AlertTriangle },
  { href: "/devices", label: "อุปกรณ์", icon: Router },
];

export function AppShell({ children }: { children: ReactNode }) {
  useMockWebSocket();
  const pathname = usePathname();
  const { metrics, livePosition, alerts, openNotifications } = useMonitoringStore();
  const pageTitle = nav.find((item) => item.href === pathname)?.label ?? "หน้าหลัก";
  const critical = alerts.some(
    (alert) => !alert.acknowledged && ["high", "emergency"].includes(alert.severity),
  );

  return (
    <div className="min-h-screen bg-white text-slate-950">
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-72 border-r border-slate-200 bg-white p-4 lg:block">
        <Link href="/" className="flex items-center gap-3 rounded-xl px-2 py-3">
          <div className="grid h-11 w-11 place-items-center rounded-xl bg-cyan-100 text-cyan-700">
            <BrainCircuit className="h-6 w-6" />
          </div>
          <div>
            <div className="font-semibold leading-tight text-slate-950">AegisCare Home</div>
            <div className="text-xs text-slate-500">ระบบดูแลความเสี่ยงล้ม</div>
          </div>
        </Link>

        <nav className="mt-7 space-y-1">
          {nav.map((item) => {
            const active = item.href === pathname;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition",
                  active
                    ? "bg-cyan-50 text-cyan-700"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-950",
                )}
              >
                <item.icon className="h-4 w-4" />
                <span>{item.label}</span>
                {active && (
                  <motion.span
                    layoutId="active-nav-dot"
                    className="ml-auto h-2 w-2 rounded-full bg-cyan-500"
                  />
                )}
              </Link>
            );
          })}
        </nav>

      </aside>

      <main className="lg:pl-72">
        <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/90 backdrop-blur-xl">
          <div className="flex min-h-20 flex-wrap items-center justify-between gap-3 px-4 py-3 lg:px-6">
            <div>
              <div className="text-xs uppercase tracking-[0.24em] text-cyan-700">
                ระบบดูแลผู้สูงอายุ
              </div>
              <h1 className="mt-1 text-2xl font-semibold tracking-normal">{pageTitle}</h1>
            </div>
            <div className="flex items-center gap-3">
              <div className="hidden rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-600 md:block">
                ผู้ใช้งาน: <span className="text-slate-950">Somchai K.</span> -{" "}
                {roomLabelThai(livePosition.room)}
              </div>
              <div className="hidden rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-600 sm:block">
                เสี่ยง:{" "}
                <span className={critical ? "text-rose-600" : "text-emerald-600"}>
                  {metrics.riskScore}%
                </span>
              </div>
              <LiveMonitoringBadge />
              <button
                onClick={openNotifications}
                className="relative rounded-lg border border-slate-200 bg-slate-50 p-2.5 text-slate-700 transition hover:border-cyan-300 hover:bg-cyan-50"
                aria-label="เปิดแจ้งเตือน"
              >
                <Bell className="h-4 w-4" />
                {critical && <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-rose-500" />}
              </button>
            </div>
          </div>
        </header>

        <div className="px-4 py-5 lg:px-6">{children}</div>
      </main>

      <CaregiverNotificationDrawer floating />
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
