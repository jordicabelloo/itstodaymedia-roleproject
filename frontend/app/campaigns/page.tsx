import { CREATIVES } from "@/lib/mock-data";
import Link from "next/link";
import HealthBadge from "@/components/HealthBadge";

const campaigns = Array.from(
  new Map(CREATIVES.map((c) => [c.campaign, c])).values()
).map((c) => ({
  name: c.campaign,
  platform: c.platform,
  creatives: CREATIVES.filter((x) => x.campaign === c.campaign),
}));

export default function CampaignsPage() {
  return (
    <div className="p-8 max-w-5xl mx-auto">
      <div className="mb-8">
        <h1 className="text-xl font-semibold text-white">Campaigns</h1>
        <p className="text-[#555] text-sm mt-0.5">{campaigns.length} active campaigns</p>
      </div>

      <div className="space-y-3">
        {campaigns.map(({ name, platform, creatives }) => {
          const critical = creatives.filter((c) => c.health_status === "critical").length;
          const totalSpend = creatives.reduce((s, c) => s + c.spend_7d, 0);
          const avgRoas = creatives.reduce((s, c) => s + c.roas_7d, 0) / creatives.length;
          return (
            <div key={name} className="bg-[#1c1c1c] border border-[#2a2a2a] rounded-xl p-5">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <p className="text-sm font-medium text-white">{name}</p>
                  <p className="text-xs text-[#444] mt-0.5 uppercase">{platform}</p>
                </div>
                <div className="flex items-center gap-6">
                  <div className="text-right">
                    <p className="text-[11px] text-[#444]">7d Spend</p>
                    <p className="text-sm text-white">${totalSpend.toLocaleString()}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[11px] text-[#444]">Avg ROAS</p>
                    <p className="text-sm text-white">{avgRoas.toFixed(1)}x</p>
                  </div>
                  {critical > 0 && (
                    <span className="text-xs text-red-400 bg-red-500/10 border border-red-500/20 px-2.5 py-1 rounded-full">
                      {critical} critical
                    </span>
                  )}
                </div>
              </div>
              <div className="grid grid-cols-1 gap-1.5 mt-3">
                {creatives.map((c) => (
                  <Link
                    key={c.id}
                    href={`/creative/${c.id}`}
                    className="flex items-center gap-3 px-3 py-2.5 bg-[#141414] rounded-lg hover:bg-white/[0.03] transition-colors group"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-white truncate">{c.headline}</p>
                    </div>
                    <div className="flex items-center gap-4 shrink-0">
                      <span className="text-xs text-[#555]">CTR {(c.ctr_7d * 100).toFixed(1)}%</span>
                      <span className="text-xs text-[#555]">ROAS {c.roas_7d}x</span>
                      <HealthBadge status={c.health_status} />
                      <span className="material-symbols-outlined text-[18px] text-[#333] group-hover:text-[#888] transition-colors">arrow_circle_right</span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
