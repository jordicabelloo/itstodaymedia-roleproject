"use client";

import { useState } from "react";
import clsx from "clsx";

// ── Types ──────────────────────────────────────────────────────────────────

type ComponentType = "hook" | "body" | "cta";
type Status = "winning" | "testing" | "paused" | "lost";

interface VideoComponent {
  id: string;
  type: ComponentType;
  label: string;
  script: string;
  duration: string;
  tag: string;
  uses: number;
}

interface Combination {
  id: string;
  name: string;
  campaign: string;
  hook_id: string;
  body_id: string;
  cta_id: string;
  status: Status;
  ctr: number;
  cpl: number;
  spend: number;
  leads: number;
  started: string;
}

// ── Mock library ────────────────────────────────────────────────────────────

const COMPONENTS: VideoComponent[] = [
  // Hooks
  { id: "h1", type: "hook", label: "Stop — don't scroll",   duration: "3s", tag: "pattern interrupt", uses: 14, script: "\"Wait — if you're over 40 and tired of diets that don't work, this is for you.\"" },
  { id: "h2", type: "hook", label: "POV: still no results", duration: "3s", tag: "problem agitation",  uses: 9,  script: "POV: You've tried everything and you're still in the same place. [frustrated mirror look]" },
  { id: "h3", type: "hook", label: "I lost 22lbs in 60 days", duration: "3s", tag: "social proof",    uses: 11, script: "\"I lost 22lbs in 60 days without giving up the foods I love.\" [before/after cut]" },
  { id: "h4", type: "hook", label: "Doctor won't tell you", duration: "3s", tag: "curiosity",         uses: 6,  script: "\"There's a reason your doctor never mentions this...\" [zoom on camera]" },
  // Bodies
  { id: "b1", type: "body", label: "Product demo + stat",   duration: "15s", tag: "demonstration",    uses: 18, script: "Show product, explain the mechanism, hit the key stat: '94% of users saw results in 30 days.' Keep it fast." },
  { id: "b2", type: "body", label: "Testimonial montage",   duration: "15s", tag: "social proof",     uses: 12, script: "3 quick 4-second testimonial cuts. Real people, real results, first name + result on screen." },
  { id: "b3", type: "body", label: "Problem → solution",    duration: "15s", tag: "before/after",     uses: 8,  script: "Agitate the problem for 7s, pivot to the solution, show the product as the bridge." },
  // CTAs
  { id: "c1", type: "cta", label: "Free trial — link in bio", duration: "5s", tag: "low friction",    uses: 21, script: "\"Claim your free 14-day trial — link in bio. Takes 30 seconds.\"" },
  { id: "c2", type: "cta", label: "Limited spots",            duration: "5s", tag: "urgency",         uses: 9,  script: "\"We're only taking 50 more people this week. Link below before it's gone.\"" },
  { id: "c3", type: "cta", label: "Quiz funnel",              duration: "5s", tag: "engagement",      uses: 7,  script: "\"Take the 60-second quiz to see if this works for you. Link in bio.\"" },
];

const COMBINATIONS: Combination[] = [
  { id: "mix1", name: "Hook 3 + Demo + Free trial",   campaign: "Meta TOFU — Weight Loss",   hook_id: "h3", body_id: "b1", cta_id: "c1", status: "winning", ctr: 4.2, cpl: 0.74, spend: 3200, leads: 1847, started: "Jun 15" },
  { id: "mix2", name: "Hook 1 + Testimonials + Quiz", campaign: "Meta TOFU — Weight Loss",   hook_id: "h1", body_id: "b2", cta_id: "c3", status: "testing", ctr: 3.1, cpl: 1.12, spend: 1100, leads: 512,  started: "Jun 20" },
  { id: "mix3", name: "Hook 2 + Problem/Sol + Urgency", campaign: "Meta Retargeting",        hook_id: "h2", body_id: "b3", cta_id: "c2", status: "testing", ctr: 2.8, cpl: 0.98, spend: 890,  leads: 389,  started: "Jun 21" },
  { id: "mix4", name: "Hook 4 + Demo + Free trial",   campaign: "Google Demand Gen",          hook_id: "h4", body_id: "b1", cta_id: "c1", status: "lost",    ctr: 1.4, cpl: 2.31, spend: 640,  leads: 87,   started: "Jun 10" },
];

// ── Config ──────────────────────────────────────────────────────────────────

const TYPE_CONFIG: Record<ComponentType, { label: string; color: string; bg: string; icon: string }> = {
  hook: { label: "Hook",  color: "text-purple-400", bg: "bg-purple-500/10 border-purple-500/20", icon: "bolt" },
  body: { label: "Body",  color: "text-blue-400",   bg: "bg-blue-500/10 border-blue-500/20",     icon: "play_circle" },
  cta:  { label: "CTA",   color: "text-amber-400",  bg: "bg-amber-500/10 border-amber-500/20",   icon: "ads_click" },
};

const STATUS_CONFIG: Record<Status, { label: string; color: string; dot: string }> = {
  winning: { label: "Winning", color: "text-green-400",  dot: "bg-green-400" },
  testing: { label: "Testing", color: "text-blue-400",   dot: "bg-blue-400 animate-pulse" },
  paused:  { label: "Paused",  color: "text-[#555]",     dot: "bg-[#444]" },
  lost:    { label: "Lost",    color: "text-red-400",    dot: "bg-red-400" },
};

const PROMPT_TOOLS = ["Higgsfield", "Kling", "IStudio", "Runway", "Sora"] as const;
type PromptTool = typeof PROMPT_TOOLS[number];

// ── Sub-components ──────────────────────────────────────────────────────────

function ComponentCard({
  comp,
  selected,
  onSelect,
}: {
  comp: VideoComponent;
  selected: boolean;
  onSelect: () => void;
}) {
  const cfg = TYPE_CONFIG[comp.type];
  return (
    <button
      onClick={onSelect}
      className={clsx(
        "w-full text-left p-3.5 rounded-xl border transition-all",
        selected
          ? `${cfg.bg} border-current ring-1 ring-current/30`
          : "bg-[#141414] border-[#232323] hover:border-[#333]"
      )}
    >
      <div className="flex items-start justify-between gap-2 mb-2">
        <p className={clsx("text-xs font-semibold leading-tight", selected ? cfg.color : "text-white")}>{comp.label}</p>
        <span className="text-[10px] text-[#444] shrink-0">{comp.duration}</span>
      </div>
      <p className="text-[11px] text-[#555] leading-relaxed line-clamp-2 mb-2">{comp.script}</p>
      <div className="flex items-center gap-2">
        <span className={clsx("text-[10px] px-1.5 py-0.5 rounded font-medium", selected ? cfg.bg + " " + cfg.color : "bg-[#1c1c1c] text-[#444]")}>
          {comp.tag}
        </span>
        <span className="text-[10px] text-[#333]">{comp.uses} uses</span>
      </div>
    </button>
  );
}

// ── Main page ───────────────────────────────────────────────────────────────

export default function VideoPage() {
  const [selectedHook, setSelectedHook] = useState<string | null>(null);
  const [selectedBody, setSelectedBody] = useState<string | null>(null);
  const [selectedCta,  setSelectedCta]  = useState<string | null>(null);
  const [promptTool, setPromptTool] = useState<PromptTool>("Higgsfield");
  const [promptLoading, setPromptLoading] = useState(false);
  const [generatedPrompt, setGeneratedPrompt] = useState<string | null>(null);
  const [promptCopied, setPromptCopied] = useState(false);
  const [activeView, setActiveView] = useState<"combos" | "mix">("combos");

  const hooks  = COMPONENTS.filter((c) => c.type === "hook");
  const bodies = COMPONENTS.filter((c) => c.type === "body");
  const ctas   = COMPONENTS.filter((c) => c.type === "cta");

  const selHook = COMPONENTS.find((c) => c.id === selectedHook);
  const selBody = COMPONENTS.find((c) => c.id === selectedBody);
  const selCta  = COMPONENTS.find((c) => c.id === selectedCta);
  const canBuild = selHook && selBody && selCta;

  async function generatePrompt() {
    if (!selHook) return;
    setPromptLoading(true);
    setGeneratedPrompt(null);

    try {
      const res = await fetch("/api/video-prompt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ hook: selHook, tool: promptTool }),
      });
      const data = await res.json();
      setGeneratedPrompt(data.prompt);
    } catch {
      setGeneratedPrompt(`Cinematic close-up of a woman (35-45) looking at camera with quiet frustration. She exhales, looks away, then back. Natural window light. Handheld, slightly unsteady. No text. Realistic, raw — not studio. 5 seconds, loop-friendly.\n\nHook line appears as subtitle at 1.5s: "${selHook.script}"`);
    } finally {
      setPromptLoading(false);
    }
  }

  function copyPrompt() {
    if (!generatedPrompt) return;
    navigator.clipboard.writeText(generatedPrompt);
    setPromptCopied(true);
    setTimeout(() => setPromptCopied(false), 2000);
  }

  const getComp = (id: string) => COMPONENTS.find((c) => c.id === id);

  return (
    <div className="p-8 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight mb-1">Creative Lab</h1>
          <p className="text-[#555] text-sm">Mix hooks, bodies, and CTAs — test combinations — generate footage prompts for Higgsfield, Kling, IStudio</p>
        </div>
        <div className="flex gap-1 bg-[#1c1c1c] border border-[#2a2a2a] rounded-lg p-1">
          {(["combos", "mix"] as const).map((v) => (
            <button
              key={v}
              onClick={() => setActiveView(v)}
              className={clsx(
                "px-4 py-1.5 rounded-md text-xs font-medium transition-all capitalize",
                activeView === v ? "bg-white/[0.08] text-white" : "text-[#555] hover:text-[#888]"
              )}
            >
              {v === "combos" ? "Active tests" : "Mix builder"}
            </button>
          ))}
        </div>
      </div>

      {/* ── VIEW: Active combinations ── */}
      {activeView === "combos" && (
        <div className="space-y-4">
          {/* Summary */}
          <div className="grid grid-cols-4 gap-3 mb-2">
            {[
              { label: "Combinations tested", value: COMBINATIONS.length.toString(), icon: "science", color: "text-white" },
              { label: "Winning combo CPL",   value: `$${Math.min(...COMBINATIONS.map(c => c.cpl)).toFixed(2)}`, icon: "emoji_events", color: "text-green-400" },
              { label: "Total leads",         value: COMBINATIONS.reduce((s,c) => s+c.leads,0).toLocaleString(), icon: "group_add", color: "text-blue-400" },
              { label: "Total spend",         value: `$${COMBINATIONS.reduce((s,c) => s+c.spend,0).toLocaleString()}`, icon: "payments", color: "text-amber-400" },
            ].map(({ label, value, icon, color }) => (
              <div key={label} className="bg-[#1c1c1c] border border-[#2a2a2a] rounded-xl p-4">
                <div className="flex items-center gap-1.5 mb-2">
                  <span className={clsx("material-symbols-outlined text-[14px]", color)}>{icon}</span>
                  <p className="text-[11px] text-[#444]">{label}</p>
                </div>
                <p className={clsx("text-xl font-bold", color)}>{value}</p>
              </div>
            ))}
          </div>

          {/* Combinations table */}
          <div className="bg-[#1c1c1c] border border-[#2a2a2a] rounded-xl overflow-hidden">
            <div className="px-5 py-3.5 border-b border-[#232323] flex items-center justify-between">
              <p className="text-sm font-semibold text-white">A/B Combinations</p>
              <button
                onClick={() => setActiveView("mix")}
                className="flex items-center gap-1.5 text-xs text-[#555] hover:text-white transition-colors"
              >
                <span className="material-symbols-outlined text-[14px]">add</span>
                New combination
              </button>
            </div>
            <div className="divide-y divide-[#1a1a1a]">
              {COMBINATIONS.map((combo) => {
                const st = STATUS_CONFIG[combo.status];
                const hook = getComp(combo.hook_id);
                const body = getComp(combo.body_id);
                const cta  = getComp(combo.cta_id);
                return (
                  <div key={combo.id} className="px-5 py-4 flex items-start gap-5">
                    {/* Status */}
                    <div className="flex items-center gap-1.5 shrink-0 mt-0.5 w-20">
                      <span className={clsx("w-1.5 h-1.5 rounded-full shrink-0", st.dot)} />
                      <span className={clsx("text-xs font-medium", st.color)}>{st.label}</span>
                    </div>

                    {/* Components */}
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-[#444] mb-2">{combo.campaign}</p>
                      <div className="flex flex-wrap gap-2">
                        {[hook, body, cta].filter(Boolean).map((comp) => {
                          const cfg = TYPE_CONFIG[comp!.type];
                          return (
                            <span key={comp!.id} className={clsx("flex items-center gap-1 text-[11px] px-2 py-1 rounded-lg border font-medium", cfg.bg, cfg.color)}>
                              <span className="material-symbols-outlined text-[12px]">{cfg.icon}</span>
                              {comp!.label}
                            </span>
                          );
                        })}
                      </div>
                    </div>

                    {/* Metrics */}
                    <div className="flex items-center gap-6 shrink-0 text-right">
                      <div>
                        <p className="text-[10px] text-[#444]">CTR</p>
                        <p className="text-sm text-white font-semibold">{combo.ctr}%</p>
                      </div>
                      <div>
                        <p className="text-[10px] text-[#444]">CPL</p>
                        <p className={clsx("text-sm font-semibold", combo.status === "winning" ? "text-green-400" : combo.status === "lost" ? "text-red-400" : "text-white")}>
                          ${combo.cpl}
                        </p>
                      </div>
                      <div>
                        <p className="text-[10px] text-[#444]">Leads</p>
                        <p className="text-sm text-white font-semibold">{combo.leads.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-[10px] text-[#444]">Spend</p>
                        <p className="text-sm text-white font-semibold">${combo.spend.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-[10px] text-[#444]">Since</p>
                        <p className="text-xs text-[#555]">{combo.started}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ── VIEW: Mix builder ── */}
      {activeView === "mix" && (
        <div className="grid grid-cols-3 gap-4">
          {/* Hooks */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="material-symbols-outlined text-[16px] text-purple-400">bolt</span>
              <p className="text-xs font-semibold text-white uppercase tracking-wider">Hook</p>
              <span className="text-[10px] text-[#444]">first 3s</span>
            </div>
            <div className="space-y-2">
              {hooks.map((h) => (
                <ComponentCard key={h.id} comp={h} selected={selectedHook === h.id} onSelect={() => setSelectedHook(selectedHook === h.id ? null : h.id)} />
              ))}
            </div>
          </div>

          {/* Bodies */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="material-symbols-outlined text-[16px] text-blue-400">play_circle</span>
              <p className="text-xs font-semibold text-white uppercase tracking-wider">Body</p>
              <span className="text-[10px] text-[#444]">15s offer</span>
            </div>
            <div className="space-y-2">
              {bodies.map((b) => (
                <ComponentCard key={b.id} comp={b} selected={selectedBody === b.id} onSelect={() => setSelectedBody(selectedBody === b.id ? null : b.id)} />
              ))}
            </div>
          </div>

          {/* CTAs */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="material-symbols-outlined text-[16px] text-amber-400">ads_click</span>
              <p className="text-xs font-semibold text-white uppercase tracking-wider">CTA</p>
              <span className="text-[10px] text-[#444]">close 5s</span>
            </div>
            <div className="space-y-2">
              {ctas.map((c) => (
                <ComponentCard key={c.id} comp={c} selected={selectedCta === c.id} onSelect={() => setSelectedCta(selectedCta === c.id ? null : c.id)} />
              ))}
            </div>

            {/* Prompt generator — appears when hook selected */}
            {selHook && (
              <div className="mt-4 bg-[#1c1c1c] border border-[#2a2a2a] rounded-xl p-4">
                <p className="text-xs font-semibold text-white mb-1">Need new footage?</p>
                <p className="text-[11px] text-[#444] mb-3 leading-relaxed">Generate a production prompt for your selected hook — ready to paste into an AI video tool.</p>
                <div className="flex flex-wrap gap-1.5 mb-3">
                  {PROMPT_TOOLS.map((t) => (
                    <button
                      key={t}
                      onClick={() => setPromptTool(t)}
                      className={clsx(
                        "px-2.5 py-1 rounded-lg text-[11px] font-medium border transition-all",
                        promptTool === t
                          ? "bg-white/[0.08] border-[#444] text-white"
                          : "bg-transparent border-[#232323] text-[#555] hover:text-[#888]"
                      )}
                    >
                      {t}
                    </button>
                  ))}
                </div>
                <button
                  onClick={generatePrompt}
                  disabled={promptLoading}
                  className="w-full py-2 rounded-lg bg-white/[0.06] hover:bg-white/[0.09] border border-[#333] text-xs text-white font-medium transition-all flex items-center justify-center gap-1.5 disabled:opacity-40"
                >
                  {promptLoading
                    ? <><span className="w-3 h-3 border border-[#444] border-t-white rounded-full animate-spin" />Generating...</>
                    : <><span className="material-symbols-outlined text-[14px]">auto_awesome</span>Generate {promptTool} prompt</>
                  }
                </button>
                {generatedPrompt && (
                  <div className="mt-3">
                    <pre className="text-[11px] text-[#aaa] whitespace-pre-wrap leading-relaxed bg-[#141414] border border-[#232323] rounded-lg p-3 mb-2 font-mono">
                      {generatedPrompt}
                    </pre>
                    <button
                      onClick={copyPrompt}
                      className={clsx(
                        "w-full py-1.5 rounded-lg text-xs font-medium border transition-all flex items-center justify-center gap-1.5",
                        promptCopied
                          ? "bg-green-500/10 border-green-500/20 text-green-400"
                          : "bg-white/[0.04] border-[#2a2a2a] text-[#666] hover:text-white"
                      )}
                    >
                      <span className="material-symbols-outlined text-[13px]">{promptCopied ? "check" : "content_copy"}</span>
                      {promptCopied ? "Copied to clipboard" : `Copy ${promptTool} prompt`}
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Bottom bar — combination preview */}
      {activeView === "mix" && (
        <div className={clsx(
          "mt-6 border rounded-xl px-5 py-4 flex items-center gap-6 transition-all",
          canBuild ? "bg-white/[0.03] border-[#333]" : "bg-[#141414] border-[#1e1e1e]"
        )}>
          <div className="flex-1 flex items-center gap-3 flex-wrap">
            {[
              { comp: selHook, type: "hook" as ComponentType },
              { comp: selBody, type: "body" as ComponentType },
              { comp: selCta,  type: "cta"  as ComponentType },
            ].map(({ comp, type }) => {
              const cfg = TYPE_CONFIG[type];
              return comp ? (
                <div key={type} className={clsx("flex items-center gap-2 px-3 py-2 rounded-lg border text-xs font-medium", cfg.bg, cfg.color)}>
                  <span className="material-symbols-outlined text-[14px]">{cfg.icon}</span>
                  {comp.label}
                  <span className="text-[10px] opacity-60">{comp.duration}</span>
                </div>
              ) : (
                <div key={type} className="flex items-center gap-2 px-3 py-2 rounded-lg border border-dashed border-[#2a2a2a] text-xs text-[#333]">
                  <span className="material-symbols-outlined text-[14px] text-[#2a2a2a]">{cfg.icon}</span>
                  Select {cfg.label}
                </div>
              );
            })}
            {canBuild && (
              <>
                <span className="text-[#333] text-xs">→</span>
                <span className="text-xs text-[#555]">
                  {((selHook ? 3 : 0) + (selBody ? 15 : 0) + (selCta ? 5 : 0))}s total
                </span>
              </>
            )}
          </div>
          <button
            disabled={!canBuild}
            className={clsx(
              "shrink-0 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all",
              canBuild
                ? "bg-white text-black hover:bg-[#e8e8e8] active:scale-[0.98]"
                : "bg-[#1c1c1c] text-[#333] cursor-not-allowed border border-[#222]"
            )}
          >
            Launch A/B test
          </button>
        </div>
      )}
    </div>
  );
}
