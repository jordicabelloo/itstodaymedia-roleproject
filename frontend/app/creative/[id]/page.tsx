import { CREATIVES } from "@/lib/mock-data";
import { notFound } from "next/navigation";
import HealthBadge from "@/components/HealthBadge";
import ScoreRing from "@/components/ScoreRing";
import MetricsChart from "@/components/MetricsChart";
import Link from "next/link";

const SIGNAL_LABELS: Record<string, string> = {
  frequency:    "Audience frequency",
  ctr_decay_7d: "CTR decay (7d)",
  cpm_spike_7d: "CPM spike (7d)",
  roas_drop_7d: "ROAS drop (7d)",
};

export default async function CreativePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const creative = CREATIVES.find((c) => c.id === id);
  if (!creative) notFound();

  return (
    <div className="p-8 max-w-5xl mx-auto">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs text-[#444] mb-6">
        <Link href="/" className="hover:text-[#888] transition-colors">Dashboard</Link>
        <span>/</span>
        <span className="text-[#666]">{creative.name}</span>
      </div>

      {/* Header */}
      <div className="flex items-start gap-5 mb-8">
        <ScoreRing score={creative.health_score} status={creative.health_status} size={72} />
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <HealthBadge status={creative.health_status} />
            <span className="text-xs text-[#444] uppercase tracking-wider">{creative.platform}</span>
          </div>
          <h1 className="text-lg font-semibold text-white mb-1">{creative.headline}</h1>
          <p className="text-sm text-[#666]">{creative.campaign}</p>
        </div>
        {creative.health_status !== "healthy" ? (
          <Link
            href={`/alerts?open=${creative.id}`}
            className="px-4 py-2 rounded-lg bg-indigo-500/10 hover:bg-indigo-500/15 border border-indigo-500/20 text-sm text-indigo-400 transition-colors flex items-center gap-1.5"
          >
            <span className="material-symbols-outlined text-[16px]">auto_awesome</span>
            View AI replacements
          </Link>
        ) : (
          <span className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-green-500/10 border border-green-500/20 text-sm text-green-400">
            <span className="material-symbols-outlined text-[16px]">check_circle</span>
            Performing well
          </span>
        )}
      </div>

      {/* Metrics row */}
      <div className="grid grid-cols-5 gap-3 mb-6">
        {[
          { label: "7d Spend",   value: `$${creative.spend_7d.toLocaleString()}` },
          { label: "ROAS",       value: `${creative.roas_7d}x` },
          { label: "CTR",        value: `${(creative.ctr_7d * 100).toFixed(1)}%` },
          { label: "Frequency",  value: creative.frequency.toFixed(1) },
          { label: "Health",     value: `${creative.health_score}/100` },
        ].map(({ label, value }) => (
          <div key={label} className="bg-[#1c1c1c] border border-[#2a2a2a] rounded-xl p-4">
            <p className="text-[11px] text-[#444] mb-1">{label}</p>
            <p className="text-lg font-semibold text-white">{value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-3 gap-4">
        {/* Chart */}
        <div className="col-span-2 bg-[#1c1c1c] border border-[#2a2a2a] rounded-xl p-5">
          <p className="text-xs font-medium text-[#555] uppercase tracking-wider mb-4">7-day performance</p>
          <MetricsChart data={creative.history} />
        </div>

        {/* Signals + copy */}
        <div className="space-y-4">
          <div className="bg-[#1c1c1c] border border-[#2a2a2a] rounded-xl p-4">
            <p className="text-xs font-medium text-[#555] uppercase tracking-wider mb-3">Fatigue signals</p>
            {creative.signals.length === 0 ? (
              <p className="text-xs text-[#444]">No signals — creative is healthy.</p>
            ) : (
              <div className="space-y-3">
                {creative.signals.map((s) => (
                  <div key={s.name}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs text-[#888]">{SIGNAL_LABELS[s.name]}</span>
                      <span className={`text-xs font-medium ${s.severity === "critical" ? "text-red-400" : "text-amber-400"}`}>
                        {s.name === "frequency" ? s.value.toFixed(1) : `${(s.value * 100).toFixed(0)}%`}
                      </span>
                    </div>
                    <div className="h-1 bg-[#2a2a2a] rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${s.severity === "critical" ? "bg-red-500" : "bg-amber-500"}`}
                        style={{ width: `${Math.min(100, (s.value / s.threshold_critical) * 80)}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="bg-[#1c1c1c] border border-[#2a2a2a] rounded-xl p-4">
            <p className="text-xs font-medium text-[#555] uppercase tracking-wider mb-3">Ad copy</p>
            <p className="text-xs text-white font-medium mb-2">{creative.headline}</p>
            <p className="text-xs text-[#666] leading-relaxed">{creative.body}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
