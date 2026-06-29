import Link from "next/link";
import Image from "next/image";
import { CREATIVES, ACCOUNT_STATS, ROI_STATS } from "@/lib/mock-data";
import HealthBadge from "@/components/HealthBadge";
import ScoreRing from "@/components/ScoreRing";

const statCards = [
  { label: "7d Spend",     value: `$${ACCOUNT_STATS.total_spend_7d.toLocaleString()}`, sub: "across all accounts" },
  { label: "Avg ROAS",     value: `${ACCOUNT_STATS.avg_roas}x`,                       sub: "last 7 days" },
  { label: "Critical Ads", value: String(ACCOUNT_STATS.critical_count),               sub: "need replacement", accent: "text-red-400" },
  { label: "Warning Ads",  value: String(ACCOUNT_STATS.warning_count),                sub: "approaching fatigue", accent: "text-amber-400" },
];

const roiCards = [
  {
    label: "Wasted spend avoided",
    value: `$${ROI_STATS.wasted_spend_avoided_30d.toLocaleString()}`,
    sub: "last 30 days, from early fatigue detection",
    icon: "savings",
    color: "text-green-400",
    bg: "bg-green-500/[0.07] border-green-500/20",
  },
  {
    label: "CPL: AI refreshed vs fatigued",
    value: `$${ROI_STATS.cpl_refreshed} vs $${ROI_STATS.cpl_fatigued}`,
    sub: `${ROI_STATS.cpl_improvement_pct}% lower cost per lead with AI variants`,
    icon: "trending_down",
    color: "text-indigo-400",
    bg: "bg-indigo-500/[0.07] border-indigo-500/20",
  },
  {
    label: "Leads from AI variants",
    value: `${ROI_STATS.leads_from_ai_variants.toLocaleString()}`,
    sub: `of ${ROI_STATS.leads_generated_30d.toLocaleString()} total leads this month`,
    icon: "group_add",
    color: "text-amber-400",
    bg: "bg-amber-500/[0.07] border-amber-500/20",
  },
  {
    label: "Refreshes deployed",
    value: `${ROI_STATS.refreshes_deployed_30d}`,
    sub: `Avg detection lag: ${ROI_STATS.avg_detection_lag_days} days before replacement`,
    icon: "refresh",
    color: "text-blue-400",
    bg: "bg-blue-500/[0.07] border-blue-500/20",
  },
];

const PLATFORM_COLOR: Record<string, string> = {
  meta: "bg-blue-500/10 text-blue-400",
  google: "bg-red-500/10 text-red-400",
};

export default function Dashboard() {
  const sorted = [...CREATIVES].sort((a, b) => a.health_score - b.health_score);

  return (
    <div className="p-8 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-xl font-bold text-white tracking-tight">Dashboard</h1>
            <span className="flex items-center gap-1.5 text-[11px] text-[#555] border border-[#2a2a2a] rounded-full px-2.5 py-1">
              <Image src="/itm-logo.png" alt="ITM" width={14} height={14} className="rounded-sm" />
              <span className="font-semibold text-[#888]">It's Today Media</span>
            </span>
          </div>
          <p className="text-[#555] text-sm">Last synced: Jun 22, 2026 — 23:41 UTC</p>
        </div>
        <button className="px-4 py-2 rounded-lg bg-white/[0.06] hover:bg-white/[0.09] border border-[#2a2a2a] text-sm text-[#ccc] transition-colors font-medium">
          Sync now
        </button>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        {statCards.map(({ label, value, sub, accent }) => (
          <div key={label} className="bg-[#1c1c1c] border border-[#2a2a2a] rounded-xl p-4">
            <p className="text-[#555] text-xs mb-2">{label}</p>
            <p className={`text-2xl font-semibold ${accent ?? "text-white"}`}>{value}</p>
            <p className="text-[#444] text-xs mt-1">{sub}</p>
          </div>
        ))}
      </div>

      {/* ROI panel */}
      <div className="mb-6">
        <p className="text-[11px] font-medium text-[#444] uppercase tracking-wider mb-3">ROI impact — last 30 days</p>
        <div className="grid grid-cols-4 gap-3">
          {roiCards.map(({ label, value, sub, icon, color, bg }) => (
            <div key={label} className={`border rounded-xl p-4 ${bg}`}>
              <div className="flex items-center gap-2 mb-2">
                <span className={`material-symbols-outlined text-[16px] ${color}`}>{icon}</span>
                <p className="text-[11px] text-[#666]">{label}</p>
              </div>
              <p className={`text-lg font-bold mb-1 ${color}`}>{value}</p>
              <p className="text-[11px] text-[#444] leading-relaxed">{sub}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Fatigue alerts banner */}
      {ACCOUNT_STATS.critical_count > 0 && (
        <div className="flex items-center justify-between bg-red-500/[0.07] border border-red-500/20 rounded-xl px-5 py-3.5 mb-8">
          <div className="flex items-center gap-3">
            <span className="w-2 h-2 rounded-full bg-red-400 animate-pulse" />
            <span className="text-sm text-red-300">
              <strong>{ACCOUNT_STATS.critical_count} creatives</strong> are in critical fatigue — estimated wasted spend: <strong>$680/day</strong>
            </span>
          </div>
          <Link href="/alerts" className="text-xs text-red-400 hover:text-red-300 font-medium underline underline-offset-2">
            View replacements
          </Link>
        </div>
      )}

      {/* Creative health table */}
      <div className="bg-[#1c1c1c] border border-[#2a2a2a] rounded-xl overflow-hidden">
        <div className="px-5 py-4 border-b border-[#2a2a2a] flex items-center justify-between">
          <h2 className="text-sm font-medium text-white">Creative Health</h2>
          <span className="text-xs text-[#555]">{CREATIVES.length} active creatives</span>
        </div>

        <div className="divide-y divide-[#232323]">
          {sorted.map((creative) => (
            <Link
              key={creative.id}
              href={`/creative/${creative.id}`}
              className="flex items-center gap-5 px-5 py-4 hover:bg-white/[0.02] transition-colors group"
            >
              {/* Score ring */}
              <ScoreRing score={creative.health_score} status={creative.health_status} size={52} />

              {/* Creative info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${PLATFORM_COLOR[creative.platform]}`}>
                    {creative.platform.toUpperCase()}
                  </span>
                  <span className="text-[#444] text-xs truncate">{creative.campaign}</span>
                </div>
                <p className="text-sm text-white font-medium truncate">{creative.headline}</p>
                <p className="text-xs text-[#555] truncate mt-0.5">{creative.body}</p>
              </div>

              {/* Metrics */}
              <div className="hidden md:flex items-center gap-8 text-right shrink-0">
                <div>
                  <p className="text-[11px] text-[#444] mb-0.5">CTR</p>
                  <p className="text-sm text-white font-medium">{(creative.ctr_7d * 100).toFixed(1)}%</p>
                </div>
                <div>
                  <p className="text-[11px] text-[#444] mb-0.5">ROAS</p>
                  <p className="text-sm text-white font-medium">{creative.roas_7d}x</p>
                </div>
                <div>
                  <p className="text-[11px] text-[#444] mb-0.5">Freq</p>
                  <p className="text-sm text-white font-medium">{creative.frequency}</p>
                </div>
                <div>
                  <p className="text-[11px] text-[#444] mb-0.5">Spend</p>
                  <p className="text-sm text-white font-medium">${creative.spend_7d.toLocaleString()}</p>
                </div>
              </div>

              {/* Status */}
              <div className="shrink-0 flex items-center gap-3">
                <HealthBadge status={creative.health_status} />
                <span className="material-symbols-outlined text-[20px] text-[#333] group-hover:text-[#888] transition-colors">arrow_circle_right</span>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Fatigue legend */}
      <div className="mt-6 flex items-center gap-6 text-xs text-[#444]">
        <span className="font-medium text-[#555]">Health score thresholds:</span>
        <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-green-500" />70–100 Healthy</span>
        <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-amber-500" />40–69 Warning</span>
        <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-red-500" />0–39 Critical</span>
      </div>
    </div>
  );
}
