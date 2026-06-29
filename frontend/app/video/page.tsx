"use client";

import { useState, useRef, useEffect, useCallback, ChangeEvent } from "react";
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
  videoUrl?: string;
  imageUrls: string[];   // multiple reference images for AI generation
  prompt: string;        // prompt sent to Higgsfield / Kling / etc.
  status: CardStatus;
}

interface Project {
  id: string;
  name: string;
  platform: string;
}

type IntegrationTool = "Higgsfield" | "Kling" | "IStudio" | "Runway";

// ── Per-project seed cards ─────────────────────────────────────────────────

function makeCard(fields: Omit<VideoCard, "imageUrls" | "prompt"> & { script: string }): VideoCard {
  return { ...fields, imageUrls: [], prompt: fields.script };
}

const SEED: Record<string, VideoCard[]> = {
  p1: [
    makeCard({ id:"p1-h1", col:"hook", label:"Stop — don't scroll",     duration:"3s",  tag:"pattern interrupt", mediaType:"ai-generated", script:"Woman (35-45) looks directly into camera, pauses mid-scroll, raises an eyebrow. Handheld, natural light, authentic bedroom setting. Subtitle fades in at 1.5s.", status:"idle" }),
    makeCard({ id:"p1-h2", col:"hook", label:"POV: still no results",   duration:"3s",  tag:"problem agitation",  mediaType:"prerecorded",  script:"POV: You've tried everything and you're still in the same place.", status:"ready" }),
    makeCard({ id:"p1-h3", col:"hook", label:"I lost 22lbs in 60 days", duration:"3s",  tag:"social proof",       mediaType:"prerecorded",  script:"\"I lost 22lbs in 60 days without giving up the foods I love.\"", status:"ready" }),
    makeCard({ id:"p1-b1", col:"body", label:"Product demo + stat",     duration:"15s", tag:"demonstration",      mediaType:"prerecorded",  script:"Show product, explain the mechanism, hit the key stat: '94% of users saw results in 30 days.'", status:"ready" }),
    makeCard({ id:"p1-b2", col:"body", label:"Testimonial montage",     duration:"15s", tag:"social proof",       mediaType:"prerecorded",  script:"3 quick 4-second testimonial cuts. Real people, real results.", status:"ready" }),
    makeCard({ id:"p1-b3", col:"body", label:"Problem → solution",      duration:"15s", tag:"before/after",       mediaType:"ai-generated", script:"Agitate the problem for 7s: show the frustrated routine. Hard cut to solution: product in hand, lighter mood, warm light. No text needed — emotion carries it.", status:"idle" }),
    makeCard({ id:"p1-c1", col:"cta",  label:"Free trial — link in bio",duration:"5s",  tag:"low friction",       mediaType:"prerecorded",  script:"\"Claim your free 14-day trial — link in bio. Takes 30 seconds.\"", status:"ready" }),
    makeCard({ id:"p1-c2", col:"cta",  label:"Limited spots",           duration:"5s",  tag:"urgency",            mediaType:"prerecorded",  script:"\"We're only taking 50 more people this week.\"", status:"ready" }),
    makeCard({ id:"p1-c3", col:"cta",  label:"Quiz funnel",             duration:"5s",  tag:"engagement",         mediaType:"ai-generated", script:"Bright, energetic cut: phone in hand, quiz screen visible, smile. Text overlay: 'Find out in 60 seconds →'. Quick zoom out.", status:"idle" }),
  ],
  p2: [
    makeCard({ id:"p2-h1", col:"hook", label:"Your money is losing value",  duration:"3s",  tag:"problem agitation", mediaType:"ai-generated", script:"Cinematic close-up of a wallet, coins spilling out slowly. Dark moody grade. Text overlay fades in: 'Inflation ate 18% of your savings last year.' No voice — visual only.", status:"idle" }),
    makeCard({ id:"p2-h2", col:"hook", label:"$0 to $10k in 6 months",     duration:"3s",  tag:"social proof",       mediaType:"prerecorded",  script:"\"I started with $0 and hit $10k in passive income in 6 months. Here's how.\"", status:"ready" }),
    makeCard({ id:"p2-h3", col:"hook", label:"Most people retire broke",    duration:"3s",  tag:"fear",               mediaType:"ai-generated", script:"Graphic: bold text animation on dark background. '90% retire with under $100k.' Pause. Then: 'Which side are you on?' Fast cut. No music — silence for impact.", status:"idle" }),
    makeCard({ id:"p2-b1", col:"body", label:"Platform walkthrough",       duration:"15s", tag:"demonstration",       mediaType:"prerecorded",  script:"Screen recording of the platform: show deposits, returns, dashboard. Keep it fast.", status:"ready" }),
    makeCard({ id:"p2-b2", col:"body", label:"Expert credibility build",   duration:"15s", tag:"authority",           mediaType:"ai-generated", script:"Talking head, mid-shot, clean minimal office background. Confident but relaxed. Show credentials lower-third at 3s. Cut to quick b-roll of charts then back to face for CTA setup.", status:"idle" }),
    makeCard({ id:"p2-c1", col:"cta",  label:"Get the free guide",        duration:"5s",  tag:"low friction",        mediaType:"prerecorded",  script:"\"Download the free wealth playbook — link below. No credit card.\"", status:"ready" }),
    makeCard({ id:"p2-c2", col:"cta",  label:"Book a strategy call",      duration:"5s",  tag:"high intent",         mediaType:"ai-generated", script:"Calendar UI visible on screen, cursor moving to book a slot. Voice over: 'Only 10 spots left this week.' Urgency bar filling up on screen. Clean, fast.", status:"idle" }),
  ],
  p3: [
    makeCard({ id:"p3-h1", col:"hook", label:"Still doing it manually?",   duration:"3s",  tag:"problem agitation", mediaType:"ai-generated", script:"Person at desk buried in spreadsheets, exhausted look, coffee going cold. Slow push in. Text overlay at 2s: 'There's a better way.' Cut to black.", status:"idle" }),
    makeCard({ id:"p3-h2", col:"hook", label:"We 10x'd output in 30 days", duration:"3s",  tag:"social proof",       mediaType:"prerecorded",  script:"\"We cut our ops team's workload in half in the first month. Here's the tool.\"", status:"ready" }),
    makeCard({ id:"p3-b1", col:"body", label:"Product demo — key feature", duration:"15s", tag:"demonstration",       mediaType:"prerecorded",  script:"Screen capture: show the single most impressive feature. No fluff.", status:"ready" }),
    makeCard({ id:"p3-b2", col:"body", label:"ROI breakdown",              duration:"15s", tag:"numbers",             mediaType:"ai-generated", script:"Text animation: numbers counting up ($4,200 saved / month). Split screen: before (chaos) vs after (clean dashboard). Upbeat but professional music. End on the product logo.", status:"idle" }),
    makeCard({ id:"p3-c1", col:"cta",  label:"Start free — no card",      duration:"5s",  tag:"low friction",        mediaType:"prerecorded",  script:"\"Start free today — no credit card required. Takes 2 minutes to set up.\"", status:"ready" }),
    makeCard({ id:"p3-c2", col:"cta",  label:"See it live — book demo",   duration:"5s",  tag:"high intent",         mediaType:"ai-generated", script:"Screen recording: calendar widget, easy booking flow. Text: 'See it live in 15 min.' Cursor clicks 'Book now'. Confirmation screen. Clean and fast.", status:"idle" }),
  ],
};

const PROJECTS: Project[] = [
  { id: "p1", name: "Weight Loss — Meta TOFU",  platform: "meta"   },
  { id: "p2", name: "Finance — Cold Traffic",    platform: "meta"   },
  { id: "p3", name: "SaaS — Google Demand Gen", platform: "google" },
];

// ── Config ──────────────────────────────────────────────────────────────────

const COL_CFG: Record<ColType, { label: string; icon: string; sub: string; color: string; ring: string; line: string; dur: string }> = {
  hook: { label:"HOOK", icon:"bolt",        sub:"first 3s",  color:"text-purple-400", ring:"ring-purple-500/40", line:"#a78bfa", dur:"3s"  },
  body: { label:"BODY", icon:"play_circle", sub:"15s offer", color:"text-blue-400",   ring:"ring-blue-500/40",   line:"#60a5fa", dur:"15s" },
  cta:  { label:"CTA",  icon:"ads_click",   sub:"close 5s",  color:"text-amber-400",  ring:"ring-amber-500/40",  line:"#fbbf24", dur:"5s"  },
};

const TOOLS: IntegrationTool[] = ["Higgsfield","Kling","IStudio","Runway"];

// ── SVG connection lines ────────────────────────────────────────────────────

function useConnectorLines(
  hookEl: HTMLDivElement | null,
  bodyEl: HTMLDivElement | null,
  ctaEl:  HTMLDivElement | null,
  container: HTMLDivElement | null,
  active: boolean,
) {
  const [lines, setLines] = useState<{ h2b: string; b2c: string } | null>(null);

  const measure = useCallback(() => {
    if (!active || !hookEl || !bodyEl || !ctaEl || !container) { setLines(null); return; }
    const box = container.getBoundingClientRect();
    const get = (el: HTMLDivElement) => {
      const r = el.getBoundingClientRect();
      return { x: r.left - box.left, y: r.top - box.top, w: r.width, h: r.height };
    };
    const h = get(hookEl), b = get(bodyEl), c = get(ctaEl);
    const mid = (r:{y:number;h:number}) => r.y + r.h / 2;
    const x1=h.x+h.w, y1=mid(h), x2=b.x, y2=mid(b);
    const x3=b.x+b.w, y3=mid(b), x4=c.x, y4=mid(c);
    const cx=(x1+x2)/2, cx2=(x3+x4)/2;
    setLines({
      h2b:`M ${x1} ${y1} C ${cx} ${y1}, ${cx} ${y2}, ${x2} ${y2}`,
      b2c:`M ${x3} ${y3} C ${cx2} ${y3}, ${cx2} ${y4}, ${x4} ${y4}`,
    });
  }, [active, hookEl, bodyEl, ctaEl, container]);

  useEffect(() => {
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [measure]);

  return lines;
}

// ── New card form ───────────────────────────────────────────────────────────

function NewCardForm({ col, onAdd, onCancel }: {
  col: ColType;
  onAdd: (card: Omit<VideoCard,"id"|"status"|"videoUrl"|"imageUrls">) => void;
  onCancel: () => void;
}) {
  const cfg = COL_CFG[col];
  const [label, setLabel]     = useState("");
  const [script, setScript]   = useState("");
  const [tag, setTag]         = useState("");
  const [mediaType, setMedia] = useState<MediaType>("prerecorded");

  function submit() {
    if (!label.trim()) return;
    onAdd({ col, label: label.trim(), script: script.trim(), tag: tag.trim() || "custom", duration: cfg.dur, mediaType, prompt: script.trim() });
  }

  return (
    <div className="rounded-xl border border-dashed border-[#333] bg-[#111] p-4" onClick={(e) => e.stopPropagation()}>
      <p className={clsx("text-xs font-semibold mb-3", cfg.color)}>New {cfg.label}</p>
      <input
        autoFocus
        value={label}
        onChange={(e) => setLabel(e.target.value)}
        placeholder="Label — e.g. Transformation hook"
        className="w-full bg-[#0f0f0f] border border-[#222] rounded-lg px-3 py-2 text-xs text-white placeholder-[#333] focus:outline-none focus:border-[#333] mb-2"
      />
      <textarea
        value={script}
        onChange={(e) => setScript(e.target.value)}
        placeholder="Script or prompt..."
        rows={3}
        className="w-full bg-[#0f0f0f] border border-[#222] rounded-lg px-3 py-2 text-xs text-[#aaa] placeholder-[#333] focus:outline-none focus:border-[#333] resize-none mb-2 font-mono leading-relaxed"
      />
      <input
        value={tag}
        onChange={(e) => setTag(e.target.value)}
        placeholder="Tag — e.g. social proof"
        className="w-full bg-[#0f0f0f] border border-[#222] rounded-lg px-3 py-2 text-xs text-white placeholder-[#333] focus:outline-none focus:border-[#333] mb-3"
      />
      <div className="flex gap-1.5 mb-3">
        {(["prerecorded","ai-generated"] as MediaType[]).map((m) => (
          <button
            key={m}
            onClick={() => setMedia(m)}
            className={clsx(
              "flex-1 py-1.5 rounded-lg text-[11px] font-medium border transition-all",
              mediaType === m
                ? m === "prerecorded"
                  ? "bg-green-500/10 border-green-500/20 text-green-400"
                  : "bg-indigo-500/10 border-indigo-500/20 text-indigo-400"
                : "bg-transparent border-[#222] text-[#444] hover:text-[#666]"
            )}
          >
            {m === "prerecorded" ? "Pre-recorded" : "AI Generated"}
          </button>
        ))}
      </div>
      <div className="flex gap-2">
        <button onClick={onCancel} className="flex-1 py-2 rounded-lg border border-[#222] text-xs text-[#444] hover:text-[#666] transition-colors">Cancel</button>
        <button
          onClick={submit}
          disabled={!label.trim()}
          className={clsx("flex-1 py-2 rounded-lg text-xs font-semibold transition-all",
            label.trim() ? "bg-white text-black hover:bg-[#e8e8e8]" : "bg-[#1a1a1a] text-[#333] cursor-not-allowed"
          )}
        >
          Add card
        </button>
      </div>
    </div>
  );
}

// ── Creative card ───────────────────────────────────────────────────────────

function CreativeCard({ card, selected, onSelect, onVideoUpload, onAddImage, onRemoveImage, onPromptChange, onGenerate, cardRef }: {
  card: VideoCard;
  selected: boolean;
  onSelect: () => void;
  onVideoUpload: (url: string) => void;
  onAddImage: (url: string) => void;
  onRemoveImage: (idx: number) => void;
  onPromptChange: (v: string) => void;
  onGenerate: () => void;
  cardRef?: React.Ref<HTMLDivElement>;
}) {
  const cfg       = COL_CFG[card.col];
  const videoInput = useRef<HTMLInputElement>(null);
  const imageInput = useRef<HTMLInputElement>(null);

  function handleVideo(e: ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (f) onVideoUpload(URL.createObjectURL(f));
  }
  function handleImage(e: ChangeEvent<HTMLInputElement>) {
    if (!e.target.files) return;
    Array.from(e.target.files).forEach((f) => onAddImage(URL.createObjectURL(f)));
    e.target.value = "";
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
      {/* Header row */}
      <div className="flex items-center justify-between px-3 pt-3 mb-2">
        <span className={clsx("text-[10px] px-2 py-0.5 rounded-full font-semibold border",
          card.mediaType === "prerecorded"
            ? "bg-green-500/10 border-green-500/20 text-green-400"
            : "bg-indigo-500/10 border-indigo-500/20 text-indigo-400"
        )}>
          {card.mediaType === "prerecorded" ? "Pre-recorded" : "AI Generated"}
        </span>
        <span className="text-[10px] text-[#333]">{card.duration}</span>
      </div>

      {/* ── Pre-recorded: single video upload ── */}
      {card.mediaType === "prerecorded" && (
        <div className="mx-3 mb-3 rounded-lg overflow-hidden bg-[#0f0f0f] border border-[#1e1e1e]" style={{height:72}}>
          {card.videoUrl ? (
            <video src={card.videoUrl} className="w-full h-full object-cover" muted playsInline />
          ) : (
            <button
              onClick={(e) => { e.stopPropagation(); videoInput.current?.click(); }}
              className="w-full h-full flex flex-col items-center justify-center gap-1 hover:bg-white/[0.02] transition-colors"
            >
              <span className="material-symbols-outlined text-[20px] text-[#2a2a2a]">upload_file</span>
              <span className="text-[10px] text-[#333]">Upload video</span>
            </button>
          )}
        </div>
      )}

      {/* ── AI Generated: image strip + prompt + generate ── */}
      {card.mediaType === "ai-generated" && (
        <div className="mx-3 mb-2" onClick={(e) => e.stopPropagation()}>
          {/* Reference images strip */}
          <div className="flex gap-1.5 mb-2 overflow-x-auto pb-1" style={{scrollbarWidth:"none"}}>
            {card.imageUrls.map((url, idx) => (
              <div key={idx} className="relative shrink-0 w-16 h-16 rounded-lg overflow-hidden border border-[#1e1e1e] group">
                <img src={url} alt="" className="w-full h-full object-cover" />
                <button
                  onClick={() => onRemoveImage(idx)}
                  className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <span className="material-symbols-outlined text-[14px] text-white">close</span>
                </button>
              </div>
            ))}
            {/* Add image button */}
            <button
              onClick={() => imageInput.current?.click()}
              className="shrink-0 w-16 h-16 rounded-lg border border-dashed border-[#2a2a2a] hover:border-[#3a3a3a] bg-[#0f0f0f] flex flex-col items-center justify-center gap-0.5 transition-colors"
            >
              <span className="material-symbols-outlined text-[16px] text-[#2a2a2a]">add_photo_alternate</span>
              <span className="text-[9px] text-[#333]">
                {card.imageUrls.length === 0 ? "Add ref" : "Add more"}
              </span>
            </button>
          </div>

          {/* Prompt textarea */}
          <textarea
            value={card.prompt}
            onChange={(e) => onPromptChange(e.target.value)}
            onClick={(e) => e.stopPropagation()}
            rows={3}
            placeholder="Describe the scene — lighting, motion, camera angle, emotion. This goes directly to Higgsfield / Kling."
            className="w-full bg-[#0f0f0f] border border-[#1e1e1e] rounded-lg px-2.5 py-2 text-[11px] text-[#aaa] placeholder-[#2e2e2e] focus:outline-none focus:border-[#2a2a2a] resize-none font-mono leading-relaxed mb-2"
          />

          {/* Generate button */}
          <button
            onClick={onGenerate}
            disabled={card.status === "generating"}
            className={clsx(
              "w-full py-2 rounded-lg border text-[11px] font-semibold transition-all flex items-center justify-center gap-1.5",
              card.status === "generating"
                ? "bg-indigo-500/10 border-indigo-500/20 text-indigo-400 cursor-not-allowed"
                : "bg-[#1a1a1a] border-[#2a2a2a] text-[#888] hover:bg-indigo-500/10 hover:border-indigo-500/20 hover:text-indigo-400"
            )}
          >
            {card.status === "generating" ? (
              <>
                <span className="w-3 h-3 border border-indigo-400/40 border-t-indigo-400 rounded-full animate-spin" />
                Generating with Higgsfield...
              </>
            ) : (
              <>
                <span className="material-symbols-outlined text-[14px]">auto_awesome</span>
                Generate video
              </>
            )}
          </button>
        </div>
      )}

      {/* Label + tag */}
      <div className="px-3 pb-3">
        <p className={clsx("text-xs font-semibold mb-1", selected ? cfg.color : "text-white")}>{card.label}</p>
        {card.mediaType === "prerecorded" && (
          <p className="text-[11px] text-[#555] leading-relaxed line-clamp-2 mb-1.5">{card.script}</p>
        )}
        <span className="inline-block text-[10px] px-1.5 py-0.5 rounded bg-[#1c1c1c] text-[#444]">{card.tag}</span>
      </div>

      <input ref={videoInput} type="file" accept="video/*"  className="hidden" onChange={handleVideo} />
      <input ref={imageInput} type="file" accept="image/*" multiple className="hidden" onChange={handleImage} />
    </div>
  );
}

// ── Main page ────────────────────────────────────────────────────────────────

export default function VideoPage() {
  const [projectId, setProjectId]     = useState("p1");
  const [allCards, setAllCards]       = useState<Record<string, VideoCard[]>>(SEED);
  const [selHook, setSelHook]         = useState<string | null>(null);
  const [selBody, setSelBody]         = useState<string | null>(null);
  const [selCta,  setSelCta]          = useState<string | null>(null);
  const [activeTool, setActiveTool]   = useState<IntegrationTool>("Higgsfield");
  const [connected, setConnected]     = useState(false);
  const [apiKey, setApiKey]           = useState("");
  const [showConnect, setShowConnect] = useState(false);
  const [assembling, setAssembling]   = useState(false);
  const [assembled, setAssembled]     = useState(false);
  const [addingCol, setAddingCol]     = useState<ColType | null>(null);

  // SVG line refs
  const [hookEl, setHookEl] = useState<HTMLDivElement | null>(null);
  const [bodyEl, setBodyEl] = useState<HTMLDivElement | null>(null);
  const [ctaEl,  setCtaEl]  = useState<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLDivElement>(null);

  const cards     = allCards[projectId] ?? [];
  const allSel    = !!(selHook && selBody && selCta);
  const lines     = useConnectorLines(hookEl, bodyEl, ctaEl, canvasRef.current, allSel);

  // Reset selection when project changes
  function switchProject(id: string) {
    setProjectId(id);
    setSelHook(null); setSelBody(null); setSelCta(null);
    setAssembled(false); setHookEl(null); setBodyEl(null); setCtaEl(null);
  }

  function updateCard(pid: string, id: string, patch: Partial<VideoCard>) {
    setAllCards((prev) => ({
      ...prev,
      [pid]: (prev[pid] ?? []).map((c) => c.id === id ? { ...c, ...patch } : c),
    }));
  }

  function addCard(col: ColType, data: Omit<VideoCard,"id"|"status"|"videoUrl"|"imageUrls">) {
    const id = `${projectId}-${col}-${Date.now()}`;
    const card: VideoCard = { ...data, id, status: "idle", imageUrls: [] };
    setAllCards((prev) => ({ ...prev, [projectId]: [...(prev[projectId] ?? []), card] }));
    setAddingCol(null);
  }

  function addImage(pid: string, id: string, url: string) {
    setAllCards((prev) => ({
      ...prev,
      [pid]: (prev[pid] ?? []).map((c) =>
        c.id === id ? { ...c, imageUrls: [...c.imageUrls, url] } : c
      ),
    }));
  }

  function removeImage(pid: string, id: string, idx: number) {
    setAllCards((prev) => ({
      ...prev,
      [pid]: (prev[pid] ?? []).map((c) =>
        c.id === id ? { ...c, imageUrls: c.imageUrls.filter((_, i) => i !== idx) } : c
      ),
    }));
  }

  function selectCard(col: ColType, id: string, el: HTMLDivElement | null) {
    if (col === "hook") { setSelHook((p) => p === id ? null : id); setHookEl(p => p?.dataset.id === id ? null : el); }
    if (col === "body") { setSelBody((p) => p === id ? null : id); setBodyEl(p => p?.dataset.id === id ? null : el); }
    if (col === "cta")  { setSelCta ((p) => p === id ? null : id); setCtaEl (p => p?.dataset.id === id ? null : el); }
    setAssembled(false);
  }

  async function assemble() {
    setAssembling(true);
    await new Promise((r) => setTimeout(r, 2200));
    setAssembling(false); setAssembled(true);
  }

  const hookCard = cards.find((c) => c.id === selHook);
  const bodyCard = cards.find((c) => c.id === selBody);
  const ctaCard  = cards.find((c) => c.id === selCta);
  const totalDur = (hookCard ? 3 : 0) + (bodyCard ? 15 : 0) + (ctaCard ? 5 : 0);

  return (
    <div className="p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-7">
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight mb-1">Creative Lab</h1>
          <p className="text-[#555] text-sm">Mix hooks, bodies, and CTAs — each workspace is independent</p>
        </div>
        <div className="flex items-center gap-3">
          <select
            value={projectId}
            onChange={(e) => switchProject(e.target.value)}
            className="bg-[#1c1c1c] border border-[#2a2a2a] rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-[#444] cursor-pointer"
          >
            {PROJECTS.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
          </select>
          <button
            onClick={() => setShowConnect(true)}
            className={clsx(
              "flex items-center gap-2 px-4 py-2 rounded-lg border text-sm font-medium transition-all",
              connected
                ? "bg-green-500/10 border-green-500/20 text-green-400"
                : "bg-[#1c1c1c] border-[#2a2a2a] text-[#888] hover:text-white hover:border-[#444]"
            )}
          >
            <span className="material-symbols-outlined text-[16px]">{connected ? "check_circle" : "link"}</span>
            {connected ? `${activeTool} connected` : "Connect AI tool"}
          </button>
        </div>
      </div>

      {/* Canvas grid — wider gap between columns */}
      <div ref={canvasRef} className="relative grid grid-cols-3 gap-12 mb-6">
        {/* SVG overlay */}
        {lines && (
          <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{zIndex:10}}>
            <defs>
              <marker id="dot-h" markerWidth="8" markerHeight="8" refX="4" refY="4">
                <circle cx="4" cy="4" r="3" fill={COL_CFG.hook.line} />
              </marker>
              <marker id="dot-b" markerWidth="8" markerHeight="8" refX="4" refY="4">
                <circle cx="4" cy="4" r="3" fill={COL_CFG.body.line} />
              </marker>
            </defs>
            <path d={lines.h2b} stroke={COL_CFG.hook.line} strokeWidth="2" fill="none" strokeDasharray="6 4" opacity="0.5" markerEnd="url(#dot-h)" />
            <path d={lines.b2c} stroke={COL_CFG.body.line} strokeWidth="2" fill="none" strokeDasharray="6 4" opacity="0.5" markerEnd="url(#dot-b)" />
          </svg>
        )}

        {(["hook","body","cta"] as ColType[]).map((col) => {
          const cfg     = COL_CFG[col];
          const colCards = cards.filter((c) => c.col === col);
          const selId   = col === "hook" ? selHook : col === "body" ? selBody : selCta;
          const isAdding = addingCol === col;

          return (
            <div key={col}>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <span className={clsx("material-symbols-outlined text-[15px]", cfg.color)}>{cfg.icon}</span>
                  <p className={clsx("text-xs font-bold uppercase tracking-wider", cfg.color)}>{cfg.label}</p>
                  <span className="text-[10px] text-[#333]">{cfg.sub}</span>
                </div>
                <span className="text-[10px] text-[#333]">{colCards.length} cards</span>
              </div>

              <div className="space-y-3">
                {colCards.map((card) => {
                  const isSelected = selId === card.id;
                  return (
                    <CreativeCard
                      key={card.id}
                      card={card}
                      selected={isSelected}
                      onSelect={() => {
                        const el = document.querySelector(`[data-cardid="${card.id}"]`) as HTMLDivElement | null;
                        selectCard(col, card.id, el);
                      }}
                      onVideoUpload={(url) => updateCard(projectId, card.id, { videoUrl: url, status: "ready" })}
                      onAddImage={(url)    => addImage(projectId, card.id, url)}
                      onRemoveImage={(idx) => removeImage(projectId, card.id, idx)}
                      onPromptChange={(v)  => updateCard(projectId, card.id, { prompt: v })}
                      onGenerate={() => {
                        updateCard(projectId, card.id, { status: "generating" });
                        setTimeout(() => updateCard(projectId, card.id, { status: "idle" }), 3000);
                      }}
                      cardRef={(el) => {
                        if (el) (el as HTMLElement).dataset.cardid = card.id;
                        if (isSelected) {
                          if (col === "hook") setHookEl(el);
                          if (col === "body") setBodyEl(el);
                          if (col === "cta")  setCtaEl(el);
                        }
                      }}
                    />
                  );
                })}

                {/* New card form or add button */}
                {isAdding ? (
                  <NewCardForm
                    col={col}
                    onAdd={(data) => addCard(col, data)}
                    onCancel={() => setAddingCol(null)}
                  />
                ) : (
                  <button
                    onClick={() => setAddingCol(isAdding ? null : col)}
                    className="w-full py-3 rounded-xl border border-dashed border-[#222] text-xs text-[#333] hover:text-[#555] hover:border-[#333] transition-all flex items-center justify-center gap-1.5"
                  >
                    <span className="material-symbols-outlined text-[15px]">add</span>
                    Add {cfg.label.toLowerCase()}
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Assembly bar */}
      <div className={clsx("rounded-xl border px-5 py-4 transition-all", allSel ? "bg-[#1a1a1a] border-[#333]" : "bg-[#141414] border-[#1e1e1e]")}>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 flex-1 flex-wrap">
            {(["hook","body","cta"] as ColType[]).map((col, i) => {
              const card = col==="hook" ? hookCard : col==="body" ? bodyCard : ctaCard;
              const cfg  = COL_CFG[col];
              return (
                <div key={col} className="flex items-center gap-2">
                  {i > 0 && <span className="material-symbols-outlined text-[14px] text-[#333]">arrow_forward</span>}
                  {card ? (
                    <span className={clsx("flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-medium",
                      col==="hook" ? "bg-purple-500/10 border-purple-500/20 text-purple-400"
                      : col==="body" ? "bg-blue-500/10 border-blue-500/20 text-blue-400"
                      : "bg-amber-500/10 border-amber-500/20 text-amber-400"
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
            {allSel && <span className="text-[11px] text-[#444] ml-1">{totalDur}s</span>}
          </div>
          <div className="flex items-center gap-2 shrink-0">
            {assembled && (
              <>
                <button className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#1c1c1c] border border-[#2a2a2a] text-xs text-[#888] hover:text-white hover:border-[#444] transition-all font-medium">
                  <span className="material-symbols-outlined text-[14px]">download</span>Download
                </button>
                <button className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-blue-600/20 border border-blue-500/30 text-xs text-blue-400 hover:bg-blue-600/30 transition-all font-medium">
                  <span className="material-symbols-outlined text-[14px]">upload</span>Upload to Meta
                </button>
              </>
            )}
            <button
              disabled={!allSel || assembling}
              onClick={assemble}
              className={clsx("flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all",
                allSel && !assembling ? "bg-white text-black hover:bg-[#e8e8e8]" : "bg-[#1c1c1c] text-[#333] border border-[#222] cursor-not-allowed"
              )}
            >
              {assembling ? (
                <><span className="w-4 h-4 border-2 border-[#444] border-t-black rounded-full animate-spin" />Assembling...</>
              ) : assembled ? (
                <><span className="material-symbols-outlined text-[16px]">check</span>Assembled</>
              ) : (
                <><span className="material-symbols-outlined text-[16px]">movie</span>Assemble</>
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
                <button key={t} onClick={() => setActiveTool(t)}
                  className={clsx("px-3 py-1.5 rounded-lg border text-xs font-medium transition-all",
                    activeTool===t ? "bg-white/[0.08] border-[#444] text-white" : "bg-transparent border-[#232323] text-[#555] hover:text-[#888]"
                  )}>{t}</button>
              ))}
            </div>
            <p className="text-xs text-[#555] mb-3">{activeTool} API key — used to generate footage from image+prompt cards.</p>
            <input
              value={apiKey} onChange={(e) => setApiKey(e.target.value)}
              placeholder={`${activeTool} API key`} type="password"
              className="w-full bg-[#141414] border border-[#2a2a2a] rounded-lg px-3 py-2.5 text-sm text-white placeholder-[#333] focus:outline-none focus:border-[#444] mb-4 font-mono"
            />
            <div className="flex gap-2">
              <button onClick={() => setShowConnect(false)} className="flex-1 py-2.5 rounded-xl border border-[#2a2a2a] text-xs text-[#555] hover:text-white transition-colors">Cancel</button>
              <button
                onClick={() => { setConnected(true); setShowConnect(false); }}
                disabled={!apiKey.trim()}
                className={clsx("flex-1 py-2.5 rounded-xl text-xs font-semibold transition-all",
                  apiKey.trim() ? "bg-white text-black hover:bg-[#e8e8e8]" : "bg-[#222] text-[#444] cursor-not-allowed"
                )}
              >Connect {activeTool}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
