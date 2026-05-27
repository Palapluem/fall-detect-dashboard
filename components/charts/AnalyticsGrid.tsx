"use client";

import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Scatter,
  ScatterChart,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { ChartFrame } from "@/components/charts/ChartFrame";
import { GaitDatum, HourlyActivityDatum, RoomUsageDatum, TrendDatum } from "@/lib/types";

export function AnalyticsGrid({
  hourlyActivityData,
  gaitData,
  trendData,
  roomUsageData,
}: {
  hourlyActivityData: HourlyActivityDatum[];
  gaitData: GaitDatum[];
  trendData: TrendDatum[];
  roomUsageData: RoomUsageDatum[];
}) {
  return (
    <section className="grid gap-4 xl:grid-cols-2">
      <ChartFrame title="กิจกรรมรายชั่วโมง">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={hourlyActivityData}>
            <CartesianGrid stroke="rgba(148,163,184,.12)" vertical={false} />
            <XAxis dataKey="hour" tick={{ fill: "#94a3b8", fontSize: 12 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: "#94a3b8", fontSize: 12 }} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={tooltipStyle} />
            <Bar dataKey="steps" fill="#38bdf8" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </ChartFrame>

      <ChartFrame title="ความแปรปรวนการเดิน">
        <ResponsiveContainer width="100%" height="100%">
          <ScatterChart data={gaitData}>
            <CartesianGrid stroke="rgba(148,163,184,.12)" />
            <XAxis dataKey="cadence" name="cadence" tick={{ fill: "#94a3b8", fontSize: 12 }} axisLine={false} tickLine={false} />
            <YAxis dataKey="sway" name="sway" tick={{ fill: "#94a3b8", fontSize: 12 }} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={tooltipStyle} />
            <Scatter data={gaitData} fill="#f59e0b" />
          </ScatterChart>
        </ResponsiveContainer>
      </ChartFrame>

      <ChartFrame title="ความไม่มั่นคงตอนเลี้ยว">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={gaitData}>
            <CartesianGrid stroke="rgba(148,163,184,.12)" vertical={false} />
            <XAxis dataKey="label" tick={{ fill: "#94a3b8", fontSize: 12 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: "#94a3b8", fontSize: 12 }} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={tooltipStyle} />
            <Line dataKey="turning" stroke="#fb7185" strokeWidth={2.4} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </ChartFrame>

      <ChartFrame title="แนวโน้มความเข้มของ Heatmap">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={trendData}>
            <defs>
              <linearGradient id="heatTrend" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#f97316" stopOpacity={0.5} />
                <stop offset="95%" stopColor="#f97316" stopOpacity={0.02} />
              </linearGradient>
            </defs>
            <CartesianGrid stroke="rgba(148,163,184,.12)" vertical={false} />
            <XAxis dataKey="time" tick={{ fill: "#94a3b8", fontSize: 12 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: "#94a3b8", fontSize: 12 }} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={tooltipStyle} />
            <Area dataKey="heat" stroke="#fb923c" fill="url(#heatTrend)" strokeWidth={2.4} />
          </AreaChart>
        </ResponsiveContainer>
      </ChartFrame>
    </section>
  );
}

const tooltipStyle = {
  background: "#020617",
  border: "1px solid rgba(255,255,255,.12)",
  borderRadius: 8,
};
