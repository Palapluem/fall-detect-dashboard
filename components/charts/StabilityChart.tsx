"use client";

import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { ChartFrame } from "@/components/charts/ChartFrame";
import { TrendDatum } from "@/lib/types";

export function StabilityChart({ data }: { data: TrendDatum[] }) {
  return (
    <ChartFrame title="ความเสี่ยงและความมั่นคง">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid stroke="rgba(148,163,184,.12)" vertical={false} />
          <XAxis dataKey="time" tick={{ fill: "#94a3b8", fontSize: 12 }} tickLine={false} axisLine={false} />
          <YAxis tick={{ fill: "#94a3b8", fontSize: 12 }} tickLine={false} axisLine={false} domain={[0, 100]} />
          <Tooltip contentStyle={{ background: "#020617", border: "1px solid rgba(255,255,255,.12)", borderRadius: 8 }} />
          <Line type="monotone" dataKey="stability" stroke="#34d399" strokeWidth={2.5} dot={false} />
          <Line type="monotone" dataKey="risk" stroke="#fb7185" strokeWidth={2.5} dot={false} />
          <Line type="monotone" dataKey="instability" stroke="#fbbf24" strokeWidth={2} dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </ChartFrame>
  );
}
