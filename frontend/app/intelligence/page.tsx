"use client";

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";

const hookData = [
  { angle: "Social proof", win_rate: 68, avg_ctr: 3.8, avg_roas: 4.2, count: 312 },
  { angle: "Curiosity",    win_rate: 61, avg_ctr: 3.4, avg_roas: 3.8, count: 287 },
  { angle: "Benefit",      win_rate: 54, avg_ctr: 3.1, avg_roas: 3.5, count: 341 },
  { angle: "Urgency",      win_rate: 48, avg_ctr: 2.9, avg_roas: 3.1, count: 198 },
  { angle: "Pain point",   win_rate: 44, avg_ctr: 2.6, avg_roas: 2.8, count: 156 },
];

const lifespanData = [
  { week: "Wk 1", ctr: 3.8 },
  { week: "Wk 2", ctr: 3.5 },
  { week: "Wk 3", ctr: 2.9 },
  { week: "Wk 4", ctr: 2.1 },
  { week: "Wk 5", ctr: 1.4 },
  { week: "Wk 6", ctr: 0.9 },
];

const HOOK_COLORS: Record<string, string> = {
  "Social proof": "#818cf8",
  "Curiosity":    "#a78bfa",
  "Benefit":      "#22c55e",
  "Urgency":      "#ef4444",
  "Pain point":   "#f59e0b",
};

const patterns = [
  { pattern: "Numbers in headline", lift: "+31% CTR", example: '"12,000 customers" vs "thousands of customers"', confidence: 94 },
  { pattern: "Free trial + no credit card", lift: "+27% CVR", example: 'Removing friction from the CTA increases conversion', confidence: 88 },
  { pattern: "Competitor framing", lift: "+22% CTR", example: '"Your competitor just did X" outperforms feature leads', confidence: 81 },
  { pattern: "Specific timeframe", lift: "+19% CVR", example: '"Results in 14 days" vs "see results fast"', confidence: 79 },
  { pattern: "Question opener", lift: "+15% CTR", example: 'Opens with a question addressing a known pain point', confidence: 76 },
];

const insights = [
  { icon: "schedule", title: "Avg creative lifespan", value: "11.4 days", sub: "Before CTR drops >20%", color: "text-blue-400" },
  { icon: "trending_up", title: "Best performing platform", value: "Meta TOFU", sub: "2.1x ROAS vs Google cold", color: "text-green-400" },
  { icon: "group", title: "Optimal frequency cap", value: "2.8",  sub: "Per person before fatigue hits", color: "text-amber-400" },
  { icon: "auto_awesome", title: "AI variant acceptance", value: "62%", sub: "Of generated variants used by team", color: "text-indigo-400" },
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-[#1c1c1c] border border-[#2a2a2a] rounded-lg p-3 text-xs shadow-xl">
      <p className="text-[#888] mb-1">{label}</p>
      {payload.map((p: any) => (
        <p key={p.dataKey} className="text-white font-medium">{p.value}{p.dataKey === "win_rate" ? "%" : ""}</p>
      ))}
    </div>
  );
};

export default function IntelligencePage() {
  return (
    <div className="p-8 max-w-5xl mx-auto">
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight mb-1">Intelligence</h1>
          <p className="text-[#555] text-sm">What AdPulse has learned from 2,847 creative performances across your accounts</p>
        </div>
        <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-xs text-indigo-400 font-medium">
          <span className="material-symbols-outlined text-[14px]">school</span>
          Updated 5 days ago
        </span>
      </div>

      {/* Key insights */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        {insights.map(({ icon, title, value, sub, color }) => (
          <div key={title} className="bg-[#1c1c1c] border border-[#2a2a2a] rounded-xl p-4">
            <div className="flex items-center gap-2 mb-3">
              <span className={`material-symbols-outlined text-[18px] ${color}`}>{icon}</span>
              <p className="text-[11px] text-[#555]">{title}</p>
            </div>
            <p className={`text-2xl font-bold mb-1 ${color}`}>{value}</p>
            <p className="text-[11px] text-[#444]">{sub}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        {/* Hook angle win rates */}
        <div className="bg-[#1c1c1c] border border-[#2a2a2a] rounded-xl p-5">
          <p className="text-xs font-medium text-[#555] uppercase tracking-wider mb-1">Hook angle win rate</p>
          <p className="text-[11px] text-[#333] mb-4">% of times this angle outperforms account average CTR</p>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={hookData} layout="vertical" margin={{ left: 60, right: 16, top: 0, bottom: 0 }}>
              <XAxis type="number" tick={{ fill: "#444", fontSize: 10 }} axisLine={false} tickLine={false} domain={[0, 100]} unit="%" />
              <YAxis type="category" dataKey="angle" tick={{ fill: "#888", fontSize: 11 }} axisLine={false} tickLine={false} width={60} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="win_rate" radius={[0, 4, 4, 0]}>
                {hookData.map((entry) => (
                  <Cell key={entry.angle} fill={HOOK_COLORS[entry.angle]} fillOpacity={0.7} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Creative lifespan curve */}
        <div className="bg-[#1c1c1c] border border-[#2a2a2a] rounded-xl p-5">
          <p className="text-xs font-medium text-[#555] uppercase tracking-wider mb-1">Average creative decay curve</p>
          <p className="text-[11px] text-[#333] mb-4">CTR by week since launch — across all accounts</p>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={lifespanData} margin={{ left: -20, right: 8, top: 0, bottom: 0 }}>
              <XAxis dataKey="week" tick={{ fill: "#555", fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "#444", fontSize: 10 }} axisLine={false} tickLine={false} unit="%" />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="ctr" radius={[4, 4, 0, 0]}>
                {lifespanData.map((entry, i) => (
                  <Cell key={i} fill={entry.ctr > 2.5 ? "#22c55e" : entry.ctr > 1.5 ? "#f59e0b" : "#ef4444"} fillOpacity={0.7} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
          <p className="text-[10px] text-[#333] mt-2 text-center">Fatigue threshold crossed at week 3 on average — AdPulse detects it at week 2</p>
        </div>
      </div>

      {/* Learned copy patterns */}
      <div className="bg-[#1c1c1c] border border-[#2a2a2a] rounded-xl overflow-hidden">
        <div className="px-5 py-4 border-b border-[#2a2a2a] flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-white">Learned copy patterns</p>
            <p className="text-xs text-[#444] mt-0.5">Statistically significant patterns extracted from your account history</p>
          </div>
          <span className="text-xs text-[#444]">Confidence based on {(2847).toLocaleString()} data points</span>
        </div>
        <div className="divide-y divide-[#232323]">
          {patterns.map((p) => (
            <div key={p.pattern} className="flex items-center gap-5 px-5 py-4">
              <div className="flex-1 min-w-0">
                <p className="text-sm text-white font-medium mb-1">{p.pattern}</p>
                <p className="text-xs text-[#555]">{p.example}</p>
              </div>
              <div className="shrink-0 flex items-center gap-6">
                <div className="text-right">
                  <p className="text-[10px] text-[#444] mb-0.5">Performance lift</p>
                  <p className="text-sm text-green-400 font-semibold">{p.lift}</p>
                </div>
                <div className="text-right w-24">
                  <p className="text-[10px] text-[#444] mb-1">Confidence</p>
                  <div className="h-1.5 bg-[#2a2a2a] rounded-full overflow-hidden">
                    <div className="h-full bg-indigo-500 rounded-full" style={{ width: `${p.confidence}%` }} />
                  </div>
                  <p className="text-[10px] text-[#555] mt-1 text-right">{p.confidence}%</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <p className="mt-4 text-[11px] text-[#333] text-center">
        Intelligence layer updates every Sunday · Private to your accounts · Never shared across clients
      </p>
    </div>
  );
}
