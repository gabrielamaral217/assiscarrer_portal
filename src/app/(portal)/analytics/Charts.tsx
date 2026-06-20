"use client";

import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

export function SessionsArea({
  data,
}: {
  data: { data: string; sessoes: number; usuarios: number }[];
}) {
  return (
    <ResponsiveContainer width="100%" height={240}>
      <AreaChart data={data} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
        <defs>
          <linearGradient id="g1" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#a96d3e" stopOpacity={0.3} />
            <stop offset="100%" stopColor="#a96d3e" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#e7ded3" vertical={false} />
        <XAxis dataKey="data" tick={{ fontSize: 11, fill: "#8a8175" }} interval="preserveStartEnd" />
        <YAxis tick={{ fontSize: 11, fill: "#8a8175" }} />
        <Tooltip
          contentStyle={{
            borderRadius: 10,
            border: "1px solid #e7ded3",
            fontSize: 12,
          }}
        />
        <Area
          type="monotone"
          dataKey="sessoes"
          name="Sessões"
          stroke="#a96d3e"
          strokeWidth={2}
          fill="url(#g1)"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}

export function HorizontalBars({
  data,
  dataKey,
  nameKey,
  color = "#1c2d40",
}: {
  data: Record<string, unknown>[];
  dataKey: string;
  nameKey: string;
  color?: string;
}) {
  return (
    <ResponsiveContainer width="100%" height={Math.max(140, data.length * 38)}>
      <BarChart data={data} layout="vertical" margin={{ left: 8, right: 16 }}>
        <XAxis type="number" hide />
        <YAxis
          type="category"
          dataKey={nameKey}
          width={130}
          tick={{ fontSize: 11, fill: "#3c4a5c" }}
        />
        <Tooltip
          contentStyle={{ borderRadius: 10, border: "1px solid #e7ded3", fontSize: 12 }}
          cursor={{ fill: "#faf7f3" }}
        />
        <Bar dataKey={dataKey} fill={color} radius={[0, 6, 6, 0]} barSize={18} />
      </BarChart>
    </ResponsiveContainer>
  );
}
