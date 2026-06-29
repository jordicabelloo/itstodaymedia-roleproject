import { HealthStatus } from "@/lib/mock-data";
import clsx from "clsx";

const CONFIG: Record<HealthStatus, { label: string; classes: string; dot: string }> = {
  critical: { label: "Critical", classes: "bg-red-500/10 text-red-400 border-red-500/20", dot: "bg-red-400" },
  warning:  { label: "Warning",  classes: "bg-amber-500/10 text-amber-400 border-amber-500/20", dot: "bg-amber-400" },
  healthy:  { label: "Healthy",  classes: "bg-green-500/10 text-green-400 border-green-500/20", dot: "bg-green-400" },
};

export default function HealthBadge({ status }: { status: HealthStatus }) {
  const { label, classes, dot } = CONFIG[status];
  return (
    <span className={clsx("inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border", classes)}>
      <span className={clsx("w-1.5 h-1.5 rounded-full", dot, status === "critical" && "animate-pulse")} />
      {label}
    </span>
  );
}
