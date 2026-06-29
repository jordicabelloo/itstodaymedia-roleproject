"use client";

import { useState } from "react";
import { CREATIVES } from "@/lib/mock-data";
import HealthBadge from "@/components/HealthBadge";
import ScoreRing from "@/components/ScoreRing";
import MetricsChart from "@/components/MetricsChart";

const SIGNAL_LABELS: Record<string, string> = {
  frequency:    "Audience frequency",
  ctr_decay_7d: "CTR decay (7d)",
  cpm_spike_7d: "CPM spike (7d)",
  roas_drop_7d: "ROAS drop (7d)",
};

const HOOK_COLOR: Record<string, string> = {
  social_proof: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  curiosity:    "bg-purple-500/10 text-purple-400 border-purple-500/20",
  urgency:      "bg-red-500/10 text-red-400 border-red-500/20",
  pain_point:   "bg-orange-500/10 text-orange-400 border-orange-500/20",
  benefit:      "bg-green-500/10 text-green-400 border-green-500/20",
};

export default function AlertsPage() {
  const fatigued = CREATIVES.filter((c) => c.health_status !== "healthy");
  const [expanded, setExpanded] = useState<string | null>(fatigued[0]?.id ?? null);

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <div className="mb-8">
        <h1 className="text-xl font-semibold text-white">Alerts</h1>
        <p className="text-[#555] text-sm mt-0.5">
          {fatigued.length} creatives need attention — AI replacements generated below
        </p>
      </div>

      <div className="space-y-4">
        {fatigued.map((creative) => {
          const isOpen = expanded === creative.id;
          return (
            <div key={creative.id} className="bg-[#1c1c1c] border border-[#2a2a2a] rounded-xl overflow-hidden">
              {/* Header row */}
              <button
                className="w-full flex items-center gap-4 px-5 py-4 hover:bg-white/[0.02] transition-colors text-left"
                onClick={() => setExpanded(isOpen ? null : creative.id)}
              >
                <ScoreRing score={creative.health_score} status={creative.health_status} size={48} />

                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white truncate">{creative.headline}</p>
                  <p className="text-xs text-[#555] mt-0.5 truncate">{creative.campaign}</p>
                </div>

                <div className="hidden md:flex items-center gap-6 shrink-0">
                  {creative.signals.slice(0, 2).map((s) => (
                    <div key={s.name} className="text-right">
                      <p className="text-[11px] text-[#444]">{SIGNAL_LABELS[s.name]}</p>
                      <p className={`text-sm font-medium ${s.severity === "critical" ? "text-red-400" : "text-amber-400"}`}>
                        {s.name === "frequency" ? s.value.toFixed(1) : `${(s.value * 100).toFixed(0)}%`}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <HealthBadge status={creative.health_status} />
                  <span className={`material-symbols-outlined text-[20px] text-[#444] transition-transform duration-200 ${isOpen ? "rotate-90" : ""}`}>arrow_circle_right</span>
                </div>
              </button>

              {/* Expanded content */}
              {isOpen && (
                <div className="border-t border-[#232323]">
                  {/* Fatigue signals + chart */}
                  <div className="grid grid-cols-2 gap-0 divide-x divide-[#232323]">
                    <div className="p-5">
                      <p className="text-xs font-medium text-[#666] uppercase tracking-wider mb-4">Fatigue signals</p>
                      <div className="space-y-3">
                        {creative.signals.map((s) => (
                          <div key={s.name}>
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-xs text-[#888]">{SIGNAL_LABELS[s.name]}</span>
                              <span className={`text-xs font-medium ${s.severity === "critical" ? "text-red-400" : "text-amber-400"}`}>
                                {s.name === "frequency" ? s.value.toFixed(1) : `${(s.value * 100).toFixed(0)}%`}
                                <span className="text-[#444] ml-1">
                                  / threshold {s.name === "frequency" ? s.threshold_critical.toFixed(1) : `${(s.threshold_critical * 100).toFixed(0)}%`}
                                </span>
                              </span>
                            </div>
                            <div className="h-1.5 bg-[#2a2a2a] rounded-full overflow-hidden">
                              <div
                                className={`h-full rounded-full ${s.severity === "critical" ? "bg-red-500" : "bg-amber-500"}`}
                                style={{ width: `${Math.min(100, (s.value / s.threshold_critical) * 80)}%` }}
                              />
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Original copy */}
                      <div className="mt-5 p-3 bg-[#141414] rounded-lg border border-[#232323]">
                        <p className="text-[11px] text-[#444] mb-2 uppercase tracking-wider">Fatigued creative</p>
                        <p className="text-xs text-white font-medium mb-1">{creative.headline}</p>
                        <p className="text-xs text-[#666] leading-relaxed">{creative.body}</p>
                      </div>
                    </div>

                    <div className="p-5">
                      <p className="text-xs font-medium text-[#666] uppercase tracking-wider mb-4">Performance trend</p>
                      <MetricsChart data={creative.history} />
                    </div>
                  </div>

                  {/* AI Variants */}
                  {creative.variants && (
                    <div className="border-t border-[#232323] p-5">
                      <div className="flex items-center gap-2 mb-4">
                        <p className="text-xs font-medium text-[#666] uppercase tracking-wider">AI-generated replacements</p>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                          Claude Sonnet 4.6
                        </span>
                      </div>
                      <div className="grid grid-cols-3 gap-3 items-stretch">
                        {creative.variants.map((v, i) => (
                          <div key={i} className="bg-[#141414] rounded-lg border border-[#232323] p-4 hover:border-[#3a3a3a] transition-colors flex flex-col min-h-[260px]">
                            <div className="flex items-center justify-between mb-3">
                              <span className="text-[10px] text-[#444]">Variant {i + 1}</span>
                              <span className={`text-[10px] px-2 py-0.5 rounded-full border capitalize ${HOOK_COLOR[v.hook_angle]}`}>
                                {v.hook_angle.replace("_", " ")}
                              </span>
                            </div>
                            <p className="text-xs text-white font-medium mb-2 leading-relaxed">{v.headline}</p>
                            <p className="text-xs text-[#666] leading-relaxed mb-3">{v.body}</p>
                            <p className="text-[11px] text-[#444] italic border-t border-[#232323] pt-3 flex-1">{v.rationale}</p>
                            <button className="mt-4 w-full py-2 rounded-md bg-white/[0.04] hover:bg-white/[0.07] border border-[#2a2a2a] text-xs text-[#888] hover:text-white transition-colors">
                              Copy to clipboard
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
