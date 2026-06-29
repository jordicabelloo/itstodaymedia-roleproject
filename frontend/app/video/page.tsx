"use client";

import {
  useState, useRef, useEffect, useCallback, ChangeEvent,
} from "react";
import clsx from "clsx";

// ── Types ──────────────────────────────────────────────────────────────────

type ColType    = "hook" | "body" | "cta";
type MediaType  = "prerecorded" | "ai-generated";
type CardStatus = "idle" | "generating" | "ready" | "error";

interface VideoCard {
  id: string;
  col: ColType;
  label: string;
  script: string;
  duration: string;
  tag: string;
  mediaType: MediaType;
  // runtime state
  videoUrl?: string;
  imageUrl?: string;
  prompt?: string;
  status: CardStatus;
}

interface Project {
  id: string;
  name: string;
  platform: string;
}

type IntegrationTool = "Higgsfield" | "Kling" | "IStudio" | "Runway";

// ── Seed data ───────────────────────────────────────────────────────────────

const PROJECTS: Project[] = [
  { id: "p1", name: "Weight Loss — Meta TOFU",    platform: "meta"   },
  { id: "p2", name: "Finance — Cold Traffic",      platform: "meta"   },
  { id: "p3", name: "SaaS — Google Demand Gen",   platform: "google" },
];

const SEED_CARDS: VideoCard[] = [
  { id:"h1", col:"hook", label:"Stop — don't scroll",    duration:"3s", tag:"pattern interrupt", mediaType:"ai-generated", script:"\"Wait — if you're over 40 and tired of diets that don't work, this is for you.\"", status:"idle" },
  { id:"h2", col:"hook", label:"POV: still no results",  duration:"3s", tag:"problem agitation",  mediaType:"prerecorded",  script:"POV: You've tried everything and you're still in the same place.", status:"ready" },
  { id:"h3", col:"hook", label:"I lost 22lbs in 60 days",duration:"3s", tag:"social proof",       mediaType:"prerecorded",  script:"\"I lost 22lbs in 60 days without giving up the foods I love.\"", status:"ready" },
  { id:"h4", col:"hook", label:"Doctor won't tell you",  duration:"3s", tag:"curiosity",          mediaType:"ai-generated", script:"\"There's a reason your doctor never mentions this...\"", status:"idle" },
  { id:"b1", col:"body", label:"Product demo + stat",    duration:"15s",tag:"demonstration",      mediaType:"prerecorded",  script:"Show product, explain the mechanism, hit the key stat: '94% of users saw results in 30 days.'", status:"ready" },
  { id:"b2", col:"body", label:"Testimonial montage",    duration:"15s",tag:"social proof",       mediaType:"prerecorded",  script:"3 quick 4-second testimonial cuts. Real people, real results.", status:"ready" },
  { id:"b3", col:"body", label:"Problem → solution",     duration:"15s",tag:"before/after",       mediaType:"ai-generated", script:"Agitate the problem for 7s, pivot to solution, show the product as the bridge.", status:"idle" },
  { id:"c1", col:"cta",  label:"Free trial — link in bio",duration:"5s",tag:"low friction",      mediaType:"prerecorded",  script:"\"Claim your free 14-day trial — link in bio. Takes 30 seconds.\"", status:"ready" },
  { id:"c2", col:"cta",  label:"Limited spots",          duration:"5s", tag:"urgency",            mediaType:"prerecorded",  script:"\"We're only taking 50 more people this week. Link below before it's gone.\"", status:"ready" },
  { id:"c3", col:"cta",  label:"Quiz funnel",            duration:"5s", tag:"engagement",         mediaType:"ai-generated", script:"\"Take the 60-second quiz to see if this works for you. Link in bio.\"", status:"idle" },
];

// ── Config ──────────────────────────────────────────────────────────────────

const COL_CFG: Record<ColType, { label: string; icon: string; sub: string; color: string; ring: string; line: string }> = {
  hook: { label:"HOOK", icon:"bolt",        sub:"first 3s",  color:"text-purple-400", ring:"ring-purple-500/40", line:"#a78bfa" },
  body: { label:"BODY", icon:"play_circle", sub:"15s offer", color:"text-blue-400",   ring:"ring-blue-500/40",   line:"#60a5fa" },
  cta:  { label:"CTA",  icon:"ads_click",   sub:"close 5s",  color:"text-amber-400",  ring:"ring-amber-500/40",  line:"#fbbf24" },
};

const TOOLS: IntegrationTool[] = ["Higgsfield","Kling","IStudio","Runway"];

// ── SVG connector ────────────────────────────────────────────────────────────

function useConnectorLines(
  hookRef: React.RefObject<HTMLDivElement | null>,
  bodyRef: React.RefObject<HTMLDivElement | null>,
  ctaRef: React.RefObject<HTMLDivElement | null>,
  containerRef: React.RefObject<HTMLDivElement | null>,
  active: boolean,
) {
  const [lines, setLines] = useState<{ h2b: string; b2c: string } | null>(null);

  const measure = useCallback(() => {
    if (!active || !hookRef.current || !bodyRef.current || !ctaRef.current || !containerRef.current) {
      setLines(null);
      return;
    }
    const box = containerRef.current.getBoundingClientRect();
    const get = (el: HTMLDivElement) => {
      const r = el.getBoundingClientRect();
      return {
        x: r.left - box.left,
        y: r.top  - box.top,
        w: r.width,
        h: r.height,
      };
    };
    const h = get(hookRef.current);
    const b = get(bodyRef.current);
    const c = get(ctaRef.current);

    const mid = (r: {y:number;h:number}) => r.y + r.h / 2;

    const x1 = h.x + h.w, y1 = mid(h);
    const x2 = b.x,        y2 = mid(b);
    const x3 = b.x + b.w,  y3 = mid(b);
    const x4 = c.x,        y4 = mid(c);

    const cx = (x1 + x2) / 2;
    const cx2 = (x3 + x4) / 2;

    setLines({
      h2b: `M ${x1} ${y1} C ${cx} ${y1}, ${cx} ${y2}, ${x2} ${y2}`,
      b2c: `M ${x3} ${y3} C ${cx2} ${y3}, ${cx2} ${y4}, ${x4} ${y4}`,
    });
  }, [active, hookRef, bodyRef, ctaRef, containerRef]);

  useEffect(() => {
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [measure]);

  return lines;
}

// ── Card component ───────────────────────────────────────────────────────────

function CreativeCard({
  card,
  selected,
  onSelect,
  onVideoUpload,
  onImageUpload,
  onPromptChange,
  onGenerate,
  cardRef,
}: {
  card: VideoCard;
  selected: boolean;
  onSelect: () => void;
  onVideoUpload: (url: string) => void;
  onImageUpload: (url: string) => void;
  onPromptChange: (v: string) => void;
  onGenerate: () => void;
  cardRef?: React.Ref<HTMLDivElement>;
}) {
  const cfg = COL_CFG[card.col];
  const videoInput = useRef<HTMLInputElement>(null);
  const imageInput = useRef<HTMLInputElement>(null);

  function handleFile(e: ChangeEvent<HTMLInputElement>, cb: (url: string) => void) {
    const f = e.target.files?.[0];
    if (f) cb(URL.createObjectURL(f));
  }

  return (
    <div
      ref={cardRef}
      onClick={onSelect}
      className={clsx(
        "relative rounded-xl border transition-all cursor-pointer select-none",
        selected
          ? `bg-[#1a1a1a] border-[#3a3a3a] ring-2 ${cfg.ring}`
          : "bg-[#141414] border-[#232323] hover:border-[#2e2e2e]"
      )}
    >
      {/* Type badge */}
      <div className="flex items-center justify-between px-3 pt-3 mb-2">
        <span className={clsx(
          "text-[10px] px-2 py-0.5 rounded-full font-semibold border",
          card.mediaType === "prerecorded"
            ? "bg-green-500/10 border-green-500/20 text-green-400"
            : "bg-indigo-500/10 border-indigo-500/20 text-indigo-400"
        )}>
          {card.mediaType === "prerecorded" ? "Pre-recorded" : "AI Generated"}
        </span>
        <span className="text-[10px] text-[#333]">{card.duration}</span>
      </div>

      {/* Media area */}
      <div className="mx-3 mb-2 rounded-lg overflow-hidden bg-[#0f0f0f] border border-[#1e1e1e]" style={{height:80}}>
        {card.mediaType === "prerecorded" ? (
          card.videoUrl ? (
            <video src={card.videoUrl} className="w-full h-full object-cover" muted playsInline />
          ) : (
            <button
              onClick={(e) => { e.stopPropagation(); videoInput.current?.click(); }}
              className="w-full h-full flex flex-col items-center justify-center gap-1 hover:bg-white/[0.02] transition-colors"
            >
              <span className="material-symbols-outlined text-[22px] text-[#2a2a2a]">upload_file</span>
              <span className="text-[10px] text-[#333]">Upload video</span>
            </button>
          )
        ) : (
          <div className="w-full h-full flex gap-0">
            {/* Reference image */}
            <div className="w-1/2 h-full border-r border-[#1e1e1e] flex items-center justify-center relative">
              {card.imageUrl ? (
                <img src={card.imageUrl} alt="" className="w-full h-full object-cover" />
              ) : (
                <button
                  onClick={(e) => { e.stopPropagation(); imageInput.current?.click(); }}
                  className="w-full h-full flex flex-col items-center justify-center gap-0.5 hover:bg-white/[0.02] transition-colors"
                >
                  <span className="material-symbols-outlined text-[18px] text-[#2a2a2a]">add_photo_alternate</span>
                  <span className="text-[9px] text-[#333]">Ref image</span>
                </button>
              )}
            </div>
            {/* Status indicator */}
            <div className="w-1/2 h-full flex flex-col items-center justify-center gap-1">
              {card.status === "generating" && (
                <>
                  <span className="w-4 h-4 border border-[#333] border-t-indigo-400 rounded-full animate-spin" />
                  <span className="text-[9px] text-indigo-400">Generating...</span>
                </>
              )}
              {card.status === "ready" && card.videoUrl && (
                <video src={card.videoUrl} className="w-full h-full object-cover" muted playsInline />
              )}
              {(card.status === "idle" || card.status === "error") && (
                <button
                  onClick={(e) => { e.stopPropagation(); onGenerate(); }}
                  className="flex flex-col items-center gap-0.5 hover:opacity-80 transition-opacity"
                >
                  <span className="material-symbols-outlined text-[18px] text-[#2a2a2a]">auto_awesome</span>
                  <span className="text-[9px] text-[#333]">Generate</span>
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Script / prompt */}
      <div className="px-3 pb-3">
        <p className={clsx("text-xs font-semibold mb-1", selected ? cfg.color : "text-white")}>{card.label}</p>
        {card.mediaType === "ai-generated" ? (
          <textarea
            value={card.prompt ?? card.script}
            onChange={(e) => { e.stopPropagation(); onPromptChange(e.target.value); }}
            onClick={(e) => e.stopPropagation()}
            rows={2}
            placeholder="Describe the scene for the AI video tool..."
            className="w-full bg-[#0f0f0f] border border-[#1e1e1e] rounded-lg px-2 py-1.5 text-[11px] text-[#aaa] placeholder-[#333] focus:outline-none focus:border-[#2a2a2a] resize-none font-mono leading-relaxed"
          />
        ) : (
          <p className="text-[11px] text-[#555] leading-relaxed line-clamp-2">{card.script}</p>
        )}
        <span className={clsx(
          "inline-block mt-1.5 text-[10px] px-1.5 py-0.5 rounded font-medium",
          selected ? `bg-${card.col === "hook" ? "purple" : card.col === "body" ? "blue" : "amber"}-500/10 ${cfg.color}` : "bg-[#1c1c1c] text-[#444]"
        )}>
          {card.tag}
        </span>
      </div>

      {/* Hidden file inputs */}
      <input ref={videoInput} type="file" accept="video/*" className="hidden"
        onChange={(e) => handleFile(e, onVideoUpload)} />
      <input ref={imageInput} type="file" accept="image/*" className="hidden"
        onChange={(e) => handleFile(e, onImageUpload)} />
    </div>
  );
}

// ── Main page ────────────────────────────────────────────────────────────────

export default function VideoPage() {
  const [projectId, setProjectId]     = useState("p1");
  const [cards, setCards]             = useState<VideoCard[]>(SEED_CARDS);
  const [selHook, setSelHook]         = useState<string | null>(null);
  const [selBody, setSelBody]         = useState<string | null>(null);
  const [selCta,  setSelCta]          = useState<string | null>(null);
  const [activeTool, setActiveTool]   = useState<IntegrationTool>("Higgsfield");
  const [connected, setConnected]     = useState(false);
  const [apiKey, setApiKey]           = useState("");
  const [showConnect, setShowConnect] = useState(false);
  const [assembling, setAssembling]   = useState(false);
  const [assembled, setAssembled]     = useState(false);

  // Card refs for SVG lines
  const hookCardRef = useRef<HTMLDivElement>(null);
  const bodyCardRef = useRef<HTMLDivElement>(null);
  const ctaCardRef  = useRef<HTMLDivElement>(null);
  const canvasRef   = useRef<HTMLDivElement>(null);

  const allSelected = !!(selHook && selBody && selCta);
  const lines = useConnectorLines(hookCardRef, bodyCardRef, ctaCardRef, canvasRef, allSelected);

  function updateCard(id: string, patch: Partial<VideoCard>) {
    setCards((prev) => prev.map((c) => c.id === id ? { ...c, ...patch } : c));
  }

  function selectCard(col: ColType, id: string) {
    if (col === "hook") setSelHook((p) => p === id ? null : id);
    if (col === "body") setSelBody((p) => p === id ? null : id);
    if (col === "cta")  setSelCta ((p) => p === id ? null : id);
    setAssembled(false);
  }

  function handleGenerate(card: VideoCard) {
    updateCard(card.id, { status: "generating" });
    setTimeout(() => updateCard(card.id, { status: "idle" }), 3000);
  }

  async function assemble() {
    setAssembling(true);
    await new Promise((r) => setTimeout(r, 2200));
    setAssembling(false);
    setAssembled(true);
  }

  const hookCard = cards.find((c) => c.id === selHook);
  const bodyCard = cards.find((c) => c.id === selBody);
  const ctaCard  = cards.find((c) => c.id === selCta);

  const totalDur = (hookCard ? 3 : 0) + (bodyCard ? 15 : 0) + (ctaCard ? 5 : 0);

  // Measure lines when selection changes
  useEffect(() => {}, [selHook, selBody, selCta]);

  const hooks  = cards.filter((c) => c.col === "hook");
  const bodies = cards.filter((c) => c.col === "body");
  const ctas   = cards.filter((c) => c.col === "cta");

  return (
    <div className="p-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight mb-1">Creative Lab</h1>
          <p className="text-[#555] text-sm">Build video ad combinations — connect Higgsfield to generate and auto-assemble</p>
        </div>
        <div className="flex items-center gap-3">
          {/* Project selector */}
          <select
            value={projectId}
            onChange={(e) => setProjectId(e.target.value)}
            className="bg-[#1c1c1c] border border-[#2a2a2a] rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-[#444] cursor-pointer"
          >
            {PROJECTS.map((p) => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>
          {/* Integration button */}
          <button
            onClick={() => setShowConnect(true)}
            className={clsx(
              "flex items-center gap-2 px-4 py-2 rounded-lg border text-sm font-medium transition-all",
              connected
                ? "bg-green-500/10 border-green-500/20 text-green-400"
                : "bg-[#1c1c1c] border-[#2a2a2a] text-[#888] hover:text-white hover:border-[#444]"
            )}
          >
            <span className="material-symbols-outlined text-[16px]">
              {connected ? "check_circle" : "link"}
            </span>
            {connected ? `${activeTool} connected` : "Connect AI tool"}
          </button>
        </div>
      </div>

      {/* Canvas */}
      <div ref={canvasRef} className="relative grid grid-cols-3 gap-6 mb-6">
        {/* SVG overlay */}
        {lines && (
          <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 10 }}>
            <defs>
              <marker id="dot1" markerWidth="6" markerHeight="6" refX="3" refY="3">
                <circle cx="3" cy="3" r="2" fill={COL_CFG.hook.line} />
              </marker>
              <marker id="dot2" markerWidth="6" markerHeight="6" refX="3" refY="3">
                <circle cx="3" cy="3" r="2" fill={COL_CFG.body.line} />
              </marker>
            </defs>
            <path
              d={lines.h2b}
              stroke={COL_CFG.hook.line}
              strokeWidth="2"
              fill="none"
              strokeDasharray="5 3"
              opacity="0.6"
              markerEnd="url(#dot1)"
            />
            <path
              d={lines.b2c}
              stroke={COL_CFG.body.line}
              strokeWidth="2"
              fill="none"
              strokeDasharray="5 3"
              opacity="0.6"
              markerEnd="url(#dot2)"
            />
          </svg>
        )}

        {/* Columns */}
        {(["hook","body","cta"] as ColType[]).map((col) => {
          const cfg = COL_CFG[col];
          const colCards = col === "hook" ? hooks : col === "body" ? bodies : ctas;
          const selId = col === "hook" ? selHook : col === "body" ? selBody : selCta;

          return (
            <div key={col}>
              <div className="flex items-center gap-2 mb-3">
                <span className={clsx("material-symbols-outlined text-[16px]", cfg.color)}>{cfg.icon}</span>
                <p className={clsx("text-xs font-bold uppercase tracking-wider", cfg.color)}>{cfg.label}</p>
                <span className="text-[10px] text-[#333]">{cfg.sub}</span>
              </div>
              <div className="space-y-3">
                {colCards.map((card) => (
                  <CreativeCard
                    key={card.id}
                    card={card}
                    selected={selId === card.id}
                    onSelect={() => selectCard(col, card.id)}
                    onVideoUpload={(url) => updateCard(card.id, { videoUrl: url, status: "ready" })}
                    onImageUpload={(url) => updateCard(card.id, { imageUrl: url })}
                    onPromptChange={(v) => updateCard(card.id, { prompt: v })}
                    onGenerate={() => handleGenerate(card)}
                    cardRef={
                      selId === card.id
                        ? col === "hook" ? hookCardRef : col === "body" ? bodyCardRef : ctaCardRef
                        : undefined
                    }
                  />
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Assembly bar */}
      <div className={clsx(
        "rounded-xl border px-5 py-4 transition-all",
        allSelected ? "bg-[#1a1a1a] border-[#333]" : "bg-[#141414] border-[#1e1e1e]"
      )}>
        <div className="flex items-center gap-4">
          {/* Combination preview pills */}
          <div className="flex items-center gap-2 flex-1 flex-wrap">
            {(["hook","body","cta"] as ColType[]).map((col, i) => {
              const card = col === "hook" ? hookCard : col === "body" ? bodyCard : ctaCard;
              const cfg  = COL_CFG[col];
              return (
                <div key={col} className="flex items-center gap-2">
                  {i > 0 && <span className="material-symbols-outlined text-[14px] text-[#333]">arrow_forward</span>}
                  {card ? (
                    <span className={clsx(
                      "flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-medium",
                      `bg-${col==="hook"?"purple":col==="body"?"blue":"amber"}-500/10`,
                      `border-${col==="hook"?"purple":col==="body"?"blue":"amber"}-500/20`,
                      cfg.color
                    )}>
                      <span className="material-symbols-outlined text-[13px]">{cfg.icon}</span>
                      {card.label}
                      <span className="opacity-50">{card.duration}</span>
                    </span>
                  ) : (
                    <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-dashed border-[#222] text-xs text-[#333]">
                      <span className="material-symbols-outlined text-[13px] text-[#2a2a2a]">{cfg.icon}</span>
                      Select {cfg.label}
                    </span>
                  )}
                </div>
              );
            })}
            {allSelected && (
              <span className="text-[11px] text-[#444] ml-2">{totalDur}s total</span>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 shrink-0">
            {assembled && (
              <button className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#1c1c1c] border border-[#2a2a2a] text-xs text-[#888] hover:text-white hover:border-[#444] transition-all font-medium">
                <span className="material-symbols-outlined text-[14px]">download</span>
                Download
              </button>
            )}
            {assembled && (
              <button className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-blue-600/20 border border-blue-500/30 text-xs text-blue-400 hover:bg-blue-600/30 transition-all font-medium">
                <span className="material-symbols-outlined text-[14px]">upload</span>
                Upload to Meta
              </button>
            )}
            <button
              disabled={!allSelected || assembling}
              onClick={assemble}
              className={clsx(
                "flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all",
                allSelected && !assembling
                  ? "bg-white text-black hover:bg-[#e8e8e8] active:scale-[0.98]"
                  : "bg-[#1c1c1c] text-[#333] border border-[#222] cursor-not-allowed"
              )}
            >
              {assembling ? (
                <>
                  <span className="w-4 h-4 border-2 border-[#444] border-t-black rounded-full animate-spin" />
                  Assembling...
                </>
              ) : assembled ? (
                <><span className="material-symbols-outlined text-[16px]">check</span>Assembled</>
              ) : (
                <><span className="material-symbols-outlined text-[16px]">movie</span>Assemble combination</>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Connect modal */}
      {showConnect && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-6" onClick={() => setShowConnect(false)}>
          <div className="bg-[#1c1c1c] border border-[#2a2a2a] rounded-2xl p-6 w-full max-w-md" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-5">
              <p className="text-sm font-bold text-white">Connect AI video tool</p>
              <button onClick={() => setShowConnect(false)}>
                <span className="material-symbols-outlined text-[18px] text-[#555] hover:text-white transition-colors">close</span>
              </button>
            </div>
            <div className="flex gap-2 mb-4 flex-wrap">
              {TOOLS.map((t) => (
                <button
                  key={t}
                  onClick={() => setActiveTool(t)}
                  className={clsx(
                    "px-3 py-1.5 rounded-lg border text-xs font-medium transition-all",
                    activeTool === t ? "bg-white/[0.08] border-[#444] text-white" : "bg-transparent border-[#232323] text-[#555] hover:text-[#888]"
                  )}
                >
                  {t}
                </button>
              ))}
            </div>
            <p className="text-xs text-[#555] mb-3">{activeTool} API key — used to generate footage from your image+prompt cards and auto-assemble combinations.</p>
            <input
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder={`${activeTool} API key`}
              type="password"
              className="w-full bg-[#141414] border border-[#2a2a2a] rounded-lg px-3 py-2.5 text-sm text-white placeholder-[#333] focus:outline-none focus:border-[#444] mb-4 font-mono"
            />
            <div className="flex gap-2">
              <button
                onClick={() => { setShowConnect(false); }}
                className="flex-1 py-2.5 rounded-xl border border-[#2a2a2a] text-xs text-[#555] hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => { setConnected(true); setShowConnect(false); }}
                disabled={!apiKey.trim()}
                className={clsx(
                  "flex-1 py-2.5 rounded-xl text-xs font-semibold transition-all",
                  apiKey.trim() ? "bg-white text-black hover:bg-[#e8e8e8]" : "bg-[#222] text-[#444] cursor-not-allowed"
                )}
              >
                Connect {activeTool}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
