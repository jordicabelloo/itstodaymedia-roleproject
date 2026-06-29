"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import clsx from "clsx";

const NAV = [
  { href: "/",          label: "Dashboard", icon: "grid_view" },
  { href: "/alerts",    label: "Alerts",    icon: "bolt",      badge: 2 },
  { href: "/campaigns", label: "Campaigns", icon: "bar_chart" },
];

function Icon({ name, className }: { name: string; className?: string }) {
  return <span className={clsx("material-symbols-outlined", className)}>{name}</span>;
}

export default function Sidebar() {
  const path = usePathname();
  return (
    <aside className="w-56 shrink-0 border-r border-[#2a2a2a] flex flex-col h-screen sticky top-0">
      {/* Brand */}
      <div className="px-4 py-4 border-b border-[#2a2a2a]">
        <div className="flex items-center gap-3">
          <Image src="/itm-logo.png" alt="It's Today Media" width={36} height={36} className="rounded-md" />
          <span className="text-white font-semibold text-sm tracking-tight">AdPulse</span>
          <span className="text-[9px] px-1.5 py-0.5 rounded bg-[#4dd0c4]/10 text-[#4dd0c4] border border-[#4dd0c4]/20 font-bold tracking-wider">BETA</span>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5">
        {NAV.map(({ href, label, icon, badge }) => (
          <Link
            key={href} href={href}
            className={clsx(
              "flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors font-medium",
              path === href
                ? "bg-white/[0.07] text-white"
                : "text-[#666] hover:text-[#ccc] hover:bg-white/[0.03]"
            )}
          >
            <span className="flex items-center gap-2.5">
              <Icon
                name={icon}
                className={clsx(
                  "text-[18px]",
                  path === href ? "text-white" : "text-[#555]"
                )}
              />
              {label}
            </span>
            {badge && (
              <span className="text-[10px] bg-red-500 text-white rounded-full w-4 h-4 flex items-center justify-center font-bold">
                {badge}
              </span>
            )}
          </Link>
        ))}
      </nav>

      {/* Footer */}
      <div className="px-4 py-4 border-t border-[#2a2a2a]">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs text-white font-bold" style={{ background: "#3a4d68" }}>
            JC
          </div>
          <div>
            <p className="text-xs text-white font-semibold">Jordi C.</p>
            <p className="text-[11px] text-[#555]">2 accounts connected</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
