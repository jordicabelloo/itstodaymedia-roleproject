"use client";

import { HealthStatus } from "@/lib/mock-data";

const COLOR: Record<HealthStatus, string> = {
  critical: "#ef4444",
  warning: "#f59e0b",
  healthy: "#22c55e",
};

export default function ScoreRing({ score, status, size = 64 }: { score: number; status: HealthStatus; size?: number }) {
  const r = (size - 8) / 2;
  const circ = 2 * Math.PI * r;
  const dash = (score / 100) * circ;
  const color = COLOR[status];

  return (
    <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#2a2a2a" strokeWidth={4} />
      <circle
        cx={size / 2} cy={size / 2} r={r}
        fill="none" stroke={color} strokeWidth={4}
        strokeDasharray={`${dash} ${circ}`}
        strokeLinecap="round"
        style={{ transition: "stroke-dasharray 0.6s ease" }}
      />
      <text
        x={size / 2} y={size / 2 + 5}
        textAnchor="middle" fill={color}
        fontSize={size * 0.22} fontWeight={600}
        style={{ transform: "rotate(90deg)", transformOrigin: `${size / 2}px ${size / 2}px` }}
      >
        {score}
      </text>
    </svg>
  );
}
