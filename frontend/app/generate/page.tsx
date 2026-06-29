"use client";

import { useState } from "react";

type HookAngle = "pain_point" | "social_proof" | "curiosity" | "urgency" | "benefit";

interface Variant {
  headline: string;
  body: string;
  hook_angle: HookAngle;
  rationale: string;
}

const HOOK_COLOR: Record<HookAngle, string> = {
  social_proof: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  curiosity:    "bg-purple-500/10 text-purple-400 border-purple-500/20",
  urgency:      "bg-red-500/10 text-red-400 border-red-500/20",
  pain_point:   "bg-orange-500/10 text-orange-400 border-orange-500/20",
  benefit:      "bg-green-500/10 text-green-400 border-green-500/20",
};

const SIGNALS = [
  "High frequency (3.5+) — audience saturated",
  "CTR decay >25% in 7 days",
  "ROAS drop >35% in 7 days",
  "CPM spike >35% vs baseline",
];

const PLATFORMS = [
  { value: "meta",   label: "Meta Ads" },
  { value: "google", label: "Google Ads" },
  { value: "tiktok", label: "TikTok Ads" },
];

export default function GeneratePage() {
  const [headline, setHeadline]   = useState("");
  const [body, setBody]           = useState("");
  const [platform, setPlatform]   = useState("meta");
  const [context, setContext]     = useState("");
  const [signals, setSignals]     = useState<string[]>([]);
  const [loading, setLoading]     = useState(false);
  const [variants, setVariants]   = useState<Variant[] | null>(null);
  const [error, setError]         = useState<string | null>(null);
  const [copied, setCopied]       = useState<number | null>(null);

  const toggleSignal = (s: string) =>
    setSignals((prev) => prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]);

  const generate = async () => {
    if (!headline.trim() || !body.trim()) return;
    setLoading(true);
    setError(null);
    setVariants(null);

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ headline, body, platform, context, signals }),
      });
      if (!res.ok) throw new Error("Generation failed");
      const data = await res.json();
      setVariants(data.variants);
    } catch (e) {
      setError("Something went wrong. Check your API key or try again.");
    } finally {
      setLoading(false);
    }
  };

  const copy = (v: Variant, i: number) => {
    navigator.clipboard.writeText(`Headline: ${v.headline}\n\nBody: ${v.body}`);
    setCopied(i);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-xl font-bold text-white tracking-tight mb-1">Generate Variants</h1>
        <p className="text-[#555] text-sm">Paste a fatigued ad — get 3 AI-powered replacements instantly.</p>
      </div>

      <div className="grid grid-cols-5 gap-6">
        {/* Form */}
        <div className="col-span-2 space-y-4">
          {/* Platform */}
          <div className="bg-[#1c1c1c] border border-[#2a2a2a] rounded-xl p-4">
            <p className="text-xs font-medium text-[#555] uppercase tracking-wider mb-3">Platform</p>
            <div className="flex gap-2">
              {PLATFORMS.map((p) => (
                <button
                  key={p.value}
                  onClick={() => setPlatform(p.value)}
                  className={`flex-1 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                    platform === p.value
                      ? "bg-white/[0.08] border-[#444] text-white"
                      : "border-[#2a2a2a] text-[#555] hover:text-[#888]"
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          {/* Ad copy */}
          <div className="bg-[#1c1c1c] border border-[#2a2a2a] rounded-xl p-4 space-y-3">
            <p className="text-xs font-medium text-[#555] uppercase tracking-wider">Fatigued creative</p>
            <div>
              <label className="text-xs text-[#666] mb-1 block">Headline</label>
              <input
                value={headline}
                onChange={(e) => setHeadline(e.target.value)}
                placeholder="Still paying too much for X?"
                className="w-full bg-[#141414] border border-[#2a2a2a] rounded-lg px-3 py-2 text-sm text-white placeholder-[#333] focus:outline-none focus:border-[#444] transition-colors"
              />
            </div>
            <div>
              <label className="text-xs text-[#666] mb-1 block">Body</label>
              <textarea
                value={body}
                onChange={(e) => setBody(e.target.value)}
                placeholder="Join 12,000+ customers who cut their costs in half..."
                rows={3}
                className="w-full bg-[#141414] border border-[#2a2a2a] rounded-lg px-3 py-2 text-sm text-white placeholder-[#333] focus:outline-none focus:border-[#444] transition-colors resize-none"
              />
            </div>
          </div>

          {/* Context */}
          <div className="bg-[#1c1c1c] border border-[#2a2a2a] rounded-xl p-4">
            <label className="text-xs font-medium text-[#555] uppercase tracking-wider mb-3 block">
              Product context <span className="text-[#333] normal-case font-normal">(optional)</span>
            </label>
            <input
              value={context}
              onChange={(e) => setContext(e.target.value)}
              placeholder="e.g. SaaS project management tool for agencies"
              className="w-full bg-[#141414] border border-[#2a2a2a] rounded-lg px-3 py-2 text-sm text-white placeholder-[#333] focus:outline-none focus:border-[#444] transition-colors"
            />
          </div>

          {/* Fatigue signals */}
          <div className="bg-[#1c1c1c] border border-[#2a2a2a] rounded-xl p-4">
            <p className="text-xs font-medium text-[#555] uppercase tracking-wider mb-3">
              Fatigue signals detected <span className="text-[#333] normal-case font-normal">(optional)</span>
            </p>
            <div className="space-y-2">
              {SIGNALS.map((s) => (
                <label key={s} className="flex items-start gap-2.5 cursor-pointer group">
                  <div
                    onClick={() => toggleSignal(s)}
                    className={`mt-0.5 w-4 h-4 rounded border flex items-center justify-center shrink-0 transition-colors ${
                      signals.includes(s)
                        ? "bg-red-500/20 border-red-500/40"
                        : "border-[#333] group-hover:border-[#555]"
                    }`}
                  >
                    {signals.includes(s) && (
                      <span className="material-symbols-outlined text-[11px] text-red-400">check</span>
                    )}
                  </div>
                  <span
                    onClick={() => toggleSignal(s)}
                    className="text-xs text-[#666] group-hover:text-[#888] transition-colors leading-relaxed"
                  >
                    {s}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Generate button */}
          <button
            onClick={generate}
            disabled={loading || !headline.trim() || !body.trim()}
            className={`w-full py-3 rounded-xl text-sm font-semibold transition-all flex items-center justify-center gap-2 ${
              loading || !headline.trim() || !body.trim()
                ? "bg-white/[0.04] border border-[#2a2a2a] text-[#444] cursor-not-allowed"
                : "bg-white text-black hover:bg-white/90"
            }`}
          >
            {loading ? (
              <>
                <span className="material-symbols-outlined text-[16px] animate-spin">progress_activity</span>
                Generating with Claude...
              </>
            ) : (
              <>
                <span className="material-symbols-outlined text-[16px]">auto_awesome</span>
                Generate variants
              </>
            )}
          </button>

          {error && (
            <p className="text-xs text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
              {error}
            </p>
          )}
        </div>

        {/* Results */}
        <div className="col-span-3">
          {!variants && !loading && (
            <div className="h-full flex flex-col items-center justify-center text-center py-16">
              <span className="material-symbols-outlined text-[48px] text-[#2a2a2a] mb-4">auto_awesome</span>
              <p className="text-[#444] text-sm">Paste a fatigued ad on the left</p>
              <p className="text-[#333] text-xs mt-1">Claude will generate 3 replacement variants with different hook angles</p>
            </div>
          )}

          {loading && (
            <div className="h-full flex flex-col items-center justify-center gap-4 py-16">
              <div className="flex gap-1.5">
                {[0, 1, 2].map((i) => (
                  <span
                    key={i}
                    className="w-2 h-2 rounded-full bg-[#444]"
                    style={{ animation: `pulse 1.2s ease-in-out ${i * 0.2}s infinite` }}
                  />
                ))}
              </div>
              <p className="text-[#555] text-sm">Claude is analyzing your creative...</p>
              <style>{`@keyframes pulse { 0%,100%{opacity:.2} 50%{opacity:1} }`}</style>
            </div>
          )}

          {variants && (
            <div className="space-y-3">
              <div className="flex items-center gap-2 mb-4">
                <p className="text-xs font-medium text-[#555] uppercase tracking-wider">AI-generated replacements</p>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                  Claude Sonnet 4.6
                </span>
              </div>

              {variants.map((v, i) => (
                <div
                  key={i}
                  className="bg-[#1c1c1c] border border-[#2a2a2a] rounded-xl p-5 hover:border-[#3a3a3a] transition-colors"
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[11px] text-[#444]">Variant {i + 1}</span>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full border capitalize ${HOOK_COLOR[v.hook_angle]}`}>
                      {v.hook_angle.replace("_", " ")}
                    </span>
                  </div>

                  <p className="text-sm text-white font-semibold mb-2">{v.headline}</p>
                  <p className="text-sm text-[#888] leading-relaxed mb-4">{v.body}</p>

                  <div className="flex items-start gap-2 mb-4 p-3 bg-[#141414] rounded-lg border border-[#232323]">
                    <span className="material-symbols-outlined text-[14px] text-[#444] mt-0.5 shrink-0">lightbulb</span>
                    <p className="text-[11px] text-[#555] italic leading-relaxed">{v.rationale}</p>
                  </div>

                  <button
                    onClick={() => copy(v, i)}
                    className={`w-full py-2 rounded-lg border text-xs font-medium transition-all flex items-center justify-center gap-1.5 ${
                      copied === i
                        ? "bg-green-500/10 border-green-500/30 text-green-400"
                        : "bg-white/[0.04] hover:bg-white/[0.07] border-[#2a2a2a] text-[#777] hover:text-white"
                    }`}
                  >
                    <span className="material-symbols-outlined text-[14px]">
                      {copied === i ? "check_circle" : "content_copy"}
                    </span>
                    {copied === i ? "Copied!" : "Copy to clipboard"}
                  </button>
                </div>
              ))}

              <button
                onClick={generate}
                className="w-full py-2.5 rounded-xl border border-[#2a2a2a] text-xs text-[#555] hover:text-[#888] transition-colors flex items-center justify-center gap-1.5 mt-2"
              >
                <span className="material-symbols-outlined text-[14px]">refresh</span>
                Regenerate
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
