"use client";

import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { ChartFrame } from "@/components/charts/ChartFrame";
import { TrendDatum } from "@/lib/types";

export function MobilityTrendChart({ data }: { data: TrendDatum[] }) {
  return (
    <ChartFrame title="แนวโน้มการเคลื่อนไหว">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data}>
          <defs>
            <linearGradient id="mobility" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#22d3ee" stopOpacity={0.45} />
              <stop offset="95%" stopColor="#22d3ee" stopOpacity={0.02} />
            </linearGradient>
          </defs>
          <CartesianGrid stroke="rgba(148,163,184,.12)" vertical={false} />
          <XAxis dataKey="time" tick={{ fill: "#94a3b8", fontSize: 12 }} tickLine={false} axisLine={false} />
          <YAxis tick={{ fill: "#94a3b8", fontSize: 12 }} tickLine={false} axisLine={false} domain={[0, 100]} />
          <Tooltip contentStyle={{ background: "#020617", border: "1px solid rgba(255,255,255,.12)", borderRadius: 8 }} />
          <Area type="monotone" dataKey="mobility" stroke="#67e8f9" fill="url(#mobility)" strokeWidth={2.5} />
        </AreaChart>
      </ResponsiveContainer>
    </ChartFrame>
  );
}
