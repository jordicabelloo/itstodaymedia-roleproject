"use client";

import { useState } from "react";
import clsx from "clsx";
import { Switch } from "@/components/ui/switch";

type AgentStatus = "active" | "idle" | "scheduled" | "beta";

interface AgentLog {
  time: string;
  message: string;
  type: "info" | "success" | "warning";
}

interface Agent {
  id: string;
  name: string;
  description: string;
  icon: string;
  status: AgentStatus;
  schedule: string;
  lastRun: string;
  nextRun: string;
  stats: { label: string; value: string }[];
  lastAction: string;
  logs: AgentLog[];
  enabled: boolean;
  beta?: boolean;
}

const STATUS_CONFIG: Record<AgentStatus, { label: string; dot: string; text: string; bg: string }> = {
  active:    { label: "Running",   dot: "bg-green-400 animate-pulse", text: "text-green-400",  bg: "bg-green-500/10 border-green-500/20" },
  idle:      { label: "Idle",      dot: "bg-[#444]",                  text: "text-[#666]",     bg: "bg-white/[0.03] border-[#2a2a2a]" },
  scheduled: { label: "Scheduled", dot: "bg-amber-400",               text: "text-amber-400",  bg: "bg-amber-500/10 border-amber-500/20" },
  beta:      { label: "Beta",      dot: "bg-indigo-400",              text: "text-indigo-400", bg: "bg-indigo-500/10 border-indigo-500/20" },
};

const AGENTS: Agent[] = [
  {
    id: "fatigue-monitor",
    name: "Fatigue Monitor",
    description: "Scans all connected ad accounts every 6 hours. Detects frequency spikes, CTR decay, CPM increases, and ROAS drops. Raises alerts automatically.",
    icon: "radar",
    status: "active",
    schedule: "Every 6 hours",
    lastRun: "2h ago",
    nextRun: "In 4h",
    lastAction: "Flagged 3 critical creatives across 2 Meta accounts",
    stats: [
      { label: "Accounts monitored", value: "2" },
      { label: "Creatives scanned", value: "847" },
      { label: "Alerts raised (7d)", value: "11" },
      { label: "Avg detection lag",  value: "< 6h" },
    ],
    logs: [
      { time: "23:41", message: "Scan complete — 847 creatives analyzed",       type: "success" },
      { time: "23:41", message: "3 critical alerts raised (ad_001, ad_005, ad_009)", type: "warning" },
      { time: "17:41", message: "Scan complete — no new alerts",                 type: "info"    },
      { time: "11:41", message: "Scan complete — 1 warning escalated to critical", type: "warning" },
    ],
    enabled: true,
  },
  {
    id: "creative-replacement",
    name: "Creative Replacement Engine",
    description: "Triggered by the Fatigue Monitor. For each flagged creative, analyzes the account's top performers and generates 3 fresh copy variants ready to upload.",
    icon: "auto_awesome",
    status: "idle",
    schedule: "On alert trigger",
    lastRun: "2h ago",
    nextRun: "On next alert",
    lastAction: "Generated 9 variants for 3 fatigued creatives — ready for review",
    stats: [
      { label: "Variants generated (7d)", value: "34" },
      { label: "Accepted by team",        value: "21" },
      { label: "Avg CTR lift",            value: "+38%" },
      { label: "Model",                   value: "qwen3:14b" },
    ],
    logs: [
      { time: "23:43", message: "Generated 3 variants for 'Still paying too much for X?'", type: "success" },
      { time: "23:43", message: "Generated 3 variants for 'Still thinking about it?'",     type: "success" },
      { time: "23:43", message: "Generated 3 variants for 'Get results in 14 days'",       type: "success" },
      { time: "17:45", message: "No fatigue alerts — standing by",                         type: "info"    },
    ],
    enabled: true,
  },
  {
    id: "campaign-learner",
    name: "Campaign Learning Engine",
    description: "Analyzes historical creative performance across all client accounts weekly. Builds a private intelligence layer: which hook angles work, how long creatives last, what patterns convert.",
    icon: "school",
    status: "scheduled",
    schedule: "Every Sunday 00:00",
    lastRun: "5 days ago",
    nextRun: "In 2 days",
    lastAction: "Indexed 2,847 creative performances — updated hook angle benchmarks",
    stats: [
      { label: "Performances indexed", value: "2,847" },
      { label: "Patterns learned",     value: "134" },
      { label: "Avg creative lifespan", value: "11.4 days" },
      { label: "Best hook angle",       value: "Social proof" },
    ],
    logs: [
      { time: "Sun 00:01", message: "Analysis complete — 412 new performances indexed",     type: "success" },
      { time: "Sun 00:01", message: "Social proof hook outperforms urgency by 34% in e-commerce", type: "info" },
      { time: "Sun 00:01", message: "Updated fatigue thresholds for Meta TOFU campaigns",   type: "info"    },
      { time: "Prev Sun",  message: "Analysis complete — 389 new performances indexed",     type: "success" },
    ],
    enabled: true,
    beta: true,
  },
  {
    id: "auto-upload",
    name: "Auto-Upload Agent",
    description: "Once a variant is approved in the dashboard, this agent uploads it directly to Meta Ads API and Google Ads API — creating the ad, setting budget, and activating it without manual steps.",
    icon: "upload",
    status: "beta",
    schedule: "On variant approval",
    lastRun: "Never",
    nextRun: "Pending setup",
    lastAction: "Awaiting Meta Ads write permissions",
    stats: [
      { label: "Ads auto-uploaded",  value: "—" },
      { label: "Platforms supported", value: "Meta, Google" },
      { label: "Avg time to live",    value: "< 2 min" },
      { label: "Requires",            value: "Write token" },
    ],
    logs: [
      { time: "—", message: "Agent not yet active — configure Meta write token to enable", type: "info" },
    ],
    enabled: false,
    beta: true,
  },
  {
    id: "performance-digest",
    name: "Weekly Digest Agent",
    description: "Every Monday morning, compiles a full performance report: top and bottom creatives, ROAS trends, fatigue events, and AI-generated recommendations. Sent directly to your team.",
    icon: "summarize",
    status: "beta",
    schedule: "Mondays at 09:00",
    lastRun: "Never",
    nextRun: "Pending setup",
    lastAction: "Awaiting email configuration",
    stats: [
      { label: "Reports sent",    value: "—" },
      { label: "Recipients",      value: "team@itstoday.media" },
      { label: "Format",          value: "Email + PDF" },
      { label: "Includes",        value: "ROAS, CTR, alerts" },
    ],
    logs: [
      { time: "—", message: "Configure recipients to activate weekly digest", type: "info" },
    ],
    enabled: false,
    beta: true,
  },
];

function StatusBadge({ status }: { status: AgentStatus }) {
  const c = STATUS_CONFIG[status];
  return (
    <span className={clsx("inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border", c.bg, c.text)}>
      <span className={clsx("w-1.5 h-1.5 rounded-full", c.dot)} />
      {c.label}
    </span>
  );
}

export default function AgentsPage() {
  const [expanded, setExpanded] = useState<string | null>(null);
  const [enabled, setEnabled] = useState<Record<string, boolean>>(
    Object.fromEntries(AGENTS.map((a) => [a.id, a.enabled]))
  );

  const activeCount = AGENTS.filter((a) => a.status === "active" || a.status === "scheduled").length;

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight mb-1">Agents</h1>
          <p className="text-[#555] text-sm">{activeCount} agents running — automating the full creative refresh cycle</p>
        </div>
        <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-green-500/10 border border-green-500/20 text-xs text-green-400 font-medium">
          <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
          System online
        </span>
      </div>

      {/* Pipeline diagram */}
      <div className="bg-[#1c1c1c] border border-[#2a2a2a] rounded-xl p-5 mb-6">
        <p className="text-xs font-medium text-[#555] uppercase tracking-wider mb-4">Automation pipeline</p>
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {[
            { icon: "sync", label: "Ad APIs", sub: "Meta · Google", color: "text-blue-400" },
            { icon: "arrow_forward", label: "", sub: "", color: "text-[#333]" },
            { icon: "radar", label: "Fatigue Monitor", sub: "every 6h", color: "text-green-400" },
            { icon: "arrow_forward", label: "", sub: "", color: "text-[#333]" },
            { icon: "auto_awesome", label: "AI Generation", sub: "on alert", color: "text-indigo-400" },
            { icon: "arrow_forward", label: "", sub: "", color: "text-[#333]" },
            { icon: "rate_review", label: "Team Review", sub: "dashboard", color: "text-amber-400" },
            { icon: "arrow_forward", label: "", sub: "", color: "text-[#333]" },
            { icon: "upload", label: "Auto-Upload", sub: "to platform", color: "text-purple-400" },
            { icon: "arrow_forward", label: "", sub: "", color: "text-[#333]" },
            { icon: "school", label: "Learning", sub: "weekly", color: "text-teal-400" },
          ].map((step, i) =>
            step.label === "" ? (
              <span key={i} className={clsx("material-symbols-outlined text-[18px] shrink-0", step.color)}>
                {step.icon}
              </span>
            ) : (
              <div key={i} className="flex flex-col items-center shrink-0 min-w-[80px]">
                <span className={clsx("material-symbols-outlined text-[22px] mb-1", step.color)}>{step.icon}</span>
                <p className="text-[11px] text-white font-medium text-center leading-tight">{step.label}</p>
                <p className="text-[10px] text-[#444] text-center">{step.sub}</p>
              </div>
            )
          )}
        </div>
      </div>

      {/* Agent cards */}
      <div className="space-y-3">
        {AGENTS.map((agent) => {
          const isOpen = expanded === agent.id;
          const isEnabled = enabled[agent.id];
          return (
            <div key={agent.id} className={clsx(
              "bg-[#1c1c1c] border rounded-xl overflow-hidden transition-colors",
              agent.beta && !isEnabled ? "border-[#222] opacity-75" : "border-[#2a2a2a]"
            )}>
              {/* Header */}
              <div className="flex items-center gap-4 px-5 py-4">
                <div className={clsx(
                  "w-10 h-10 rounded-xl flex items-center justify-center shrink-0",
                  agent.status === "active" ? "bg-green-500/10" :
                  agent.status === "scheduled" ? "bg-amber-500/10" :
                  agent.status === "beta" ? "bg-indigo-500/10" : "bg-white/[0.04]"
                )}>
                  <span className={clsx(
                    "material-symbols-outlined text-[20px]",
                    agent.status === "active" ? "text-green-400" :
                    agent.status === "scheduled" ? "text-amber-400" :
                    agent.status === "beta" ? "text-indigo-400" : "text-[#444]"
                  )}>{agent.icon}</span>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <p className="text-sm font-semibold text-white">{agent.name}</p>
                    {agent.beta && (
                      <span className="text-[9px] px-1.5 py-0.5 rounded bg-indigo-500/15 text-indigo-400 border border-indigo-500/20 font-bold tracking-wider">BETA</span>
                    )}
                  </div>
                  <p className="text-xs text-[#555] truncate">{agent.lastAction}</p>
                </div>

                <div className="hidden md:flex items-center gap-6 shrink-0 text-right">
                  <div>
                    <p className="text-[10px] text-[#444]">Schedule</p>
                    <p className="text-xs text-[#888]">{agent.schedule}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-[#444]">Last run</p>
                    <p className="text-xs text-[#888]">{agent.lastRun}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-[#444]">Next run</p>
                    <p className="text-xs text-[#888]">{agent.nextRun}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <StatusBadge status={agent.status} />
                  <Switch
                    checked={isEnabled}
                    onCheckedChange={(v) => setEnabled((p) => ({ ...p, [agent.id]: v }))}
                    className="data-[state=checked]:bg-green-500 data-[state=unchecked]:bg-[#2a2a2a] shrink-0"
                  />
                  <button onClick={() => setExpanded(isOpen ? null : agent.id)}>
                    <span className="material-symbols-outlined text-[20px] text-[#444] hover:text-[#888] transition-colors">
                      {isOpen ? "expand_less" : "expand_more"}
                    </span>
                  </button>
                </div>
              </div>

              {/* Expanded */}
              {isOpen && (
                <div className="border-t border-[#232323] grid grid-cols-3 divide-x divide-[#232323]">
                  {/* Description + stats */}
                  <div className="col-span-2 p-5">
                    <p className="text-xs text-[#666] leading-relaxed mb-5">{agent.description}</p>
                    <div className="grid grid-cols-4 gap-3">
                      {agent.stats.map((s) => (
                        <div key={s.label} className="bg-[#141414] rounded-lg border border-[#232323] p-3">
                          <p className="text-[10px] text-[#444] mb-1">{s.label}</p>
                          <p className="text-sm text-white font-semibold">{s.value}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                  {/* Logs */}
                  <div className="p-5">
                    <p className="text-xs font-medium text-[#555] uppercase tracking-wider mb-3">Recent logs</p>
                    <div className="space-y-2.5">
                      {agent.logs.map((log, i) => (
                        <div key={i} className="flex gap-2">
                          <span className="text-[10px] text-[#333] shrink-0 mt-0.5 w-12">{log.time}</span>
                          <p className={clsx("text-[11px] leading-relaxed", {
                            "text-[#666]":  log.type === "info",
                            "text-green-500/80": log.type === "success",
                            "text-amber-500/80": log.type === "warning",
                          })}>{log.message}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
