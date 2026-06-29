"use client";

import { useState } from "react";
import clsx from "clsx";

type Platform = "meta" | "tiktok" | "youtube";
type Duration = "15" | "30" | "60";

const PLATFORMS: { id: Platform; label: string; icon: string; sub: string }[] = [
  { id: "meta",    label: "Meta Reels",      icon: "play_circle", sub: "Facebook & Instagram" },
  { id: "tiktok",  label: "TikTok",          icon: "music_video", sub: "For You Page" },
  { id: "youtube", label: "YouTube Shorts",  icon: "smart_display", sub: "Shorts feed" },
];

const HOOK_LABELS: Record<string, { label: string; color: string; icon: string }> = {
  pattern_interrupt:  { label: "Pattern interrupt",   color: "text-purple-400",  icon: "bolt" },
  problem_agitation:  { label: "Problem agitation",   color: "text-red-400",     icon: "warning" },
  social_proof:       { label: "Social proof",        color: "text-green-400",   icon: "verified" },
};

interface VideoScript {
  hook_style: string;
  hook: string;
  script: string;
  visual_direction: string;
  text_overlays: string[];
  rationale: string;
}

type Tab = "script" | "visual" | "overlays";

export default function VideoPage() {
  const [platform, setPlatform] = useState<Platform>("meta");
  const [duration, setDuration] = useState<Duration>("30");
  const [product, setProduct] = useState("");
  const [audience, setAudience] = useState("");
  const [painPoint, setPainPoint] = useState("");
  const [cta, setCta] = useState("");
  const [loading, setLoading] = useState(false);
  const [scripts, setScripts] = useState<VideoScript[] | null>(null);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState<Record<number, Tab>>({});
  const [copied, setCopied] = useState<number | null>(null);

  async function generate() {
    if (!product.trim() || !audience.trim()) return;
    setLoading(true);
    setError("");
    setScripts(null);

    try {
      const res = await fetch("/api/video", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ product, audience, pain_point: painPoint, cta, platform, duration }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Generation failed");
      setScripts(data.scripts);
    } catch (e: any) {
      setError(e.message ?? "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  function copyScript(idx: number, text: string) {
    navigator.clipboard.writeText(text);
    setCopied(idx);
    setTimeout(() => setCopied(null), 2000);
  }

  function getTab(idx: number): Tab {
    return activeTab[idx] ?? "script";
  }

  return (
    <div className="p-8 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight mb-1">Video Creative Generator</h1>
          <p className="text-[#555] text-sm">AI-written scripts for paid social — hook, full script, visual direction, text overlays</p>
        </div>
        <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-xs text-purple-400 font-medium">
          <span className="material-symbols-outlined text-[14px]">smart_toy</span>
          qwen3:14b
        </span>
      </div>

      <div className="grid grid-cols-5 gap-6">
        {/* Left: inputs */}
        <div className="col-span-2 space-y-5">
          {/* Platform */}
          <div>
            <label className="text-xs font-medium text-[#555] uppercase tracking-wider block mb-2">Platform</label>
            <div className="space-y-2">
              {PLATFORMS.map((p) => (
                <button
                  key={p.id}
                  onClick={() => setPlatform(p.id)}
                  className={clsx(
                    "w-full flex items-center gap-3 px-4 py-3 rounded-xl border text-left transition-all",
                    platform === p.id
                      ? "bg-white/[0.06] border-[#444] text-white"
                      : "bg-[#1c1c1c] border-[#2a2a2a] text-[#666] hover:border-[#333]"
                  )}
                >
                  <span className={clsx("material-symbols-outlined text-[18px]", platform === p.id ? "text-purple-400" : "text-[#444]")}>
                    {p.icon}
                  </span>
                  <div>
                    <p className="text-sm font-medium leading-none mb-0.5">{p.label}</p>
                    <p className="text-[10px] text-[#555]">{p.sub}</p>
                  </div>
                  {platform === p.id && (
                    <span className="material-symbols-outlined text-[16px] text-purple-400 ml-auto">check_circle</span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Duration */}
          <div>
            <label className="text-xs font-medium text-[#555] uppercase tracking-wider block mb-2">Duration</label>
            <div className="flex gap-2">
              {(["15", "30", "60"] as Duration[]).map((d) => (
                <button
                  key={d}
                  onClick={() => setDuration(d)}
                  className={clsx(
                    "flex-1 py-2 rounded-lg border text-sm font-medium transition-all",
                    duration === d
                      ? "bg-purple-500/15 border-purple-500/30 text-purple-300"
                      : "bg-[#1c1c1c] border-[#2a2a2a] text-[#666] hover:border-[#333]"
                  )}
                >
                  {d}s
                </button>
              ))}
            </div>
          </div>

          {/* Inputs */}
          <div className="space-y-3">
            <div>
              <label className="text-xs font-medium text-[#555] uppercase tracking-wider block mb-1.5">Product / offer</label>
              <input
                value={product}
                onChange={(e) => setProduct(e.target.value)}
                placeholder="e.g. Weight loss supplement for women over 40"
                className="w-full bg-[#1c1c1c] border border-[#2a2a2a] rounded-lg px-3 py-2.5 text-sm text-white placeholder-[#333] focus:outline-none focus:border-[#444] transition-colors"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-[#555] uppercase tracking-wider block mb-1.5">Target audience</label>
              <input
                value={audience}
                onChange={(e) => setAudience(e.target.value)}
                placeholder="e.g. Women 35-55, frustrated with yo-yo dieting"
                className="w-full bg-[#1c1c1c] border border-[#2a2a2a] rounded-lg px-3 py-2.5 text-sm text-white placeholder-[#333] focus:outline-none focus:border-[#444] transition-colors"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-[#555] uppercase tracking-wider block mb-1.5">Core pain point</label>
              <input
                value={painPoint}
                onChange={(e) => setPainPoint(e.target.value)}
                placeholder="e.g. Tried everything, nothing sticks"
                className="w-full bg-[#1c1c1c] border border-[#2a2a2a] rounded-lg px-3 py-2.5 text-sm text-white placeholder-[#333] focus:outline-none focus:border-[#444] transition-colors"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-[#555] uppercase tracking-wider block mb-1.5">CTA</label>
              <input
                value={cta}
                onChange={(e) => setCta(e.target.value)}
                placeholder="e.g. Claim your free trial"
                className="w-full bg-[#1c1c1c] border border-[#2a2a2a] rounded-lg px-3 py-2.5 text-sm text-white placeholder-[#333] focus:outline-none focus:border-[#444] transition-colors"
              />
            </div>
          </div>

          <button
            onClick={generate}
            disabled={loading || !product.trim() || !audience.trim()}
            className={clsx(
              "w-full py-3 rounded-xl font-semibold text-sm transition-all flex items-center justify-center gap-2",
              loading || !product.trim() || !audience.trim()
                ? "bg-[#222] text-[#444] cursor-not-allowed"
                : "bg-white text-black hover:bg-[#e8e8e8] active:scale-[0.98]"
            )}
          >
            {loading ? (
              <>
                <span className="w-4 h-4 border-2 border-[#444] border-t-white rounded-full animate-spin" />
                Generating scripts...
              </>
            ) : (
              <>
                <span className="material-symbols-outlined text-[18px]">movie</span>
                Generate 3 video scripts
              </>
            )}
          </button>

          {error && (
            <p className="text-xs text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">{error}</p>
          )}
        </div>

        {/* Right: output */}
        <div className="col-span-3">
          {!scripts && !loading && (
            <div className="h-full flex flex-col items-center justify-center text-center py-20 border border-dashed border-[#2a2a2a] rounded-xl">
              <span className="material-symbols-outlined text-[48px] text-[#2a2a2a] mb-4">movie</span>
              <p className="text-[#444] text-sm font-medium mb-1">No scripts yet</p>
              <p className="text-[#333] text-xs">Fill in the product and audience, then generate</p>
            </div>
          )}

          {loading && (
            <div className="h-full flex flex-col items-center justify-center py-20 border border-dashed border-[#2a2a2a] rounded-xl gap-4">
              <div className="w-8 h-8 border-2 border-[#333] border-t-purple-400 rounded-full animate-spin" />
              <p className="text-[#555] text-sm">Writing scripts with qwen3:14b...</p>
              <p className="text-[#333] text-xs">Hook, full script, visual direction, overlays</p>
            </div>
          )}

          {scripts && (
            <div className="space-y-4">
              {scripts.map((s, idx) => {
                const meta = HOOK_LABELS[s.hook_style] ?? { label: s.hook_style, color: "text-white", icon: "movie" };
                const tab = getTab(idx);
                return (
                  <div key={idx} className="bg-[#1c1c1c] border border-[#2a2a2a] rounded-xl overflow-hidden">
                    {/* Card header */}
                    <div className="flex items-start justify-between px-5 py-4 border-b border-[#232323]">
                      <div className="flex-1 min-w-0 pr-4">
                        <div className="flex items-center gap-2 mb-2">
                          <span className={clsx("material-symbols-outlined text-[16px]", meta.color)}>{meta.icon}</span>
                          <span className={clsx("text-xs font-semibold", meta.color)}>{meta.label}</span>
                        </div>
                        <p className="text-sm text-white font-semibold leading-snug">{s.hook}</p>
                        <p className="text-xs text-[#444] mt-1.5 leading-relaxed">{s.rationale}</p>
                      </div>
                      <button
                        onClick={() => copyScript(idx, `HOOK:\n${s.hook}\n\nSCRIPT:\n${s.script}\n\nVISUAL DIRECTION:\n${s.visual_direction}\n\nTEXT OVERLAYS:\n${s.text_overlays.join(" | ")}`)}
                        className={clsx(
                          "shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all",
                          copied === idx
                            ? "bg-green-500/10 border-green-500/20 text-green-400"
                            : "bg-white/[0.04] border-[#2a2a2a] text-[#666] hover:text-white hover:border-[#444]"
                        )}
                      >
                        <span className="material-symbols-outlined text-[14px]">
                          {copied === idx ? "check" : "content_copy"}
                        </span>
                        {copied === idx ? "Copied" : "Copy all"}
                      </button>
                    </div>

                    {/* Tabs */}
                    <div className="flex border-b border-[#1a1a1a]">
                      {(["script", "visual", "overlays"] as Tab[]).map((t) => (
                        <button
                          key={t}
                          onClick={() => setActiveTab((p) => ({ ...p, [idx]: t }))}
                          className={clsx(
                            "px-4 py-2.5 text-xs font-medium transition-colors capitalize",
                            tab === t
                              ? "text-white border-b-2 border-purple-400"
                              : "text-[#555] hover:text-[#888]"
                          )}
                        >
                          {t === "script" ? "Full script" : t === "visual" ? "Visual direction" : "Text overlays"}
                        </button>
                      ))}
                    </div>

                    {/* Tab content */}
                    <div className="p-5">
                      {tab === "script" && (
                        <pre className="text-xs text-[#ccc] whitespace-pre-wrap leading-relaxed font-mono">{s.script}</pre>
                      )}
                      {tab === "visual" && (
                        <p className="text-xs text-[#ccc] leading-relaxed">{s.visual_direction}</p>
                      )}
                      {tab === "overlays" && (
                        <div className="flex flex-wrap gap-2">
                          {s.text_overlays.map((overlay, i) => (
                            <span key={i} className="px-2.5 py-1 bg-[#141414] border border-[#2a2a2a] rounded-lg text-xs text-white font-medium">
                              {overlay}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
