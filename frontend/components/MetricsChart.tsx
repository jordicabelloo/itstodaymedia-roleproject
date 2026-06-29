"use client";

import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { DailyMetric } from "@/lib/mock-data";

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-[#1c1c1c] border border-[#2a2a2a] rounded-lg p-3 text-xs shadow-xl">
      <p className="text-[#888] mb-2">{label}</p>
      {payload.map((p: any) => (
        <div key={p.dataKey} className="flex items-center gap-2 mb-1">
          <span className="w-2 h-2 rounded-full" style={{ background: p.color }} />
          <span className="text-[#aaa]">{p.name}:</span>
          <span className="text-white font-medium">{p.value}</span>
        </div>
      ))}
    </div>
  );
};

export default function MetricsChart({ data }: { data: DailyMetric[] }) {
  const normalized = data.map((d) => ({
    ...d,
    ctr: +(d.ctr * 100).toFixed(2),
    roas: +d.roas.toFixed(2),
    frequency: +d.frequency.toFixed(1),
  }));

  return (
    <ResponsiveContainer width="100%" height={200}>
      <LineChart data={normalized} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
        <XAxis dataKey="date" tick={{ fill: "#555", fontSize: 11 }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fill: "#555", fontSize: 11 }} axisLine={false} tickLine={false} />
        <Tooltip content={<CustomTooltip />} cursor={{ stroke: "rgba(255,255,255,0.06)", strokeWidth: 1 }} />
        <Legend
          iconType="circle" iconSize={6}
          wrapperStyle={{ fontSize: 11, color: "#666", paddingTop: 8 }}
        />
        <Line type="monotone" dataKey="ctr" name="CTR %" stroke="#818cf8" dot={false} strokeWidth={2} />
        <Line type="monotone" dataKey="roas" name="ROAS" stroke="#22c55e" dot={false} strokeWidth={2} />
        <Line type="monotone" dataKey="frequency" name="Frequency" stroke="#f59e0b" dot={false} strokeWidth={2} strokeDasharray="4 2" />
      </LineChart>
    </ResponsiveContainer>
  );
}
