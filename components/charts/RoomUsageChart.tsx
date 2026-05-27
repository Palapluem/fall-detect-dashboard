"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { ChartFrame } from "@/components/charts/ChartFrame";
import { RoomUsageDatum } from "@/lib/types";

export function RoomUsageChart({ data }: { data: RoomUsageDatum[] }) {
  return (
    <ChartFrame title="ความถี่การเดินในแต่ละห้อง">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <CartesianGrid stroke="rgba(148,163,184,.12)" vertical={false} />
          <XAxis dataKey="room" tick={{ fill: "#94a3b8", fontSize: 11 }} tickLine={false} axisLine={false} />
          <YAxis tick={{ fill: "#94a3b8", fontSize: 12 }} tickLine={false} axisLine={false} />
          <Tooltip contentStyle={{ background: "#020617", border: "1px solid rgba(255,255,255,.12)", borderRadius: 8 }} />
          <Bar dataKey="visits" fill="#22d3ee" radius={[8, 8, 0, 0]} />
          <Bar dataKey="risk" fill="#fb7185" radius={[8, 8, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </ChartFrame>
  );
}
